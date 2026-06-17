import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { sanityFetch } from "@/lib/sanity/fetch";
import { ALL_INSIGHTS_QUERY, type InsightCard } from "@/lib/queries/insights";

export const metadata = { title: "Intelligence Briefing | APRN Dashboard" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

const CATEGORY_LABEL: Record<string, string> = {
  intelligence: "Intelligence",
  research:     "Research",
  editorial:    "Editorial",
};

const ACTIVE_COURSES = [
  {
    code: "APC-101",
    title: "Pipeline Integrity Management",
    instructor: "Prof. S. Adebayo",
    modules: 12,
    currentModule: 4,
    progress: 65,
  },
  {
    code: "APC-210",
    title: "Cross-Border Regulatory Frameworks",
    instructor: "Dr. E. Mensah",
    modules: 8,
    currentModule: 2,
    progress: 20,
  },
];

const NETWORK_ACTIVITY = [
  {
    name: "Fatima Diallo",
    action: "joined the network.",
    detail: "Senior Structural Engineer, Dakar",
    ago: "2 hours ago",
    detailGold: false,
  },
  {
    name: "Samuel Njoroge",
    action: "updated certification.",
    detail: "Completed: Advanced Pipeline Integrity Management",
    ago: "5 hours ago",
    detailGold: false,
  },
  {
    name: "Amira Hassan",
    action: "published a paper.",
    detail: "Corrosion Metrics in High-Salinity Environments",
    ago: "1 day ago",
    detailGold: true,
  },
];

export default async function IntelligenceBriefingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { count: savedCount }, sanityResult] = await Promise.all([
    supabase.from("profiles").select("full_name, membership_tier").eq("id", user.id).single(),
    supabase.from("saved_items").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    sanityFetch<InsightCard[]>(ALL_INSIGHTS_QUERY, {}, ["insights"]).catch(() => null),
  ]);

  const recentContent = (sanityResult ?? []).slice(0, 5);

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";
  const tier = profile?.membership_tier ?? "free";
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);

  return (
    <div className="flex flex-col gap-10 max-w-320">

      {/* ── Welcome Banner + Stats ─────────────────────────────────── */}
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
            </div>
            <div className="flex items-center gap-2 bg-navy-900/80 border border-gold-500/30 px-4 py-2 self-start shrink-0">
              <i className="fa-solid fa-shield-halved text-gold-500 text-sm" />
              <span className="text-xs font-bold tracking-widest text-gold-500 uppercase">
                {tierLabel} Member
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Courses Enrolled",   value: String(ACTIVE_COURSES.length), sub: "Active" },
            { label: "Research Saved",     value: String(savedCount ?? 0), sub: "articles" },
            { label: "Network",            value: "—",       sub: "Connections" },
            { label: "Membership",         value: tierLabel, sub: "current plan", bar: true },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-navy-800 border border-white/5 p-6 flex flex-col justify-between h-32 hover:border-gold-500/20 transition-colors cursor-pointer group relative overflow-hidden"
            >
              {s.bar && <div className="absolute bottom-0 left-0 h-1 bg-gold-500 w-3/4" />}
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-gold-500 transition-colors">
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

      {/* ── Two-column grid ───────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* ── Left: Courses + Research ──────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-8">

          {/* Continue Learning */}
          <section className="flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3
                className="text-xl font-semibold text-white"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Continue Learning
              </h3>
              <Link
                href="/dashboard/courses"
                className="text-xs font-bold tracking-widest text-gold-500 uppercase hover:text-gold-400 transition-colors flex items-center gap-1.5"
              >
                All Courses <i className="fa-solid fa-arrow-right text-[10px]" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {ACTIVE_COURSES.map((course) => (
                <Link
                  key={course.code}
                  href="/dashboard/courses"
                  className="bg-navy-800 border border-white/5 hover:border-gold-500/30 transition-colors group overflow-hidden block"
                >
                  <div className="h-28 bg-navy-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-t from-navy-900 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className="px-2 py-1 bg-navy-900/80 border border-white/10 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                        Module {course.currentModule}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col gap-4">
                    <div>
                      <h4 className="text-base font-semibold text-white mb-1 group-hover:text-gold-400 transition-colors line-clamp-2">
                        {course.title}
                      </h4>
                      <p className="text-xs text-slate-400">Instructor: {course.instructor}</p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-navy-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold-500 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Recent Intelligence */}
          <section className="flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3
                className="text-xl font-semibold text-white"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Recent Intelligence
              </h3>
              <Link
                href="/dashboard/research"
                className="text-xs font-bold tracking-widest text-gold-500 uppercase hover:text-gold-400 transition-colors flex items-center gap-1.5"
              >
                View All <i className="fa-solid fa-arrow-right text-[10px]" />
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              {recentContent.length > 0 ? (
                recentContent.map((item) => (
                  <Link
                    key={item._id}
                    href={`/dashboard/research/${item.slug}`}
                    className="bg-navy-800 border border-white/5 p-5 flex items-center justify-between group hover:border-gold-500/20 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 bg-navy-900 border border-white/5 flex items-center justify-center shrink-0 group-hover:border-gold-500/20 transition-colors">
                        <i className="fa-solid fa-file-lines text-slate-500 group-hover:text-gold-500 transition-colors text-sm" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <span className="px-2 py-0.5 bg-navy-900 border border-white/5 text-[9px] font-bold tracking-widest text-gold-500 uppercase">
                            {CATEGORY_LABEL[item.category] ?? item.category}
                          </span>
                          <span className="text-xs text-slate-400">{formatDate(item.publishDate)}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-white group-hover:text-gold-400 transition-colors truncate">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                    <i className="fa-solid fa-arrow-right text-[10px] text-slate-600 group-hover:text-gold-500 transition-colors ml-4 shrink-0" />
                  </Link>
                ))
              ) : (
                <div className="bg-navy-800 border border-white/5 p-8 text-center">
                  <i className="fa-solid fa-newspaper text-slate-600 text-2xl mb-3 block" />
                  <p className="text-sm text-slate-500">No intelligence items published yet.</p>
                  <p className="text-xs text-slate-600 mt-1">Check back soon — new content is added weekly.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ── Right: Membership + Network ───────────────────────── */}
        <div className="flex flex-col gap-8">

          {/* Membership Status */}
          <section className="bg-navy-800 border border-white/5 border-t-2 border-t-gold-500 p-6 flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold tracking-widest text-white uppercase">Membership</h3>
              <i className="fa-solid fa-shield-halved text-gold-500 text-xl" />
            </div>

            <div className="bg-navy-900 border border-white/5 p-4">
              <p className="text-xs text-slate-500 mb-1">Current Tier</p>
              <p className="text-lg font-semibold text-white">{tierLabel} Member</p>
              <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Status</p>
                  <p className="text-sm text-white font-medium">Active</p>
                </div>
                <span className="text-xs text-emerald-400 font-medium bg-emerald-400/10 px-2 py-1 border border-emerald-400/20">
                  Active
                </span>
              </div>
            </div>

            <Link
              href="/dashboard/membership"
              className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-navy-900 text-xs font-bold tracking-widest uppercase text-center transition-colors block"
            >
              {tier === "free" ? "Upgrade Membership" : "View Benefits"}
            </Link>
          </section>

          {/* Network Activity */}
          <section className="bg-navy-800 border border-white/5 overflow-hidden flex flex-col">
            <div className="bg-navy-700 px-6 py-4 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-sm font-bold tracking-widest text-white uppercase">Network Activity</h3>
              <Link href="/dashboard/network" className="text-xs text-gold-500 hover:text-gold-400 transition-colors">
                View All
              </Link>
            </div>
            <div className="p-6 flex flex-col gap-6">
              {NETWORK_ACTIVITY.map((a) => (
                <div key={a.name} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-navy-600 border border-white/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-slate-400">
                      {a.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-white">
                      <span className="font-semibold">{a.name}</span>{" "}
                      <span className="text-slate-400">{a.action}</span>
                    </p>
                    <p className={`text-xs mt-0.5 leading-relaxed ${a.detailGold ? "text-gold-500 hover:underline cursor-pointer" : "text-slate-400"}`}>
                      {a.detail}
                    </p>
                    <p className="text-[10px] text-slate-600 mt-1.5 uppercase tracking-widest">{a.ago}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Links */}
          <section className="bg-navy-800 border border-white/5 p-6">
            <h3 className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-4">Quick Access</h3>
            <div className="flex flex-col gap-2">
              {[
                { icon: "fa-newspaper",     label: "Newsletter Archive",  href: "/newsletter" },
                { icon: "fa-flask",         label: "Research Hub",        href: "/research" },
                { icon: "fa-graduation-cap",label: "Training Programs",   href: "/training" },
                { icon: "fa-calendar",      label: "Upcoming Events",     href: "/events" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-3 py-2.5 px-3 hover:bg-navy-700 text-slate-400 hover:text-white transition-colors group"
                >
                  <i className={`fa-solid ${l.icon} text-[11px] text-slate-600 group-hover:text-gold-500 transition-colors w-4 text-center`} />
                  <span className="text-xs font-medium">{l.label}</span>
                  <i className="fa-solid fa-arrow-right text-[9px] ml-auto text-slate-700 group-hover:text-gold-500 transition-colors" />
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
