import { defineField, defineType } from 'sanity'
import { BookIcon } from '@sanity/icons'

export const policyFramework = defineType({
  name: 'policyFramework',
  title: 'Policy Framework',
  type: 'document',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Framework Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'frameworkType',
      title: 'Framework Type',
      type: 'string',
      options: {
        list: [
          { value: 'AU',         title: 'African Union (AU)' },
          { value: 'ECOWAS',     title: 'ECOWAS' },
          { value: 'EAC',        title: 'East African Community (EAC)' },
          { value: 'SADC',       title: 'SADC' },
          { value: 'COMESA',     title: 'COMESA' },
          { value: 'bilateral',  title: 'Bilateral Agreement' },
          { value: 'national',   title: 'National Policy' },
          { value: 'industry',   title: 'Industry Standard' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 5,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'body',
      title: 'Full Analysis',
      type: 'richText',
    }),
    defineField({
      name: 'dateAdopted',
      title: 'Date Adopted',
      type: 'date',
    }),
    defineField({
      name: 'inForce',
      title: 'Currently in Force',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'countries',
      title: 'Countries / Signatories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'country' }] }],
    }),
    defineField({
      name: 'document',
      title: 'Framework Document (PDF)',
      type: 'file',
      options: { accept: '.pdf' },
    }),
    defineField({
      name: 'relatedCorridors',
      title: 'Related Pipeline Corridors',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'pipelineCorridor' }] }],
    }),
    defineField({
      name: 'relatedReports',
      title: 'Related Research Reports',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'researchReport' }] }],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'frameworkType', active: 'inForce' },
    prepare: ({ title, subtitle, active }) => ({
      title,
      subtitle: `${subtitle} ${active ? '· Active' : '· Inactive'}`,
    }),
  },
})
