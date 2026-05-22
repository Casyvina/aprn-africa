import Link from "next/link";

export const metadata = { title: "Saved Articles | APRN" };

const saved = [
  {
    tag: "Pipeline Integrity",
    tagColor: "text-gold-500",
    title: "Corrosion Metrics in High-Salinity Coastal Environments",
    excerpt: "A comparative study of electrochemical corrosion rates across 14 offshore pipeline segments in the Niger Delta, with updated cathodic protection benchmarks.",
    date: "May 2026",
    readTime: "12 min read",
    type: "Research Paper",
  },
  {
    tag: "Policy & Regulation",
    tagColor: "text-blue-400",
    title: "ECOWAS Tariff Harmonisation Draft Analysis",
    excerpt: "Detailed examination of the proposed cross-border energy tariff framework and its implications for pipeline transit agreements in West Africa.",
    date: "Apr 2026",
    readTime: "8 min read",
    type: "Policy Brief",
  },
  {
    tag: "Renewable Integration",
    tagColor: "text-emerald-400",
    title: "Hydrogen Blending Capacity in Legacy Gas Infrastructure",
    excerpt: "Assessment of material compatibility and operational feasibility for 10–20% hydrogen blending in existing sub-Saharan gas transmission networks.",
    date: "Apr 2026",
    readTime: "15 min read",
    type: "Technical Report",
  },
  {
    tag: "Industry Outlook",
    tagColor: "text-gold-500",
    title: "Africa Pipeline Infrastructure 2026 Outlook",
    excerpt: "A comprehensive review of planned and in-progress pipeline projects across the continent, including financing structures and regulatory timelines.",
    date: "Mar 2026",
    readTime: "20 min read",
    type: "Annual Report",
  },
];

export default function SavedPage() {
  return (
    <div className="flex flex-col gap-8 max-w-[900px]">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h2
            className="text-3xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Saved Articles
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Research and intelligence you&apos;ve bookmarked for later.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            {saved.length} saved
          </span>
          <button className="px-4 py-2 bg-navy-800 border border-white/10 text-xs text-slate-400 hover:text-white hover:border-gold-500/30 transition-colors">
            Clear All
          </button>
        </div>
      </div>

      {/* ── Sort / filter row ────────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">
        {["All", "Research Papers", "Policy Briefs", "Technical Reports", "Industry Insights"].map((f, i) => (
          <button
            key={f}
            className={`px-4 py-2 text-xs font-semibold transition-colors ${
              i === 0
                ? "bg-gold-500 text-navy-900"
                : "bg-navy-800 border border-white/10 text-slate-400 hover:text-white hover:border-gold-500/30"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Saved list ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {saved.map((item) => (
          <div
            key={item.title}
            className="bg-navy-800 border border-white/5 p-6 flex gap-5 hover:border-gold-500/20 transition-colors group"
          >
            {/* Icon */}
            <div className="w-10 h-10 bg-navy-900 border border-white/5 flex items-center justify-center shrink-0 mt-0.5">
              <i className="fa-solid fa-file-lines text-slate-500 group-hover:text-gold-500 transition-colors text-sm" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-0.5 bg-navy-900 border border-white/5 text-[9px] font-bold tracking-widest uppercase ${item.tagColor}`}>
                  {item.tag}
                </span>
                <span className="text-[10px] text-slate-500">{item.type}</span>
                <span className="text-[10px] text-slate-500">{item.date}</span>
                <span className="text-[10px] text-slate-500">{item.readTime}</span>
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-gold-400 transition-colors leading-snug">
                {item.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                {item.excerpt}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 shrink-0">
              <Link
                href="/research"
                className="w-8 h-8 bg-navy-900 border border-white/5 flex items-center justify-center hover:border-gold-500/30 transition-colors group/btn"
                title="Read"
              >
                <i className="fa-solid fa-arrow-up-right-from-square text-slate-500 group-hover/btn:text-gold-500 transition-colors text-[10px]" />
              </Link>
              <button
                className="w-8 h-8 bg-navy-900 border border-white/5 flex items-center justify-center hover:border-red-500/30 transition-colors group/btn"
                title="Remove"
              >
                <i className="fa-solid fa-bookmark text-gold-500 group-hover/btn:text-red-400 transition-colors text-[10px]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Browse CTA ──────────────────────────────────────────── */}
      <div className="bg-navy-800 border border-white/5 border-dashed p-8 flex flex-col items-center text-center gap-3">
        <i className="fa-solid fa-books text-slate-600 text-2xl" />
        <p className="text-sm text-white font-medium">Discover more research</p>
        <p className="text-xs text-slate-400">
          Browse the full APRN archive and bookmark papers relevant to your work.
        </p>
        <Link
          href="/research"
          className="mt-2 px-6 py-2.5 bg-gold-500 text-navy-900 text-xs font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors"
        >
          Browse Research Archive
        </Link>
      </div>
    </div>
  );
}
