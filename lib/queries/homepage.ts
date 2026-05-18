import { groq } from 'next-sanity'

export interface HomepageConfig {
  activeProjectsCount?: number
  engineeringTraineesCount?: number
  kmUnderConstruction?: number
  capexTrackedBillions?: number
  heroHeadline?: string
  heroSubtext?: string
}

export const HOMEPAGE_CONFIG_QUERY = groq`
  *[_type == "homepageConfig"][0] {
    activeProjectsCount,
    engineeringTraineesCount,
    kmUnderConstruction,
    capexTrackedBillions,
    heroHeadline,
    heroSubtext,
  }
`
