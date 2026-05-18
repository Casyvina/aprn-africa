import { defineField, defineType } from 'sanity'
import { UsersIcon } from '@sanity/icons'

export const organizationPartner = defineType({
  name: 'organizationPartner',
  title: 'Organization / Partner',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Organization Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'type',
      title: 'Organization Type',
      type: 'string',
      options: {
        list: [
          { value: 'energy-company',  title: 'Energy Company' },
          { value: 'government',      title: 'Government / State Agency' },
          { value: 'academic',        title: 'Academic Institution' },
          { value: 'financial',       title: 'Financial Institution' },
          { value: 'regulatory',      title: 'Regulatory Body' },
          { value: 'multilateral',    title: 'Multilateral Organization' },
          { value: 'ngo',             title: 'NGO / Civil Society' },
          { value: 'consultancy',     title: 'Consultancy / Advisory' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tier',
      title: 'Partnership Tier',
      type: 'string',
      options: {
        list: [
          { value: 'strategic',      title: 'Strategic' },
          { value: 'institutional',  title: 'Institutional' },
          { value: 'academic',       title: 'Academic' },
          { value: 'industry',       title: 'Industry' },
          { value: 'governmental',   title: 'Governmental' },
        ],
      },
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'reference',
      to: [{ type: 'country' }],
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'type', media: 'logo' },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: subtitle?.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      media,
    }),
  },
})
