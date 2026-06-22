import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";

function isAdmin(email: string | undefined) {
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email?.toLowerCase() ?? "");
}

function applyMergeTag(template: string, firstName: string): string {
  return template.replace(/\{\{first_name\}\}/gi, firstName);
}

function firstNameFrom(fullName: string): string {
  return fullName.split(/\s+/)[0] ?? fullName;
}

function buildHtml(body: string, subject: string): string {
  const escaped = body
    .split("\n\n")
    .map((para) => `<p style="color:#cbd5e1;font-size:14px;line-height:1.7;margin:0 0 16px;">${para.replace(/\n/g, "<br/>")}</p>`)
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#071B2A;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#071B2A;">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#0D2436;border:1px solid rgba(255,255,255,0.05);max-width:600px;width:100%;">
        <tr>
          <td style="background:#071B2A;border-bottom:2px solid #D4A017;padding:28px 36px;">
            <div style="font-size:11px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;color:#D4A017;margin-bottom:4px;">APRN AFRICA</div>
            <div style="font-size:18px;font-weight:bold;color:#ffffff;font-family:Georgia,serif;">${subject}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 36px;">
            ${escaped}
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid rgba(255,255,255,0.05);padding:20px 36px;">
            <p style="font-size:11px;color:#475569;margin:0;">Joseph Agwuh · Director, Applied Engineering · APRN Africa</p>
            <p style="font-size:11px;color:#334155;margin:4px 0 0;">josephagwuh@gmail.com · aprn-africa.org</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

const BATCH_SIZE = 10;
const BATCH_DELAY_MS = 1000;

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const admin = createAdminClient();
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data: campaign } = await admin
    .from("outreach_campaigns")
    .select("*, outreach_recipients(*)")
    .eq("id", id)
    .single();

  if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  if (!campaign.subject || !campaign.body_template) {
    return NextResponse.json({ error: "Generate email content before sending" }, { status: 400 });
  }

  const sendable = (campaign.outreach_recipients ?? []).filter(
    (r: { status: string; recipient_email: string | null }) =>
      r.status === "pending" && r.recipient_email
  );

  if (!sendable.length) return NextResponse.json({ error: "No pending recipients with email addresses" }, { status: 400 });

  // Cap single send run at 50 — surface this to the admin UI
  const batch = sendable.slice(0, 50);

  await admin.from("outreach_campaigns").update({ status: "sending" }).eq("id", id);

  let sent = 0;
  let failed = 0;
  const results: { id: string; status: string; resend_id?: string; error?: string }[] = [];

  for (let i = 0; i < batch.length; i += BATCH_SIZE) {
    const chunk = batch.slice(i, i + BATCH_SIZE);

    await Promise.all(
      chunk.map(async (r: { id: string; recipient_name: string; recipient_email: string | null; personalized_body: string | null }) => {
        if (!r.recipient_email) return; // already filtered but satisfies TS
        const firstName = firstNameFrom(r.recipient_name);
        const body = r.personalized_body
          ? applyMergeTag(r.personalized_body, firstName)
          : applyMergeTag(campaign.body_template!, firstName);
        const html = buildHtml(body, campaign.subject!);

        const { data: emailData, error: emailError } = await resend.emails.send({
          from: "Joseph Agwuh — APRN Africa <info@aprn-africa.org>",
          to: [r.recipient_email],
          subject: campaign.subject!,
          html,
          headers: {
            "X-Campaign-Id": id,
            "X-Recipient-Id": r.id,
          },
        });

        if (emailError || !emailData?.id) {
          failed++;
          await admin.from("outreach_recipients").update({ status: "pending", notes: emailError?.message ?? "Send failed" }).eq("id", r.id);
          results.push({ id: r.id, status: "failed", error: emailError?.message });
        } else {
          sent++;
          await admin.from("outreach_recipients").update({
            status: "sent",
            resend_message_id: emailData.id,
            sent_at: new Date().toISOString(),
          }).eq("id", r.id);
          results.push({ id: r.id, status: "sent", resend_id: emailData.id });
        }
      })
    );

    // Pause between chunks to avoid hitting Resend rate limits
    if (i + BATCH_SIZE < batch.length) {
      await new Promise((res) => setTimeout(res, BATCH_DELAY_MS));
    }
  }

  const allSent = (campaign.outreach_recipients ?? []).every(
    (r: { status: string }) => r.status !== "pending"
  );
  await admin.from("outreach_campaigns").update({
    status: allSent ? "sent" : "ready",
    sent_at: allSent ? new Date().toISOString() : null,
  }).eq("id", id);

  return NextResponse.json({ sent, failed, total: batch.length, results });
}
