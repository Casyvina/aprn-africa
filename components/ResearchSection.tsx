const featured = {
  category: "Research Brief",
  date: "April 2026",
  title: "Local Content Compliance in West African Midstream Projects: A Regulatory Gap Analysis",
  summary:
    "A structured review of local content enforcement mechanisms across ECOWAS member states, identifying critical discrepancies between policy mandates and on-ground implementation in five major pipeline corridors.",
  tags: ["Local Content", "ECOWAS", "Regulatory Analysis"],
  readTime: "14 min read",
};

const publications = [
  {
    category: "Industry Report",
    date: "March 2026",
    title: "Nigeria–Morocco Gas Pipeline: Engineering Readiness Assessment",
    summary:
      "Technical review of NMGP corridor feasibility across 13 nations, covering pressure ratings, terrain variance, and cross-border handoff protocols.",
    tags: ["NMGP", "West Africa"],
    icon: "fa-file-chart-column",
  },
  {
    category: "Regulatory Update",
    date: "February 2026",
    title: "NMDPRA Tariff Framework Revisions — 2026 Midstream Edition",
    summary:
      "Summary of new capacity charge structures and third-party access obligations under updated Nigerian downstream regulations.",
    tags: ["Nigeria", "NMDPRA", "Tariffs"],
    icon: "fa-gavel",
  },
  {
    category: "Infrastructure Analysis",
    date: "January 2026",
    title: "East African Crude Oil Pipeline: Progress & Risk Register",
    summary:
      "Six-month status update on EACOP construction milestones, financing status, and community engagement benchmarks across Uganda and Tanzania.",
    tags: ["EACOP", "East Africa"],
    icon: "fa-route",
  },
  {
    category: "Research Brief",
    date: "December 2025",
    title: "Skills Gap Quantification: Midstream Africa 2025–2030",
    summary:
      "Modelling of certified pipeline engineer supply vs. projected demand across the continent's 22 active pipeline development corridors.",
    tags: ["Skills Gap", "Workforce"],
    icon: "fa-microscope",
  },
];

const categoryColors: Record<string, string> = {
  "Research Brief": "text-gold-500 border-gold-500/30 bg-gold-500/5",
  "Industry Report": "text-copper-500 border-copper-500/30 bg-copper-500/5",
  "Regulatory Update": "text-blue-400 border-blue-400/30 bg-blue-400/5",
  "Infrastructure Analysis": "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
};

export default function ResearchSection() {
  return (
    <section id="research" className="py-24 bg-navy-900 border-t border-navy-800 relative">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-14 gap-6">
          <div>
            <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold mb-3 block">
              Intelligence Hub
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Research &amp; Intelligence
            </h2>
            <p className="text-slate-400 mt-3 max-w-lg">
              Authoritative analysis on African pipeline infrastructure, regulatory developments, and
              workforce intelligence — accessible to all network members.
            </p>
          </div>
          <button className="shrink-0 px-5 py-2.5 text-sm font-semibold text-gold-500 border border-gold-500/40 hover:bg-gold-500/10 transition-colors rounded-sm whitespace-nowrap">
            View Full Library <i className="fa-solid fa-arrow-right ml-2" />
          </button>
        </div>

        {/* Featured + grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Featured card */}
          <div className="lg:col-span-2 glass-panel rounded-sm p-8 border-l-4 border-gold-500 flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryColors[featured.category]}`}
              >
                {featured.category}
              </span>
              <span className="text-xs text-slate-500">{featured.date}</span>
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-4 leading-snug">
              {featured.title}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">{featured.summary}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {featured.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2.5 py-1 bg-navy-800 text-slate-400 rounded-sm border border-navy-700"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-navy-700 pt-5">
              <span className="text-xs text-slate-500">
                <i className="fa-regular fa-clock mr-1.5" />
                {featured.readTime}
              </span>
              <button className="text-sm text-gold-500 font-semibold hover:underline">
                Read Brief <i className="fa-solid fa-arrow-right ml-1" />
              </button>
            </div>
          </div>

          {/* Publication cards */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {publications.map((pub) => (
              <div
                key={pub.title}
                className="glass-panel rounded-sm p-5 border border-navy-700 hover:border-gold-500/40 transition-all group flex flex-col"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${categoryColors[pub.category]}`}
                  >
                    {pub.category}
                  </span>
                  <span className="text-[10px] text-slate-500 ml-auto">{pub.date}</span>
                </div>
                <div className="flex gap-3 mb-3">
                  <div className="w-8 h-8 rounded-sm bg-navy-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className={`fa-solid ${pub.icon} text-gold-500 text-sm`} />
                  </div>
                  <h4 className="font-display text-sm font-bold text-white leading-snug">{pub.title}</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4 flex-1">{pub.summary}</p>
                <div className="flex flex-wrap gap-1.5">
                  {pub.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 bg-navy-800 text-slate-400 rounded-sm border border-navy-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
