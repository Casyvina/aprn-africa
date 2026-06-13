import { createAdminClient } from "@/lib/supabase/admin";
import AdminMembersTable from "@/components/AdminMembersTable";

export const metadata = { title: "Members | APRN Admin" };

export default async function AdminMembersPage() {
  const admin = createAdminClient();

  const [profilesRes, usersRes] = await Promise.all([
    admin.from("profiles")
      .select("id, full_name, membership_tier, country, discipline, organisation, topics, updated_at, last_seen_at")
      .order("updated_at", { ascending: false }),
    admin.auth.admin.listUsers({ page: 1, perPage: 500 }),
  ]);

  const profiles = profilesRes.data ?? [];
  const users    = usersRes.data?.users ?? [];

  // Merge auth users with profiles
  const profileMap = new Map(profiles.map((p) => [p.id, p]));
  const members = users.map((u) => {
    const profile = profileMap.get(u.id);
    return {
      id:           u.id,
      email:        u.email ?? "",
      fullName:     profile?.full_name ?? "",
      tier:         profile?.membership_tier ?? "free",
      country:      profile?.country ?? "",
      discipline:   profile?.discipline ?? "",
      organisation: profile?.organisation ?? "",
      topics:       profile?.topics ?? [],
      joinedAt:     u.created_at,
      lastActiveAt: profile?.last_seen_at ?? u.last_sign_in_at ?? u.created_at,
      updatedAt:    profile?.updated_at ?? u.created_at,
    };
  });

  return <AdminMembersTable members={members} />;
}
