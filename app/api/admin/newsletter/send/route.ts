import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSanityClient } from "next-sanity";
import { Resend } from "resend";
import { groq } from "next-sanity";
import type { NewsletterIssue } from "@/lib/queries/newsletter";
import { buildNewsletterHtml, buildNewsletterText } from "@/lib/newsletter-email";

function isAdmin(email: string | undefined): boolean {
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email?.toLowerCase() ?? "");
}

function getSanityWriteClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token     = process.env.SANITY_WRITE_TOKEN;
  if (!projectId || !token) return null;
  return createSanityClient({ projectId, dataset, apiVersion: "2025-05-01", useCdn: false, token });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return NextResponse.json({ error: "RESEND_API_KEY not configured." }, { status: 503 });

  const sanity = getSanityWriteClient();
  if (!sanity) return NextResponse.json({ error: "Sanity write client not configured." }, { status: 503 });

  const { issueId, testOnly = false } = await req.json();
  if (!issueId) return NextResponse.json({ error: "issueId is required." }, { status: 400 });

  // Fetch the full issue by ID
  const issue = await sanity.fetch<NewsletterIssue | null>(
    groq`*[_type == "newsletter" && _id == $id][0] {
      _id, "slug": slug.current, title, volume, issueNumber,
      publishDate, leadSummary,
      "heroImageUrl": heroImage.asset->url,
      "heroImageAlt": coalesce(heroImage.alt, title),
      stories[]{ tag, headline, summary, sourceUrl, "imageUrl": image.asset->url, "imageAlt": coalesce(image.alt, headline) },
      editorAnalysis, pullQuote, status
    }`,
    { id: issueId },
  );

  if (!issue) return NextResponse.json({ error: "Issue not found." }, { status: 404 });
  if (issue.status === "sent" && !testOnly) {
    return NextResponse.json({ error: "This issue has already been sent. Use testOnly to preview." }, { status: 409 });
  }

  // Determine recipients
  let recipients: string[];
  if (testOnly) {
    recipients = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim()).filter(Boolean);
  } else {
    const rows = await sanity.fetch<Array<{ email: string }>>(
      groq`*[_type == "subscriber" && active == true]{ email }`,
    );
    recipients = rows.map((r) => r.email).filter(Boolean);
  }

  if (recipients.length === 0) {
    return NextResponse.json({ error: testOnly ? "No admin emails configured." : "No active subscribers found." }, { status: 404 });
  }

  const siteUrl    = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aprn-africa.org";
  const html       = buildNewsletterHtml(issue, siteUrl);
  const text       = buildNewsletterText(issue, siteUrl);
  const issueLabel = `Vol. ${issue.volume}, Issue ${String(issue.issueNumber).padStart(3, "0")}`;
  const subject    = testOnly
    ? `[TEST] ${issueLabel} — ${issue.title}`
    : `${issueLabel} — ${issue.title}`;
  const resend     = new Resend(resendKey);

  const batchSize = 100;
  let sent = 0;

  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize).map((email) => ({
      from: "APRN Intelligence Briefing <newsletter@aprn-africa.org>",
      to:   [email],
      subject,
      html,
      text,
      headers: { "List-Unsubscribe": "<mailto:info@aprn-africa.org?subject=Unsubscribe>" },
    }));
    const { error } = await resend.batch.send(batch);
    if (error) {
      console.error("[admin/newsletter/send] Resend batch error:", error);
    } else {
      sent += batch.length;
    }
  }

  // Mark as sent in Sanity only on full send
  if (!testOnly) {
    await sanity
      .patch(issue._id)
      .set({ status: "sent", sentAt: new Date().toISOString(), recipientCount: sent })
      .commit();
  }

  return NextResponse.json({ ok: true, issueId: issue._id, issueLabel, sent, testOnly });
}
