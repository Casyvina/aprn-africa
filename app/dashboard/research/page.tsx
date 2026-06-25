import { sanityFetch } from "@/lib/sanity/fetch";
import { DASHBOARD_RESEARCH_QUERY } from "@/lib/queries/research";
import type { DashboardResearchCard } from "@/lib/queries/research";
import { createClient } from "@/lib/supabase/server";
import ResearchPageClient from "@/components/dashboard/ResearchPageClient";

export const metadata = { title: "My Research | APRN" };

export default async function ResearchPage() {
  const supabase = await createClient();

  const [papers, { data: { user } }] = await Promise.all([
    sanityFetch<DashboardResearchCard[]>(DASHBOARD_RESEARCH_QUERY, {}, ["research"]),
    supabase.auth.getUser(),
  ]);

  let savedMap: Record<string, string> = {};
  if (user) {
    const { data } = await supabase
      .from("saved_items")
      .select("id, item_id")
      .eq("user_id", user.id)
      .eq("item_type", "research");
    savedMap = Object.fromEntries((data ?? []).map((s) => [s.item_id, s.id]));
  }

  return <ResearchPageClient papers={papers} savedMap={savedMap} />;
}
