import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email.toLowerCase());
}

const BUCKET = "aprn-documents";

const MIME: Record<string, string> = {
  html: "text/html",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  pdf:  "application/pdf",
};

/**
 * POST — one-time migration that copies all files from public/documents/
 * into the aprn-documents Supabase Storage bucket.
 */
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const admin = createAdminClient();
  await admin.storage.createBucket(BUCKET, { public: false });

  const docsDir = join(process.cwd(), "public", "documents");
  let filenames: string[];
  try {
    filenames = readdirSync(docsDir);
  } catch {
    return new Response(JSON.stringify({ error: "public/documents not found" }), { status: 500 });
  }

  const results: { filename: string; success: boolean; error?: string }[] = [];
  for (const name of filenames) {
    const ext = name.split(".").pop()?.toLowerCase() ?? "";
    const mime = MIME[ext] ?? "application/octet-stream";
    try {
      const buffer = readFileSync(join(docsDir, name));
      const { error } = await admin.storage.from(BUCKET).upload(name, buffer, {
        contentType: mime,
        upsert: true,
      });
      results.push({ filename: name, success: !error, error: error?.message });
    } catch (e) {
      results.push({ filename: name, success: false, error: String(e) });
    }
  }

  return Response.json({ results });
}
