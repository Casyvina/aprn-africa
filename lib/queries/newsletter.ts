import { groq } from 'next-sanity'

// ── Types ────────────────────────────────────────────────────────────────────

export interface NewsletterStory {
  tag: string
  headline: string
  summary: string
  sourceUrl?: string
}

export interface NewsletterIssue {
  _id: string
  slug: string
  title: string
  volume: number
  issueNumber: number
  publishDate: string
  leadSummary: string
  stories: NewsletterStory[]
  editorAnalysis: string
  pullQuote?: string
  status: 'draft' | 'review' | 'approved' | 'sent'
  sentAt?: string
  recipientCount?: number
}

export type NewsletterCard = Pick<
  NewsletterIssue,
  '_id' | 'slug' | 'title' | 'volume' | 'issueNumber' | 'publishDate' | 'leadSummary' | 'status' | 'sentAt'
>

// ── Queries ───────────────────────────────────────────────────────────────────

// A newsletter is visible if it is published in Sanity (no drafts. prefix) regardless
// of whether the status field was explicitly set. Tokun just needs to hit Publish.
const PUBLISHED = `_type == "newsletter"`

/** All published issues for the archive listing — newest first (capped at 24) */
export const ALL_NEWSLETTERS_QUERY = groq`
  *[${PUBLISHED}] | order(publishDate desc) [0...24] {
    _id,
    "slug": slug.current,
    title,
    volume,
    issueNumber,
    publishDate,
    leadSummary,
    status,
    sentAt,
  }
`

/** Latest single issue for the /newsletter landing hero */
export const LATEST_NEWSLETTER_QUERY = groq`
  *[${PUBLISHED}] | order(publishDate desc) [0] {
    _id,
    "slug": slug.current,
    title,
    volume,
    issueNumber,
    publishDate,
    leadSummary,
    stories[]{ tag, headline, summary, sourceUrl },
    editorAnalysis,
    pullQuote,
    status,
    sentAt,
    recipientCount,
  }
`

/** Full issue detail for /newsletter/[issue] */
export const NEWSLETTER_BY_SLUG_QUERY = groq`
  *[${PUBLISHED} && slug.current == $slug][0] {
    _id,
    "slug": slug.current,
    title,
    volume,
    issueNumber,
    publishDate,
    leadSummary,
    stories[]{ tag, headline, summary, sourceUrl },
    editorAnalysis,
    pullQuote,
    status,
    sentAt,
    recipientCount,
  }
`

/** Static params for generateStaticParams */
export const NEWSLETTER_SLUGS_QUERY = groq`
  *[${PUBLISHED}]{ "slug": slug.current }
`

/** Latest approved (not-yet-sent) issue for the send API */
export const NEWSLETTER_APPROVED_QUERY = groq`
  *[_type == "newsletter" && status == "approved"] | order(publishDate desc) [0] {
    _id,
    "slug": slug.current,
    title,
    volume,
    issueNumber,
    publishDate,
    leadSummary,
    stories[]{ tag, headline, summary },
    editorAnalysis,
    pullQuote,
  }
`
