import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email.toLowerCase());
}

/** GET — meta overrides keyed by stakeholder_id + custom stakeholders array */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const admin = createAdminClient();
  const [metaRes, customRes] = await Promise.all([
    admin.from("strategy_stakeholders_meta").select("*"),
    admin.from("strategy_stakeholders").select("*").order("created_at"),
  ]);

  if (metaRes.error) return new Response(JSON.stringify({ error: metaRes.error.message }), { status: 500 });

  const map: Record<string, { last_contact_date: string | null; notes: string | null }> = {};
  (metaRes.data ?? []).forEach((row) => { map[row.stakeholder_id] = row; });

  return Response.json({ meta: map, custom: customRes.data ?? [] });
}

/** POST — create a new custom stakeholder */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const body = await req.json() as {
    name: string;
    org?: string;
    type: string;
    influence: string;
    interest: string;
    relationship?: string;
    engagement_strategy?: string;
    last_contact?: string;
    ix: number;
    iy: number;
  };

  if (!body.name?.trim()) {
    return new Response(JSON.stringify({ error: "name is required" }), { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("strategy_stakeholders")
    .insert({
      name: body.name.trim(),
      org: body.org?.trim() || undefined,
      type: body.type,
      influence: body.influence,
      interest: body.interest,
      relationship: body.relationship?.trim() || undefined,
      engagement_strategy: body.engagement_strategy?.trim() || undefined,
      last_contact: body.last_contact?.trim() || undefined,
      ix: body.ix,
      iy: body.iy,
      created_by: user.email || undefined,
    })
    .select()
    .single();

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return Response.json({ stakeholder: data });
}

/** PUT — upsert meta (last_contact_date + notes) for any stakeholder, or update a custom stakeholder */
export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const body = await req.json() as {
    // meta update (static or custom stakeholders)
    stakeholder_id?: string;
    last_contact_date?: string;
    notes?: string;
    // full update for custom stakeholders
    id?: string;
    name?: string;
    org?: string;
    type?: string;
    influence?: string;
    interest?: string;
    relationship?: string;
    engagement_strategy?: string;
    last_contact?: string;
    ix?: number;
    iy?: number;
  };

  const admin = createAdminClient();

  // Full record update for custom stakeholder
  if (body.id) {
    const { data, error } = await admin
      .from("strategy_stakeholders")
      .update({
        updated_at: new Date().toISOString(),
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.org !== undefined ? { org: body.org } : {}),
        ...(body.type !== undefined ? { type: body.type } : {}),
        ...(body.influence !== undefined ? { influence: body.influence } : {}),
        ...(body.interest !== undefined ? { interest: body.interest } : {}),
        ...(body.relationship !== undefined ? { relationship: body.relationship } : {}),
        ...(body.engagement_strategy !== undefined ? { engagement_strategy: body.engagement_strategy } : {}),
        ...(body.last_contact !== undefined ? { last_contact: body.last_contact } : {}),
        ...(body.ix !== undefined ? { ix: body.ix } : {}),
        ...(body.iy !== undefined ? { iy: body.iy } : {}),
      })
      .eq("id", body.id)
      .select()
      .single();

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    return Response.json({ stakeholder: data });
  }

  // Meta-only update (last contact date + notes)
  if (!body.stakeholder_id) {
    return new Response(JSON.stringify({ error: "stakeholder_id or id is required" }), { status: 400 });
  }

  const { error } = await admin
    .from("strategy_stakeholders_meta")
    .upsert(
      { stakeholder_id: body.stakeholder_id, last_contact_date: body.last_contact_date || null, notes: body.notes || null, updated_by: user.email },
      { onConflict: "stakeholder_id" }
    );

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return Response.json({ success: true });
}

/** DELETE — remove a custom stakeholder by id (?id=uuid) */
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return new Response(JSON.stringify({ error: "id is required" }), { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin.from("strategy_stakeholders").delete().eq("id", id);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return Response.json({ success: true });
}
