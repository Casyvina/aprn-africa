import { groq } from 'next-sanity'

export interface EventCard {
  _id: string
  slug: string
  title: string
  subtitle?: string
  description?: string
  eventType: string
  status: string
  featured: boolean
  startDate: string
  endDate?: string
  timezone?: string
  location?: string
  venueUrl?: string
  expectedAttendees?: number
  isFree: boolean
  priceUSD?: number
  registrationUrl?: string
  coverImage?: { asset: { url: string }; alt?: string }
  tags?: { title: string }[]
}

export const EVENTS_QUERY = groq`
  *[_type == "event" && status in ["published", "coming_soon"]] | order(startDate asc) {
    _id,
    "slug": slug.current,
    title,
    subtitle,
    "description": pt::text(description),
    eventType,
    status,
    featured,
    startDate,
    endDate,
    timezone,
    location,
    venueUrl,
    expectedAttendees,
    isFree,
    priceUSD,
    registrationUrl,
    coverImage { asset->{ url }, alt },
    "tags": tags[]->{ title },
  }
`
