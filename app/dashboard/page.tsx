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

  return (
    <>
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs tracking-[0.3em] text-gold-500 uppercase mb-2">Dashboard</p>
        <h1
          className="text-3xl md:text-4xl font-bold text-white"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Welcome back, {firstName}
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Membership banner — free tier */}
      {tier === "free" && (
        <div className="mb-10 p-6 border border-gold-500/20 bg-gold-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white mb-1">Upgrade to Professional</p>
            <p className="text-xs text-slate-400">
              Unlock the full research archive, course catalogue, and engineer network.
            </p>
          </div>
          <a
            href="/dashboard/membership"
            className="shrink-0 border border-gold-500 px-5 py-2.5 text-xs font-semibold tracking-widest uppercase text-gold-500 hover:bg-gold-500 hover:text-navy-900 transition-all"
          >
            View Plans
          </a>
        </div>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { icon: "fa-book-open", label: "Saved Research", value: "0", note: "articles bookmarked" },
          { icon: "fa-graduation-cap", label: "Enrolled Courses", value: "0", note: "in progress" },
          { icon: "fa-users", label: "Network", value: "—", note: "connections" },
          { icon: "fa-id-card", label: "Membership", value: tier.charAt(0).toUpperCase() + tier.slice(1), note: "current plan" },
        ].map((s) => (
          <div key={s.label} className="bg-navy-800 border border-white/5 p-6">
            <i className={`fa-solid ${s.icon} text-gold-500/70 text-sm mb-4 block`} />
            <div
              className="text-2xl font-bold text-white mb-1"
              style={{ fontFamily: "var(--font-oswald), sans-serif" }}
            >
              {s.value}
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">{s.note}</div>
          </div>
        ))}
      </div>

      {/* Recent activity placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-navy-800 border border-white/5 p-8">
          <h2 className="text-sm font-semibold text-white mb-1 uppercase tracking-widest">
            Latest Research
          </h2>
          <p className="text-xs text-slate-500 mb-6">From the APRN knowledge base</p>
          <a
            href="/research"
            className="inline-flex items-center gap-2 text-xs text-gold-500 hover:text-gold-400 transition-colors"
          >
            Browse research archive <i className="fa-solid fa-arrow-right text-[10px]" />
          </a>
        </div>

        <div className="bg-navy-800 border border-white/5 p-8">
          <h2 className="text-sm font-semibold text-white mb-1 uppercase tracking-widest">
            Training Programmes
          </h2>
          <p className="text-xs text-slate-500 mb-6">Pipeline certification and capacity building</p>
          <a
            href="/training"
            className="inline-flex items-center gap-2 text-xs text-gold-500 hover:text-gold-400 transition-colors"
          >
            View all courses <i className="fa-solid fa-arrow-right text-[10px]" />
          </a>
        </div>
      </div>
    </>
  );
}
