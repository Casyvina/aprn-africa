import { createClient } from "@/lib/supabase/server";
import NetworkPageClient from "@/components/dashboard/NetworkPageClient";

export const metadata = { title: "Engineer Network | APRN" };

export interface NetworkMember {
  id: string;
  full_name: string;
  job_title: string | null;
  organisation: string | null;
  country: string | null;
  discipline: string | null;
  last_seen_at: string | null;
  avatar_url: string | null;
  membership_tier: string;
}

export default async function NetworkPage() {
  const supabase = await createClient();

  const { data: members } = await supabase
    .from("profiles")
    .select("id, full_name, job_title, organisation, country, discipline, last_seen_at, avatar_url, membership_tier")
    .not("full_name", "is", null)
    .order("last_seen_at", { ascending: false, nullsFirst: false })
    .limit(40);

  const { count } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .not("full_name", "is", null);

  return (
    <NetworkPageClient
      members={(members ?? []) as NetworkMember[]}
      totalCount={count ?? 0}
    />
  );
}
