import { defineField, defineType } from 'sanity'
import { EditIcon } from '@sanity/icons'

export const publication = defineType({
  name: 'publication',
  title: 'Publication',
  type: 'document',
  icon: EditIcon,
  description: 'Shorter, editorial-style content: op-eds, position papers, technical notes, event summaries.',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
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
      name: 'publicationType',
      title: 'Publication Type',
      type: 'string',
      options: {
        list: [
          { value: 'op-ed',           title: 'Op-Ed' },
          { value: 'position-paper',  title: 'Position Paper' },
          { value: 'technical-note',  title: 'Technical Note' },
          { value: 'event-summary',   title: 'Event Summary' },
          { value: 'press-release',   title: 'Press Release' },
          { value: 'commentary',      title: 'Commentary' },
          { value: 'interview',       title: 'Interview' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish Date',
      type: 'date',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'One-line framing shown under the title.',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'estimatedReadTime',
      title: 'Estimated Read Time (minutes)',
      type: 'number',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'richText',
    }),
    defineField({
      name: 'authors',
      title: 'Authors',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'person' }] }],
    }),
    defineField({
      name: 'countries',
      title: 'Countries',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'country' }] }],
    }),
    defineField({
      name: 'topics',
      title: 'Topics',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'topic' }] }],
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      description: 'If this was originally published externally, link to the source.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'publicationType', media: 'coverImage' },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: subtitle?.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      media,
    }),
  },
})
