import { defineField, defineType } from 'sanity'
import { EditIcon } from '@sanity/icons'

// Powers the "Editorial Insight" article variant on /insights/[slug].
// Thought leadership, strategic commentary, and institutional positioning pieces.
export const editorialInsight = defineType({
  name: 'editorialInsight',
  title: 'Editorial Insight',
  type: 'document',
  icon: EditIcon,
  description: "Long-form thought leadership and strategic commentary published under APRN's institutional voice.",
  groups: [
    { name: 'content',   title: 'Content',   default: true },
    { name: 'metadata',  title: 'Metadata' },
    { name: 'relations', title: 'Related Content' },
    { name: 'seo',       title: 'SEO' },
  ],
  fields: [
    // ── Identity ──────────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      group: 'content',
      description: 'One-line framing shown beneath the title in the article hero.',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'content',
      rows: 4,
      description: 'Summary for listing cards, social sharing, and search previews.',
      validation: (r) => r.required().max(400),
    }),

    // ── Visual ────────────────────────────────────────────────────────
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),

    // ── Key Insights Panel ───────────────────────────────────────────
    defineField({
      name: 'keyInsights',
      title: 'Key Insight Stats',
      type: 'array',
      group: 'content',
      description: 'Up to 4 data points shown in the Bloomberg-style intelligence panel.',
      of: [{ type: 'insightStat' }],
      validation: (r) => r.max(4),
    }),

    // ── Body ──────────────────────────────────────────────────────────
    defineField({
      name: 'body',
      title: 'Body',
      type: 'richText',
      group: 'content',
    }),
    defineField({
      name: 'pullQuote',
      title: 'Pull Quote',
      type: 'text',
      group: 'content',
      rows: 3,
      description: 'Displayed in the full-width Strategic Commentary section at the base of the article.',
      validation: (r) => r.required(),
    }),

    // ── Metadata ─────────────────────────────────────────────────────
    defineField({
      name: 'publishDate',
      title: 'Publish Date',
      type: 'date',
      group: 'metadata',
      validation: (r) => r.required(),
      initialValue: () => new Date().toISOString().slice(0, 10),
    }),
    defineField({
      name: 'estimatedReadTime',
      title: 'Estimated Read Time (minutes)',
      type: 'number',
      group: 'metadata',
      validation: (r) => r.min(1),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'metadata',
      description: 'Pin to the featured position on the Insights listing page.',
      initialValue: false,
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      group: 'metadata',
      to: [{ type: 'person' }],
    }),
    defineField({
      name: 'topics',
      title: 'Topics',
      type: 'array',
      group: 'metadata',
      of: [{ type: 'reference', to: [{ type: 'topic' }] }],
    }),

    // ── Related Content ──────────────────────────────────────────────
    defineField({
      name: 'relatedReports',
      title: 'Related Research Reports',
      type: 'array',
      group: 'relations',
      of: [{ type: 'reference', to: [{ type: 'researchReport' }] }],
    }),
    defineField({
      name: 'relatedCorridors',
      title: 'Related Pipeline Corridors',
      type: 'array',
      group: 'relations',
      of: [{ type: 'reference', to: [{ type: 'pipelineCorridor' }] }],
    }),
    defineField({
      name: 'relatedEditorials',
      title: 'Related Editorials',
      type: 'array',
      group: 'relations',
      of: [{ type: 'reference', to: [{ type: 'editorialInsight' }] }],
    }),

    // ── SEO ───────────────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
      group: 'seo',
    }),
  ],
  orderings: [
    {
      title: 'Newest First',
      name: 'publishDateDesc',
      by: [{ field: 'publishDate', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      date: 'publishDate',
      media: 'heroImage',
      featured: 'featured',
    },
    prepare: ({ title, date, media, featured }) => ({
      title: `${featured ? '★ ' : ''}${title}`,
      subtitle: date,
      media,
    }),
  },
})
