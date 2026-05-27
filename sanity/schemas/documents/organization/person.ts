import { defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons'

export const person = defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
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
      name: 'title',
      title: 'Job Title / Role',
      type: 'string',
      description: 'e.g. Director of Research, Senior Pipeline Engineer',
    }),
    defineField({
      name: 'honorific',
      title: 'Honorific / Prefix',
      type: 'string',
      options: {
        list: ['Dr.', 'Prof.', 'Eng.', 'Mr.', 'Mrs.', 'Ms.'],
      },
    }),
    defineField({
      name: 'organization',
      title: 'Organization',
      type: 'string',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'quote',
      title: 'Strategic Quote',
      type: 'text',
      rows: 3,
      description: 'Inspirational quote shown on the leadership page.',
    }),
    defineField({
      name: 'highlights',
      title: 'Profile Highlights',
      type: 'array',
      description: 'Up to 2 headline stats shown beside the profile (e.g. "20+ Years" / "Industry Experience").',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'string' }),
            defineField({ name: 'label', title: 'Label', type: 'string' }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        },
      ],
      validation: (r) => r.max(2),
    }),
    defineField({
      name: 'expertise',
      title: 'Areas of Expertise',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'topic' }] }],
    }),
    defineField({
      name: 'linkedIn',
      title: 'LinkedIn URL',
      type: 'url',
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'title', media: 'photo' },
    prepare: ({ title, subtitle, media }) => ({ title, subtitle, media }),
  },
})
