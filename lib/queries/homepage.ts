import { groq } from 'next-sanity'

// ── Types ─────────────────────────────────────────────────────────────────

export interface HeroMetric {
  label: string
  value: string
  width: string
}

export interface LeadershipPerson {
  name: string
  title: string
  photoUrl?: string
}

export interface InsightStat {
  value: string
  label: string
  icon?: string
}

export interface Pillar {
  icon: string
  title: string
  description: string
}

export interface RoadmapMilestone {
  year: string
  title: string
  description: string
  tag?: string
  tagSide: 'left' | 'right'
}

export interface HomepageConfig {
  // Hero
  heroBadgeLabel?: string
  heroHeadline?: string
  heroSubtext?: string
  heroImageUrl?: string
  heroPrimaryButtonLabel?: string
  heroSecondaryButtonLabel?: string

  // Metrics
  activeProjectsCount?: number
  engineeringTraineesCount?: number
  policyFrameworksCount?: number
  kmUnderConstruction?: number
  capexTrackedBillions?: number
  transNationalRoutes?: number
  trainingHubs?: number

  // About
  aboutHeading?: string
  aboutDescription?: string
  aboutPartnerName?: string
  aboutStat1Value?: string
  aboutStat1Label?: string
  aboutStat2Value?: string
  aboutStat2Label?: string
  aboutLeadership?: LeadershipPerson[]
  aboutImageUrl?: string

  // Why Now
  whyNowBadge?: string
  whyNowHeading?: string
  whyNowIntro1?: string
  whyNowIntro2?: string
  whyNowQuote?: string
  whyNowStats?: InsightStat[]

  // Pillars
  pillarsSectionTag?: string
  pillarsSectionHeading?: string
  pillars?: Pillar[]

  // Partnerships
  partnershipsBadge?: string
  partnershipsHeading?: string
  partnershipsSubtext?: string
  partnershipsBackgroundImageUrl?: string

  // Corridors / Map
  corridorsHeading?: string
  corridorsSubtext?: string
  corridorSpotlightLabel?: string
  corridorSpotlightTitle?: string
  corridorSpotlightSubtitle?: string

  // Research / Intelligence
  researchBadge?: string
  researchHeading?: string
  researchSubtext?: string
  researchBackgroundImageUrl?: string

  // Newsletter
  newsletterBadge?: string
  newsletterHeading?: string
  newsletterSubtext?: string
  newsletterBackgroundImageUrl?: string

  // Roadmap
  roadmapHeading?: string
  roadmapMilestones?: RoadmapMilestone[]

  // CTA
  ctaHeadline?: string
  ctaSubtext?: string
  ctaButtonLabel?: string
  ctaSecondaryButtonLabel?: string
  ctaBackgroundImageUrl?: string
}

// ── GROQ Query ────────────────────────────────────────────────────────────

export const HOMEPAGE_CONFIG_QUERY = groq`
  *[_type == "homepageConfig"][0] {
    // Hero
    heroBadgeLabel,
    heroHeadline,
    heroSubtext,
    "heroImageUrl": heroImage.asset->url,
    heroPrimaryButtonLabel,
    heroSecondaryButtonLabel,

    // Metrics
    activeProjectsCount,
    engineeringTraineesCount,
    policyFrameworksCount,
    kmUnderConstruction,
    capexTrackedBillions,
    transNationalRoutes,
    trainingHubs,

    // About
    aboutHeading,
    aboutDescription,
    aboutPartnerName,
    aboutStat1Value,
    aboutStat1Label,
    aboutStat2Value,
    aboutStat2Label,
    "aboutLeadership": aboutLeadership[]->{
      name,
      title,
      "photoUrl": photo.asset->url
    },
    "aboutImageUrl": aboutImage.asset->url,

    // Why Now
    whyNowBadge,
    whyNowHeading,
    whyNowIntro1,
    whyNowIntro2,
    whyNowQuote,
    whyNowStats[]{ value, label, icon },

    // Pillars
    pillarsSectionTag,
    pillarsSectionHeading,
    pillars[]{ icon, title, description },

    // Partnerships
    partnershipsBadge,
    partnershipsHeading,
    partnershipsSubtext,
    "partnershipsBackgroundImageUrl": partnershipsBackgroundImage.asset->url,

    // Corridors / Map
    corridorsHeading,
    corridorsSubtext,
    corridorSpotlightLabel,
    corridorSpotlightTitle,
    corridorSpotlightSubtitle,

    // Research / Intelligence
    researchBadge,
    researchHeading,
    researchSubtext,
    "researchBackgroundImageUrl": researchBackgroundImage.asset->url,

    // Newsletter
    newsletterBadge,
    newsletterHeading,
    newsletterSubtext,
    "newsletterBackgroundImageUrl": newsletterBackgroundImage.asset->url,

    // Roadmap
    roadmapHeading,
    roadmapMilestones[]{ year, title, description, tag, tagSide },

    // CTA
    ctaHeadline,
    ctaSubtext,
    ctaButtonLabel,
    ctaSecondaryButtonLabel,
    "ctaBackgroundImageUrl": ctaBackgroundImage.asset->url,
  }
`
