const pillars = [
  {
    icon: "fa-microscope",
    title: "Pipeline Research",
    description:
      "Advanced studies on material science, flow dynamics, and corrosion prevention tailored to African environments.",
  },
  {
    icon: "fa-hard-hat",
    title: "Engineering Training",
    description:
      "Internationally aligned certification programs building local capacity in design, construction, and maintenance.",
  },
  {
    icon: "fa-users-gear",
    title: "Women in Pipeline",
    description:
      "Dedicated initiatives to increase female representation in technical and leadership roles across the midstream sector.",
  },
  {
    icon: "fa-database",
    title: "African Pipeline Database",
    description:
      "The continent's most comprehensive GIS mapping and technical repository of existing and planned infrastructure.",
  },
  {
    icon: "fa-scale-balanced",
    title: "Policy & Regulation",
    description:
      "Advising governments and regulatory bodies on harmonized cross-border pipeline frameworks and tariffs.",
  },
  {
    icon: "fa-earth-africa",
    title: "Continental Collaboration",
    description:
      "Facilitating joint ventures and knowledge transfer between African NOCs and international operators.",
  },
];

export default function PillarsSection() {
  return (
    <section id="pillars" className="py-24 bg-navy-800 relative">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(212, 160, 23, 0.05) 0%, transparent 70%)",
        }}
      />
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16">
          <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold mb-3 block">
            Strategic Focus
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">Our Core Pillars</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="glass-panel p-8 rounded-sm hover:border-gold-500/50 transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <i
                className={`fa-solid ${pillar.icon} text-3xl text-gold-500 mb-6 group-hover:scale-110 transition-transform block`}
              />
              <h3 className="text-xl font-bold text-white mb-3 font-display">{pillar.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
