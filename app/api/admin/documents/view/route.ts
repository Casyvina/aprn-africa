import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email.toLowerCase());
}

/**
 * GET /api/admin/documents/view?filename=xxx
 * Serves an HTML document from Supabase Storage with the correct Content-Type.
 * Supabase signed URLs often include Content-Disposition: attachment which forces
 * download instead of rendering — this proxy strips that and forces inline display.
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const filename = new URL(req.url).searchParams.get("filename");
  if (!filename) return new Response("filename required", { status: 400 });

  // Only serve HTML files through this proxy
  if (!filename.toLowerCase().endsWith(".html")) {
    return new Response("Only HTML files can be viewed inline", { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.storage.from("aprn-documents").download(filename);
  if (error || !data) {
    return new Response("File not found in storage", { status: 404 });
  }

  const html = await data.text();
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": "inline",
      "X-Content-Type-Options": "nosniff",
      // Allow the document to load its own resources
      "Content-Security-Policy": "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: https:; img-src * data:;",
    },
  });
}
