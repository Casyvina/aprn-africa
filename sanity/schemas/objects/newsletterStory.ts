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
    defineField({
      name: 'related',
      title: 'Linked APRN Article',
      type: 'reference',
      to: [
        { type: 'researchReport' },
        { type: 'editorialInsight' },
        { type: 'intelligenceUpdate' },
        { type: 'event' },
        { type: 'publication' },
      ],
      description: 'Optional. If set, the article’s cover image is used in the email and on the web when no Story Image is uploaded.',
    }),
    defineField({
      name: 'image',
      title: 'Story Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional. Overrides the linked article’s image. Landscape works best (16:9).',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describes the image for screen readers and when images are blocked in email.',
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'headline', subtitle: 'tag', media: 'image' },
  },
})
