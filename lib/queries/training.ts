import { groq } from 'next-sanity'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TrainingProgramCard {
  _id: string
  slug: string
  programCode?: string
  title: string
  programType: string
  level: string
  description: string
  durationWeeks?: number
  effortPerWeek?: string
  featured: boolean
  coverImageUrl?: string
}

export interface TrainingProgramDetail extends TrainingProgramCard {
  deliveryMode?: string
  moduleCount?: number
  applicationUrl?: string
  applicationDeadline?: string
  intakeDates?: string[]
  learningOutcomes?: string[]
  targetAudience?: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  curriculum?: any[]
  instructors?: Array<{
    _id: string
    name: string
    title?: string
    organization?: string
    bio?: string
    photoUrl?: string
  }>
  relatedPrograms?: Array<{
    _id: string
    slug: string
    programCode?: string
    title: string
    level?: string
    programType?: string
  }>
}

// ── Queries ───────────────────────────────────────────────────────────────────

export const TRAINING_PROGRAMS_QUERY = groq`
  *[_type == "trainingProgram"] | order(featured desc, _createdAt asc) {
    _id,
    title,
    "slug": slug.current,
    programCode,
    programType,
    level,
    description,
    durationWeeks,
    effortPerWeek,
    featured,
    "coverImageUrl": coverImage.asset->url,
  }
`

export const TRAINING_PROGRAM_SLUGS_QUERY = groq`
  *[_type == "trainingProgram"]{ "slug": slug.current }
`

export const TRAINING_PROGRAM_BY_SLUG_QUERY = groq`
  *[_type == "trainingProgram" && slug.current == $slug][0] {
    _id,
    "slug": slug.current,
    programCode,
    title,
    programType,
    level,
    description,
    "coverImageUrl": coverImage.asset->url,
    durationWeeks,
    effortPerWeek,
    moduleCount,
    deliveryMode,
    applicationUrl,
    applicationDeadline,
    intakeDates,
    featured,
    learningOutcomes,
    targetAudience,
    curriculum,
    instructors[]->{
      _id,
      name,
      title,
      organization,
      bio,
      "photoUrl": photo.asset->url,
    },
    relatedPrograms[]->{
      _id,
      "slug": slug.current,
      programCode,
      title,
      level,
      programType,
    },
  }
`
