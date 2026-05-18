import { defineField, defineType } from 'sanity'
import { EarthGlobeIcon } from '@sanity/icons'

export const country = defineType({
  name: 'country',
  title: 'Country',
  type: 'document',
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Country Name',
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
      name: 'isoCode',
      title: 'ISO Code',
      type: 'string',
      description: 'ISO 3166-1 alpha-2 code, e.g. NG, GH, ZA',
      validation: (r) => r.required().max(2).uppercase(),
    }),
    defineField({
      name: 'isoCode3',
      title: 'ISO Code (3-letter)',
      type: 'string',
      description: 'ISO 3166-1 alpha-3 code, e.g. NGA, GHA, ZAF',
      validation: (r) => r.max(3).uppercase(),
    }),
    defineField({
      name: 'region',
      title: 'African Region',
      type: 'string',
      options: {
        list: [
          { value: 'west-africa',     title: 'West Africa' },
          { value: 'east-africa',     title: 'East Africa' },
          { value: 'north-africa',    title: 'North Africa' },
          { value: 'central-africa',  title: 'Central Africa' },
          { value: 'southern-africa', title: 'Southern Africa' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'flag',
      title: 'Flag',
      type: 'image',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'isoCode', media: 'flag' },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: subtitle ? `[${subtitle}]` : '',
      media,
    }),
  },
})
