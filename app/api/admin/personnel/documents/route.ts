import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const PERSONNEL_EMAILS = ["josephagwuh@gmail.com", "info@aprn-africa.org"];
const BUCKET = "aprn-documents";
const FOLDER = "personnel";

function hasAccess(email: string | undefined): boolean {
  return PERSONNEL_EMAILS.includes(email?.toLowerCase() ?? "");
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !hasAccess(user.email)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const admin = createAdminClient();

  const { data: files, error } = await admin.storage.from(BUCKET).list(FOLDER, {
    limit: 200,
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  const { data: metaRows } = await admin
    .from("strategy_documents_meta")
    .select("*")
    .eq("category", "Personnel");

  const metaMap: Record<string, Record<string, string | null>> = {};
  (metaRows ?? []).forEach((row: Record<string, string | null>) => {
    metaMap[row.doc_id as string] = row;
  });

  const docs = (files ?? [])
    .filter((f) => f.name !== ".emptyFolderPlaceholder")
    .map((f) => {
      const storagePath = `${FOLDER}/${f.name}`;
      const m = metaMap[storagePath] ?? {};
      return {
        id: storagePath,
        filename: f.name,
        storagePath,
        size: (f.metadata?.size as number) ?? 0,
        created_at: f.created_at ?? null,
        display_name: m.display_name ?? f.name,
        description: m.description ?? "",
        version: m.version ?? "",
        doc_date: m.doc_date ?? "",
        person: m.notes ?? "",
      };
    });

  return Response.json({ docs });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !hasAccess(user.email)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const displayName = formData.get("display_name") as string | null;
  if (!file) return new Response(JSON.stringify({ error: "No file provided" }), { status: 400 });

  const admin = createAdminClient();
  const storagePath = `${FOLDER}/${file.name}`;
  const buffer = await file.arrayBuffer();

  const { error: uploadError } = await admin.storage.from(BUCKET).upload(storagePath, buffer, {
    contentType: file.type || "application/octet-stream",
    upsert: true,
  });
  if (uploadError) return new Response(JSON.stringify({ error: uploadError.message }), { status: 500 });

  await admin.from("strategy_documents_meta").upsert({
    doc_id: storagePath,
    filename: storagePath,
    display_name: displayName ?? file.name,
    category: "Personnel",
    updated_by: user.email ?? null,
    updated_at: new Date().toISOString(),
  }, { onConflict: "doc_id" });

  return Response.json({ storagePath });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !hasAccess(user.email)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const filename = new URL(req.url).searchParams.get("filename");
  if (!filename) return new Response(JSON.stringify({ error: "filename required" }), { status: 400 });

  const storagePath = `${FOLDER}/${filename}`;
  const admin = createAdminClient();

  const { error: storageError } = await admin.storage.from(BUCKET).remove([storagePath]);
  if (storageError) return new Response(JSON.stringify({ error: storageError.message }), { status: 500 });

  await admin.from("strategy_documents_meta").delete().eq("doc_id", storagePath);

  return Response.json({ success: true });
}
