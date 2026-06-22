import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Resend sends webhook events for email.opened, email.bounced, email.delivery_delayed, etc.
// We update the recipient row status accordingly.

interface ResendWebhookEvent {
  type: string;
  data: {
    email_id: string;
    // other fields present but not needed
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json() as ResendWebhookEvent;
  const messageId = body?.data?.email_id;
  if (!messageId) return NextResponse.json({ ok: true });

  const admin = createAdminClient();

  if (body.type === "email.opened") {
    await admin
      .from("outreach_recipients")
      .update({ status: "opened", opened_at: new Date().toISOString() })
      .eq("resend_message_id", messageId)
      .eq("status", "sent"); // don't downgrade if already "replied"
  }

  if (body.type === "email.bounced") {
    await admin
      .from("outreach_recipients")
      .update({ status: "bounced" })
      .eq("resend_message_id", messageId);
  }

  return NextResponse.json({ ok: true });
}
