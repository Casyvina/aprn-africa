import { groq } from 'next-sanity'

export interface PartnerCard {
  _id: string
  name: string
  slug: string
  type: string
  tier?: string
  logoUrl?: string
  website?: string
  featured: boolean
}

export const FEATURED_PARTNERS_QUERY = groq`
  *[_type == "organizationPartner" && featured == true] | order(tier asc, name asc) {
    _id,
    name,
    "slug": slug.current,
    type,
    tier,
    "logoUrl": logo.asset->url,
    website,
    featured,
  }
`

export const ALL_PARTNERS_QUERY = groq`
  *[_type == "organizationPartner"] | order(tier asc, name asc) {
    _id,
    name,
    "slug": slug.current,
    type,
    tier,
    "logoUrl": logo.asset->url,
    website,
    featured,
  }
`
