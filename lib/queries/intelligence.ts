import { groq } from 'next-sanity'

export interface TickerItem {
  _id: string
  headline: string
  category: string
  corridorCode?: string
}

export interface HomepageIntelCard {
  _id: string
  headline: string
  summary: string
  category: string
  publishedAt: string
  corridorName?: string
}

export const INTELLIGENCE_TICKER_QUERY = groq`
  *[_type in ["intelligenceUpdate", "editorialInsight"]] | order(coalesce(publishedAt, publishDate) desc)[0...10] {
    _id,
    "headline": coalesce(headline, title),
    "category": coalesce(category, "editorial"),
    "corridorCode": relatedCorridor->code,
  }
`

export const HOMEPAGE_INTEL_QUERY = groq`
  *[_type == "intelligenceUpdate"] | order(publishedAt desc)[0...4] {
    _id,
    headline,
    summary,
    category,
    publishedAt,
    "corridorName": relatedCorridor->name,
  }
`

export interface HomepageLatestCard {
  _id: string
  title: string
  slug: string | null
  excerpt: string
  publishDate: string
  category: string
  heroImage: string | null
  readTime: number | null
}

export const HOMEPAGE_LATEST_QUERY = groq`
  *[_type in ["editorialInsight", "intelligenceUpdate"]] | order(coalesce(publishDate, publishedAt) desc)[0...4] {
    _id,
    "title": coalesce(title, headline),
    "slug": slug.current,
    "excerpt": coalesce(excerpt, summary),
    "publishDate": coalesce(publishDate, publishedAt),
    "category": coalesce(
      select(_type == "editorialInsight" => "Editorial"),
      select(category == "market"       => "Market"),
      select(category == "project"      => "Project"),
      select(category == "policy"       => "Policy"),
      select(category == "training"     => "Training"),
      select(category == "partnership"  => "Partnership"),
      "Intelligence"
    ),
    "heroImage": heroImage.asset->url,
    "readTime": estimatedReadTime,
  }
`
