import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/types/database";

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email.toLowerCase());
}

/** GET — fetch all channel overrides from strategy_channels */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("strategy_channels")
    .select("*")
    .order("sort_order");

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  // Return as a map keyed by channel id for easy lookup
  const map: Record<string, unknown> = {};
  (data ?? []).forEach((row) => { map[row.id] = row; });
  return Response.json({ channels: map });
}

/** PUT — upsert a single channel record */
export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const body = await req.json() as {
    id: string;
    name: string;
    freq?: string;
    content?: string;
    audience?: string;
    owner?: string;
    notes?: string;
    whatsapp_groups?: Json;
    sort_order?: number;
  };

  if (!body.id) return new Response(JSON.stringify({ error: "id is required" }), { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin
    .from("strategy_channels")
    .upsert({ ...body, updated_by: user.email }, { onConflict: "id" });

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return Response.json({ success: true });
}
