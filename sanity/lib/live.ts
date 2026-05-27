/**
 * Compatibility shim for pages that use the next-sanity `sanityFetch` object signature:
 *   sanityFetch<T>({ query, params? }) => { data: T }
 *
 * Wraps the project's existing fetch utility at lib/sanity/fetch.ts.
 */
import { sanityFetch as _fetch } from "@/lib/sanity/fetch";

export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
}: {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
}): Promise<{ data: T }> {
  const data = await _fetch<T>(query, params, tags);
  return { data };
}
