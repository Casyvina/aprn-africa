import { defineField, defineType } from 'sanity'

export const pillar = defineType({
  name: 'pillar',
  title: 'Pillar',
  type: 'object',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Font Awesome class, e.g. fa-microscope, fa-hard-hat, fa-database',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'icon' },
    prepare: ({ title, subtitle }) => ({ title, subtitle }),
  },
})
