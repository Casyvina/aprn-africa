const stats = [
  {
    value: "$180B",
    label: "Pipeline investment projected across Africa by 2030",
    icon: "fa-chart-line",
  },
  {
    value: "72%",
    label: "Of senior pipeline engineering roles currently filled by non-African talent",
    icon: "fa-users",
  },
  {
    value: "15+",
    label: "Continental infrastructure projects stalled due to local skills deficit",
    icon: "fa-triangle-exclamation",
  },
  {
    value: "12",
    label: "AU member states with no domestically certified pipeline standards body",
    icon: "fa-file-circle-xmark",
  },
];

export default function WhyNowSection() {
  return (
    <section id="why-now" className="py-24 bg-navy-900 relative border-t border-navy-800">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 80% 50%, rgba(201, 122, 43, 0.07) 0%, transparent 60%)",
        }}
      />
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — editorial intro */}
          <div>
            <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold mb-4 block">
              The Urgency
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Why Africa Needs This{" "}
              <span className="text-gold-500">Institution Now.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Africa is entering its most consequential energy decade. Billions in infrastructure
              capital are flowing — yet the continent risks repeating the colonial-era pattern of
              building assets without building the people to own, operate, and govern them.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              APRN exists to close that gap permanently: through world-class engineering certification,
              policy frameworks grounded in African realities, and a living intelligence network that
              keeps practitioners, regulators, and investors aligned.
            </p>
            <div className="inline-flex items-center gap-3 px-5 py-3 glass-panel rounded-sm border-l-4 border-gold-500">
              <i className="fa-solid fa-quote-left text-gold-500 text-xl" />
              <span className="text-sm text-slate-300 italic">
                &ldquo;Local content requirements without local capacity is policy fiction.&rdquo;
              </span>
            </div>
          </div>

          {/* Right — stat grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {stats.map((s) => (
              <div
                key={s.label}
                className="glass-panel p-6 rounded-sm border border-navy-700 hover:border-gold-500/40 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-sm bg-gold-500/10 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-gold-500/20 transition-colors">
                    <i className={`fa-solid ${s.icon} text-gold-500`} />
                  </div>
                  <div>
                    <div className="font-display text-3xl font-bold text-white mb-2">{s.value}</div>
                    <p className="text-xs text-slate-400 leading-relaxed">{s.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
