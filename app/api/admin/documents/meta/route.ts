import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email.toLowerCase());
}

/** GET — return all document metadata rows keyed by filename */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.from("strategy_documents_meta").select("*");
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  const meta: Record<string, unknown> = {};
  (data ?? []).forEach((row) => { meta[row.doc_id] = row; });
  return Response.json({ meta });
}

/** PUT — upsert metadata for a single document */
export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const body = await req.json() as {
    filename: string;
    display_name?: string;
    description?: string;
    doc_date?: string;
    version?: string;
    notes?: string;
    category?: string;
  };

  if (!body.filename) return new Response(JSON.stringify({ error: "filename required" }), { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin.from("strategy_documents_meta").upsert({
    doc_id: body.filename,
    filename: body.filename,
    display_name: body.display_name ?? null,
    description: body.description ?? null,
    doc_date: body.doc_date ?? null,
    version: body.version ?? null,
    notes: body.notes ?? null,
    category: body.category ?? null,
    updated_by: user.email ?? null,
    updated_at: new Date().toISOString(),
  }, { onConflict: "doc_id" });

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return Response.json({ success: true });
}

/** DELETE — remove metadata row for a document (?filename=xxx) */
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const filename = new URL(req.url).searchParams.get("filename");
  if (!filename) return new Response(JSON.stringify({ error: "filename required" }), { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin.from("strategy_documents_meta").delete().eq("doc_id", filename);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return Response.json({ success: true });
}
