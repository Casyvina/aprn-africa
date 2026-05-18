import { groq } from 'next-sanity'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ResearchKeyMetric {
  value: string
  label: string
  unit?: string
  trend?: string
}

export interface RelatedResearchCard {
  _id: string
  slug: string
  title: string
  reportType?: string
  publishDate: string
  coverImageUrl?: string
  authorName: string
}

export interface ResearchReportDetail {
  _id: string
  slug: string
  title: string
  reportType?: string
  publishDate: string
  executiveSummary?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any[]
  keyInsights?: ResearchKeyMetric[]
  pullQuote?: string
  coverImageUrl?: string
  pdfUrl?: string
  authorName: string
  authorRole: string
  relatedReports?: RelatedResearchCard[]
}

// ── Queries ───────────────────────────────────────────────────────────────────

export const RESEARCH_BY_SLUG_QUERY = groq`
  *[_type == "researchReport" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    reportType,
    publishDate,
    executiveSummary,
    body,
    keyInsights[]{ value, label, unit, trend },
    pullQuote,
    "coverImageUrl": coverImage.asset->url,
    "pdfUrl": pdfAsset.asset->url,
    "authorName": coalesce(authors[0]->name, "APRN Research Team"),
    "authorRole": coalesce(authors[0]->title, "APRN Research Team"),
    relatedReports[0...3]->{
      _id,
      title,
      "slug": slug.current,
      reportType,
      publishDate,
      "coverImageUrl": coverImage.asset->url,
      "authorName": coalesce(authors[0]->name, "APRN Research Team"),
    }
  }
`

export const RESEARCH_SLUGS_QUERY = groq`
  *[_type == "researchReport"]{ "slug": slug.current }
`

// ── Homepage section ──────────────────────────────────────────────────────────

export interface HomepageResearchCard {
  _id: string
  title: string
  slug: string
  reportType: string
  publishDate: string
  executiveSummary: string
  estimatedReadTime?: number
  topics: { name: string }[]
}

export interface HomepageResearchResult {
  featured: HomepageResearchCard | null
  publications: HomepageResearchCard[]
}

export interface ResearchPageCard {
  _id: string
  title: string
  slug: string
  reportType: string
  publishDate: string
  executiveSummary: string
  estimatedReadTime?: number
  pageCount?: number
  topics: { name: string }[]
}

export interface ResearchPageResult {
  featured: ResearchPageCard | null
  secondary: ResearchPageCard[]
}

export const RESEARCH_PAGE_QUERY = groq`
  {
    "featured": *[_type == "researchReport" && featured == true] | order(publishDate desc)[0] {
      _id,
      title,
      "slug": slug.current,
      reportType,
      publishDate,
      executiveSummary,
      estimatedReadTime,
      pageCount,
      "topics": topics[]->{ name },
    },
    "secondary": *[_type == "researchReport" && !(featured == true)] | order(publishDate desc)[0...2] {
      _id,
      title,
      "slug": slug.current,
      reportType,
      publishDate,
      executiveSummary,
      "topics": topics[]->{ name },
    }
  }
`

export const HOMEPAGE_RESEARCH_QUERY = groq`
  {
    "featured": *[_type == "researchReport" && featured == true] | order(publishDate desc)[0] {
      _id,
      title,
      "slug": slug.current,
      reportType,
      publishDate,
      executiveSummary,
      estimatedReadTime,
      "topics": topics[]->{ name },
    },
    "publications": *[_type == "researchReport" && !(featured == true)] | order(publishDate desc)[0...4] {
      _id,
      title,
      "slug": slug.current,
      reportType,
      publishDate,
      executiveSummary,
      "topics": topics[]->{ name },
    }
  }
`
