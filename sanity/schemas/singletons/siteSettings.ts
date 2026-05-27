import { defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      initialValue: 'APRN Africa',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'logoImage',
      title: 'Site Logo',
      type: 'image',
      description: 'Used in navigation bar, footer, and dashboard.',
      options: { hotspot: false },
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short institutional tagline used in headers and SEO.',
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'contactEmail',
      title: 'General Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'partnerEmail',
      title: 'Partnership Enquiries Email',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Office Address',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({ name: 'twitter',   title: 'Twitter / X', type: 'url' }),
        defineField({ name: 'linkedin',  title: 'LinkedIn',    type: 'url' }),
        defineField({ name: 'youtube',   title: 'YouTube',     type: 'url' }),
        defineField({ name: 'facebook',  title: 'Facebook',    type: 'url' }),
      ],
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO',
      type: 'seoFields',
      description: 'Fallback SEO used when a page has no specific SEO set.',
    }),

    // ── Footer ────────────────────────────────────────────────────────────
    defineField({
      name: 'footerDescription',
      title: 'Footer Description',
      type: 'text',
      rows: 3,
      description: 'Short tagline shown in the footer brand column.',
      initialValue: 'Building the knowledge infrastructure for Africa\'s energy transition through rigorous research and elite training.',
    }),
    defineField({
      name: 'footerInitiatives',
      title: 'Footer — Initiatives Links',
      type: 'array',
      of: [{ type: 'footerLinkItem' }],
    }),
    defineField({
      name: 'footerOrganisation',
      title: 'Footer — Organisation Links',
      type: 'array',
      of: [{ type: 'footerLinkItem' }],
    }),
    defineField({
      name: 'footerResources',
      title: 'Footer — Resources Links',
      type: 'array',
      of: [{ type: 'footerLinkItem' }],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
})
