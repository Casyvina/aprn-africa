import { groq } from 'next-sanity'

export interface FooterLink {
  label: string
  href: string
}

export interface SiteSettingsFooter {
  contactEmail?: string
  footerDescription?: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    youtube?: string
    facebook?: string
  }
  footerInitiatives?: FooterLink[]
  footerOrganisation?: FooterLink[]
  footerResources?: FooterLink[]
}

export const SITE_SETTINGS_FOOTER_QUERY = groq`
  *[_type == "siteSettings"][0] {
    contactEmail,
    footerDescription,
    socialLinks { twitter, linkedin, youtube, facebook },
    footerInitiatives[]{ label, href },
    footerOrganisation[]{ label, href },
    footerResources[]{ label, href },
  }
`
