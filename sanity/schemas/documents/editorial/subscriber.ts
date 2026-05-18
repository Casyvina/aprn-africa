import { defineField, defineType } from 'sanity'
import { UsersIcon } from '@sanity/icons'

// Newsletter subscribers collected from aprn-africa.org/newsletter.
// Created automatically by the /api/newsletter POST route when someone subscribes.
export const subscriber = defineType({
  name: 'subscriber',
  title: 'Subscriber',
  type: 'document',
  icon: UsersIcon,
  description: 'Newsletter subscribers collected from the APRN Intelligence Briefing signup form.',
  fields: [
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
    }),
    defineField({
      name: 'org',
      title: 'Organisation',
      type: 'string',
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Set to false to unsubscribe without deleting.',
      initialValue: true,
    }),
    defineField({
      name: 'subscribedAt',
      title: 'Subscribed At',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: 'Newest First',
      name: 'subscribedAtDesc',
      by: [{ field: 'subscribedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      email:     'email',
      firstName: 'firstName',
      org:       'org',
      active:    'active',
    },
    prepare: ({ email, firstName, org, active }) => ({
      title:    [firstName, email].filter(Boolean).join(' — '),
      subtitle: [org, active === false ? '⛔ Unsubscribed' : '✅ Active'].filter(Boolean).join(' · '),
    }),
  },
})
