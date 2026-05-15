import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const { name, org, email, country, type, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ message: "Name, email, and message are required." }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    // Dev fallback — log and accept
    console.log("[contact] Resend not configured —", { name, org, email, country, type, message });
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(resendKey);

  const { error } = await resend.emails.send({
    from:     "APRN Contact Form <newsletter@aprn-africa.org>",
    to:       ["info@aprn-africa.org"],
    replyTo:  email,
    subject:  `[APRN Inquiry] ${type || "General"} — ${org || name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#071B2A;color:#ffffff;padding:40px;">
        <div style="border-bottom:3px solid #D4A017;padding-bottom:20px;margin-bottom:24px;">
          <h2 style="margin:0;font-size:22px;color:#D4A017;">New Inquiry via aprn-africa.org</h2>
        </div>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;width:140px;">Name</td><td style="padding:8px 0;font-size:14px;">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Organisation</td><td style="padding:8px 0;font-size:14px;">${org || "—"}</td></tr>
          <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Email</td><td style="padding:8px 0;font-size:14px;"><a href="mailto:${email}" style="color:#D4A017;">${email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Country</td><td style="padding:8px 0;font-size:14px;">${country || "—"}</td></tr>
          <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Inquiry Type</td><td style="padding:8px 0;font-size:14px;">${type || "—"}</td></tr>
        </table>
        <div style="margin-top:24px;padding:20px;background:#0D2436;border-left:3px solid #D4A017;">
          <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;">Message</p>
          <p style="margin:0;font-size:15px;line-height:1.7;white-space:pre-wrap;">${message}</p>
        </div>
        <p style="margin-top:24px;font-size:11px;color:#334155;">Reply directly to this email to respond to ${name}.</p>
      </div>
    `,
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    return NextResponse.json({ message: "Failed to send message. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
