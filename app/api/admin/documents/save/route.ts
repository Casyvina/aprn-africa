import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email.toLowerCase());
}

const BUCKET = "aprn-documents";

/**
 * PUT — save (or overwrite) an HTML document in Supabase Storage.
 * Called after the admin approves the AI-edited preview.
 */
export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { filename, content } = await req.json() as { filename?: string; content?: string };
  if (!filename || !content) {
    return new Response(JSON.stringify({ error: "filename and content are required" }), { status: 400 });
  }

  const admin = createAdminClient();
  const blob = new Blob([content], { type: "text/html; charset=utf-8" });

  const { error } = await admin.storage.from(BUCKET).upload(filename, blob, {
    contentType: "text/html; charset=utf-8",
    upsert: true,
  });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return Response.json({ success: true });
}
