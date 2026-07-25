import { client } from './client'

// Content types that change frequently — short cache
const FAST_TAGS = new Set([
  // homepage / listing pages
  'newsletter', 'intelligence', 'insights', 'training', 'leadership', 'partnerships', 'events', 'event',
  // article-level document types — editors expect changes to appear quickly
  'editorialInsight', 'intelligenceUpdate', 'publication', 'researchReport',
])

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
