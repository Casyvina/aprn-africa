import { groq } from 'next-sanity'

export interface PersonHighlight {
  value: string
  label: string
}

export interface PersonCard {
  _id: string
  name: string
  title?: string
  bio?: string
  quote?: string
  highlights?: PersonHighlight[]
  photoUrl?: string
  slug?: string
}

export const PERSONS_QUERY = groq`
  *[_type == "person"] | order(name asc) {
    _id,
    name,
    title,
    bio,
    quote,
    highlights[]{ value, label },
    "photoUrl": photo.asset->url,
    "slug": slug.current,
  }
`
