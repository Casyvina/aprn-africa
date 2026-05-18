import { defineField, defineType } from 'sanity'
import { ComponentIcon } from '@sanity/icons'

export const infrastructureProject = defineType({
  name: 'infrastructureProject',
  title: 'Infrastructure Project',
  type: 'document',
  icon: ComponentIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Project Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'projectType',
      title: 'Project Type',
      type: 'string',
      options: {
        list: [
          { value: 'pipeline-segment',   title: 'Pipeline Segment' },
          { value: 'lng-terminal',       title: 'LNG Terminal' },
          { value: 'refinery',           title: 'Refinery' },
          { value: 'compressor-station', title: 'Compressor Station' },
          { value: 'storage-facility',   title: 'Storage Facility' },
          { value: 'metering-station',   title: 'Metering Station' },
          { value: 'processing-plant',   title: 'Gas Processing Plant' },
          { value: 'fsru',               title: 'FSRU (Floating Storage & Regasification)' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { value: 'operational',        title: 'Operational' },
          { value: 'under-construction', title: 'Under Construction' },
          { value: 'proposed',           title: 'Proposed' },
          { value: 'feasibility',        title: 'Feasibility Study' },
          { value: 'suspended',          title: 'Suspended' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'corridor',
      title: 'Parent Corridor',
      type: 'reference',
      to: [{ type: 'pipelineCorridor' }],
      description: 'The strategic corridor this project belongs to.',
    }),
    defineField({
      name: 'countries',
      title: 'Countries',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'country' }] }],
    }),
    defineField({
      name: 'operator',
      title: 'Primary Operator',
      type: 'reference',
      to: [{ type: 'organizationPartner' }],
    }),
    defineField({
      name: 'capex',
      title: 'Capital Expenditure',
      type: 'capexFigure',
    }),
    defineField({
      name: 'estimatedCompletionDate',
      title: 'Estimated Completion Date',
      type: 'date',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'geolocation',
      title: 'Location',
      type: 'geolocation',
    }),
    defineField({
      name: 'relatedReports',
      title: 'Related Reports',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'researchReport' }] }],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'projectType', media: 'coverImage' },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: subtitle?.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      media,
    }),
  },
})
