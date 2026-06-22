import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";

function isAdmin(email: string | undefined): boolean {
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email?.toLowerCase() ?? "");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function markdownToHtml(md: string): string {
  return escapeHtml(md)
    .replace(/^## (.+)$/gm, '<h2 style="color:#D4A017;font-size:18px;margin:24px 0 8px;font-family:Georgia,serif;">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 style="color:#ffffff;font-size:14px;margin:20px 0 6px;font-family:Arial,sans-serif;text-transform:uppercase;letter-spacing:1px;">$1</h3>')
    .replace(/^- (.+)$/gm, '<li style="color:#cbd5e1;font-size:13px;margin:4px 0;line-height:1.6;">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, (m) => `<ul style="margin:8px 0 12px 16px;padding:0;">${m}</ul>`)
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#ffffff;">$1</strong>')
    .replace(/\n{2,}/g, '<br/>')
    .replace(/^(?!<[h|u|l])(.*\S.*)$/gm, '<p style="color:#cbd5e1;font-size:13px;margin:6px 0;line-height:1.6;">$1</p>');
}

function buildEmailHtml(content: string, weekLabel: string): string {
  const body = markdownToHtml(content);
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#071B2A;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#071B2A;">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#0D2436;border:1px solid rgba(255,255,255,0.05);max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#071B2A;border-bottom:2px solid #D4A017;padding:28px 36px;">
            <div style="font-size:11px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;color:#D4A017;margin-bottom:4px;">APRN AFRICA</div>
            <div style="font-size:20px;font-weight:bold;color:#ffffff;font-family:Georgia,serif;">Weekly Progress Report</div>
            <div style="font-size:12px;color:#64748b;margin-top:4px;">${weekLabel}</div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 36px;">
            ${body}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="border-top:1px solid rgba(255,255,255,0.05);padding:20px 36px;">
            <p style="font-size:11px;color:#475569;margin:0;">Sent by Joseph Agwuh · Director, Applied Engineering · APRN Africa</p>
            <p style="font-size:11px;color:#334155;margin:4px 0 0;">josephagwuh@gmail.com</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content, weekLabel, weekOf, rawData } = await req.json();
  if (!content || !weekLabel || !weekOf) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const subject = `APRN Weekly Report — ${weekLabel}`;
  const html = buildEmailHtml(content, weekLabel);

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error: emailError } = await resend.emails.send({
    from: "APRN Africa <noreply@aprn-africa.org>",
    to: ["info@aprn-africa.org", "olaghri@gmail.com"],
    cc: ["josephagwuh@gmail.com"],
    subject,
    html,
  });

  if (emailError) return NextResponse.json({ error: emailError.message }, { status: 500 });

  const admin = createAdminClient();
  const { error: dbError } = await admin.from("weekly_reports").insert({
    week_of: weekOf,
    subject,
    content,
    raw_data: rawData ?? null,
    sent_at: new Date().toISOString(),
    sent_by: user.email ?? "unknown",
  });

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
