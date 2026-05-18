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
  *[_type == "intelligenceUpdate"] | order(publishedAt desc)[0...8] {
    _id,
    headline,
    category,
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
