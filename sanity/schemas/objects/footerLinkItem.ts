import { defineField, defineType } from 'sanity'
import { LinkIcon } from '@sanity/icons'

export const footerLinkItem = defineType({
  name: 'footerLinkItem',
  title: 'Footer Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'href',
      title: 'URL / Path',
      type: 'string',
      description: 'Relative path e.g. /training or absolute URL',
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'href' },
    prepare: ({ title, subtitle }) => ({ title, subtitle }),
  },
})
