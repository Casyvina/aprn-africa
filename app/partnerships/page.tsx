import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const partnerCategories = [
  {
    icon: "fa-industry",
    title: "National Oil Companies",
    desc: "State-owned operators driving continental upstream and midstream development — our foundational institutional partners.",
    count: "14+",
  },
  {
    icon: "fa-hard-hat",
    title: "Engineering Firms",
    desc: "EPC contractors, FEED consultancies, and specialist integrity firms embedded in APRN's technical standards process.",
    count: "28+",
  },
  {
    icon: "fa-university",
    title: "Academic Institutions",
    desc: "Universities and polytechnics co-developing curriculum, hosting research, and producing the next generation of pipeline engineers.",
    count: "12",
  },
  {
    icon: "fa-scale-balanced",
    title: "Regulatory Bodies",
    desc: "National regulators and AU agencies aligning safety codes, environmental standards, and licensing frameworks continentally.",
    count: "9",
  },
  {
    icon: "fa-landmark",
    title: "Financial Institutions",
    desc: "Development finance institutions, infrastructure funds, and multilaterals backing bankable energy transit projects.",
    count: "7",
  },
  {
    icon: "fa-microchip",
    title: "Technology Partners",
    desc: "Instrumentation vendors, digital inspection platforms, and simulation technology providers advancing sector innovation.",
    count: "11",
  },
];

const benefits = [
  {
    icon: "fa-network-wired",
    title: "Continental Network Access",
    body: "Direct engagement with 42+ institutions across 14 AU member states operating in the pipeline and energy transit sector.",
  },
  {
    icon: "fa-file-shield",
    title: "Co-develop Standards",
    body: "Shape the technical frameworks, certification requirements, and safety protocols governing Africa's next generation of infrastructure.",
  },
  {
    icon: "fa-users-gear",
    title: "Talent Pipeline",
    body: "First access to APRN-certified engineers, integrity specialists, and infrastructure managers ready for deployment.",
  },
  {
    icon: "fa-chart-line",
    title: "Intelligence Access",
    body: "Priority access to APRN's research publications, infrastructure GIS data, and policy advisory outputs.",
  },
];

const nodes = [
  { x: 500, y: 80,  label: "National Oil Companies",  icon: "fa-industry",       pos: "top" },
  { x: 830, y: 180, label: "Engineering Firms",        icon: "fa-hard-hat",       pos: "right" },
  { x: 830, y: 430, label: "Financial Institutions",   icon: "fa-landmark",       pos: "right" },
  { x: 500, y: 530, label: "Academic Institutions",    icon: "fa-university",     pos: "bottom" },
  { x: 170, y: 430, label: "Regulatory Bodies",        icon: "fa-scale-balanced", pos: "left" },
  { x: 170, y: 180, label: "Technology Partners",      icon: "fa-microchip",      pos: "left" },
];

export default function PartnershipsPage() {
  return (
    <>
      <Navigation />
      <main className="bg-navy-900 text-white">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative pt-24 min-h-[90vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-pipeline.jpg"
              alt="Pipeline infrastructure"
              fill
              sizes="100vw"
              className="object-cover opacity-30 mix-blend-luminosity"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-900/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 py-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-gold-500/30 mb-6">
                <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                <span className="text-xs font-semibold tracking-widest uppercase text-gold-500">
                  Continental Infrastructure Alliance
                </span>
              </div>

              <h1 className="font-display text-5xl lg:text-7xl font-bold leading-[1.1] mb-6 text-white">
                Building Africa&apos;s <br />
                <span className="text-gradient">Pipeline Ecosystem</span> <br />
                Together
              </h1>

              <p className="text-lg text-slate-300 max-w-2xl leading-relaxed border-l-2 border-gold-500 pl-6 mb-10">
                APRN unites regulators, operators, and academic institutions to standardise engineering
                excellence, ensure integrity, and drive sustainable energy transport across the continent.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="#ecosystem"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold tracking-wide transition-all rounded-sm shadow-[0_0_20px_rgba(212,160,23,0.4)] uppercase text-sm"
                >
                  Explore Partnerships <i className="fa-solid fa-arrow-right" />
                </a>
                <a
                  href="mailto:info@aprn-africa.org"
                  className="inline-flex items-center gap-3 px-8 py-4 glass-panel hover:bg-navy-800 text-white font-bold tracking-wide transition-all rounded-sm border border-navy-700 uppercase text-sm"
                >
                  <i className="fa-regular fa-circle-play text-gold-500" /> View Manifesto
                </a>
              </div>
            </div>

            {/* Right card */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="glass-panel p-8 rounded-sm border border-gold-500/30 shadow-[0_0_30px_rgba(212,160,23,0.1)] translate-y-8">
                <div className="relative w-full h-64 overflow-hidden rounded-sm mb-6">
                  <Image
                    src="/images/engineers-group.png"
                    alt="Engineering Collaboration"
                    fill
                    sizes="(max-width: 1280px) 40vw, 600px"
                    className="object-cover opacity-80 mix-blend-luminosity"
                  />
                </div>
                <h3 className="font-display text-xl font-bold mb-2 text-white">
                  Strategic Framework 2025
                </h3>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                  Aligning 14 nations under unified technical standards for cross-border pipeline integrity.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-navy-900/60 p-4 rounded-sm border border-navy-700">
                    <div className="font-display text-2xl font-bold text-gold-500 mb-1">42+</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Institutional Partners</div>
                  </div>
                  <div className="bg-navy-900/60 p-4 rounded-sm border border-navy-700">
                    <div className="font-display text-2xl font-bold text-gold-500 mb-1">12,000km</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Network Coverage</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </section>

        {/* ── Ecosystem Node Map ────────────────────────────────── */}
        <section id="ecosystem" className="py-24 bg-navy-800 border-t border-navy-700">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold mb-4 block">
                The Connectivity Matrix
              </span>
              <h2 className="font-display text-4xl font-bold text-white mb-6">
                A Centralised Hub for Sector Synergy
              </h2>
              <p className="text-slate-400 leading-relaxed">
                APRN sits at the nexus of the African energy transport sector, ensuring seamless knowledge
                transfer, regulatory alignment, and operational excellence across all critical nodes.
              </p>
            </div>

            {/* SVG node map */}
            <div className="relative h-[580px] w-full glass-panel rounded-sm overflow-hidden border border-navy-700">
              {/* Grid background */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(29,64,91,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(29,64,91,0.2) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 1000 580"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Concentric rings */}
                <circle cx="500" cy="305" r="140" fill="none" stroke="rgba(29,64,91,0.6)" strokeWidth="1" />
                <circle cx="500" cy="305" r="240" fill="none" stroke="rgba(29,64,91,0.35)" strokeWidth="1" />

                {/* Connector lines */}
                {nodes.map((n) => (
                  <line
                    key={n.label}
                    x1="500" y1="305"
                    x2={n.x} y2={n.y}
                    stroke="rgba(212,160,23,0.3)"
                    strokeWidth="1.5"
                    strokeDasharray="6 4"
                  />
                ))}

                {/* Node circles */}
                {nodes.map((n) => (
                  <g key={n.label}>
                    <circle cx={n.x} cy={n.y} r="36" fill="rgba(13,36,54,0.9)" stroke="rgba(212,160,23,0.4)" strokeWidth="1.5" />
                    <circle cx={n.x} cy={n.y} r="28" fill="rgba(7,27,42,0.8)" stroke="rgba(212,160,23,0.15)" strokeWidth="1" />
                  </g>
                ))}

                {/* Center node */}
                <circle cx="500" cy="305" r="58" fill="rgba(7,27,42,0.95)" stroke="rgba(212,160,23,0.8)" strokeWidth="2" />
                <circle cx="500" cy="305" r="48" fill="rgba(13,36,54,0.9)" stroke="rgba(212,160,23,0.3)" strokeWidth="1" />
              </svg>

              {/* Center label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center z-10" style={{ marginTop: "10px" }}>
                  <div className="w-16 h-16 rounded-full bg-gold-500/10 border-2 border-gold-500 flex items-center justify-center mx-auto mb-2 shadow-[0_0_20px_rgba(212,160,23,0.4)]">
                    <i className="fa-solid fa-network-wired text-gold-500 text-xl" />
                  </div>
                  <span className="text-xs font-bold text-gold-500 uppercase tracking-widest block">APRN</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Hub</span>
                </div>
              </div>

              {/* Node labels — absolutely positioned */}
              {/* Top */}
              <div className="absolute text-center" style={{ left: "50%", top: "4%", transform: "translateX(-50%)" }}>
                <i className="fa-solid fa-industry text-gold-500 text-sm block mb-1" />
                <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold whitespace-nowrap">National Oil Cos.</span>
              </div>
              {/* Top-right */}
              <div className="absolute text-center" style={{ left: "74%", top: "19%", transform: "translateX(-50%)" }}>
                <i className="fa-solid fa-hard-hat text-gold-500 text-sm block mb-1" />
                <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold whitespace-nowrap">Engineering Firms</span>
              </div>
              {/* Bottom-right */}
              <div className="absolute text-center" style={{ left: "74%", top: "65%", transform: "translateX(-50%)" }}>
                <i className="fa-solid fa-landmark text-gold-500 text-sm block mb-1" />
                <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold whitespace-nowrap">Financial Institutions</span>
              </div>
              {/* Bottom */}
              <div className="absolute text-center" style={{ left: "50%", top: "85%", transform: "translateX(-50%)" }}>
                <i className="fa-solid fa-university text-gold-500 text-sm block mb-1" />
                <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold whitespace-nowrap">Academic Institutions</span>
              </div>
              {/* Bottom-left */}
              <div className="absolute text-center" style={{ left: "26%", top: "65%", transform: "translateX(-50%)" }}>
                <i className="fa-solid fa-scale-balanced text-gold-500 text-sm block mb-1" />
                <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold whitespace-nowrap">Regulatory Bodies</span>
              </div>
              {/* Top-left */}
              <div className="absolute text-center" style={{ left: "26%", top: "19%", transform: "translateX(-50%)" }}>
                <i className="fa-solid fa-microchip text-gold-500 text-sm block mb-1" />
                <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold whitespace-nowrap">Technology Partners</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Partner Categories ────────────────────────────────── */}
        <section className="py-24 bg-navy-900 border-t border-navy-800">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold mb-4 block">
                  Partner Ecosystem
                </span>
                <h2 className="font-display text-4xl lg:text-5xl font-bold text-white">
                  Who We Work With
                </h2>
              </div>
              <p className="text-slate-500 max-w-md text-sm text-right leading-relaxed">
                Six distinct partner classes, each playing a critical role in APRN&apos;s continental mandate.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partnerCategories.map((p) => (
                <div
                  key={p.title}
                  className="glass-panel p-8 border border-navy-700 hover:border-gold-500/40 transition-all group relative overflow-hidden rounded-sm"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-gold-500/15 transition-all" />
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-sm bg-navy-900 border border-navy-700 flex items-center justify-center text-gold-500 text-2xl group-hover:border-gold-500/40 transition-colors">
                      <i className={`fa-solid ${p.icon}`} />
                    </div>
                    <span className="font-display text-3xl font-bold text-white/20 group-hover:text-gold-500/30 transition-colors">
                      {p.count}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold mb-3 text-white">{p.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Partner ───────────────────────────────────────── */}
        <section className="py-24 bg-navy-800 border-t border-navy-700">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold mb-4 block">
                Partnership Benefits
              </span>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-6">
                Why Partner With APRN
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Access the continent&apos;s most influential network for pipeline engineering, policy, and
                infrastructure intelligence.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="bg-navy-900 border border-navy-700 p-8 hover:border-gold-500/40 transition-colors"
                >
                  <div className="w-12 h-12 rounded-sm bg-gold-500/10 flex items-center justify-center text-gold-500 mb-6">
                    <i className={`fa-solid ${b.icon} text-xl`} />
                  </div>
                  <h3 className="font-display text-lg font-bold mb-3 text-white">{b.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{b.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="py-32 bg-navy-900 border-t border-navy-800 relative overflow-hidden">
          <div className="absolute inset-0">
            <div
              style={{ backgroundImage: "url('/images/pipeline-aerial.png')" }}
              className="w-full h-full bg-cover bg-center opacity-10 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/80 to-transparent" />
          </div>
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <p className="text-xs tracking-[0.3em] text-gold-500 mb-6 uppercase">Join the Alliance</p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Africa&apos;s infrastructure future depends on{" "}
              <span className="text-gradient">African engineering capability</span>
            </h2>
            <p className="text-slate-400 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
              Join APRN in building the definitive institutional platform for the continent&apos;s energy
              and pipeline sectors.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:info@aprn-africa.org"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold tracking-wide transition-all rounded-sm shadow-[0_0_20px_rgba(212,160,23,0.3)] uppercase text-sm"
              >
                Become a Partner <i className="fa-solid fa-arrow-right" />
              </a>
              <a
                href="/about"
                className="inline-flex items-center gap-3 px-8 py-4 glass-panel hover:bg-navy-800 text-white font-semibold tracking-wide transition-all rounded-sm border border-white/10 uppercase text-sm"
              >
                Learn About APRN
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
