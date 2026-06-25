import { createAdminClient } from "@/lib/supabase/admin";
import AdminOverviewClient from "@/components/admin/AdminOverviewClient";

export const metadata = { title: "Admin Overview | APRN" };

const TIER_ORDER = ["student", "graduate", "professional", "associate", "corporate"];

export default async function AdminOverviewPage() {
  const admin = createAdminClient();

  const { data: profiles } = await admin
    .from("profiles")
    .select("id, full_name, membership_tier, updated_at")
    .order("updated_at", { ascending: false });

  const { data: { users } } = await admin.auth.admin.listUsers({ page: 1, perPage: 500 });

  const totalMembers = profiles?.length ?? 0;

  const tierCounts: Record<string, number> = {};
  for (const p of profiles ?? []) {
    const t = p.membership_tier ?? "free";
    tierCounts[t] = (tierCounts[t] ?? 0) + 1;
  }

  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);
  const newThisMonth = users?.filter(
    (u) => new Date(u.created_at) > monthAgo
  ).length ?? 0;

  const paidCount = totalMembers - (tierCounts["free"] ?? 0);
  const profPlus = (tierCounts["professional"] ?? 0) + (tierCounts["associate"] ?? 0) + (tierCounts["corporate"] ?? 0);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  const recentUsers = (users ?? [])
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8)
    .map((u) => {
      const profile = profileMap.get(u.id);
      return {
        id: u.id,
        name: profile?.full_name ?? u.email?.split("@")[0] ?? "—",
        email: u.email ?? "",
        tier: profile?.membership_tier ?? "free",
        joined: new Date(u.created_at).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "2-digit",
        }),
      };
    });

  return (
    <AdminOverviewClient
      totalMembers={totalMembers}
      profPlus={profPlus}
      paidCount={paidCount}
      newThisMonth={newThisMonth}
      tierCounts={tierCounts}
      recentUsers={recentUsers}
    />
  );
}
