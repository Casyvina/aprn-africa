import { defineField, defineType } from 'sanity'

// Reusable stat card used in the Bloomberg-style Key Intelligence panel
// across Intelligence Briefs, Research Reports, and Editorial Insights.
export const insightStat = defineType({
  name: 'insightStat',
  title: 'Insight Stat',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      description: 'e.g. "127 km", "340,000+", "<12%", "Q2 2026"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Short descriptor shown below the value',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Font Awesome Icon Class',
      type: 'string',
      description: 'FA class without "fa-solid" prefix — e.g. fa-route, fa-users, fa-gauge-high',
      initialValue: 'fa-chart-line',
    }),
  ],
  preview: {
    select: { value: 'value', label: 'label' },
    prepare: ({ value, label }) => ({ title: value, subtitle: label }),
  },
})
