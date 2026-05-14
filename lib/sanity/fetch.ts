import { client } from './client'

export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  tags: string[] = [],
): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      revalidate: process.env.NODE_ENV === 'development' ? 0 : 3600,
      tags,
    },
  })
}
