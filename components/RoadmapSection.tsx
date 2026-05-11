const milestones = [
  {
    year: "2026",
    color: "bg-gold-500",
    textColor: "text-navy-900",
    borderColor: "border-gold-500",
    sideColor: "border-gold-500",
    title: "Phase I Expansion",
    description:
      "Launch of the centralized continental database and opening of two new regional training hubs.",
    tag: "Target: 500 new certified engineers.",
    tagSide: "right" as const,
  },
  {
    year: "2028",
    color: "bg-copper-500",
    textColor: "text-navy-900",
    borderColor: "border-copper-500",
    sideColor: "border-copper-500",
    title: "Policy Harmonization",
    description:
      "Implementation of unified cross-border tariff structures and safety standards across ECOWAS and SADC.",
    tag: "Target: Policy adoption in 10 nations.",
    tagSide: "left" as const,
  },
  {
    year: "2030",
    color: "bg-navy-700",
    textColor: "text-gold-500",
    borderColor: "border-gold-500",
    sideColor: "border-gold-500",
    title: "Full Integration",
    description:
      "APRN positioned as the leading certification partner for major continental midstream projects across all AU member states.",
    tag: "Target: 100% data coverage.",
    tagSide: "right" as const,
  },
];

export default function RoadmapSection() {
  return (
    <section id="roadmap" className="py-24 bg-navy-800">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-16 text-center">
          Development Roadmap <span className="text-gold-500">2026–2030</span>
        </h2>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-0.5 bg-navy-700 transform md:-translate-x-1/2" />

          <div className="space-y-12">
            {milestones.map((m) => (
              <div
                key={m.year}
                className="relative flex flex-col md:flex-row items-start md:items-center justify-between group"
              >
                {/* Left column */}
                {m.tagSide === "right" ? (
                  <div className="md:w-5/12 text-left md:text-right order-2 md:order-1 pl-16 md:pl-0 pr-0 md:pr-12">
                    <h4 className="text-xl font-bold text-white mb-2">{m.title}</h4>
                    <p className="text-sm text-slate-400">{m.description}</p>
                  </div>
                ) : (
                  <div className="md:w-5/12 order-3 md:order-1 pl-16 md:pl-12 hidden md:block text-right">
                    <div className={`glass-panel p-4 text-xs text-slate-300 border-r-2 ${m.sideColor} inline-block`}>
                      {m.tag}
                    </div>
                  </div>
                )}

                {/* Year bubble */}
                <div
                  className={`absolute left-0 md:left-1/2 w-14 h-14 rounded-full border-4 border-navy-800 ${m.color} flex items-center justify-center transform md:-translate-x-1/2 z-10 shadow-[0_0_15px_rgba(212,160,23,0.4)]`}
                >
                  <span className={`${m.textColor} font-bold text-sm`}>{m.year}</span>
                </div>

                {/* Right column */}
                {m.tagSide === "right" ? (
                  <div className="md:w-5/12 order-3 pl-16 md:pl-12 hidden md:block">
                    <div className={`glass-panel p-4 text-xs text-slate-300 border-l-2 ${m.sideColor}`}>
                      {m.tag}
                    </div>
                  </div>
                ) : (
                  <div className="md:w-5/12 text-left order-2 md:order-3 pl-16 md:pl-12">
                    <h4 className="text-xl font-bold text-white mb-2">{m.title}</h4>
                    <p className="text-sm text-slate-400">{m.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
