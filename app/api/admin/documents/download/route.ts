import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email.toLowerCase());
}

/**
 * GET /api/admin/documents/download?filename=xxx
 * Forces a file download regardless of type. Proxies from Supabase Storage and
 * sets Content-Disposition: attachment so the browser always saves rather than renders.
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const filename = new URL(req.url).searchParams.get("filename");
  if (!filename) return new Response("filename required", { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin.storage.from("aprn-documents").download(filename);
  if (error || !data) {
    return new Response("File not found", { status: 404 });
  }

  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const mimeMap: Record<string, string> = {
    html: "text/html",
    pdf:  "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    txt:  "text/plain",
  };
  const contentType = mimeMap[ext] ?? "application/octet-stream";

  return new Response(data, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
