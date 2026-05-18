import { defineField, defineType } from 'sanity'

export const geolocation = defineType({
  name: 'geolocation',
  title: 'Geolocation',
  type: 'object',
  fields: [
    defineField({
      name: 'lat',
      title: 'Latitude',
      type: 'number',
      validation: (r) => r.min(-90).max(90),
    }),
    defineField({
      name: 'lng',
      title: 'Longitude',
      type: 'number',
      validation: (r) => r.min(-180).max(180),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Optional display label for this point.',
    }),
  ],
})
