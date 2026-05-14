import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { firstName, email, org } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ message: "A valid email address is required." }, { status: 400 });
  }

  const apiKey    = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  // If Resend is not configured, log and accept gracefully (dev / staging mode)
  if (!apiKey || !audienceId) {
    console.log("[newsletter] Resend not configured — recording subscription:", { firstName, email, org });
    return NextResponse.json({ ok: true });
  }

  const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      first_name: firstName ?? "",
      unsubscribed: false,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    console.error("[newsletter] Resend error:", body);
    return NextResponse.json(
      { message: "Could not register your subscription. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
