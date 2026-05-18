import { defineField, defineType } from 'sanity'

export const seoFields = defineType({
  name: 'seoFields',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Overrides the page title in search results. Max 60 characters.',
      validation: (r) => r.max(60),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Short summary shown in search results. Max 160 characters.',
      validation: (r) => r.max(160),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Image shown when shared on social media. Recommended: 1200×630px.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'noIndex',
      title: 'No Index',
      type: 'boolean',
      description: 'Prevent this page from appearing in search engines.',
      initialValue: false,
    }),
  ],
})
