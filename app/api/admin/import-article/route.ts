import { NextRequest, NextResponse } from "next/server"
import { writeClient } from "@/lib/sanity/write-client"
import { createClient } from "@/lib/supabase/server"

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)

function isAdmin(email: string | undefined) {
  return ADMIN_EMAILS.includes(email?.toLowerCase() ?? "")
}

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80)
}

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

// ── Inline parser: **bold**, *italic*, plain text ────────────────────────────
type Span = { _type: "span"; _key: string; text: string; marks: string[] }

function parseInline(text: string): Span[] {
  const spans: Span[] = []
  let rest = text

  while (rest.length > 0) {
    const boldIdx = rest.indexOf("**")
    const emIdx   = rest.indexOf("*")

    // no more marks
    if (boldIdx === -1 && emIdx === -1) {
      spans.push({ _type: "span", _key: uid(), text: rest, marks: [] })
      break
    }

    // bold comes first (or only)
    if (boldIdx !== -1 && (emIdx === -1 || boldIdx <= emIdx)) {
      const closeIdx = rest.indexOf("**", boldIdx + 2)
      if (closeIdx === -1) {
        spans.push({ _type: "span", _key: uid(), text: rest, marks: [] })
        break
      }
      if (boldIdx > 0) spans.push({ _type: "span", _key: uid(), text: rest.slice(0, boldIdx), marks: [] })
      spans.push({ _type: "span", _key: uid(), text: rest.slice(boldIdx + 2, closeIdx), marks: ["strong"] })
      rest = rest.slice(closeIdx + 2)
      continue
    }

    // italic
    const closeIdx = rest.indexOf("*", emIdx + 1)
    if (closeIdx === -1) {
      spans.push({ _type: "span", _key: uid(), text: rest, marks: [] })
      break
    }
    if (emIdx > 0) spans.push({ _type: "span", _key: uid(), text: rest.slice(0, emIdx), marks: [] })
    spans.push({ _type: "span", _key: uid(), text: rest.slice(emIdx + 1, closeIdx), marks: ["em"] })
    rest = rest.slice(closeIdx + 1)
  }

  return spans.filter((s) => s.text.length > 0)
}

// ── Markdown → Portable Text ─────────────────────────────────────────────────
type PTBlock = {
  _type: "block"
  _key: string
  style: string
  children: Span[]
  markDefs: []
}

function markdownToPortableText(markdown: string): PTBlock[] {
  const blocks: PTBlock[] = []

  for (const raw of markdown.split("\n")) {
    const line = raw.trim()
    if (!line) continue

    // Skip metadata lines (** Key: value **) and --- and # H1 and *Sources:
    if (/^\*\*[A-Za-z ]+:\*\*/.test(line)) continue
    if (line === "---") continue
    if (line.startsWith("# ")) continue
    if (line.startsWith("*Sources") || line.startsWith("*Source")) continue

    // H2
    if (line.startsWith("## ")) {
      blocks.push({ _type: "block", _key: uid(), style: "h2", children: [{ _type: "span", _key: uid(), text: line.slice(3), marks: [] }], markDefs: [] })
      continue
    }

    // H3
    if (line.startsWith("### ")) {
      blocks.push({ _type: "block", _key: uid(), style: "h3", children: [{ _type: "span", _key: uid(), text: line.slice(4), marks: [] }], markDefs: [] })
      continue
    }

    // Blockquote
    if (line.startsWith("> ")) {
      blocks.push({ _type: "block", _key: uid(), style: "blockquote", children: parseInline(line.slice(2)), markDefs: [] })
      continue
    }

    // Normal paragraph
    blocks.push({ _type: "block", _key: uid(), style: "normal", children: parseInline(line), markDefs: [] })
  }

  return blocks
}

// ── Metadata extraction ───────────────────────────────────────────────────────
function extractMeta(markdown: string) {
  const g = (key: string) => {
    const m = markdown.match(new RegExp(`\\*\\*${key}:\\*\\*\\s*(.+)`))
    return m?.[1]?.trim() ?? ""
  }

  const titleMatch = markdown.match(/^# (.+)$/m)
  const title = titleMatch?.[1]?.trim() ?? g("Title")

  return {
    title,
    subtitle:          g("Subtitle"),
    excerpt:           g("Summary"),
    pullQuote:         g("Pull Quote"),
    publishDate:       g("Publish Date") || new Date().toISOString().slice(0, 10),
    estimatedReadTime: parseInt(g("Estimated Read Time") || "10", 10),
  }
}

// ── Route ────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { markdown, docType = "editorialInsight" } = await req.json() as {
    markdown: string
    docType?: "editorialInsight" | "researchReport"
  }

  if (!markdown?.trim()) {
    return NextResponse.json({ error: "No markdown provided" }, { status: 400 })
  }

  const meta  = extractMeta(markdown)
  const body  = markdownToPortableText(markdown)
  const slug  = toSlug(meta.title)
  const draftId = `drafts.${uid()}${uid()}`

  if (!meta.title) {
    return NextResponse.json({ error: "Could not parse a title from the markdown. Make sure the document has a # H1 line." }, { status: 400 })
  }

  const doc: Record<string, unknown> & { _id: string; _type: string } = {
    _id:   draftId,
    _type: docType,
    title: meta.title,
    "slug": { _type: "slug", current: slug },
    publishDate:       meta.publishDate,
    estimatedReadTime: meta.estimatedReadTime || undefined,
    body,
  }

  if (meta.subtitle)   doc.subtitle   = meta.subtitle
  if (meta.excerpt)    doc.excerpt    = meta.excerpt
  if (meta.pullQuote)  doc.pullQuote  = meta.pullQuote

  // researchReport uses executiveSummary instead of excerpt
  if (docType === "researchReport" && meta.excerpt) {
    doc.executiveSummary = meta.excerpt
    delete doc.excerpt
  }

  await writeClient.createOrReplace(doc)

  return NextResponse.json({
    ok: true,
    draftId,
    slug,
    studioUrl: `/studio/structure/editorialInsight;${draftId}`,
  })
}
