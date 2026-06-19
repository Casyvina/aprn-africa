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

async function fetchUrlContext(url: string): Promise<{ text: string; ok: boolean; reason?: string }> {
  if (!isSafeUrl(url)) return { text: "", ok: false, reason: "URL blocked for security reasons (must be public https://)" };
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; APRN-ContentBot/1.0)" },
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) return { text: "", ok: false, reason: `Server returned ${res.status}` };
    const html = await res.text();
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const trimmed = text.slice(0, 10_000);
    if (trimmed.length < 200) return { text: "", ok: false, reason: "Page returned too little readable text (may require login or JavaScript)" };
    return { text: trimmed, ok: true };
  } catch (err) {
    return { text: "", ok: false, reason: err instanceof Error ? err.message : "Fetch failed" };
  }
}

function buildPublicationPrompt(params: {
  pubType: string;
  topic: string;
  angle?: string;
  keyPoints?: string;
  urlContext: string;
}): string {
  const { pubType, topic, angle, keyPoints, urlContext } = params;
  const hasSource = urlContext.length > 200;

  const jsonShape = `{
  "title": "Precise headline (max 80 chars)",
  "subtitle": "One-line framing or context (max 120 chars)",
  "summary": "Two-sentence summary of the piece (max 300 chars)",
  "estimatedReadTime": 4,
  "body": [
    { "style": "normal", "text": "Opening paragraph..." },
    { "style": "h2", "text": "Section Heading" },
    { "style": "normal", "text": "..." }
  ]
}`;

  const toneMap: Record<string, string> = {
    "op-ed":          "a direct, argued op-ed — thesis-first, evidenced, calls for action",
    "position-paper": "a formal position paper — structured argument with stated position, evidence, and policy recommendations",
    "technical-note": "a concise technical note — precise, specific, oriented to practitioners",
    "event-summary":  "a factual event summary — who, what, what happened, significance, what comes next",
    "press-release":  "a professional press release — announcement lead, supporting details, boilerplate close",
    "commentary":     "an analytical commentary — reasoned perspective on a recent development",
    "interview":      "a formatted Q&A interview — questions bold-style (Q:), answers as paragraphs (A:)",
  };
  const tone = toneMap[pubType] ?? `a ${pubType.replace(/-/g, " ")}`;

  if (hasSource) {
    return `You are writing for APRN Africa — a professional platform for pipeline engineering and energy sector professionals.

Write ${tone}.

REFERENCE MATERIAL (ground the piece in specific details from this source):
"""
${urlContext}
"""

Topic: ${topic}
Angle: ${angle || "Key implications and professional perspective"}
Cover: ${keyPoints || "The most important points from the source material"}

- Open with a specific fact, figure, or event from the reference — not a generic statement
- Target audience: pipeline engineers, energy managers, and policy professionals in Africa
- Body: 400–600 words total

Respond with ONLY valid JSON — no markdown fences, no explanation:
${jsonShape}

No text outside the JSON object.`;
  }

  return `You are writing for APRN Africa — a professional platform for pipeline engineering and energy sector professionals.

Write ${tone}.

Topic: ${topic}
Angle: ${angle || "Key implications and professional perspective"}
Cover: ${keyPoints || "The most important points on this topic"}

- Reference specific African infrastructure projects, regulatory bodies, or documented events by name
- Target audience: pipeline engineers, energy managers, and policy professionals in Africa
- Body: 400–600 words total

Respond with ONLY valid JSON — no markdown fences, no explanation:
${jsonShape}

No text outside the JSON object.`;
}

function buildPrompt(params: {
  isResearch: boolean;
  topic: string;
  angle?: string;
  keyPoints?: string;
  urlContext: string;
}): string {
  const { isResearch, topic, angle, keyPoints, urlContext } = params;
  const hasSource = urlContext.length > 200;

  const jsonShape = isResearch
    ? `{
  "title": "Precise technical headline (max 80 chars)",
  "subtitle": "One-line scope or methodology framing",
  "executiveSummary": "500-char max: key findings and recommendation",
  "pullQuote": "One evidence-based quotable sentence",
  "estimatedReadTime": 10,
  "body": [
    { "style": "normal", "text": "Opening paragraph..." },
    { "style": "h2", "text": "Background and Context" },
    { "style": "normal", "text": "..." },
    { "style": "h2", "text": "Key Findings" },
    { "style": "normal", "text": "..." },
    { "style": "h2", "text": "Implications for African Operators" },
    { "style": "normal", "text": "..." },
    { "style": "h2", "text": "Recommendations" },
    { "style": "normal", "text": "..." }
  ]
}`
    : `{
  "title": "Sharp specific headline (max 80 chars)",
  "subtitle": "One-line framing",
  "excerpt": "280-char max summary",
  "pullQuote": "One memorable analytical sentence",
  "estimatedReadTime": 7,
  "body": [
    { "style": "normal", "text": "Opening paragraph..." },
    { "style": "h2", "text": "Section Heading" },
    { "style": "normal", "text": "..." }
  ]
}`;

  if (isResearch && hasSource) {
    return `You are a research analyst at APRN Africa producing a working paper for pipeline and energy professionals.

The text below is PRIMARY SOURCE MATERIAL scraped from a reference document. Your working paper must be built on the specific facts, data, project names, figures, costs, regulatory references, and findings present in this source. Do not invent data not in it.

PRIMARY SOURCE:
"""
${urlContext}
"""

Topic: ${topic}
Focus: ${angle || "Technical and policy analysis of the key findings"}
Required coverage: ${keyPoints || "Critical findings and their implications for African pipeline operators"}

Write a rigorous working paper that:
- Opens by grounding the reader in a SPECIFIC finding, number, or event from the source
- Extracts project names, costs, timelines, technical specifications, and regulatory references from the source and builds analysis around them
- Contextualises findings within the African pipeline sector: ECOWAS frameworks, NMDPRA/DPR regulations, WAGP, NMGP, EACOP, Trans-Saharan Gas Pipeline where relevant
- Provides structured analysis — what the evidence shows, what it means for operators, what should be done
- Reads like an SPE technical paper or World Bank sector assessment — not a think-piece

Respond with ONLY valid JSON — no markdown fences, no explanation:
${jsonShape}

Requirements: Body 800–1100 words total. Use specific names, numbers, and references from the source. No text outside the JSON object.`;
  }

  if (isResearch && !hasSource) {
    return `You are a research analyst at APRN Africa producing a working paper for pipeline and energy engineering professionals.

Topic: ${topic}
Focus: ${angle || "Technical and policy analysis"}
Required coverage: ${keyPoints || "Critical technical, regulatory, and commercial dimensions"}

Write a rigorous working paper. Every claim must be anchored to documented reality:
- Reference SPECIFIC African infrastructure projects by name (WAGP, NMGP, EACOP, Trans-Saharan Gas Pipeline, Mozambique LNG, Dangote Refinery Pipeline, etc.)
- Cite actual regulatory bodies and frameworks (NMDPRA, DPR, NPA, ECOWAS Energy Protocol, AU Agenda 2063)
- Use documented figures where they exist (project costs, pipeline lengths, capacity, dates)
- Structure: Executive Summary → Background → Key Technical/Policy Findings → Implications for African Operators → Recommendations
- Tone: SPE journal meets World Bank infrastructure assessment — evidence-first, not opinion-first

Respond with ONLY valid JSON:
${jsonShape}

Body: 800–1100 words. Reference specific projects and figures. No text outside the JSON object.`;
  }

  if (!isResearch && hasSource) {
    return `You are a senior content strategist at APRN Africa writing an editorial insight piece for pipeline engineers and energy professionals.

REFERENCE MATERIAL (the specific facts and events below are your starting point — ground your commentary in them):
"""
${urlContext}
"""

Topic: ${topic}
Angle: ${angle || "What this means for African pipeline engineers and policymakers"}
Cover: ${keyPoints || "Key implications and professional perspective"}

Write an editorial that:
- Opens with a SPECIFIC detail, number, project name, or event from the reference — not a generic statement
- Builds analytical commentary ON TOP of those facts (what does this mean? what should the sector do?)
- Targets pipeline engineers, energy managers, and policy professionals in Africa
- Tone: authoritative, direct — Foreign Affairs meets SPE technical commentary

Respond with ONLY valid JSON:
${jsonShape}

Body: 700–900 words. Open with a specific reference detail. No text outside the JSON object.`;
  }

  // Editorial, no source URL
  return `You are a senior content strategist at APRN Africa writing an editorial insight piece for pipeline and energy professionals.

Topic: ${topic}
Angle: ${angle || "Strategic analysis and professional perspective"}
Cover: ${keyPoints || "The most important dimensions of this topic for African energy professionals"}

Write an editorial grounded in documented sector realities — not abstract commentary:
- Reference specific African projects, companies, regulatory developments, or events by name
- Every analytical claim should connect to a real-world reference point in the African energy sector
- Tone: authoritative, direct — Foreign Affairs meets SPE commentary

Respond with ONLY valid JSON:
${jsonShape}

Body: 700–900 words. No generic platitudes. No text outside the JSON object.`;
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

  const { type, pubType, topic, angle, keyPoints, url } = await req.json() as {
    type: "editorialInsight" | "researchReport" | "publication";
    pubType?: string;
    topic: string;
    angle?: string;
    keyPoints?: string;
    url?: string;
  };

  if (!topic) return NextResponse.json({ error: "topic is required" }, { status: 400 });

  const isResearch = type === "researchReport";
  const isPublication = type === "publication";

  let urlContextText = "";
  let urlContextUsed = false;
  let urlFetchWarning: string | undefined;

  if (url) {
    const result = await fetchUrlContext(url);
    if (result.ok) {
      urlContextText = result.text;
      urlContextUsed = true;
    } else {
      urlFetchWarning = result.reason;
    }
  }

  const prompt = isPublication
    ? buildPublicationPrompt({ pubType: pubType ?? "op-ed", topic, angle, keyPoints, urlContext: urlContextText })
    : buildPrompt({ isResearch, topic, angle, keyPoints, urlContext: urlContextText });

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await anthropic.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 8192,
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
    summary?: string;
    executiveSummary?: string;
    pullQuote?: string;
    estimatedReadTime?: number;
    body: BodyBlock[];
  };

  const docId = `drafts.${crypto.randomUUID()}`;
  const slug = toSlug(generated.title);
  const today = new Date().toISOString().slice(0, 10);
  const body = toPortableText(generated.body ?? []);

  let sanityWrite: Promise<unknown>;
  if (isPublication) {
    sanityWrite = writeClient.createOrReplace<Record<string, unknown>>({
      _id: docId,
      _type: "publication",
      title: generated.title,
      slug: { _type: "slug", current: slug },
      subtitle: generated.subtitle ?? "",
      summary: generated.summary ?? "",
      estimatedReadTime: generated.estimatedReadTime ?? 4,
      body,
      publicationType: pubType ?? "op-ed",
      publishDate: today,
      featured: false,
    });
  } else if (isResearch) {
    sanityWrite = writeClient.createOrReplace<Record<string, unknown>>({
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
    });
  } else {
    sanityWrite = writeClient.createOrReplace<Record<string, unknown>>({
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
    });
  }

  // Run Sanity write and Fal.ai image gen in parallel
  const [, imageUrl] = await Promise.all([
    sanityWrite,
    generateHeroImage(generated.title, topic),
  ]);

  return NextResponse.json({ docId, slug, title: generated.title, imageUrl, urlContextUsed, urlFetchWarning });
}
