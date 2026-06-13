import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email.toLowerCase());
}

/** GET — fetch all stakeholder meta overrides as a map keyed by stakeholder_id */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("strategy_stakeholders_meta")
    .select("*");

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  const map: Record<string, { last_contact_date: string | null; notes: string | null }> = {};
  (data ?? []).forEach((row) => { map[row.stakeholder_id] = row; });
  return Response.json({ meta: map });
}

/** PUT — upsert a single stakeholder's metadata */
export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { stakeholder_id, last_contact_date, notes } = await req.json() as {
    stakeholder_id: string;
    last_contact_date?: string;
    notes?: string;
  };

  if (!stakeholder_id) {
    return new Response(JSON.stringify({ error: "stakeholder_id is required" }), { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("strategy_stakeholders_meta")
    .upsert(
      { stakeholder_id, last_contact_date: last_contact_date || null, notes: notes || null, updated_by: user.email },
      { onConflict: "stakeholder_id" }
    );

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return Response.json({ success: true });
}
