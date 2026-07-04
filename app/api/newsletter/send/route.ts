import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { Resend } from "resend";
import type { NewsletterIssue } from "@/lib/queries/newsletter";
import { NEWSLETTER_APPROVED_QUERY } from "@/lib/queries/newsletter";
import { groq } from "next-sanity";
import { buildNewsletterHtml } from "@/lib/newsletter-email";

// -- Sanity write client -------------------------------------------------------

function getSanityClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token     = process.env.SANITY_WRITE_TOKEN;
  if (!projectId || !token) return null;
  return createClient({ projectId, dataset, apiVersion: "2025-05-01", useCdn: false, token });
}

// -- Subscriber list from Sanity -----------------------------------------------

const ACTIVE_SUBSCRIBERS_QUERY = groq`
  *[_type == "subscriber" && active == true]{ email }
`;

async function fetchSubscribers(sanity: ReturnType<typeof getSanityClient>): Promise<string[]> {
  if (!sanity) return [];
  const rows = await sanity.fetch<Array<{ email: string }>>(ACTIVE_SUBSCRIBERS_QUERY);
  return rows.map((r) => r.email).filter(Boolean);
}

// -- Route handler -------------------------------------------------------------

export async function POST(req: NextRequest) {
  // Protect with a shared secret
  const secret = req.headers.get("x-send-secret");
  if (!process.env.NEWSLETTER_SEND_SECRET || secret !== process.env.NEWSLETTER_SEND_SECRET) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({ message: "RESEND_API_KEY not configured." }, { status: 503 });
  }

  const sanity = getSanityClient();
  if (!sanity) {
    return NextResponse.json({ message: "Sanity write client not configured." }, { status: 503 });
  }

  // 1. Fetch the approved issue
  const issue = await sanity.fetch<NewsletterIssue | null>(NEWSLETTER_APPROVED_QUERY);
  if (!issue) {
    return NextResponse.json({ message: "No approved issue found." }, { status: 404 });
  }

  // 2. Get subscribers from Sanity
  const subscribers = await fetchSubscribers(sanity);
  if (subscribers.length === 0) {
    return NextResponse.json({ message: "No active subscribers found.", sent: 0 });
  }

  const siteUrl    = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aprn-africa.org";
  const html       = buildNewsletterHtml(issue, siteUrl);
  const issueLabel = `Vol. ${issue.volume}, Issue ${String(issue.issueNumber).padStart(3, "0")}`;
  const resend     = new Resend(resendKey);

  // 3. Send individually using Resend batch API (100 per call — each recipient private)
  const batchSize = 100;
  let sent = 0;

  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize).map((email) => ({
      from:    "APRN Intelligence Briefing <newsletter@aprn-africa.org>",
      to:      [email],
      subject: `${issueLabel} — ${issue.title}`,
      html,
    }));
    const { error } = await resend.batch.send(batch);
    if (error) {
      console.error("[newsletter/send] Resend batch error:", error);
    } else {
      sent += batch.length;
    }
  }

  // 4. Mark the issue as sent in Sanity
  await sanity
    .patch(issue._id)
    .set({ status: "sent", sentAt: new Date().toISOString(), recipientCount: sent })
    .commit();

  return NextResponse.json({ ok: true, issueId: issue._id, issueLabel, sent });
}
