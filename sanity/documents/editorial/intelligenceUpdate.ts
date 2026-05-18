import { defineField, defineType } from 'sanity'
import { BellIcon } from '@sanity/icons'

export const intelligenceUpdate = defineType({
  name: 'intelligenceUpdate',
  title: 'Intelligence Update',
  type: 'document',
  icon: BellIcon,
  description: 'Breaking intelligence items that power the ticker strip and news feed.',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'Short, punchy. Displayed in the intelligence strip ticker.',
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: 'Expanded detail shown in feed or modal views.',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (r) => r.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { value: 'market',       title: 'Market Intelligence' },
          { value: 'project',      title: 'Project Update' },
          { value: 'policy',       title: 'Policy & Regulation' },
          { value: 'training',     title: 'Training & Programs' },
          { value: 'partnership',  title: 'Partnership' },
          { value: 'event',        title: 'Event' },
          { value: 'research',     title: 'Research' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'priority',
      title: 'Priority',
      type: 'string',
      options: {
        list: [
          { value: 'normal',    title: 'Normal' },
          { value: 'urgent',    title: 'Urgent' },
          { value: 'featured',  title: 'Featured' },
        ],
      },
      initialValue: 'normal',
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      description: 'Link to full external story, if applicable.',
    }),
    defineField({
      name: 'relatedReport',
      title: 'Related Report',
      type: 'reference',
      to: [{ type: 'researchReport' }],
      description: 'Links the ticker item to a full report on the platform.',
    }),
    defineField({
      name: 'relatedCorridor',
      title: 'Related Corridor',
      type: 'reference',
      to: [{ type: 'pipelineCorridor' }],
    }),

    // ── Full Article Fields (optional) ───────────────────────────────
    // Leave empty for ticker-only updates.
    // Fill in to publish as a full Intelligence Brief on /insights/[slug].
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Required to publish as a full article on /insights/[slug].',
      options: { source: 'headline' },
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'One-line framing shown beneath the title in the article hero.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'keyInsights',
      title: 'Key Insight Stats',
      type: 'array',
      description: 'Up to 4 data points for the Bloomberg-style intelligence panel.',
      of: [{ type: 'insightStat' }],
      validation: (r) => r.max(4),
    }),
    defineField({
      name: 'body',
      title: 'Full Article Body',
      type: 'richText',
      description: 'Full editorial body. Leave empty for ticker-only updates.',
    }),
    defineField({
      name: 'pullQuote',
      title: 'Pull Quote',
      type: 'text',
      rows: 3,
      description: 'Strategic commentary quote for the full article view.',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'person' }],
    }),
    defineField({
      name: 'estimatedReadTime',
      title: 'Estimated Read Time (minutes)',
      type: 'number',
      validation: (r) => r.min(1),
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Insights',
      type: 'boolean',
      description: 'Pin to featured position on the Insights listing page.',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: 'Newest First',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Priority',
      name: 'priorityDesc',
      by: [{ field: 'priority', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'headline',
      subtitle: 'category',
      priority: 'priority',
      date: 'publishedAt',
    },
    prepare: ({ title, subtitle, priority, date }) => ({
      title: `${priority === 'urgent' ? '🔴 ' : priority === 'featured' ? '★ ' : ''}${title}`,
      subtitle: [subtitle?.toUpperCase(), date?.slice(0, 10)].filter(Boolean).join(' · '),
    }),
  },
})
