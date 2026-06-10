import { client } from './client'

// Content types that change frequently — short cache
const FAST_TAGS = new Set(['newsletter', 'intelligence', 'insights', 'training', 'leadership', 'partnerships'])

export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  tags: string[] = [],
): Promise<T> {
  const isFast = tags.some((t) => FAST_TAGS.has(t))
  return client.fetch<T>(query, params, {
    next: {
      revalidate: process.env.NODE_ENV === 'development' ? 30 : isFast ? 60 : 3600,
      tags,
    },
  })
}
