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

    if (boldIdx === -1 && emIdx === -1) {
      spans.push({ _type: "span", _key: uid(), text: rest, marks: [] })
      break
    }

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

    if (/^\*\*[A-Za-z ]+:\*\*/.test(line)) continue
    if (line === "---") continue
    if (line.startsWith("# ")) continue
    if (line.startsWith("*Sources") || line.startsWith("*Source")) continue

    if (line.startsWith("## ")) {
      blocks.push({ _type: "block", _key: uid(), style: "h2", children: [{ _type: "span", _key: uid(), text: line.slice(3), marks: [] }], markDefs: [] })
      continue
    }
    if (line.startsWith("### ")) {
      blocks.push({ _type: "block", _key: uid(), style: "h3", children: [{ _type: "span", _key: uid(), text: line.slice(4), marks: [] }], markDefs: [] })
      continue
    }
    if (line.startsWith("> ")) {
      blocks.push({ _type: "block", _key: uid(), style: "blockquote", children: parseInline(line.slice(2)), markDefs: [] })
      continue
    }

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
  const inForceRaw = g("In Force").toLowerCase()

  return {
    title,
    subtitle:          g("Subtitle"),
    excerpt:           g("Summary"),
    pullQuote:         g("Pull Quote"),
    publishDate:       g("Publish Date") || new Date().toISOString().slice(0, 10),
    dateAdopted:       g("Date Adopted"),
    estimatedReadTime: parseInt(g("Estimated Read Time") || "0", 10),
    category:          g("Category").toLowerCase(),
    priority:          g("Priority").toLowerCase(),
    publicationType:   g("Publication Type").toLowerCase(),
    frameworkType:     g("Framework Type").toLowerCase(),
    externalUrl:       g("External URL"),
    // empty string = unset → default true; explicit "no"/"false" → false
    inForce: inForceRaw === "" ? true : inForceRaw !== "no" && inForceRaw !== "false",
  }
}

// ── Enum resolvers ────────────────────────────────────────────────────────────
function resolveEnum(map: Record<string, string>, raw: string): string | undefined {
  if (!raw) return undefined
  const lower = raw.trim()
  if (map[lower]) return map[lower]
  const entry = Object.entries(map).find(([k]) => lower.includes(k))
  return entry?.[1]
}

const CATEGORY_VALUES: Record<string, string> = {
  "market intelligence": "market", "market":       "market",
  "project update":      "project", "project":     "project",
  "policy & regulation": "policy",  "policy":      "policy",
  "training & programs": "training", "training":   "training",
  "partnership":         "partnership",
  "event":               "event",
  "research":            "research",
}

const PUBLICATION_TYPE_VALUES: Record<string, string> = {
  "op-ed":          "op-ed",          "op ed":         "op-ed",
  "position paper": "position-paper",
  "technical note": "technical-note",
  "event summary":  "event-summary",
  "press release":  "press-release",
  "commentary":     "commentary",
  "interview":      "interview",
}

const FRAMEWORK_TYPE_VALUES: Record<string, string> = {
  "african union":          "AU",          "au":       "AU",
  "east african community": "EAC",         "eac":      "EAC",
  "ecowas":                 "ECOWAS",
  "sadc":                   "SADC",
  "comesa":                 "COMESA",
  "bilateral agreement":    "bilateral",   "bilateral": "bilateral",
  "national policy":        "national",    "national":  "national",
  "industry standard":      "industry",    "industry":  "industry",
}

// ── Document type ─────────────────────────────────────────────────────────────
const VALID_TYPES = [
  "editorialInsight",
  "researchReport",
  "publication",
  "intelligenceUpdate",
  "policyFramework",
] as const
type DocType = typeof VALID_TYPES[number]

// ── Route ────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { markdown, docType = "editorialInsight" } = await req.json() as {
    markdown: string
    docType?: string
  }

  if (!markdown?.trim()) {
    return NextResponse.json({ error: "No markdown provided" }, { status: 400 })
  }
  if (!VALID_TYPES.includes(docType as DocType)) {
    return NextResponse.json({ error: `Unknown document type: ${docType}` }, { status: 400 })
  }

  const meta    = extractMeta(markdown)
  const body    = markdownToPortableText(markdown)
  const slug    = toSlug(meta.title)
  const draftId = `drafts.${uid()}${uid()}`

  if (!meta.title) {
    return NextResponse.json({
      error: "Could not parse a title. Make sure the document has a # H1 line.",
    }, { status: 400 })
  }

  const slugField = { _type: "slug" as const, current: slug }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let doc: Record<string, any> & { _id: string; _type: string }

  switch (docType as DocType) {
    case "editorialInsight":
      doc = {
        _id: draftId, _type: "editorialInsight",
        title:      meta.title,
        slug:       slugField,
        publishDate: meta.publishDate,
        body,
        ...(meta.subtitle          ? { subtitle: meta.subtitle } : {}),
        ...(meta.excerpt           ? { excerpt: meta.excerpt } : {}),
        ...(meta.pullQuote         ? { pullQuote: meta.pullQuote } : {}),
        ...(meta.estimatedReadTime ? { estimatedReadTime: meta.estimatedReadTime } : {}),
      }
      break

    case "researchReport":
      doc = {
        _id: draftId, _type: "researchReport",
        title:      meta.title,
        slug:       slugField,
        publishDate: meta.publishDate,
        body,
        ...(meta.subtitle          ? { subtitle: meta.subtitle } : {}),
        ...(meta.excerpt           ? { executiveSummary: meta.excerpt } : {}),
        ...(meta.pullQuote         ? { pullQuote: meta.pullQuote } : {}),
        ...(meta.estimatedReadTime ? { estimatedReadTime: meta.estimatedReadTime } : {}),
      }
      break

    case "publication": {
      const publicationType = resolveEnum(PUBLICATION_TYPE_VALUES, meta.publicationType)
      doc = {
        _id: draftId, _type: "publication",
        title:      meta.title,
        slug:       slugField,
        publishDate: meta.publishDate,
        body,
        ...(meta.subtitle          ? { subtitle: meta.subtitle } : {}),
        ...(meta.excerpt           ? { summary: meta.excerpt } : {}),
        ...(meta.estimatedReadTime ? { estimatedReadTime: meta.estimatedReadTime } : {}),
        ...(publicationType        ? { publicationType } : {}),
        ...(meta.externalUrl       ? { externalUrl: meta.externalUrl } : {}),
      }
      break
    }

    case "intelligenceUpdate": {
      const category = resolveEnum(CATEGORY_VALUES, meta.category)
      const priority = ["normal", "urgent", "featured"].includes(meta.priority) ? meta.priority : "normal"
      doc = {
        _id: draftId, _type: "intelligenceUpdate",
        headline:    meta.title,
        slug:        slugField,
        publishedAt: meta.publishDate
          ? `${meta.publishDate}T00:00:00.000Z`
          : new Date().toISOString(),
        priority,
        body,
        ...(category               ? { category } : {}),
        ...(meta.subtitle          ? { subtitle: meta.subtitle } : {}),
        ...(meta.excerpt           ? { summary: meta.excerpt } : {}),
        ...(meta.pullQuote         ? { pullQuote: meta.pullQuote } : {}),
        ...(meta.estimatedReadTime ? { estimatedReadTime: meta.estimatedReadTime } : {}),
        ...(meta.externalUrl       ? { externalUrl: meta.externalUrl } : {}),
      }
      break
    }

    case "policyFramework": {
      const frameworkType = resolveEnum(FRAMEWORK_TYPE_VALUES, meta.frameworkType)
      const dateAdopted   = meta.dateAdopted || meta.publishDate
      doc = {
        _id: draftId, _type: "policyFramework",
        title:   meta.title,
        slug:    slugField,
        inForce: meta.inForce,
        body,
        ...(meta.excerpt    ? { summary: meta.excerpt } : {}),
        ...(frameworkType   ? { frameworkType } : {}),
        ...(dateAdopted     ? { dateAdopted } : {}),
      }
      break
    }

    default:
      return NextResponse.json({ error: "Unhandled document type" }, { status: 400 })
  }

  await writeClient.createOrReplace(doc)

  return NextResponse.json({
    ok: true,
    draftId,
    slug,
    studioUrl: `/studio/structure/${docType};${draftId}`,
  })
}
