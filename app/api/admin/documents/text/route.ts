import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { unzipSync } from "fflate";

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email.toLowerCase());
}

const dec = new TextDecoder();

function stripXml(xml: string): string {
  return xml
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&#\d+;/g, " ")
    .replace(/<[^>]+>/g, " ").replace(/ {2,}/g, " ").trim();
}

function extractPptx(data: Uint8Array): string {
  const files = unzipSync(data);
  const slideKeys = Object.keys(files)
    .filter((k) => /^ppt\/slides\/slide\d+\.xml$/.test(k))
    .sort((a, b) => {
      const na = parseInt(a.match(/\d+/)?.[0] ?? "0");
      const nb = parseInt(b.match(/\d+/)?.[0] ?? "0");
      return na - nb;
    });

  return slideKeys
    .map((k) => {
      const xml = dec.decode(files[k]);
      // Extract runs from <a:t> elements (DrawingML text runs)
      return (xml.match(/<a:t[^>]*>([^<]*)<\/a:t>/g) ?? [])
        .map((m) => m.replace(/<[^>]+>/g, "").replace(/&[^;]+;/g, " ").trim())
        .filter(Boolean)
        .join(" ");
    })
    .join("\n")
    .replace(/ {2,}/g, " ")
    .trim();
}

function extractDocx(data: Uint8Array): string {
  const files = unzipSync(data);
  const docXml = files["word/document.xml"];
  if (!docXml) return "";
  const xml = dec.decode(docXml);
  // Insert newlines at paragraph boundaries before stripping tags
  return stripXml(xml.replace(/<\/w:p>/g, " \n")).replace(/\n{3,}/g, "\n\n");
}

function extractXlsx(data: Uint8Array): string {
  const files = unzipSync(data);
  const texts: string[] = [];

  // Shared strings table contains all unique cell string values
  const ssFile = files["xl/sharedStrings.xml"];
  if (ssFile) {
    const xml = dec.decode(ssFile);
    const matches = xml.match(/<t[^>]*>([^<]*)<\/t>/g) ?? [];
    for (const m of matches) {
      const t = m.replace(/<[^>]+>/g, "").trim();
      if (t) texts.push(t);
    }
  }

  return texts.join(" ").replace(/ {2,}/g, " ").trim();
}

/**
 * GET /api/admin/documents/text?filename=xxx
 * Extracts plain text from DOCX, PPTX, or XLSX by reading the ZIP structure directly.
 * Used by the AI summariser to supply real document content to Claude.
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
  if (!["docx", "pptx", "xlsx"].includes(ext)) {
    return new Response(JSON.stringify({ error: "Unsupported format" }), { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.storage.from("aprn-documents").download(filename);
  if (error || !data) {
    return new Response(JSON.stringify({ error: "File not found" }), { status: 404 });
  }

  try {
    const bytes = new Uint8Array(await data.arrayBuffer());
    let text = "";
    if (ext === "pptx") text = extractPptx(bytes);
    else if (ext === "docx") text = extractDocx(bytes);
    else if (ext === "xlsx") text = extractXlsx(bytes);

    return new Response(JSON.stringify({ text: text.slice(0, 12000) }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("[/api/admin/documents/text] extraction error:", e);
    return new Response(JSON.stringify({ error: "Extraction failed", detail: String(e) }), { status: 500 });
  }
}
