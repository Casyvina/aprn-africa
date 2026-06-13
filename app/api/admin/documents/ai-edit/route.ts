import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { join } from "path";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email.toLowerCase());
}

const BUCKET = "aprn-documents";
const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * POST — AI-edit an HTML document.
 * Reads from Supabase Storage (or falls back to public/documents/),
 * applies the instruction via Claude, and streams back the corrected HTML.
 * Does NOT save — the client calls /api/admin/documents/save to persist.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { filename, instruction } = await req.json() as { filename?: string; instruction?: string };
  if (!filename || !instruction?.trim()) {
    return new Response(JSON.stringify({ error: "filename and instruction are required" }), { status: 400 });
  }
  if (!filename.toLowerCase().endsWith(".html")) {
    return new Response(JSON.stringify({ error: "AI editing is only supported for HTML documents" }), { status: 400 });
  }

  const admin = createAdminClient();
  let htmlContent = "";

  // 1. Try Supabase Storage first
  const { data: blob, error: dlErr } = await admin.storage.from(BUCKET).download(filename);
  if (!dlErr && blob) {
    htmlContent = await blob.text();
  } else {
    // 2. Fall back to public/documents/ (existing static files)
    try {
      htmlContent = readFileSync(join(process.cwd(), "public", "documents", filename), "utf-8");
    } catch {
      return new Response(JSON.stringify({ error: "File not found" }), { status: 404 });
    }
  }

  const stream = await claude.messages.stream({
    model: "claude-opus-4-6",
    max_tokens: 32000,
    system:
      "You are editing an internal HTML document for APRN Africa, a pan-African pipeline research and networking organisation. " +
      "Apply the requested change precisely and return ONLY the complete corrected HTML document. " +
      "CRITICAL: Output raw HTML only — no markdown, no code fences, no backticks, no commentary before or after. " +
      "Your response must start with <!DOCTYPE or <html and end with </html>.",
    messages: [
      {
        role: "user",
        content: `Apply this change to the document: "${instruction}"\n\nReturn the complete corrected HTML document only. Start your response directly with <!DOCTYPE or <html — no preamble.\n\n---\n\n${htmlContent}`,
      },
    ],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "X-Content-Type-Options": "nosniff" },
  });
}
