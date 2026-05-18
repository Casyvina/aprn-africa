import { defineField, defineType } from 'sanity'
import { BookIcon } from '@sanity/icons'

export const trainingProgram = defineType({
  name: 'trainingProgram',
  title: 'Training Program',
  type: 'document',
  icon: BookIcon,
  groups: [
    { name: 'overview',  title: 'Overview',  default: true },
    { name: 'details',   title: 'Details' },
    { name: 'logistics', title: 'Logistics' },
    { name: 'seo',       title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Program Title',
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
      name: 'programType',
      title: 'Program Type',
      type: 'string',
      group: 'overview',
      options: {
        list: [
          { value: 'certification',      title: 'Professional Certification' },
          { value: 'fellowship',         title: 'Fellowship' },
          { value: 'workshop',           title: 'Workshop' },
          { value: 'short-course',       title: 'Short Course' },
          { value: 'executive-program',  title: 'Executive Program' },
          { value: 'apprenticeship',     title: 'Apprenticeship' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'level',
      title: 'Level',
      type: 'string',
      group: 'overview',
      options: {
        list: [
          { value: 'foundation',    title: 'Foundation' },
          { value: 'intermediate',  title: 'Intermediate' },
          { value: 'advanced',      title: 'Advanced' },
          { value: 'professional',  title: 'Professional' },
          { value: 'executive',     title: 'Executive' },
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'overview',
      rows: 5,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'overview',
      options: { hotspot: true },
    }),
    defineField({
      name: 'featured',
      title: 'Featured Program',
      type: 'boolean',
      group: 'overview',
      initialValue: false,
    }),

    // ── Details ──────────────────────────────────────────────────────
    defineField({
      name: 'curriculum',
      title: 'Curriculum',
      type: 'richText',
      group: 'details',
    }),
    defineField({
      name: 'instructors',
      title: 'Instructors',
      type: 'array',
      group: 'details',
      of: [{ type: 'reference', to: [{ type: 'person' }] }],
    }),
    defineField({
      name: 'topics',
      title: 'Topics Covered',
      type: 'array',
      group: 'details',
      of: [{ type: 'reference', to: [{ type: 'topic' }] }],
    }),

    // ── Logistics ────────────────────────────────────────────────────
    defineField({
      name: 'durationWeeks',
      title: 'Duration (weeks)',
      type: 'number',
      group: 'logistics',
      validation: (r) => r.min(1),
    }),
    defineField({
      name: 'deliveryMode',
      title: 'Delivery Mode',
      type: 'string',
      group: 'logistics',
      options: {
        list: [
          { value: 'in-person',  title: 'In-Person' },
          { value: 'online',     title: 'Online' },
          { value: 'hybrid',     title: 'Hybrid' },
        ],
      },
    }),
    defineField({
      name: 'countries',
      title: 'Available In',
      type: 'array',
      group: 'logistics',
      of: [{ type: 'reference', to: [{ type: 'country' }] }],
    }),
    defineField({
      name: 'applicationDeadline',
      title: 'Application Deadline',
      type: 'date',
      group: 'logistics',
    }),
    defineField({
      name: 'intakeDates',
      title: 'Intake Dates',
      type: 'array',
      group: 'logistics',
      of: [{ type: 'date' }],
    }),
    defineField({
      name: 'applicationUrl',
      title: 'Application URL',
      type: 'url',
      group: 'logistics',
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
    select: { title: 'title', subtitle: 'programType', media: 'coverImage' },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: subtitle?.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      media,
    }),
  },
})
