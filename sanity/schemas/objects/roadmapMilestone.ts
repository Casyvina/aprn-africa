import { defineField, defineType } from 'sanity'

export const roadmapMilestone = defineType({
  name: 'roadmapMilestone',
  title: 'Roadmap Milestone',
  type: 'object',
  fields: [
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'e.g. 2026',
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
    }),
    defineField({
      name: 'tag',
      title: 'Target Label',
      type: 'string',
      description: 'e.g. Target: 500 new certified engineers.',
    }),
    defineField({
      name: 'tagSide',
      title: 'Tag Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Right (content on left, tag on right)', value: 'right' },
          { title: 'Left (tag on left, content on right)', value: 'left' },
        ],
        layout: 'radio',
      },
      initialValue: 'right',
    }),
  ],
  preview: {
    select: { title: 'year', subtitle: 'title' },
    prepare: ({ title, subtitle }) => ({ title, subtitle }),
  },
})
