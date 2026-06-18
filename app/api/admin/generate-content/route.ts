import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { fal } from "@fal-ai/client";
import { writeClient } from "@/lib/sanity/write-client";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

interface BodyBlock { style: string; text: string }

function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function toPortableText(blocks: BodyBlock[]) {
  return blocks.map((b, i) => ({
    _type: "block",
    _key: `b${i}`,
    style: b.style || "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `s${i}`, text: b.text, marks: [] }],
  }));
}

function isSafeUrl(rawUrl: string): boolean {
  let parsed: URL;
  try { parsed = new URL(rawUrl); } catch { return false; }

  if (parsed.protocol !== "https:") return false;

  const host = parsed.hostname.toLowerCase();
  if (host === "localhost" || host === "0.0.0.0" || host === "") return false;

  // Block IPv4 private / loopback / link-local ranges
  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const [a, b] = [Number(ipv4[1]), Number(ipv4[2])];
    if (
      a === 127 ||                                  // 127.0.0.0/8 loopback
      a === 10 ||                                   // 10.0.0.0/8 private
      (a === 172 && b >= 16 && b <= 31) ||          // 172.16.0.0/12 private
      (a === 192 && b === 168) ||                   // 192.168.0.0/16 private
      (a === 169 && b === 254)                      // 169.254.0.0/16 cloud metadata
    ) return false;
  }

  // Block IPv6 loopback and ULA ranges
  if (host === "[::1]" || /^\[f[cd]/i.test(host)) return false;

  return true;
}

async function fetchUrlContext(url: string): Promise<string> {
  if (!isSafeUrl(url)) return "";
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; APRN-ContentBot/1.0)" },
      signal: AbortSignal.timeout(10_000),
    });
    const html = await res.text();
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text.slice(0, 6000);
  } catch {
    return "";
  }
}

async function generateHeroImage(title: string, _topic: string): Promise<string | null> {
  if (!process.env.FAL_KEY) return null;
  try {
    const result = await fal.subscribe("fal-ai/flux-pro", {
      input: {
        prompt: `Professional editorial cover image for an article titled "${title}". African oil and gas pipeline infrastructure, industrial engineering photography, aerial or wide-angle industrial scene. Dark navy and gold color palette, moody cinematic lighting, high resolution, photorealistic.`,
        image_size: "landscape_16_9",
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        safety_tolerance: "2",
        output_format: "jpeg",
      },
    }) as { data: { images: { url: string }[] } };
    return result?.data?.images?.[0]?.url ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { type, topic, angle, keyPoints, url } = await req.json() as {
    type: "editorialInsight" | "researchReport";
    topic: string;
    angle?: string;
    keyPoints?: string;
    url?: string;
  };

  if (!topic) return NextResponse.json({ error: "topic is required" }, { status: 400 });

  const urlContext = url ? await fetchUrlContext(url) : "";

  const isResearch = type === "researchReport";

  const prompt = `You are a senior content strategist for APRN Africa — Africa's professional network for pipeline and energy engineers. Your writing is authoritative, data-aware, and squarely focused on the African energy sector context.

Write a ${isResearch ? "research report" : "editorial insight article"} on this topic:
Topic: ${topic}
Angle/focus: ${angle || "Provide a comprehensive professional overview"}
Key points to include: ${keyPoints || "Cover the most important and current aspects of this topic"}
${urlContext ? `\nReference material extracted from URL (use as factual context):\n"""\n${urlContext}\n"""` : ""}

Respond with ONLY valid JSON — no markdown fences, no explanation — in this exact structure:
{
  "title": "A precise, compelling headline (max 80 chars)",
  "subtitle": "One-line framing that expands on the title",
  ${isResearch ? '"executiveSummary"' : '"excerpt"'}: "${isResearch ? "500-char max concise overview for listing cards" : "280-char max summary for listing cards and social sharing"}",
  "pullQuote": "One powerful, quotable sentence from the article",
  "estimatedReadTime": 8,
  "body": [
    { "style": "normal", "text": "Opening paragraph..." },
    { "style": "h2", "text": "Section Heading" },
    { "style": "normal", "text": "Body paragraph..." }
  ]
}

Guidelines:
- Body should be 700–1000 words total across all paragraphs
- Use h2 headings to break the piece into 3–4 clear sections
- Ground analysis in African context: infrastructure gaps, regulatory landscape, ECOWAS/AU frameworks, financing challenges
- Tone: institutional, clear, evidence-aware — like Foreign Affairs meets SPE journal
- DO NOT include any text outside the JSON object`;

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await anthropic.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = message.content[0].type === "text" ? message.content[0].text : "";
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) {
    return NextResponse.json({ error: "Model returned no JSON" }, { status: 500 });
  }

  const generated = JSON.parse(match[0]) as {
    title: string;
    subtitle?: string;
    excerpt?: string;
    executiveSummary?: string;
    pullQuote?: string;
    estimatedReadTime?: number;
    body: BodyBlock[];
  };

  const docId = `drafts.${crypto.randomUUID()}`;
  const slug = toSlug(generated.title);
  const today = new Date().toISOString().slice(0, 10);
  const body = toPortableText(generated.body ?? []);

  // Run Sanity write and Fal.ai image gen in parallel
  const [, imageUrl] = await Promise.all([
    isResearch
      ? writeClient.createOrReplace<Record<string, unknown>>({
          _id: docId,
          _type: "researchReport",
          title: generated.title,
          slug: { _type: "slug", current: slug },
          subtitle: generated.subtitle ?? "",
          executiveSummary: generated.executiveSummary ?? "",
          pullQuote: generated.pullQuote ?? "",
          body,
          reportType: "working-paper",
          publishDate: today,
          estimatedReadTime: generated.estimatedReadTime ?? 10,
          featured: false,
        })
      : writeClient.createOrReplace<Record<string, unknown>>({
          _id: docId,
          _type: "editorialInsight",
          title: generated.title,
          slug: { _type: "slug", current: slug },
          subtitle: generated.subtitle ?? "",
          excerpt: generated.excerpt ?? "",
          pullQuote: generated.pullQuote ?? "",
          body,
          publishDate: today,
          estimatedReadTime: generated.estimatedReadTime ?? 8,
          featured: false,
        }),
    generateHeroImage(generated.title, topic),
  ]);

  return NextResponse.json({ docId, slug, title: generated.title, imageUrl });
}
