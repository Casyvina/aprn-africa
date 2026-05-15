import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { Resend } from "resend";
import type { NewsletterIssue } from "@/lib/queries/newsletter";
import { NEWSLETTER_APPROVED_QUERY } from "@/lib/queries/newsletter";
import { groq } from "next-sanity";

// ── Sanity write client ───────────────────────────────────────────────────────

function getSanityClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token     = process.env.SANITY_WRITE_TOKEN;
  if (!projectId || !token) return null;
  return createClient({ projectId, dataset, apiVersion: "2025-05-01", useCdn: false, token });
}

// ── Subscriber list from Sanity ───────────────────────────────────────────────

const ACTIVE_SUBSCRIBERS_QUERY = groq`
  *[_type == "subscriber" && active == true]{ email }
`;

async function fetchSubscribers(sanity: ReturnType<typeof getSanityClient>): Promise<string[]> {
  if (!sanity) return [];
  const rows = await sanity.fetch<Array<{ email: string }>>(ACTIVE_SUBSCRIBERS_QUERY);
  return rows.map((r) => r.email).filter(Boolean);
}

// ── HTML email builder ────────────────────────────────────────────────────────

function buildEmailHtml(issue: NewsletterIssue, siteUrl: string): string {
  const issueLabel = `Vol. ${issue.volume}, Issue ${String(issue.issueNumber).padStart(3, "0")}`;
  const issueUrl   = `${siteUrl}/newsletter/${issue.slug}`;

  const storiesHtml = issue.stories
    .map(
      (s) => `
      <tr>
        <td style="padding:20px 0;border-bottom:1px solid #15324A;">
          <span style="display:inline-block;background:#D4A017;color:#071B2A;font-size:9px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;padding:3px 8px;margin-bottom:8px;">${s.tag}</span>
          <h3 style="margin:0 0 8px;font-family:Georgia,serif;font-size:18px;color:#ffffff;line-height:1.4;">${s.headline}</h3>
          <p style="margin:0;font-size:14px;color:#94a3b8;line-height:1.6;">${s.summary}</p>
          ${s.sourceUrl ? `<a href="${s.sourceUrl}" style="display:inline-block;margin-top:8px;font-size:11px;color:#D4A017;text-decoration:none;text-transform:uppercase;letter-spacing:0.1em;">Source →</a>` : ""}
        </td>
      </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${issue.title}</title></head>
<body style="margin:0;padding:0;background:#071B2A;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#071B2A;">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#0D2436;border-bottom:3px solid #D4A017;padding:32px 40px;text-align:center;">
            <p style="margin:0 0 4px;font-size:10px;color:#D4A017;text-transform:uppercase;letter-spacing:0.3em;">Africa's Pipeline Intelligence Weekly</p>
            <h1 style="margin:0;font-family:Georgia,serif;font-size:36px;color:#ffffff;font-weight:700;">APRN Intelligence Briefing</h1>
            <p style="margin:8px 0 0;font-size:11px;color:#475569;text-transform:uppercase;letter-spacing:0.15em;">${issueLabel}</p>
          </td>
        </tr>

        <!-- Dateline -->
        <tr>
          <td style="background:#D4A017;padding:10px 40px;">
            <p style="margin:0;font-size:11px;color:#071B2A;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;">${issueLabel} · ${new Date(issue.publishDate).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · ${issue.stories.length} Stories</p>
          </td>
        </tr>

        <!-- Lead summary -->
        <tr>
          <td style="background:#0D2436;padding:24px 40px;border-bottom:1px solid #15324A;">
            <p style="margin:0;font-size:15px;color:#cbd5e1;line-height:1.7;">${issue.leadSummary}</p>
          </td>
        </tr>

        <!-- Stories -->
        <tr>
          <td style="background:#0D2436;padding:0 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${storiesHtml}
            </table>
          </td>
        </tr>

        <!-- Editor's Analysis -->
        <tr>
          <td style="background:#15324A;padding:32px 40px;border-top:1px solid #D4A017;">
            <p style="margin:0 0 12px;font-size:10px;color:#D4A017;text-transform:uppercase;letter-spacing:0.2em;">Editor's Analysis</p>
            ${issue.pullQuote ? `<p style="margin:0 0 16px;font-family:Georgia,serif;font-size:20px;color:#ffffff;font-style:italic;line-height:1.5;">&ldquo;${issue.pullQuote}&rdquo;</p>` : ""}
            <p style="margin:0;font-size:14px;color:#94a3b8;line-height:1.7;white-space:pre-line;">${issue.editorAnalysis}</p>
            <p style="margin:16px 0 0;font-size:12px;color:#475569;">— Lucy Okeke, Founder &amp; Executive Director, APRN</p>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="background:#071B2A;padding:32px 40px;text-align:center;border-top:1px solid #15324A;">
            <a href="${issueUrl}" style="display:inline-block;background:#D4A017;color:#071B2A;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;padding:14px 32px;text-decoration:none;">Read Full Issue Online →</a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#071B2A;padding:24px 40px;border-top:1px solid #15324A;text-align:center;">
            <p style="margin:0 0 8px;font-size:11px;color:#334155;">African Pipeline Resource Network · <a href="${siteUrl}" style="color:#D4A017;text-decoration:none;">aprn-africa.org</a></p>
            <p style="margin:0;font-size:10px;color:#1e293b;">You received this because you subscribed to the APRN Intelligence Briefing.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Route handler ─────────────────────────────────────────────────────────────

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
  const html       = buildEmailHtml(issue, siteUrl);
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
