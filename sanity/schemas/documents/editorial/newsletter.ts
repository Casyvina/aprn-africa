import { defineField, defineType } from 'sanity'
import { EnvelopeIcon } from '@sanity/icons'

// Powers /newsletter/[issue] pages and the Resend email send flow.
// Claude pushes new issues here as DRAFT — editor reviews, then publishes.
export const newsletter = defineType({
  name: 'newsletter',
  title: 'Newsletter Issue',
  type: 'document',
  icon: EnvelopeIcon,
  description: 'A single issue of the APRN Intelligence Briefing. Created by Claude, reviewed and published by the editorial team.',
  groups: [
    { name: 'content',  title: 'Content',  default: true },
    { name: 'metadata', title: 'Metadata' },
    { name: 'send',     title: 'Send & Status' },
  ],
  fields: [
    // ── Identity ──────────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Issue Title',
      type: 'string',
      group: 'content',
      description: 'e.g. "APRN Daily Pipeline Intelligence — Vol. 1, Issue 002"',
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
      name: 'volume',
      title: 'Volume',
      type: 'number',
      group: 'metadata',
      validation: (r) => r.required().min(1),
      initialValue: 1,
    }),
    defineField({
      name: 'issueNumber',
      title: 'Issue Number',
      type: 'number',
      group: 'metadata',
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish Date',
      type: 'date',
      group: 'metadata',
      validation: (r) => r.required(),
      initialValue: () => new Date().toISOString().slice(0, 10),
    }),

    // ── Stories ───────────────────────────────────────────────────────
    defineField({
      name: 'stories',
      title: 'Stories',
      type: 'array',
      group: 'content',
      description: 'Between 4 and 12 stories. Claude generates these from live research.',
      of: [{ type: 'newsletterStory' }],
      validation: (r) => r.min(4).max(12),
    }),

    // ── Editor Analysis ───────────────────────────────────────────────
    defineField({
      name: 'editorAnalysis',
      title: "Editor's Analysis",
      type: 'text',
      group: 'content',
      rows: 6,
      description: 'The strategic editorial commentary that runs at the base of each issue.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'pullQuote',
      title: 'Pull Quote',
      type: 'string',
      group: 'content',
      description: 'One strong sentence extracted from the analysis for display emphasis.',
    }),

    // ── Hero / Intro ──────────────────────────────────────────────────
    defineField({
      name: 'leadSummary',
      title: 'Lead Summary',
      type: 'text',
      group: 'content',
      rows: 3,
      description: 'Two or three sentences summarising this issue — shown at the top of the web page and email.',
      validation: (r) => r.required().max(400),
    }),

    // ── Send & Status ─────────────────────────────────────────────────
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'send',
      options: {
        list: [
          { title: 'Draft (AI Generated)', value: 'draft' },
          { title: 'Under Review',         value: 'review' },
          { title: 'Approved to Send',     value: 'approved' },
          { title: 'Sent',                 value: 'sent' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'sentAt',
      title: 'Sent At',
      type: 'datetime',
      group: 'send',
      description: 'Populated automatically when the issue is sent via Resend.',
      readOnly: true,
    }),
    defineField({
      name: 'recipientCount',
      title: 'Recipients Sent To',
      type: 'number',
      group: 'send',
      description: 'Populated automatically after sending.',
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: 'Newest First',
      name: 'issueDateDesc',
      by: [{ field: 'publishDate', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title:   'title',
      date:    'publishDate',
      status:  'status',
      issue:   'issueNumber',
      volume:  'volume',
    },
    prepare: ({ title, date, status, issue, volume }) => {
      const statusIcon = status === 'sent' ? '✅' : status === 'approved' ? '🟢' : status === 'review' ? '🟡' : '📝'
      return {
        title: `${statusIcon} Vol. ${volume ?? 1}, #${issue ?? '?'} — ${title ?? 'Untitled'}`,
        subtitle: date,
      }
    },
  },
})
