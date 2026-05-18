import { defineField, defineType } from 'sanity'

export const capexFigure = defineType({
  name: 'capexFigure',
  title: 'CapEx Figure',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Value',
      type: 'number',
      validation: (r) => r.min(0),
    }),
    defineField({
      name: 'unit',
      title: 'Unit',
      type: 'string',
      options: {
        list: [
          { value: 'million', title: 'Million' },
          { value: 'billion', title: 'Billion' },
        ],
      },
      initialValue: 'billion',
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'USD',
      options: {
        list: [
          { value: 'USD', title: 'USD' },
          { value: 'EUR', title: 'EUR' },
          { value: 'GBP', title: 'GBP' },
          { value: 'NGN', title: 'NGN' },
          { value: 'ZAR', title: 'ZAR' },
        ],
      },
    }),
    defineField({
      name: 'estimateYear',
      title: 'Estimate Year',
      type: 'number',
      description: 'The year this CapEx estimate was published.',
      validation: (r) => r.min(1990).max(2100),
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Where this figure was sourced from.',
    }),
  ],
})
