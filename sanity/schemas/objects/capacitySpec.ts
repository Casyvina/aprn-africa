import { defineField, defineType } from 'sanity'

export const capacitySpec = defineType({
  name: 'capacitySpec',
  title: 'Capacity Specification',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Value',
      type: 'number',
      validation: (r) => r.min(0),
    }),
    defineField({
      name: 'unit',
      title: 'Unit',
      type: 'string',
      options: {
        list: [
          { value: 'MMSCFD', title: 'MMSCFD (Million Standard Cubic Feet/Day)' },
          { value: 'Bcf/day', title: 'Bcf/day (Billion Cubic Feet/Day)' },
          { value: 'bpd', title: 'bpd (Barrels per Day)' },
          { value: 'MTPA', title: 'MTPA (Million Tonnes per Annum)' },
          { value: 'MW', title: 'MW (Megawatts)' },
          { value: 'GW', title: 'GW (Gigawatts)' },
        ],
      },
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'string',
      description: 'e.g. "Design capacity", "Phase 1 throughput"',
    }),
  ],
})
