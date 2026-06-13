import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";
  const tier = profile?.membership_tier ?? "free";
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);

  function lastSeenLabel(iso: string | null | undefined): string {
    if (!iso) return "";
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 2)   return "Active now";
    if (mins < 60)  return `Last active ${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)   return `Last active ${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `Last active ${days}d ago`;
  }

  const lastSeen = lastSeenLabel(profile?.last_seen_at);

  return (
    <div className="flex flex-col gap-10 max-w-320">

      {/* ── Welcome Banner + Stats ────────────────────────────── */}
      <section className="flex flex-col gap-5">
        <div className="bg-navy-800 border border-white/5 border-l-4 border-l-gold-500 p-8 relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-64 h-full pointer-events-none"
            style={{ background: "linear-gradient(to left, rgba(212,160,23,0.05), transparent)" }}
          />
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
            <div>
              <h2
                className="text-3xl font-bold text-white mb-2"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Welcome back, {firstName}
              </h2>
              <p className="text-slate-400 text-sm">Your intelligence briefing is ready for review.</p>
              {lastSeen && (
                <p className="text-[11px] text-slate-600 mt-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  {lastSeen}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 bg-navy-900/80 border border-gold-500/30 px-4 py-2 self-start shrink-0">
              <i className="fa-solid fa-shield-halved text-gold-500 text-sm" />
              <span className="text-xs font-bold tracking-widest text-gold-500 uppercase">
                {tierLabel} Member
              </span>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Courses Enrolled", value: "0",  sub: "Active" },
            { label: "Research Saved",   value: "0",  sub: "articles" },
            { label: "Network",          value: "—",  sub: "Connections" },
            { label: "Membership",       value: tierLabel, sub: "current plan", bar: true },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-navy-800 border border-white/5 p-6 flex flex-col justify-between h-32 hover:border-gold-500/20 transition-colors cursor-pointer group relative overflow-hidden"
            >
              {s.bar && <div className="absolute bottom-0 left-0 h-1 bg-gold-500/40 w-3/4" />}
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase group-hover:text-gold-500 transition-colors">
                {s.label}
              </span>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-4xl font-bold text-white"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  {s.value}
                </span>
                <span className="text-xs text-slate-400">{s.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Main grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left column */}
        <div className="lg:col-span-2 flex flex-col gap-8">

          {/* Continue Learning */}
          <section className="flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3
                className="text-lg font-semibold text-white"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Continue Learning
              </h3>
              <Link
                href="/training"
                className="text-[10px] font-bold tracking-widest text-gold-500 uppercase hover:text-gold-400 transition-colors flex items-center gap-1"
              >
                All Courses <i className="fa-solid fa-arrow-right" />
              </Link>
            </div>

            {/* Empty state */}
            <div className="bg-navy-800 border border-white/5 border-dashed p-10 flex flex-col items-center justify-center text-center gap-3">
              <i className="fa-solid fa-graduation-cap text-slate-600 text-2xl" />
              <p className="text-sm text-slate-500">No courses enrolled yet.</p>
              <Link
                href="/training"
                className="text-xs text-gold-500 hover:text-gold-400 transition-colors font-medium"
              >
                Browse training programmes →
              </Link>
            </div>
          </section>

          {/* Recent Research */}
          <section className="flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3
                className="text-lg font-semibold text-white"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Recent Research
              </h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-navy-800 border border-white/10 text-xs text-white hover:border-gold-500/50 transition-colors">
                  Latest
                </button>
                <button className="px-3 py-1 border border-transparent text-xs text-slate-400 hover:text-white transition-colors">
                  Saved
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { tag: "Pipeline Integrity",   title: "Corrosion Metrics in High-Salinity Coastal Environments",    date: "May 2026" },
                { tag: "Policy & Regulation",  title: "ECOWAS Tariff Harmonization Draft Analysis",                 date: "Apr 2026" },
                { tag: "Renewable Integration",title: "Hydrogen Blending Capacity in Legacy Gas Infrastructure",    date: "Apr 2026" },
              ].map((r) => (
                <Link
                  key={r.title}
                  href="/research"
                  className="bg-navy-800 border border-white/5 p-5 flex items-center justify-between group hover:bg-navy-700/50 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-9 h-9 bg-navy-900 border border-white/5 flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-file-lines text-slate-400 group-hover:text-gold-500 transition-colors text-xs" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="px-2 py-0.5 bg-navy-900 border border-white/5 text-[9px] font-bold tracking-widest text-gold-500 uppercase">
                          {r.tag}
                        </span>
                        <span className="text-xs text-slate-400">{r.date}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-gold-400 transition-colors truncate">
                        {r.title}
                      </h4>
                    </div>
                  </div>
                  <button className="text-slate-500 hover:text-gold-500 transition-colors p-2 shrink-0">
                    <i className="fa-regular fa-bookmark text-sm" />
                  </button>
                </Link>
              ))}
            </div>

            <Link
              href="/research"
              className="text-center text-xs text-slate-500 hover:text-gold-500 transition-colors py-3 border-t border-white/5"
            >
              Browse full research archive →
            </Link>
          </section>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">

          {/* Membership card */}
          <div className="bg-navy-800 border border-white/5 border-t-2 border-t-gold-500 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-white uppercase tracking-widest">Membership</h3>
              <span className="px-2 py-0.5 bg-gold-500/10 border border-gold-500/30 text-[9px] font-bold tracking-widest text-gold-500 uppercase">
                {tierLabel}
              </span>
            </div>

            {tier === "free" ? (
              <>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Upgrade to <strong className="text-white">Professional</strong> to unlock the full
                  research archive, course catalogue, and engineer network.
                </p>
                <Link
                  href="/dashboard/membership"
                  className="w-full text-center py-3 text-xs font-bold tracking-widest uppercase text-navy-900 bg-gold-500 hover:bg-gold-400 transition-colors"
                >
                  View Plans
                </Link>
              </>
            ) : (
              <div className="flex flex-col gap-3 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="text-emerald-400 font-medium">Active</span>
                </div>
                <div className="flex justify-between">
                  <span>Plan</span>
                  <span className="text-white capitalize">{tier}</span>
                </div>
                <Link href="/dashboard/membership" className="text-gold-500 hover:text-gold-400 transition-colors mt-1">
                  Manage membership →
                </Link>
              </div>
            )}
          </div>

          {/* Quick access */}
          <div className="bg-navy-800 border border-white/5 p-6 flex flex-col gap-4">
            <h3 className="text-xs font-semibold text-white uppercase tracking-widest">Quick Access</h3>
            <div className="flex flex-col gap-0.5">
              {[
                { href: "/research",     icon: "fa-book-open",      label: "Research Archive" },
                { href: "/insights",     icon: "fa-chart-bar",      label: "Industry Insights" },
                { href: "/training",     icon: "fa-graduation-cap", label: "Training Catalogue" },
                { href: "/newsletter",   icon: "fa-newspaper",      label: "Newsletter Archive" },
                { href: "/partnerships", icon: "fa-handshake",      label: "Partner Directory" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-3 py-2.5 px-3 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors group"
                >
                  <i className={`fa-solid ${l.icon} text-xs w-4 text-slate-600 group-hover:text-gold-500 transition-colors`} />
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Network teaser */}
          <div className="bg-navy-800 border border-white/5 p-6 flex flex-col gap-4">
            <h3 className="text-xs font-semibold text-white uppercase tracking-widest">Engineer Network</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connect with pipeline engineers, researchers, and policymakers across Africa.
            </p>
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-navy-700 border-2 border-navy-800 flex items-center justify-center"
                >
                  <i className="fa-solid fa-user text-slate-500 text-[10px]" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full bg-gold-500/20 border-2 border-navy-800 flex items-center justify-center">
                <span className="text-[8px] font-bold text-gold-500">+</span>
              </div>
            </div>
            <Link
              href="/dashboard/network"
              className="text-xs text-gold-500 hover:text-gold-400 transition-colors"
            >
              Browse engineer directory →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
