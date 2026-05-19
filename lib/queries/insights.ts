import { groq } from 'next-sanity'

// ── Types ────────────────────────────────────────────────────────────────────

export type InsightCategory = 'intelligence' | 'research' | 'editorial'

export interface InsightCard {
  _id: string
  slug: string
  category: InsightCategory
  featured?: boolean
  title: string
  subtitle?: string
  excerpt: string
  publishDate: string
  estimatedReadTime?: number
  heroImage?: string
  authorName: string
  authorRole: string
}

export interface InsightDetail extends InsightCard {
  keyInsights?: Array<{ value: string; label: string; icon?: string }>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any[]
  pullQuote?: string
}

// ── Field fragment (reused across queries) ────────────────────────────────────

const CARD_FIELDS = groq`
  _id,
  "slug": slug.current,
  "category": select(
    _type == "editorialInsight" => "editorial",
    reportType == "briefing"    => "intelligence",
    "research"
  ),
  featured,
  title,
  subtitle,
  "excerpt": coalesce(excerpt, executiveSummary),
  publishDate,
  estimatedReadTime,
  "heroImage": coalesce(heroImage.asset->url, coverImage.asset->url),
  "authorName": coalesce(author->name, authors[0]->name, "APRN Intelligence Desk"),
  "authorRole": coalesce(author->title, authors[0]->title, "APRN Research Team"),
`

// ── Queries ───────────────────────────────────────────────────────────────────

export const PAGE_SIZE = 9

/** Initial page of insights — featured (1) + grid (PAGE_SIZE) */
export const ALL_INSIGHTS_QUERY = groq`
  *[_type in ["researchReport", "editorialInsight"]] | order(publishDate desc) [0...${PAGE_SIZE + 1}] {
    ${CARD_FIELDS}
  }
`

/** Load-more batch — called from server action with $start / $end */
export const MORE_INSIGHTS_QUERY = groq`
  *[_type in ["researchReport", "editorialInsight"]] | order(publishDate desc) [$start...$end] {
    ${CARD_FIELDS}
  }
`

/** Full article detail for /insights/[slug] */
export const INSIGHT_BY_SLUG_QUERY = groq`
  *[_type in ["researchReport", "editorialInsight"] && slug.current == $slug][0] {
    ${CARD_FIELDS}
    keyInsights[]{ value, label, icon },
    body,
    pullQuote,
  }
`

/** Static params — all slugs for generateStaticParams */
export const INSIGHT_SLUGS_QUERY = groq`
  *[_type in ["researchReport", "editorialInsight"]]{ "slug": slug.current }
`

/** Related articles for the sidebar (excludes current slug) */
export const RELATED_INSIGHTS_QUERY = groq`
  *[
    _type in ["researchReport", "editorialInsight"]
    && slug.current != $slug
  ] | order(publishDate desc) [0...3] {
    ${CARD_FIELDS}
  }
`
