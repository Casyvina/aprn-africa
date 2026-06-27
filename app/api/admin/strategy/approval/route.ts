import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function isAdmin(email: string | undefined): boolean {
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email?.toLowerCase() ?? "");
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user?.email)) return Response.json({ error: "Forbidden" }, { status: 403 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("strategy_approval_steps")
    .select("*")
    .order("sort_order");

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ steps: data });
}

export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user?.email)) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id, who_handles, description } = await req.json() as {
    id: string;
    who_handles?: string;
    description?: string;
  };

  if (!id) return Response.json({ error: "id required" }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("strategy_approval_steps")
    .update({
      updated_at: new Date().toISOString(),
      ...(who_handles !== undefined ? { who_handles } : {}),
      ...(description !== undefined ? { description } : {}),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ step: data });
}
