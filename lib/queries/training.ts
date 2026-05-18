import { groq } from 'next-sanity'

export interface TrainingProgramCard {
  _id: string
  slug: string
  name: string
  programType: string
  level: string
  description: string
  durationWeeks?: number
  featured: boolean
}

export const TRAINING_PROGRAMS_QUERY = groq`
  *[_type == "trainingProgram"] | order(featured desc, _createdAt asc) {
    _id,
    name,
    "slug": slug.current,
    programType,
    level,
    description,
    durationWeeks,
    featured,
  }
`
