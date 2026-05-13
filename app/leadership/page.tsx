import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const pillars = [
  {
    icon: "fa-compass",
    title: "Engineering & Technical",
    body: "Establishing rigorous standards for material integrity, fluid dynamics, and structural longevity across Africa's diverse terrains and operating environments.",
  },
  {
    icon: "fa-scale-balanced",
    title: "Regulation & Policy",
    body: "Harmonising cross-border legislation and environmental compliance frameworks for transnational pipeline and energy transit projects.",
  },
  {
    icon: "fa-industry",
    title: "Industry Operations",
    body: "Optimising asset lifecycle management, maintenance protocols, and operational safety standards across the midstream sector.",
  },
  {
    icon: "fa-microscope",
    title: "Academia & Research",
    body: "Directing critical research into advanced materials, leak detection, corrosion mitigation, and flow optimisation for African conditions.",
  },
  {
    icon: "fa-users-gear",
    title: "Capacity Building",
    body: "Developing the continent's pipeline workforce through world-class certification programmes and knowledge transfer mechanisms.",
  },
  {
    icon: "fa-landmark",
    title: "Infrastructure Finance",
    body: "Guiding investment frameworks, de-risking project structures, and aligning development finance with infrastructure bankability requirements.",
  },
];

const leadership = [
  {
    name: "Lucy Okeke",
    title: "Founder & President",
    photo: "/images/lucy-okeke.jpg",
    quote: "The next decade of African development relies entirely on the integrity of our physical infrastructure. We are not merely building pipelines — we are constructing the arteries of continental economic sovereignty.",
    stats: [
      { value: "20+", label: "Years Industry Experience" },
      { value: "8", label: "Nations Advised" },
    ],
    bio: "Lucy Okeke is the founding force behind APRN, bringing two decades of experience in oil and gas regulations, energy policy, sustainability, and institutional development across West Africa. She leads APRN's strategic vision and continental partnerships.",
  },
  {
    name: "Joseph Agwuh",
    title: "Director, Applied Engineering and Innovation",
    photo: "/images/joseph-agwuh.png",
    quote: "Applied engineering without applied knowledge transfer is a temporary solution. APRN exists to make Africa's infrastructure expertise permanent, indigenous, and self-sustaining.",
    stats: [
      { value: "15+", label: "Years Engineering Practice" },
      { value: "12+", label: "Technical Programmes Led" },
    ],
    bio: "Joseph Agwuh drives APRN's technical programmes, overseeing research output, engineering curriculum development, and the organisation's applied innovation agenda across the midstream sector.",
  },
];

export default function LeadershipPage() {
  return (
    <>
      <Navigation />
      <main
        className="bg-navy-900 text-white"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="pt-40 pb-32 px-6 lg:px-12 min-h-[90vh] flex flex-col justify-center relative overflow-hidden max-w-[1440px] mx-auto">
          {/* Decorative glow */}
          <div className="absolute top-1/4 left-10 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gold-500/3 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-navy-800/50 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
              <span className="text-xs font-medium tracking-widest text-gold-500 uppercase">Institutional Leadership</span>
            </div>

            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-8 text-white"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Leadership &amp; <br />
              <span className="italic text-gold-500">Strategic</span> Advisory
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
              Guiding Africa&apos;s pipeline engineering and infrastructure future through collaboration,
              research, and technical leadership.
            </p>
          </div>

          {/* Mandate card */}
          <div className="mt-24 max-w-5xl mx-auto w-full">
            <div className="glass-panel p-8 rounded-sm border border-gold-500/20 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h3
                  className="text-2xl mb-3 text-gold-500"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  The Infrastructure Mandate
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  A unified framework connecting engineering excellence with policy regulation to secure
                  continental energy and water networks — led by practitioners who have built, governed,
                  and taught across Africa.
                </p>
              </div>
              <div className="hidden md:block w-px h-24 bg-gold-500/20 flex-shrink-0" />
              <div className="flex-1 grid grid-cols-3 gap-4 text-center">
                {[
                  { value: "42+", label: "Institutional Partners" },
                  { value: "14", label: "Nations Engaged" },
                  { value: "50k km", label: "Infrastructure Mapped" },
                ].map((s) => (
                  <div key={s.label}>
                    <div
                      className="text-2xl font-bold text-gold-500"
                      style={{ fontFamily: "var(--font-oswald), sans-serif" }}
                    >
                      {s.value}
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Leadership Profiles ───────────────────────────────── */}
        {leadership.map((person, i) => (
          <section
            key={person.name}
            className="py-32 px-6 lg:px-12 border-t border-white/10 relative"
          >
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              {/* Portrait — alternate sides */}
              <div className={`lg:col-span-5 relative ${i % 2 === 1 ? "lg:order-last" : ""}`}>
                <div className="absolute inset-0 bg-gold-500/10 translate-x-4 translate-y-4 rounded-sm" />
                <div className="relative rounded-sm overflow-hidden border border-gold-500/30 group">
                  <div className="relative h-[560px] overflow-hidden bg-navy-800">
                    <Image
                      src={person.photo}
                      alt={person.name}
                      fill
                      className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3
                      className="text-2xl font-bold text-white mb-1"
                      style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                      {person.name}
                    </h3>
                    <p className="text-sm text-gold-500 tracking-wider uppercase">{person.title}</p>
                  </div>
                </div>
              </div>

              {/* Biography */}
              <div className="lg:col-span-7">
                <h2
                  className="text-4xl md:text-5xl font-bold mb-8 text-white"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  Strategic{" "}
                  <span className="italic text-gold-500">Vision</span>
                </h2>

                <blockquote className="border-l-2 border-gold-500/50 pl-6 mb-8">
                  <p className="text-lg text-slate-300 font-light leading-relaxed italic">
                    &ldquo;{person.quote}&rdquo;
                  </p>
                </blockquote>

                <p className="text-slate-400 leading-relaxed mb-10 text-sm">{person.bio}</p>

                <div className="grid grid-cols-2 gap-8 border-t border-gold-500/20 pt-8">
                  {person.stats.map((s) => (
                    <div key={s.label}>
                      <span
                        className="block text-3xl font-bold text-gold-500 mb-2"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                      >
                        {s.value}
                      </span>
                      <span className="text-xs uppercase tracking-widest text-slate-500">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* ── Advisory Pillars ──────────────────────────────────── */}
        <section className="py-32 px-6 lg:px-12 border-t border-white/10 bg-navy-800/30">
          <div className="max-w-[1440px] mx-auto">
            <div className="text-center mb-20">
              <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold mb-4 block">
                Governance Structure
              </span>
              <h2
                className="text-4xl md:text-5xl font-bold text-white mb-6"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Advisory{" "}
                <span className="italic text-gold-500">Pillars</span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Comprehensive governance structure designed to address every facet of continental
                infrastructure development and engineering excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pillars.map((p) => (
                <div
                  key={p.title}
                  className="glass-panel rounded-sm p-8 border border-navy-700 hover:border-gold-500/30 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-2xl group-hover:bg-gold-500/10 transition-all" />
                  <i className={`fa-solid ${p.icon} text-gold-500 text-2xl mb-6 block`} />
                  <h3
                    className="text-xl font-bold mb-3 text-white"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    {p.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="py-32 px-6 border-t border-white/10 bg-navy-900 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: "radial-gradient(ellipse at 50% 50%, rgba(212,160,23,0.06) 0%, transparent 70%)",
          }} />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <p className="text-xs tracking-[0.3em] text-gold-500 mb-8 uppercase">Work With APRN</p>
            <blockquote
              className="text-3xl md:text-5xl font-bold leading-tight max-w-4xl mx-auto mb-12 text-white"
              style={{ fontFamily: "var(--font-oswald), sans-serif" }}
            >
              &ldquo;Africa&apos;s infrastructure future requires{" "}
              <span className="text-gold-500">African engineering capacity</span>&rdquo;
            </blockquote>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="mailto:info@aprn-africa.org"
                className="inline-flex items-center justify-center gap-3 border border-gold-500 px-8 py-4 text-sm font-medium tracking-widest uppercase text-gold-500 hover:bg-gold-500 hover:text-navy-900 transition-all"
              >
                Get In Touch <i className="fa-solid fa-arrow-right" />
              </a>
              <a
                href="/partnerships"
                className="inline-flex items-center justify-center gap-3 border border-white/20 px-8 py-4 text-sm font-medium tracking-widest uppercase hover:bg-white hover:text-navy-900 transition-all"
              >
                Partner With APRN <i className="fa-solid fa-arrow-right" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
