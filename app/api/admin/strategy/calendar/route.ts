import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email.toLowerCase());
}

/** GET — fetch all calendar items ordered by week + sort_order */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("strategy_calendar_items")
    .select("*")
    .order("week_number")
    .order("sort_order");

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return Response.json({ items: data ?? [] });
}

/** POST — add a new calendar item */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { week_number, week_label, item, owner } = await req.json() as {
    week_number: number;
    week_label: string;
    item: string;
    owner?: string;
  };

  if (!item?.trim() || !week_number) {
    return new Response(JSON.stringify({ error: "week_number and item are required" }), { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("strategy_calendar_items")
    .insert({ week_number, week_label, item: item.trim(), owner: owner ?? "" })
    .select()
    .single();

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return Response.json({ item: data });
}

/** PUT — update a calendar item's text, owner, or sort_order */
export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { id, item, owner, sort_order } = await req.json() as {
    id: string;
    item?: string;
    owner?: string;
    sort_order?: number;
  };

  if (!id) return new Response(JSON.stringify({ error: "id is required" }), { status: 400 });

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("strategy_calendar_items")
    .update({
      updated_at: new Date().toISOString(),
      ...(item !== undefined ? { item } : {}),
      ...(owner !== undefined ? { owner } : {}),
      ...(sort_order !== undefined ? { sort_order } : {}),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return Response.json({ item: data });
}

/** DELETE — remove a calendar item by id (?id=uuid) */
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return new Response(JSON.stringify({ error: "id is required" }), { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin.from("strategy_calendar_items").delete().eq("id", id);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return Response.json({ success: true });
}
