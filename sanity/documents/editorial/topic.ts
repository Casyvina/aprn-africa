import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'

export const topic = defineType({
  name: 'topic',
  title: 'Topic / Tag',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Topic Name',
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
      name: 'domain',
      title: 'Domain',
      type: 'string',
      description: 'The primary knowledge domain this topic belongs to.',
      options: {
        list: [
          { value: 'infrastructure',  title: 'Infrastructure' },
          { value: 'policy',          title: 'Policy & Regulation' },
          { value: 'finance',         title: 'Finance & Investment' },
          { value: 'training',        title: 'Training & Capacity Building' },
          { value: 'geopolitics',     title: 'Geopolitics' },
          { value: 'environment',     title: 'Environment & Sustainability' },
          { value: 'engineering',     title: 'Engineering & Technology' },
          { value: 'data',            title: 'Data & Analytics' },
          { value: 'energy-security', title: 'Energy Security' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'domain' },
    prepare: ({ title, subtitle }) => ({
      title,
      subtitle: subtitle?.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
    }),
  },
})
