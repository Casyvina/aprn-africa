import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function isAdmin(email: string | undefined) {
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email?.toLowerCase() ?? "");
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: campaign_id } = await params;
  const { recipients } = await req.json() as {
    recipients: {
      recipient_type: string;
      recipient_id: string;
      recipient_name: string;
      recipient_email: string | null;
    }[];
  };

  if (!recipients?.length) return NextResponse.json({ error: "No recipients provided" }, { status: 400 });

  const admin = createAdminClient();

  // Check for existing entries to avoid duplicates
  const { data: existing } = await admin
    .from("outreach_recipients")
    .select("recipient_id")
    .eq("campaign_id", campaign_id);

  const existingIds = new Set((existing ?? []).map((r) => r.recipient_id));
  const newRecipients = recipients
    .filter((r) => !existingIds.has(r.recipient_id))
    .map((r) => ({
      campaign_id,
      recipient_type: r.recipient_type,
      recipient_id: r.recipient_id,
      recipient_name: r.recipient_name,
      recipient_email: r.recipient_email,
      status: r.recipient_email ? "pending" : "no_email",
    }));

  if (!newRecipients.length) return NextResponse.json({ added: 0, skipped: recipients.length });

  const { error } = await admin.from("outreach_recipients").insert(newRecipients);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ added: newRecipients.length, skipped: recipients.length - newRecipients.length });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: campaign_id } = await params;
  const { recipient_row_id } = await req.json();
  const admin = createAdminClient();
  const { error } = await admin
    .from("outreach_recipients")
    .delete()
    .eq("id", recipient_row_id)
    .eq("campaign_id", campaign_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
