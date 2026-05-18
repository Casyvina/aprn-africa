import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export const researchReport = defineType({
  name: 'researchReport',
  title: 'Research Report',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    { name: 'content',   title: 'Content',   default: true },
    { name: 'metadata',  title: 'Metadata' },
    { name: 'assets',    title: 'Assets' },
    { name: 'relations', title: 'Related Content' },
    { name: 'seo',       title: 'SEO' },
  ],
  fields: [
    // ── Identity ────────────────────────────────────────────────────
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
    }),
    defineField({
      name: 'executiveSummary',
      title: 'Executive Summary',
      type: 'text',
      group: 'content',
      rows: 6,
      description: 'Concise overview displayed in report cards and listings.',
      validation: (r) => r.required().max(600),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'richText',
      group: 'content',
    }),
    defineField({
      name: 'keyInsights',
      title: 'Key Insight Stats',
      type: 'array',
      group: 'content',
      description: 'Up to 4 data points shown in the Bloomberg-style panel on the article page.',
      of: [{ type: 'insightStat' }],
      validation: (r) => r.max(4),
    }),
    defineField({
      name: 'pullQuote',
      title: 'Pull Quote',
      type: 'text',
      group: 'content',
      rows: 3,
      description: 'Displayed in the full-width Strategic Commentary section at the base of the article.',
    }),

    // ── Metadata ─────────────────────────────────────────────────────
    defineField({
      name: 'reportType',
      title: 'Report Type',
      type: 'string',
      group: 'metadata',
      options: {
        list: [
          { value: 'flagship',        title: 'Flagship Report' },
          { value: 'technical-audit', title: 'Technical Audit' },
          { value: 'policy-brief',    title: 'Policy Brief' },
          { value: 'data-note',       title: 'Data Note' },
          { value: 'working-paper',   title: 'Working Paper' },
          { value: 'white-paper',     title: 'White Paper' },
          { value: 'briefing',        title: 'Intelligence Briefing' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish Date',
      type: 'date',
      group: 'metadata',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Report',
      type: 'boolean',
      group: 'metadata',
      description: 'Pin to the featured position on the Research page.',
      initialValue: false,
    }),
    defineField({
      name: 'pageCount',
      title: 'Page Count',
      type: 'number',
      group: 'metadata',
      validation: (r) => r.min(1),
    }),
    defineField({
      name: 'estimatedReadTime',
      title: 'Estimated Read Time (minutes)',
      type: 'number',
      group: 'metadata',
    }),
    defineField({
      name: 'topics',
      title: 'Topics',
      type: 'array',
      group: 'metadata',
      of: [{ type: 'reference', to: [{ type: 'topic' }] }],
    }),
    defineField({
      name: 'authors',
      title: 'Authors',
      type: 'array',
      group: 'metadata',
      of: [{ type: 'reference', to: [{ type: 'person' }] }],
    }),
    defineField({
      name: 'countries',
      title: 'Countries Covered',
      type: 'array',
      group: 'metadata',
      of: [{ type: 'reference', to: [{ type: 'country' }] }],
    }),

    // ── Assets ───────────────────────────────────────────────────────
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'assets',
      options: { hotspot: true },
    }),
    defineField({
      name: 'pdfAsset',
      title: 'Downloadable PDF',
      type: 'file',
      group: 'assets',
      options: { accept: '.pdf' },
    }),
    defineField({
      name: 'citation',
      title: 'Citation Metadata',
      type: 'citationMetadata',
      group: 'assets',
    }),

    // ── Relations ────────────────────────────────────────────────────
    defineField({
      name: 'relatedCorridors',
      title: 'Related Pipeline Corridors',
      type: 'array',
      group: 'relations',
      of: [{ type: 'reference', to: [{ type: 'pipelineCorridor' }] }],
    }),
    defineField({
      name: 'relatedProjects',
      title: 'Related Infrastructure Projects',
      type: 'array',
      group: 'relations',
      of: [{ type: 'reference', to: [{ type: 'infrastructureProject' }] }],
    }),
    defineField({
      name: 'relatedFrameworks',
      title: 'Related Policy Frameworks',
      type: 'array',
      group: 'relations',
      of: [{ type: 'reference', to: [{ type: 'policyFramework' }] }],
    }),
    defineField({
      name: 'relatedReports',
      title: 'Related Reports',
      type: 'array',
      group: 'relations',
      of: [{ type: 'reference', to: [{ type: 'researchReport' }] }],
    }),

    // ── SEO ──────────────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      type: 'reportType',
      date: 'publishDate',
      media: 'coverImage',
      featured: 'featured',
    },
    prepare: ({ title, type, date, media, featured }) => ({
      title: `${featured ? '★ ' : ''}${title}`,
      subtitle: [type?.replace(/-/g, ' ').toUpperCase(), date].filter(Boolean).join(' · '),
      media,
    }),
  },
})
