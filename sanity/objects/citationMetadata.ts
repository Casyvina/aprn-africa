import { defineField, defineType } from 'sanity'

export const citationMetadata = defineType({
  name: 'citationMetadata',
  title: 'Citation Metadata',
  type: 'object',
  fields: [
    defineField({
      name: 'seriesCode',
      title: 'Series Code',
      type: 'string',
      description: 'Internal reference code, e.g. APRN-RPT-2026-001',
    }),
    defineField({
      name: 'doi',
      title: 'DOI',
      type: 'string',
      description: 'Digital Object Identifier, e.g. 10.1000/xyz123',
    }),
    defineField({
      name: 'issn',
      title: 'ISSN',
      type: 'string',
    }),
    defineField({
      name: 'license',
      title: 'License',
      type: 'string',
      options: {
        list: [
          { value: 'all-rights-reserved', title: 'All Rights Reserved' },
          { value: 'cc-by-4',             title: 'CC BY 4.0' },
          { value: 'cc-by-nc-4',          title: 'CC BY-NC 4.0' },
          { value: 'cc-by-nd-4',          title: 'CC BY-ND 4.0' },
        ],
      },
      initialValue: 'all-rights-reserved',
    }),
    defineField({
      name: 'suggestedCitation',
      title: 'Suggested Citation',
      type: 'text',
      rows: 3,
      description: 'Pre-formatted citation string for academic use.',
    }),
  ],
})
