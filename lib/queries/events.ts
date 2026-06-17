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

export interface EventSpeaker {
  _id: string
  name: string
  title?: string
  organisation?: string
  photoUrl?: string
  slug?: string
  bio?: string
}

export interface AgendaItem {
  time?: string
  title: string
  description?: string
  speaker?: { name: string; title?: string }
}

export interface EventDetail extends EventCard {
  speakers: EventSpeaker[]
  agendaItems: AgendaItem[]
  sponsors: { _id: string; name: string; logoUrl?: string; website?: string }[]
  countries: { name: string }[]
}

export const EVENT_DETAIL_QUERY = groq`
  *[_type == "event" && slug.current == $slug][0]{
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
    capacity,
    isFree,
    priceUSD,
    registrationUrl,
    coverImage { asset->{ url }, alt },
    "tags": tags[]->{ title },
    "speakers": speakers[]->{
      _id, name, title,
      "organisation": organisation,
      bio,
      "photoUrl": photo.asset->url,
      "slug": slug.current
    },
    agendaItems[]{
      time, title, description,
      "speaker": speaker->{ name, title }
    },
    "sponsors": sponsors[]->{ _id, name, "logoUrl": logo.asset->url, website },
    "countries": countries[]->{ name },
  }
`

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
