import { defineField, defineType } from 'sanity'

// A single story/article inside a newsletter issue.
export const newsletterStory = defineType({
  name: 'newsletterStory',
  title: 'Newsletter Story',
  type: 'object',
  fields: [
    defineField({
      name: 'tag',
      title: 'Tag / Beat',
      type: 'string',
      description: 'e.g. EACOP, AKK Pipeline, Policy, Upstream, Training, Editorial',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 4,
      description: 'Two to four sentence summary for the email and web display.',
      validation: (r) => r.required().max(600),
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source URL',
      type: 'url',
      description: 'Optional link to the original source.',
    }),
  ],
  preview: {
    select: { title: 'headline', subtitle: 'tag' },
  },
})
