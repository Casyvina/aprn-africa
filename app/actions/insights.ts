"use server";

import { sanityFetch } from "@/lib/sanity/fetch";
import { MORE_INSIGHTS_QUERY, PAGE_SIZE, type InsightCard } from "@/lib/queries/insights";

export async function fetchMoreInsights(offset: number): Promise<InsightCard[]> {
  return sanityFetch<InsightCard[]>(
    MORE_INSIGHTS_QUERY,
    { start: offset, end: offset + PAGE_SIZE },
    ["researchReport", "editorialInsight"],
  );
}
