import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { sanityFetch } from "@/lib/sanity/fetch";
import { TRAINING_PROGRAMS_QUERY, type TrainingProgramCard } from "@/lib/queries/training";

export const metadata = {
  title: "Programs & Initiatives | APRN Africa",
  description:
    "APRN's institutional programmes — engineering development, research, technical training, policy engagement, and industry collaboration across Africa.",
};

const corePrograms = [
  {
    title: "Pipeline Engineering Excellence",
    href: "/training",
    desc: "Technical capacity building for pipeline design, operations, and maintenance across Africa.",
  },
  {
    title: "Infrastructure Research & Analytics",
    href: "/research",
    desc: "Data-driven research on continental pipeline infrastructure, investment flows, and corridor development.",
  },
  {
    title: "Asset Integrity & Safety",
    href: "/training",
    desc: "Corrosion control, inspection protocols, risk management, and emergency response training.",
  },
  {
    title: "Women in Pipeline Engineering",
    href: "/about",
    desc: "Dedicated initiative to increase representation and leadership of women in Africa's pipeline sector.",
  },
  {
    title: "Youth Technical Development",
    href: "/training",
    desc: "Entry pathways for graduates entering the pipeline sector through structured fundamentals programmes.",
  },
  {
    title: "Policy & Regulatory Frameworks",
    href: "/research",
    desc: "Engaging governments and regulators to align African pipeline standards with international best practice.",
  },
];

const deliverySteps = [
  {
    step: "01",
    title: "Research & Analysis",
    desc: "Identifying critical infrastructure gaps and technical requirements across the continent.",
  },
  {
    step: "02",
    title: "Curriculum Design",
    desc: "Developing industry-aligned technical training modules with partner institutions.",
  },
  {
    step: "03",
    title: "Practical Execution",
    desc: "Hands-on simulation, field deployment training, and in-country delivery.",
  },
  {
    step: "04",
    title: "Global Certification",
    desc: "Standardised assessment, professional credentialing, and alumni support.",
  },
];

const objectives = [
  { label: "Technical Certifications", pct: 85 },
  { label: "Policy Implementation", pct: 62 },
  { label: "Industry Partnerships", pct: 94 },
];

const regionalData = [
  { region: "West", pct: 45 },
  { region: "East", pct: 25 },
  { region: "South", pct: 20 },
  { region: "North", pct: 10 },
];

const growthPoints = [100, 120, 150, 180, 220, 280];
const growthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const maxGrowth = Math.max(...growthPoints);

function GrowthSparkline() {
  const w = 280;
  const h = 100;
  const pts = growthPoints.map((v, i) => {
    const x = (i / (growthPoints.length - 1)) * w;
    const y = h - (v / maxGrowth) * h * 0.9;
    return `${x},${y}`;
  });
  const polyline = pts.join(" ");
  const fillPath = `M0,${h} L${pts.join(" L")} L${w},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="growth-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4A017" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#D4A017" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill="url(#growth-fill)" />
      <polyline points={polyline} fill="none" stroke="#D4A017" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export default async function ProgramsPage() {
  let programs: TrainingProgramCard[] = [];
  try {
    const fetched = await sanityFetch<TrainingProgramCard[]>(TRAINING_PROGRAMS_QUERY, {}, ["trainingProgram"]);
    if (fetched?.length) programs = fetched;
  } catch { /* show nothing if Sanity unavailable */ }

  return (
    <>
      <Navigation />
      <main className="bg-navy-900 text-white">

        {/* Hero */}
        <section className="relative pt-40 pb-24 min-h-[520px] flex items-center border-b border-gold-500/20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div
              style={{ backgroundImage: "url('/images/hero-pipeline.jpg')" }}
              className="w-full h-full bg-cover bg-center opacity-25 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-navy-900/70" />
            <div className="absolute inset-0 bg-linear-to-r from-navy-900 via-navy-900/80 to-transparent" />
          </div>
          <div className="relative z-20 max-w-360 mx-auto px-6 lg:px-12 w-full">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-px bg-gold-500" />
                <span className="text-gold-500 text-xs tracking-[0.2em] uppercase font-semibold">
                  Institutional Mandate
                </span>
              </div>
              <h1
                className="text-5xl md:text-7xl leading-tight mb-8 text-white"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Programs &amp; Strategic Initiatives
              </h1>
              <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
                Building Africa's pipeline capability through engineering development, research,
                technical training, policy engagement, and industry collaboration.
              </p>
            </div>
          </div>
        </section>

        {/* Core Programs — editorial list */}
        <section className="py-24 bg-navy-900">
          <div className="max-w-360 mx-auto px-6 lg:px-12">
            <div className="flex justify-between items-end mb-16 pb-6 border-b border-gold-500/20">
              <h2
                className="text-4xl text-white"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Core Programs
              </h2>
              <Link
                href="/training"
                className="text-gold-500 text-sm tracking-widest uppercase hover:text-white transition-colors flex items-center gap-2"
              >
                View Training <i className="fa-solid fa-arrow-right text-xs" />
              </Link>
            </div>

            <div className="flex flex-col">
              {corePrograms.map((p) => (
                <Link
                  key={p.title}
                  href={p.href}
                  className="group flex items-center justify-between py-8 border-b border-gold-500/10 hover:bg-navy-800 transition-colors px-4 -mx-4"
                >
                  <div className="flex-1 min-w-0 pr-8">
                    <h3
                      className="text-2xl text-white group-hover:text-gold-500 transition-colors mb-1"
                      style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                      {p.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed hidden sm:block">{p.desc}</p>
                  </div>
                  <i className="fa-solid fa-arrow-right text-gold-500 opacity-0 group-hover:opacity-100 -translate-x-3 group-hover:translate-x-0 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Flagship Initiative — Africa Pipeline Academy */}
        <section className="py-24 bg-navy-800 border-y border-gold-500/20">
          <div className="max-w-360 mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-5 flex flex-col justify-center">
                <div className="inline-block border border-gold-500/30 px-4 py-1 text-gold-500 text-xs tracking-widest uppercase mb-8 w-max">
                  Flagship Initiative
                </div>
                <h2
                  className="text-4xl md:text-5xl mb-6 text-white leading-tight"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  Africa Pipeline Academy (APA)
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-10">
                  A world-class institutional hub dedicated to elevating the technical proficiency of
                  pipeline engineers across the continent. The academy integrates advanced simulation
                  labs, international certification protocols, and rigorous practical training.
                </p>

                <div className="grid grid-cols-2 gap-8 mb-10">
                  <div>
                    <div
                      className="text-3xl text-gold-500 mb-2"
                      style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                      15k+
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider">Engineers Trained</div>
                  </div>
                  <div>
                    <div
                      className="text-3xl text-gold-500 mb-2"
                      style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                      24
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider">Partner Universities</div>
                  </div>
                </div>

                <Link
                  href="/training"
                  className="inline-block bg-gold-500 hover:bg-gold-400 text-navy-900 px-8 py-3 text-xs tracking-wider font-bold uppercase transition-colors w-max"
                >
                  Discover the Academy
                </Link>
              </div>

              {/* Right: image + stats panel */}
              <div className="lg:col-span-7">
                <div className="h-[500px] border border-gold-500/20 relative overflow-hidden group bg-navy-900">
                  <div
                    style={{ backgroundImage: "url('/images/female-engineer-training.png')" }}
                    className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-70 transition-all duration-700 mix-blend-luminosity"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-navy-900 via-navy-900/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex gap-6">
                      {[
                        { label: "Countries Active", value: "32" },
                        { label: "Graduates", value: "15k+" },
                        { label: "Avg. Pass Rate", value: "91%" },
                      ].map((s) => (
                        <div key={s.label} className="bg-navy-900/80 border border-gold-500/20 px-4 py-3">
                          <p
                            className="text-gold-500 text-xl font-bold"
                            style={{ fontFamily: "var(--font-playfair), serif" }}
                          >
                            {s.value}
                          </p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Intelligence */}
        <section className="py-24 bg-navy-900">
          <div className="max-w-360 mx-auto px-6 lg:px-12">
            <div className="flex justify-between items-end mb-16 pb-6 border-b border-gold-500/20">
              <h2
                className="text-4xl text-white"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Impact Intelligence
              </h2>
              <span className="text-gold-500 text-xs tracking-widest uppercase">2026 Metrics</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Workforce Growth */}
              <div className="bg-navy-800 border border-gold-500/20 p-8 flex flex-col h-80">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Workforce Growth</div>
                <div
                  className="text-3xl text-white mb-4"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  +42.8% <span className="text-sm text-gold-500 ml-1">YTD</span>
                </div>
                <div className="flex-1 relative">
                  <GrowthSparkline />
                </div>
                <div className="flex justify-between mt-3">
                  {growthLabels.map((l) => (
                    <span key={l} className="text-[9px] text-slate-600 uppercase">{l}</span>
                  ))}
                </div>
              </div>

              {/* Regional Distribution */}
              <div className="bg-navy-800 border border-gold-500/20 p-8 flex flex-col h-80">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Certification Distribution</div>
                <div
                  className="text-2xl text-white mb-6"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  Regional Spread
                </div>
                <div className="flex-1 flex items-end gap-4">
                  {regionalData.map((r) => (
                    <div key={r.region} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-xs text-gold-500 font-bold">{r.pct}%</span>
                      <div
                        className="w-full bg-linear-to-t from-gold-500 to-gold-400/60"
                        style={{ height: `${(r.pct / 45) * 120}px` }}
                      />
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider">{r.region}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Objectives */}
              <div className="bg-navy-800 border border-gold-500/20 p-8 flex flex-col h-80">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-8">Key Objectives 2026</div>
                <div className="space-y-7 flex-1">
                  {objectives.map((o) => (
                    <div key={o.label}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white text-xs">{o.label}</span>
                        <span className="text-gold-500 font-mono text-xs">{o.pct}%</span>
                      </div>
                      <div className="h-px w-full bg-navy-900 border border-gold-500/10 relative">
                        <div
                          className="h-full bg-gold-500 absolute top-0 left-0"
                          style={{ width: `${o.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Active Programs from Sanity */}
        {programs.length > 0 && (
          <section className="py-24 bg-navy-800 border-t border-navy-700">
            <div className="max-w-360 mx-auto px-6 lg:px-12">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                <div>
                  <span className="text-gold-500 uppercase tracking-widest text-xs font-semibold mb-3 block">
                    Now Enrolling
                  </span>
                  <h2
                    className="text-3xl lg:text-4xl font-bold text-white"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    Active Programmes
                  </h2>
                </div>
                <Link
                  href="/training"
                  className="text-gold-500 text-xs tracking-widest uppercase hover:underline flex items-center gap-2"
                >
                  All Training <i className="fa-solid fa-arrow-right" />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {programs.map((p) => (
                  <div
                    key={p._id}
                    className="glass-panel p-7 border border-navy-700 hover:border-gold-500/40 transition-all group flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gold-500 px-2.5 py-1 border border-gold-500/30 bg-gold-500/5">
                        {p.level.charAt(0).toUpperCase() + p.level.slice(1)}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                        {p.programType}{p.durationWeeks ? ` · ${p.durationWeeks} wks` : ""}
                      </span>
                    </div>
                    <h3
                      className="text-xl font-bold text-white group-hover:text-gold-500 transition-colors leading-snug"
                      style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                      {p.name}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed flex-1">{p.description}</p>
                    <Link
                      href="/contact"
                      className="text-gold-500 text-xs font-bold flex items-center gap-2 group-hover:gap-3 transition-all mt-1 uppercase tracking-widest"
                    >
                      Apply or Enquire <i className="fa-solid fa-arrow-right text-[10px]" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Program Delivery Model */}
        <section className="py-24 bg-navy-800 border-t border-gold-500/20">
          <div className="max-w-360 mx-auto px-6 lg:px-12">
            <h2
              className="text-4xl text-white mb-16 text-center"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Technical Delivery Model
            </h2>

            <div className="relative max-w-5xl mx-auto">
              <div className="hidden md:block absolute top-14 left-0 w-full h-px bg-gold-500/20 z-0" />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                {deliverySteps.map((s) => (
                  <div
                    key={s.step}
                    className="bg-navy-900 border border-gold-500/30 p-8 text-center hover:border-gold-500 transition-colors"
                  >
                    <div className="w-12 h-12 border border-gold-500 flex items-center justify-center mx-auto mb-6 bg-navy-800">
                      <span
                        className="text-gold-500 text-lg"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                      >
                        {s.step}
                      </span>
                    </div>
                    <h4
                      className="text-lg text-white mb-3"
                      style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                      {s.title}
                    </h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 bg-navy-900 border-t border-gold-500/20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div
              style={{ backgroundImage: "url('/images/pipeline-aerial.png')" }}
              className="w-full h-full bg-cover bg-center mix-blend-luminosity opacity-20"
            />
            <div className="absolute inset-0 bg-linear-to-t from-navy-900 via-navy-900/50 to-transparent" />
          </div>
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <h2
              className="text-4xl md:text-6xl text-white mb-8 max-w-4xl mx-auto leading-tight"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              &ldquo;Africa&apos;s infrastructure future depends on{" "}
              <span className="text-gradient">African engineering capability.</span>&rdquo;
            </h2>
            <p className="text-gold-500 tracking-[0.2em] uppercase text-xs mb-12">Institutional Directive</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="inline-block bg-gold-500 hover:bg-gold-400 text-navy-900 px-8 py-4 text-xs tracking-widest font-bold uppercase transition-all"
              >
                Join the Network
              </Link>
              <Link
                href="/about"
                className="inline-block border border-gold-500 text-gold-500 hover:bg-gold-500/10 px-8 py-4 text-xs tracking-widest font-bold uppercase transition-all"
              >
                Partner With Us
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
