import { defineField, defineType } from 'sanity'
import { HomeIcon } from '@sanity/icons'

export const homepageConfig = defineType({
  name: 'homepageConfig',
  title: 'Homepage Config',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'hero',      title: 'Hero',      default: true },
    { name: 'metrics',   title: 'Metrics' },
    { name: 'featured',  title: 'Featured Content' },
    { name: 'cta',       title: 'CTA' },
  ],
  fields: [
    // ── Hero ─────────────────────────────────────────────────────────
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline Override',
      type: 'string',
      group: 'hero',
      description: 'Leave blank to use the default headline from the component.',
    }),
    defineField({
      name: 'heroSubtext',
      title: 'Hero Subtext Override',
      type: 'text',
      group: 'hero',
      rows: 3,
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
    }),

    // ── Platform Metrics ──────────────────────────────────────────────
    defineField({
      name: 'activeProjectsCount',
      title: 'Active Projects Count',
      type: 'number',
      group: 'metrics',
    }),
    defineField({
      name: 'engineeringTraineesCount',
      title: 'Engineering Trainees Count',
      type: 'number',
      group: 'metrics',
    }),
    defineField({
      name: 'policyFrameworksCount',
      title: 'Policy Frameworks Count',
      type: 'number',
      group: 'metrics',
    }),
    defineField({
      name: 'kmUnderConstruction',
      title: 'km Under Construction',
      type: 'number',
      group: 'metrics',
    }),
    defineField({
      name: 'capexTrackedBillions',
      title: 'CapEx Tracked ($ Billions)',
      type: 'number',
      group: 'metrics',
    }),
    defineField({
      name: 'transNationalRoutes',
      title: 'Trans-National Routes',
      type: 'number',
      group: 'metrics',
    }),
    defineField({
      name: 'trainingHubs',
      title: 'Training Hubs',
      type: 'number',
      group: 'metrics',
    }),

    // ── Featured Content ──────────────────────────────────────────────
    defineField({
      name: 'featuredReport',
      title: 'Featured Report',
      type: 'reference',
      group: 'featured',
      to: [{ type: 'researchReport' }],
      description: 'The main featured report shown in the hero intelligence block.',
    }),
    defineField({
      name: 'secondaryReports',
      title: 'Secondary Reports',
      type: 'array',
      group: 'featured',
      of: [{ type: 'reference', to: [{ type: 'researchReport' }] }],
      validation: (r) => r.max(2),
    }),
    defineField({
      name: 'featuredCorridors',
      title: 'Featured Corridors',
      type: 'array',
      group: 'featured',
      of: [{ type: 'reference', to: [{ type: 'pipelineCorridor' }] }],
      description: 'Corridors to highlight in the map or corridors section.',
    }),
    defineField({
      name: 'featuredPartners',
      title: 'Featured Partners',
      type: 'array',
      group: 'featured',
      of: [{ type: 'reference', to: [{ type: 'organizationPartner' }] }],
      description: 'Override the auto-selection of featured partners.',
    }),

    // ── CTA ───────────────────────────────────────────────────────────
    defineField({
      name: 'ctaHeadline',
      title: 'CTA Headline',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'ctaSubtext',
      title: 'CTA Subtext',
      type: 'text',
      group: 'cta',
      rows: 3,
    }),
    defineField({
      name: 'ctaButtonLabel',
      title: 'CTA Button Label',
      type: 'string',
      group: 'cta',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Homepage Configuration' }),
  },
})
