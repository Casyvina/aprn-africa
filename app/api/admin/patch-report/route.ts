import { NextRequest, NextResponse } from "next/server"
import { writeClient } from "@/lib/sanity/write-client"
import { createClient as createServerClient } from "@/lib/supabase/server"

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)

function isAdmin(email: string | undefined) {
  return ADMIN_EMAILS.includes(email?.toLowerCase() ?? "")
}

// ── Section parser ────────────────────────────────────────────────────────────
// Reads blocks delimited by ===...=== LABEL ===...=== in the full-fields format

function parseSection(text: string, label: string): string {
  const re = new RegExp(
    `={10,}\\s*\\n${label}\\s*\\n={10,}\\s*\\n([\\s\\S]*?)(?:={10,}|$)`,
    "i"
  )
  const m = text.match(re)
  if (!m) return ""
  // Strip parenthetical notes, "(unchanged …)", "(no change…)" etc.
  return m[1]
    .replace(/^\s*\(.*\)\s*$/gm, "")     // lines that are purely parenthetical
    .replace(/^NOTE:.*$/m, "")
    .trim()
}

// Parses "1. VALUE — LABEL" or "VALUE — LABEL" lines for key insights
function parseKeyInsights(raw: string) {
  return raw
    .split("\n")
    .map((l) => l.replace(/^\d+\.\s*/, "").trim())
    .filter((l) => l && !l.startsWith("Note:"))
    .map((l) => {
      // Split on " — " or " - " (en-dash or hyphen)
      const sep = l.includes(" — ") ? " — " : " - "
      const [valuePart, ...labelParts] = l.split(sep)
      const label = labelParts.join(sep).trim()
      // Separate value and unit: e.g. "84%" → value "84", unit "%"
      const valMatch = valuePart.trim().match(/^([^%km$B]+?)(%|km|B|M)?$/)
      const value = valMatch?.[1]?.trim() ?? valuePart.trim()
      const unit  = valMatch?.[2] ?? ""
      return { _type: "insightStat" as const, _key: Math.random().toString(36).slice(2, 8), value, unit, label }
    })
    .filter((s) => s.value && s.label)
    .slice(0, 4)
}

// ── Route ────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { slug, content } = await req.json() as { slug: string; content: string }

  if (!slug?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "slug and content are required" }, { status: 400 })
  }

  // Find the existing document
  const existing = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == "researchReport" && slug.current == $slug][0]{ _id }`,
    { slug }
  )

  if (!existing) {
    return NextResponse.json({ error: `No published researchReport found with slug "${slug}"` }, { status: 404 })
  }

  // Parse fields from the structured document
  const title             = parseSection(content, "TITLE")
  const subtitle          = parseSection(content, "SUBTITLE")
  const executiveSummary  = parseSection(content, "EXECUTIVE SUMMARY")
  const pullQuote         = parseSection(content, "PULL QUOTE")
  const metaTitle         = parseSection(content, "SEO — META TITLE \\(max 60 characters\\)")
  const metaDesc          = parseSection(content, "SEO — META DESCRIPTION \\(max 160 characters\\)")

  const keyInsightsRaw    = parseSection(content, "KEY INSIGHT STATS.*")
  const keyInsights       = keyInsightsRaw ? parseKeyInsights(keyInsightsRaw) : undefined

  // reportType mapping
  const reportTypeRaw     = parseSection(content, "REPORT TYPE").toLowerCase()
  const reportTypeMap: Record<string, string> = {
    "flagship report": "flagship",
    "policy brief":    "policy-brief",
    "working paper":   "working-paper",
    "white paper":     "white-paper",
    "intelligence briefing": "briefing",
    "intelligence brief":    "briefing",
    "technical audit": "technical-audit",
    "data note":       "data-note",
  }
  const reportType = Object.entries(reportTypeMap).find(([k]) => reportTypeRaw.includes(k))?.[1]

  const publishDateRaw    = parseSection(content, "PUBLISH DATE")
  const publishDate       = publishDateRaw.match(/\d{4}-\d{2}-\d{2}/)?.[0]

  const pageCountRaw      = parseSection(content, "PAGE COUNT")
  const pageCount         = parseInt(pageCountRaw) || undefined

  const readTimeRaw       = parseSection(content, "ESTIMATED READ TIME.*")
  const estimatedReadTime = parseInt(readTimeRaw) || undefined

  const featuredRaw       = parseSection(content, "FEATURED REPORT").toLowerCase()
  const featured          = featuredRaw.includes("yes") || featuredRaw.includes("true") || featuredRaw.includes("pin")
    ? true
    : featuredRaw.includes("no") || featuredRaw.includes("false")
      ? false
      : undefined

  // Build patch — only include fields that were successfully parsed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const patch: Record<string, any> = {}

  if (title)            patch.title = title
  if (subtitle)         patch.subtitle = subtitle
  if (executiveSummary) patch.executiveSummary = executiveSummary
  if (pullQuote)        patch.pullQuote = pullQuote
  if (reportType)       patch.reportType = reportType
  if (publishDate)      patch.publishDate = publishDate
  if (pageCount)        patch.pageCount = pageCount
  if (estimatedReadTime) patch.estimatedReadTime = estimatedReadTime
  if (typeof featured === "boolean") patch.featured = featured
  if (keyInsights?.length) patch.keyInsights = keyInsights
  if (metaTitle || metaDesc) {
    patch.seo = {
      _type: "seoFields",
      ...(metaTitle ? { metaTitle } : {}),
      ...(metaDesc  ? { metaDescription: metaDesc } : {}),
    }
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No parseable fields found in the document" }, { status: 400 })
  }

  await writeClient.patch(existing._id).set(patch).commit()

  const fieldsApplied = Object.keys(patch)

  return NextResponse.json({
    ok: true,
    documentId: existing._id,
    slug,
    fieldsApplied,
    note: "Topics, authors, countries, corridors, and related reports require manual linking in Studio (they need existing document IDs).",
  })
}
