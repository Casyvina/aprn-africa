const partners = [
  {
    acronym: "NMDPRA",
    name: "Nigerian Midstream & Downstream Petroleum Regulatory Authority",
    role: "Regulatory Partner",
    icon: "fa-shield-halved",
    tier: "primary",
  },
  {
    acronym: "NUPRC",
    name: "Nigerian Upstream Petroleum Regulatory Commission",
    role: "Regulatory Partner",
    icon: "fa-oil-well",
    tier: "primary",
  },
  {
    acronym: "EITEP",
    name: "Energy Institute for Training, Education & Policy",
    role: "Strategic Training Partner",
    icon: "fa-graduation-cap",
    tier: "primary",
  },
  {
    acronym: "AEC",
    name: "African Energy Chamber",
    role: "Continental Advocacy",
    icon: "fa-earth-africa",
    tier: "primary",
  },
  {
    acronym: "ECOWAS",
    name: "Economic Community of West African States",
    role: "Regional Policy Framework",
    icon: "fa-landmark",
    tier: "secondary",
  },
  {
    acronym: "AU–AFREC",
    name: "African Union — African Energy Commission",
    role: "Continental Standards Body",
    icon: "fa-building-columns",
    tier: "secondary",
  },
];

const associatePartners = [
  { name: "University of Lagos", category: "Academia" },
  { name: "University of Pretoria", category: "Academia" },
  { name: "Makerere University", category: "Academia" },
  { name: "TotalEnergies EP", category: "Industry" },
  { name: "Nigerian National Petroleum Company", category: "Industry" },
  { name: "Tanzania Petroleum Development Corp.", category: "Industry" },
];

export default function PartnershipsSection() {
  return (
    <section id="partnerships" className="py-24 bg-navy-800 relative border-t border-navy-700">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 100%, rgba(212, 160, 23, 0.05) 0%, transparent 50%)",
        }}
      />
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16">
          <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold mb-3 block">
            Institutional Network
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            Partners &amp; Affiliates
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">
            APRN operates within a framework of regulatory, academic, and industry partnerships that
            ensure our programmes meet the highest continental standards.
          </p>
        </div>

        {/* Primary partners */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {partners.map((p) => (
            <div
              key={p.acronym}
              className={`glass-panel p-6 rounded-sm border transition-all group hover:border-gold-500/50 ${
                p.tier === "primary" ? "border-navy-700" : "border-navy-800 opacity-80"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-sm bg-gold-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500/20 transition-colors">
                  <i className={`fa-solid ${p.icon} text-gold-500 text-lg`} />
                </div>
                <div>
                  <div className="font-display text-lg font-bold text-white mb-0.5">{p.acronym}</div>
                  <div className="text-xs text-slate-400 leading-snug mb-2">{p.name}</div>
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border border-gold-500/30 text-gold-500 bg-gold-500/5">
                    {p.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Associate partners bar */}
        <div className="glass-panel rounded-sm p-6 border border-navy-700">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold mr-2 shrink-0">
              Academic &amp; Industry Associates:
            </span>
            {associatePartners.map((ap) => (
              <span
                key={ap.name}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs text-slate-300 bg-navy-900 border border-navy-700 rounded-sm"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    ap.category === "Academia" ? "bg-gold-500" : "bg-copper-500"
                  }`}
                />
                {ap.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
