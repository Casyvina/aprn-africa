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

  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const admin = createAdminClient();

  // PPTX / DOCX / XLSX — generate a fresh signed URL server-side and redirect to Office Online Viewer
  if (["pptx", "docx", "xlsx"].includes(ext)) {
    const { data: urlData } = await admin.storage.from("aprn-documents").createSignedUrl(filename, 3600);
    if (!urlData?.signedUrl) return new Response("File not found in storage", { status: 404 });
    const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(urlData.signedUrl)}`;
    return Response.redirect(officeUrl, 302);
  }

  // HTML — serve inline with strict CSP
  if (ext !== "html") {
    return new Response("Unsupported file type for inline view", { status: 400 });
  }

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
      // Scripts are blocked entirely — documents are styled HTML only
      "Content-Security-Policy": "default-src 'self'; style-src 'self' 'unsafe-inline' https: data:; script-src 'none'; img-src * data:; font-src * data: https:; frame-ancestors 'none';",
    },
  });
}
