import { defineField, defineType } from 'sanity'
import { CalendarIcon } from '@sanity/icons'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    { name: 'overview',      title: 'Overview',      default: true },
    { name: 'details',       title: 'Details' },
    { name: 'speakers',      title: 'Speakers & Agenda' },
    { name: 'registration',  title: 'Registration' },
    { name: 'seo',           title: 'SEO' },
  ],
  fields: [
    // ── Overview ──────────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      group: 'overview',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'overview',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      group: 'overview',
      description: 'Short tagline shown on the events listing card.',
    }),
    defineField({
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      group: 'overview',
      options: {
        list: [
          { value: 'summit',     title: 'Summit' },
          { value: 'conference', title: 'Conference' },
          { value: 'workshop',   title: 'Workshop' },
          { value: 'webinar',    title: 'Webinar' },
          { value: 'forum',      title: 'Policy Forum' },
          { value: 'community',  title: 'Community Event' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'overview',
      options: {
        list: [
          { value: 'draft',       title: 'Draft (not visible on site)' },
          { value: 'published',   title: 'Published' },
          { value: 'coming_soon', title: 'Coming Soon (visible, no registration)' },
          { value: 'cancelled',   title: 'Cancelled' },
          { value: 'completed',   title: 'Completed' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Event',
      type: 'boolean',
      group: 'overview',
      description: 'Show as the featured event at the top of the events listing.',
      initialValue: false,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'overview',
      options: { hotspot: true },
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'overview',
      of: [{ type: 'reference', to: [{ type: 'topic' }] }],
    }),

    // ── Details ───────────────────────────────────────────────────────
    defineField({
      name: 'description',
      title: 'Description',
      type: 'richText',
      group: 'details',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date & Time',
      type: 'datetime',
      group: 'details',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date & Time',
      type: 'datetime',
      group: 'details',
    }),
    defineField({
      name: 'timezone',
      title: 'Timezone',
      type: 'string',
      group: 'details',
      initialValue: 'Africa/Lagos',
      description: 'e.g. Africa/Lagos, Africa/Nairobi, Europe/Berlin',
    }),
    defineField({
      name: 'location',
      title: 'Physical Location',
      type: 'string',
      group: 'details',
      description: 'City, Country — leave blank for virtual events.',
    }),
    defineField({
      name: 'venueUrl',
      title: 'Virtual Venue URL',
      type: 'url',
      group: 'details',
      description: 'Zoom, Teams, or other link for online events.',
    }),
    defineField({
      name: 'expectedAttendees',
      title: 'Expected Attendees',
      type: 'number',
      group: 'details',
    }),
    defineField({
      name: 'countries',
      title: 'Countries Involved',
      type: 'array',
      group: 'details',
      of: [{ type: 'reference', to: [{ type: 'country' }] }],
    }),

    // ── Speakers & Agenda ─────────────────────────────────────────────
    defineField({
      name: 'speakers',
      title: 'Speakers',
      type: 'array',
      group: 'speakers',
      of: [{ type: 'reference', to: [{ type: 'person' }] }],
    }),
    defineField({
      name: 'agendaItems',
      title: 'Agenda',
      type: 'array',
      group: 'speakers',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'time',        title: 'Time',        type: 'string', description: 'e.g. 09:00 – 09:30' }),
            defineField({ name: 'title',       title: 'Session Title', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
            defineField({ name: 'speaker',     title: 'Speaker',     type: 'reference', to: [{ type: 'person' }] }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'time' },
            prepare: ({ title, subtitle }) => ({ title, subtitle }),
          },
        },
      ],
    }),
    defineField({
      name: 'sponsors',
      title: 'Sponsors & Partners',
      type: 'array',
      group: 'speakers',
      of: [{ type: 'reference', to: [{ type: 'organizationPartner' }] }],
    }),

    // ── Registration ──────────────────────────────────────────────────
    defineField({
      name: 'isFree',
      title: 'Free Event',
      type: 'boolean',
      group: 'registration',
      initialValue: true,
    }),
    defineField({
      name: 'priceUSD',
      title: 'Price (USD)',
      type: 'number',
      group: 'registration',
      description: 'Leave blank if free. Paystack will convert to NGN.',
      hidden: ({ document }) => !!document?.isFree,
    }),
    defineField({
      name: 'registrationUrl',
      title: 'External Registration URL',
      type: 'url',
      group: 'registration',
      description: 'If using an external form (Eventbrite, etc.). Leave blank to use the APRN registration flow.',
    }),
    defineField({
      name: 'capacity',
      title: 'Capacity',
      type: 'number',
      group: 'registration',
      description: 'Maximum number of registrations. Leave blank for unlimited.',
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
      title: 'Start Date (Newest First)',
      name: 'startDateDesc',
      by: [{ field: 'startDate', direction: 'desc' }],
    },
  ],

  preview: {
    select: {
      title:     'title',
      subtitle:  'eventType',
      media:     'coverImage',
      status:    'status',
      startDate: 'startDate',
    },
    prepare: ({ title, subtitle, media, status, startDate }) => {
      const date = startDate ? new Date(startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
      return {
        title,
        subtitle: [subtitle, date, status !== 'published' ? `(${status})` : ''].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
