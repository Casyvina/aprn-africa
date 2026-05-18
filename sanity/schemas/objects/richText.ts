import { defineArrayMember, defineType } from 'sanity'

export const richText = defineType({
  name: 'richText',
  title: 'Rich Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal',     value: 'normal' },
        { title: 'H2',         value: 'h2' },
        { title: 'H3',         value: 'h3' },
        { title: 'H4',         value: 'h4' },
        { title: 'Quote',      value: 'blockquote' },
        { title: 'Note',       value: 'note' },
      ],
      lists: [
        { title: 'Bullet',     value: 'bullet' },
        { title: 'Numbered',   value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold',       value: 'strong' },
          { title: 'Italic',     value: 'em' },
          { title: 'Underline',  value: 'underline' },
          { title: 'Code',       value: 'code' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'External Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (r) => r.required(),
              },
              {
                name: 'blank',
                type: 'boolean',
                title: 'Open in new tab',
                initialValue: true,
              },
            ],
          },
          {
            name: 'internalLink',
            type: 'object',
            title: 'Internal Link',
            fields: [
              {
                name: 'reference',
                type: 'reference',
                title: 'Document',
                to: [
                  { type: 'researchReport' },
                  { type: 'pipelineCorridor' },
                  { type: 'trainingProgram' },
                  { type: 'policyFramework' },
                ],
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          validation: (r) => r.required(),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
      ],
    }),
  ],
})
