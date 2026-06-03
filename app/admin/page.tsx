import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = { title: "Admin Overview | APRN" };

const TIER_ORDER = ["student", "graduate", "professional", "associate", "corporate"];

export default async function AdminOverviewPage() {
  const admin = createAdminClient();

  // Fetch all profiles
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, full_name, membership_tier, updated_at")
    .order("updated_at", { ascending: false });

  // Fetch auth users (for email + created_at)
  const { data: { users } } = await admin.auth.admin.listUsers({ page: 1, perPage: 500 });

  const totalMembers = profiles?.length ?? 0;

  // Tier breakdown
  const tierCounts: Record<string, number> = {};
  for (const p of profiles ?? []) {
    const t = p.membership_tier ?? "free";
    tierCounts[t] = (tierCounts[t] ?? 0) + 1;
  }

  // New this month
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);
  const newThisMonth = users?.filter(
    (u) => new Date(u.created_at) > monthAgo
  ).length ?? 0;

  // Paid members (non-free)
  const paidCount = totalMembers - (tierCounts["free"] ?? 0);

  // Professional-tier+ (professional, associate, corporate)
  const profPlus = (tierCounts["professional"] ?? 0) + (tierCounts["associate"] ?? 0) + (tierCounts["corporate"] ?? 0);

  // Recent signups (last 8)
  const recentUsers = (users ?? [])
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  // Join with profile names
  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  return (
    <div className="flex flex-col gap-8 max-w-275">

      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <h1
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Overview
        </h1>
        <p className="text-sm text-slate-400 mt-1">Platform-wide member and activity summary.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Members",   value: totalMembers, icon: "fa-users",      accent: "#D4A017" },
          { label: "Professional+",   value: profPlus,     icon: "fa-id-badge",   accent: "#60a5fa" },
          { label: "Paid Members",    value: paidCount,    icon: "fa-id-card",    accent: "#34d399" },
          { label: "New (30 days)",   value: newThisMonth, icon: "fa-user-plus",  accent: "#a78bfa" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-navy-800 border border-white/5 p-5"
            style={{ borderLeftWidth: "3px", borderLeftColor: s.accent }}
          >
            <div className="flex items-center gap-2 mb-3">
              <i className={`fa-solid ${s.icon} text-[10px]`} style={{ color: s.accent }} />
              <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500">{s.label}</p>
            </div>
            <p
              className="text-3xl font-bold text-white"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Tier breakdown + Recent signups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Tier breakdown */}
        <div className="bg-navy-800 border border-white/5 p-6">
          <h2 className="text-xs font-bold tracking-widest uppercase text-gold-500 mb-5">
            Members by Tier
          </h2>
          <div className="flex flex-col gap-3">
            {[...TIER_ORDER, "free"].map((tier) => {
              const count = tierCounts[tier] ?? 0;
              const pct = totalMembers > 0 ? Math.round((count / totalMembers) * 100) : 0;
              return (
                <div key={tier}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-white capitalize">{tier}</span>
                    <span className="text-xs text-slate-500">{count} members</span>
                  </div>
                  <div className="h-1.5 bg-navy-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent signups */}
        <div className="bg-navy-800 border border-white/5 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-bold tracking-widest uppercase text-gold-500">
              Recent Signups
            </h2>
            <Link
              href="/admin/members"
              className="text-[10px] text-slate-500 hover:text-gold-500 transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {recentUsers.length === 0 ? (
              <p className="text-xs text-slate-500">No members yet.</p>
            ) : (
              recentUsers.map((u) => {
                const profile = profileMap.get(u.id);
                const name = profile?.full_name ?? u.email?.split("@")[0] ?? "—";
                const tier = profile?.membership_tier ?? "free";
                const joined = new Date(u.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" });
                return (
                  <div key={u.id} className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-navy-900 border border-gold-500/20 flex items-center justify-center shrink-0">
                      <span className="text-[9px] font-bold text-gold-500">
                        {name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{u.email}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[9px] font-bold tracking-widest uppercase text-slate-400 capitalize">{tier}</p>
                      <p className="text-[9px] text-slate-600">{joined}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { href: "/admin/members",  icon: "fa-users",               label: "Manage Members",    desc: "View, search, and update member tiers" },
          { href: "/admin/generate", icon: "fa-wand-magic-sparkles", label: "Generate Content",  desc: "AI-draft an editorial or research report" },
          { href: "/admin/payments", icon: "fa-credit-card",         label: "Payments",          desc: "Review Paystack payment history" },
          { href: "/dashboard",      icon: "fa-arrow-left",          label: "Back to Dashboard", desc: "Return to your member dashboard" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-navy-800 border border-white/5 p-5 hover:border-gold-500/20 transition-colors group"
          >
            <div className="w-8 h-8 bg-navy-900 border border-white/5 flex items-center justify-center mb-3">
              <i className={`fa-solid ${item.icon} text-gold-500 text-[10px]`} />
            </div>
            <p className="text-xs font-bold text-white group-hover:text-gold-400 transition-colors mb-1">{item.label}</p>
            <p className="text-[10px] text-slate-500">{item.desc}</p>
          </Link>
        ))}
      </div>

    </div>
  );
}
