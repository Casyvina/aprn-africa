import { defineField, defineType } from 'sanity'
import { EarthGlobeIcon } from '@sanity/icons'

export const pipelineCorridor = defineType({
  name: 'pipelineCorridor',
  title: 'Pipeline Corridor',
  type: 'document',
  icon: EarthGlobeIcon,
  groups: [
    { name: 'overview',   title: 'Overview',   default: true },
    { name: 'technical',  title: 'Technical' },
    { name: 'geospatial', title: 'Geospatial' },
    { name: 'relations',  title: 'Related Content' },
  ],
  fields: [
    // ── Identity ────────────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Corridor Name',
      type: 'string',
      group: 'overview',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'overview',
      options: { source: 'name' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'code',
      title: 'Corridor Code',
      type: 'string',
      group: 'overview',
      description: 'Short reference code, e.g. NMGP, OB3, WAGP, TSGP',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'overview',
      options: { hotspot: true },
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'overview',
      options: {
        list: [
          { value: 'operational',        title: 'Operational' },
          { value: 'under-construction', title: 'Under Construction' },
          { value: 'proposed',           title: 'Proposed' },
          { value: 'feasibility',        title: 'Feasibility Study' },
          { value: 'suspended',          title: 'Suspended' },
          { value: 'decommissioned',     title: 'Decommissioned' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'routeDescription',
      title: 'Route Description',
      type: 'text',
      group: 'overview',
      rows: 4,
      description: 'Describe the geographic route from origin to terminus.',
    }),
    defineField({
      name: 'strategicSignificance',
      title: 'Strategic Significance',
      type: 'text',
      group: 'overview',
      rows: 5,
      description: 'Why this corridor matters geopolitically and economically.',
    }),
    defineField({
      name: 'countries',
      title: 'Countries',
      type: 'array',
      group: 'overview',
      of: [{ type: 'reference', to: [{ type: 'country' }] }],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'operators',
      title: 'Operators',
      type: 'array',
      group: 'overview',
      of: [{ type: 'reference', to: [{ type: 'organizationPartner' }] }],
    }),

    // ── Technical ────────────────────────────────────────────────────
    defineField({
      name: 'lengthKm',
      title: 'Total Length (km)',
      type: 'number',
      group: 'technical',
      validation: (r) => r.min(0),
    }),
    defineField({
      name: 'diameterInches',
      title: 'Diameter (inches)',
      type: 'number',
      group: 'technical',
    }),
    defineField({
      name: 'capacity',
      title: 'Capacity',
      type: 'capacitySpec',
      group: 'technical',
    }),
    defineField({
      name: 'estimatedCapex',
      title: 'Estimated CapEx',
      type: 'capexFigure',
      group: 'technical',
    }),
    defineField({
      name: 'commissionYear',
      title: 'Commission Year',
      type: 'number',
      group: 'technical',
      validation: (r) => r.min(1950).max(2100),
    }),

    // ── Geospatial ────────────────────────────────────────────────────
    defineField({
      name: 'originPoint',
      title: 'Origin Point',
      type: 'geolocation',
      group: 'geospatial',
    }),
    defineField({
      name: 'terminusPoint',
      title: 'Terminus Point',
      type: 'geolocation',
      group: 'geospatial',
    }),
    defineField({
      name: 'geoJson',
      title: 'GeoJSON Route',
      type: 'text',
      group: 'geospatial',
      description: 'Paste a GeoJSON LineString or MultiLineString for map visualization.',
      rows: 6,
    }),

    // ── Relations ─────────────────────────────────────────────────────
    defineField({
      name: 'relatedReports',
      title: 'Related Research Reports',
      type: 'array',
      group: 'relations',
      of: [{ type: 'reference', to: [{ type: 'researchReport' }] }],
    }),
    defineField({
      name: 'relatedProjects',
      title: 'Related Infrastructure Projects',
      type: 'array',
      group: 'relations',
      of: [{ type: 'reference', to: [{ type: 'infrastructureProject' }] }],
    }),
    defineField({
      name: 'relatedFrameworks',
      title: 'Related Policy Frameworks',
      type: 'array',
      group: 'relations',
      of: [{ type: 'reference', to: [{ type: 'policyFramework' }] }],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'status',
      code: 'code',
      media: 'coverImage',
    },
    prepare: ({ title, subtitle, code, media }) => ({
      title: code ? `[${code}] ${title}` : title,
      subtitle: subtitle?.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      media,
    }),
  },
})
