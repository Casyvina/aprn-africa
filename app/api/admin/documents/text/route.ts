import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { OfficeParser } from "officeparser";
import type { SupportedFileType } from "officeparser";

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email.toLowerCase());
}

const SUPPORTED = ["docx", "pptx", "xlsx"] as const;
type BinaryExt = (typeof SUPPORTED)[number];

function isSupportedExt(ext: string): ext is BinaryExt {
  return (SUPPORTED as readonly string[]).includes(ext);
}

/**
 * GET /api/admin/documents/text?filename=xxx
 * Extracts plain text from DOCX, PPTX, or XLSX using officeparser.
 * Used by the AI summariser to provide actual document content to Claude.
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const filename = new URL(req.url).searchParams.get("filename");
  if (!filename) {
    return new Response(JSON.stringify({ error: "filename required" }), { status: 400 });
  }

  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  if (!isSupportedExt(ext)) {
    return new Response(JSON.stringify({ error: "Unsupported format — only docx, pptx, xlsx" }), { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.storage.from("aprn-documents").download(filename);
  if (error || !data) {
    return new Response(JSON.stringify({ error: "File not found in storage" }), { status: 404 });
  }

  try {
    const buffer = Buffer.from(await data.arrayBuffer());
    const ast = await OfficeParser.parseOffice(buffer, { fileType: ext as SupportedFileType });
    const text = ast.toText().trim().slice(0, 12000);
    return new Response(JSON.stringify({ text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Extraction failed", detail: String(e) }), { status: 500 });
  }
}
