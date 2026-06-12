import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email.toLowerCase());
}

const BUCKET = "aprn-documents";

/** GET — list all files in the bucket with signed URLs */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const admin = createAdminClient();

  // Create bucket on first use — ignore error if it already exists
  await admin.storage.createBucket(BUCKET, { public: false });

  const { data, error } = await admin.storage.from(BUCKET).list("", {
    limit: 200,
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const files = await Promise.all(
    (data ?? [])
      .filter((f) => f.name !== ".emptyFolderPlaceholder")
      .map(async (f) => {
        const { data: urlData } = await admin.storage.from(BUCKET).createSignedUrl(f.name, 3600);
        return {
          filename: f.name,
          signedUrl: urlData?.signedUrl ?? null,
          size: f.metadata?.size ?? 0,
        };
      })
  );

  return Response.json({ files });
}

/** POST — upload a new document to storage */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return new Response(JSON.stringify({ error: "No file provided" }), { status: 400 });
  }

  const admin = createAdminClient();
  const buffer = await file.arrayBuffer();

  const { error } = await admin.storage.from(BUCKET).upload(file.name, buffer, {
    contentType: file.type || "application/octet-stream",
    upsert: true,
  });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const { data: urlData } = await admin.storage.from(BUCKET).createSignedUrl(file.name, 3600);
  return Response.json({ filename: file.name, signedUrl: urlData?.signedUrl ?? null });
}
