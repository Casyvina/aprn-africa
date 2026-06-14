import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { sanityFetch } from "@/lib/sanity/fetch";
import { TRAINING_PROGRAMS_QUERY, type TrainingProgramCard } from "@/lib/queries/training";

const PROGRAM_TYPE_LABEL: Record<string, string> = {
  certification: "Certification",
  fellowship: "Fellowship",
  "short-course": "Short Course",
  workshop: "Workshop",
};

const LEVEL_COLOR: Record<string, string> = {
  entry: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
  professional: "text-gold-500 border-gold-500/30 bg-gold-500/5",
  executive: "text-copper-500 border-copper-500/30 bg-copper-500/5",
};

const tracks = [
  {
    icon: "fa-graduation-cap",
    title: "Entry-Level Fundamentals",
    desc: "Foundational knowledge for recent graduates entering the pipeline sector — covering design principles, material science, and field safety.",
  },
  {
    icon: "fa-certificate",
    title: "Professional Certification",
    desc: "Advanced technical modules aligned with international engineering standards for mid-career practitioners seeking formal accreditation.",
  },
  {
    icon: "fa-shield-virus",
    title: "Pipeline Integrity & Safety",
    desc: "Specialised training in corrosion control, in-line inspection, risk assessment, and emergency response protocols.",
  },
  {
    icon: "fa-map",
    title: "Project Management",
    desc: "End-to-end lifecycle management for large-scale infrastructure — scheduling, procurement, stakeholder engagement, and regulatory compliance.",
  },
  {
    icon: "fa-scale-balanced",
    title: "Policy & Regulation",
    desc: "Understanding continental and national frameworks: AU Energy Policy, ECOWAS Protocols, and domesticating international pipeline standards.",
  },
  {
    icon: "fa-bolt",
    title: "Energy Transition Readiness",
    desc: "Preparing pipeline professionals for hydrogen transport, CCS infrastructure, and the technical demands of Africa's low-carbon transition.",
  },
];

const stats = [
  { value: "40%", label: "Projected deficit in skilled pipeline engineers by 2030" },
  { value: "$50B+", label: "Planned infrastructure investments requiring local expertise" },
  { value: "72%", label: "Senior roles currently filled by non-African talent" },
  { value: "12", label: "AU member states with no domestically certified standards body" },
];

export default async function TrainingPage() {
  let programs: TrainingProgramCard[] = [];
  try {
    const fetched = await sanityFetch<TrainingProgramCard[]>(TRAINING_PROGRAMS_QUERY, {}, ["trainingProgram"]);
    if (fetched?.length) programs = fetched;
  } catch { /* show nothing if Sanity unavailable */ }

  return (
    <>
      <Navigation />
      <main className="bg-navy-900 text-white">

        {/* -- Hero ----------------------------------------------- */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 min-h-[90vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-pipeline.jpg"
              alt="Pipeline infrastructure"
              fill
              sizes="100vw"
              className="object-cover opacity-30 mix-blend-luminosity"
              priority
            />
            <div className="absolute inset-0 bg-navy-900/80" />
            <div className="absolute inset-0 bg-linear-to-t from-navy-900 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-linear-to-r from-navy-900 via-navy-900/80 to-transparent" />
          </div>

          <div className="max-w-360 mx-auto px-6 lg:px-12 relative z-20 grid lg:grid-cols-12 gap-12 items-center w-full">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/30 bg-gold-500/10 mb-6">
                <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                <span className="text-xs font-semibold text-gold-500 uppercase tracking-widest">
                  World-Class Engineering Academy
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] mb-6 text-white">
                Developing Africa&apos;s <br />
                <span className="text-gradient">Pipeline Workforce</span>
              </h1>

              <p className="text-lg lg:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
                Building the next generation of technical leaders, integrity engineers, and
                infrastructure specialists to power the continent&apos;s energy future.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#tracks"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold tracking-wide transition-all rounded-sm shadow-[0_0_20px_rgba(212,160,23,0.2)]"
                >
                  Explore Programs <i className="fa-solid fa-arrow-right text-sm" />
                </a>
                <a
                  href="/about"
                  className="inline-flex items-center gap-2 px-8 py-4 glass-panel hover:bg-navy-800 text-white font-semibold tracking-wide transition-all rounded-sm border border-white/10"
                >
                  Partner With APRN
                </a>
              </div>
            </div>

            {/* Floating metrics card */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-linear-to-br from-gold-500/20 to-transparent rounded-full blur-3xl" />
                <div className="glass-panel rounded-sm p-6 relative z-10 border border-navy-700 hover:border-gold-500/40 transition-all duration-500 rotate-2 hover:rotate-0">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-navy-700">
                    <span className="text-sm font-semibold text-slate-300 uppercase tracking-widest">
                      Academy Metrics
                    </span>
                    <i className="fa-solid fa-chart-line text-gold-500" />
                  </div>

                  <div className="space-y-5">
                    {[
                      { label: "Engineering Capacity", pct: "85%" },
                      { label: "Field Readiness", pct: "92%" },
                      { label: "Certification Pass Rate", pct: "78%" },
                    ].map((m) => (
                      <div key={m.label}>
                        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                          <span>{m.label}</span>
                          <span className="text-gold-500 font-mono">{m.pct}</span>
                        </div>
                        <div className="h-1.5 w-full bg-navy-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-gold-500 to-copper-500 rounded-full"
                            style={{ width: m.pct }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 rounded-sm bg-navy-900 border border-navy-700 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-sm bg-gold-500/10 flex items-center justify-center text-gold-500 shrink-0">
                      <i className="fa-solid fa-shield-halved text-xl" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">Industry Certified</div>
                      <div className="text-slate-400 text-xs">Internationally Aligned Standards</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* -- Why Training Matters ------------------------------- */}
        <section className="py-24 bg-navy-900 border-t border-navy-800">
          <div className="max-w-360 mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold mb-4 block">
                  The Imperative
                </span>
                <h2 className="font-display text-3xl lg:text-4xl font-bold mb-6 text-white">
                  Why Training Matters Now
                </h2>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  Africa is undergoing massive infrastructure expansion, yet faces a critical shortage
                  of specialised engineering talent. An ageing workforce and rapid technological shifts
                  demand immediate, high-calibre capacity development.
                </p>
                <div className="grid grid-cols-2 gap-5">
                  {stats.map((s) => (
                    <div
                      key={s.value}
                      className="glass-panel p-5 rounded-sm border border-navy-700 hover:border-gold-500/40 transition-colors"
                    >
                      <div className="font-display text-3xl font-bold text-gold-500 mb-2">{s.value}</div>
                      <p className="text-xs text-slate-400 leading-relaxed">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gold-500/5 rounded-sm transform -rotate-2" />
                <Image
                  src="/images/female-engineer-training.png"
                  alt="Female engineer in training"
                  width={900}
                  height={600}
                  className="relative rounded-sm border border-navy-700 object-cover h-105 w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* -- Training Tracks ------------------------------------ */}
        <section id="tracks" className="py-24 bg-navy-800 border-t border-navy-700">
          <div className="max-w-360 mx-auto px-6 lg:px-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold mb-4 block">
                Curriculum
              </span>
              <h2 className="font-display text-3xl lg:text-5xl font-bold mb-6 text-white">
                Comprehensive Training Tracks
              </h2>
              <p className="text-slate-400 text-lg">
                Specialised programmes designed to build competency at every stage of the pipeline
                lifecycle.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tracks.map((t) => (
                <div
                  key={t.title}
                  className="glass-panel rounded-sm p-8 border border-navy-700 hover:border-gold-500/40 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-gold-500/15 transition-all" />
                  <div className="w-14 h-14 rounded-sm bg-navy-900 border border-navy-700 flex items-center justify-center text-gold-500 mb-6 text-2xl group-hover:border-gold-500/40 transition-colors">
                    <i className={`fa-solid ${t.icon}`} />
                  </div>
                  <h3 className="font-display text-lg font-bold mb-3 text-white">{t.title}</h3>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">{t.desc}</p>
                  <span className="text-gold-500 text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                    View Curriculum <i className="fa-solid fa-arrow-right text-xs" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* -- Certification Pathway ----------------------------- */}
        <section className="py-24 bg-navy-900 border-t border-navy-800">
          <div className="max-w-360 mx-auto px-6 lg:px-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold mb-4 block">
                Your Journey
              </span>
              <h2 className="font-display text-3xl lg:text-5xl font-bold mb-6 text-white">
                A Clear Path to Certification
              </h2>
              <p className="text-slate-400 text-lg">
                From graduate entry to executive leadership — every stage of your career has a structured programme.
              </p>
            </div>

            <div className="relative">
              {/* Connector line */}
              <div className="hidden lg:block absolute top-14 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold-500/30 to-transparent" />

              <div className="grid lg:grid-cols-3 gap-8">
                {[
                  {
                    level: "01",
                    title: "Entry Level",
                    subtitle: "Fundamentals Track",
                    icon: "fa-seedling",
                    color: "text-emerald-400",
                    border: "border-emerald-400/30",
                    bg: "bg-emerald-400/5",
                    modules: ["Pipeline Design Principles", "Material Science Basics", "Field Safety Protocols", "QHSE Fundamentals"],
                    outcome: "APRN Entry Certificate",
                    audience: "Recent graduates, career switchers",
                  },
                  {
                    level: "02",
                    title: "Professional",
                    subtitle: "Certification Track",
                    icon: "fa-certificate",
                    color: "text-gold-500",
                    border: "border-gold-500/30",
                    bg: "bg-gold-500/5",
                    modules: ["Integrity Management Systems", "Corrosion Engineering", "Risk Assessment & Modelling", "Regulatory Compliance"],
                    outcome: "APRN Professional Certificate",
                    audience: "Mid-career engineers (3–10 yrs)",
                  },
                  {
                    level: "03",
                    title: "Executive",
                    subtitle: "Leadership Track",
                    icon: "fa-crown",
                    color: "text-copper-500",
                    border: "border-copper-500/30",
                    bg: "bg-copper-500/5",
                    modules: ["Infrastructure Financing", "Cross-Border Policy Frameworks", "Project Portfolio Leadership", "Stakeholder & Board Engagement"],
                    outcome: "APRN Executive Fellowship",
                    audience: "Senior engineers, directors",
                  },
                ].map((tier) => (
                  <div
                    key={tier.level}
                    className={`glass-panel rounded-sm border ${tier.border} p-8 flex flex-col gap-5 hover:border-opacity-60 transition-all`}
                  >
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-sm ${tier.bg} border ${tier.border} flex items-center justify-center shrink-0`}>
                        <i className={`fa-solid ${tier.icon} ${tier.color} text-lg`} />
                      </div>
                      <span className={`text-3xl font-bold ${tier.color} opacity-20 font-display`}>{tier.level}</span>
                    </div>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-widest ${tier.color} mb-1`}>{tier.subtitle}</p>
                      <h3 className="font-display text-xl font-bold text-white">{tier.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{tier.audience}</p>
                    </div>
                    <ul className="space-y-2">
                      {tier.modules.map((m) => (
                        <li key={m} className="flex items-start gap-2 text-sm text-slate-400">
                          <i className="fa-solid fa-check text-[9px] mt-1 text-gold-500 shrink-0" />
                          {m}
                        </li>
                      ))}
                    </ul>
                    <div className={`mt-auto pt-4 border-t ${tier.border}`}>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Credential</p>
                      <p className={`text-sm font-semibold ${tier.color}`}>{tier.outcome}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* -- APConnect Platform --------------------------------- */}
        <section className="py-24 bg-navy-800 border-t border-navy-700">
          <div className="max-w-360 mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                  <span className="text-xs font-bold text-gold-500 uppercase tracking-widest">Now Live</span>
                </div>
                <h2 className="font-display text-3xl lg:text-4xl font-bold mb-6 text-white">
                  APConnect™ — Africa&apos;s Pipeline Learning Platform
                </h2>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  Structured online courses, video modules, and assessments — all built specifically for Africa&apos;s pipeline and energy sector. Learn at your own pace, earn credentials, and track progress in your dashboard.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { icon: "fa-play-circle",     label: "Video modules",        value: "Self-paced" },
                    { icon: "fa-check-circle",     label: "Structured assessments", value: "Graded" },
                    { icon: "fa-certificate",      label: "On completion",        value: "Certificate" },
                    { icon: "fa-mobile-screen",    label: "Access",               value: "Any device" },
                  ].map((f) => (
                    <div key={f.label} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-sm bg-navy-900 border border-navy-700 flex items-center justify-center shrink-0 mt-0.5">
                        <i className={`fa-solid ${f.icon} text-gold-500 text-xs`} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{f.value}</p>
                        <p className="text-[10px] text-slate-500">{f.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold text-sm tracking-wide transition-all rounded-sm"
                  >
                    Join & Start Learning <i className="fa-solid fa-arrow-right text-xs" />
                  </Link>
                  <Link
                    href="/dashboard/courses"
                    className="inline-flex items-center gap-2 px-6 py-3 glass-panel border border-white/10 hover:border-white/20 text-white font-semibold text-sm transition-all rounded-sm"
                  >
                    Browse Courses
                  </Link>
                </div>
              </div>

              {/* Platform feature card */}
              <div className="glass-panel rounded-sm border border-navy-700 p-6 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-navy-700">
                  <div>
                    <p className="text-sm font-bold text-white">APConnect™</p>
                    <p className="text-xs text-slate-500">Pipeline Learning Platform</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest px-2 py-1 bg-emerald-400/10 border border-emerald-400/20 rounded-full">
                    Live
                  </span>
                </div>
                {[
                  { title: "Pipeline Integrity Management", level: "Professional", pct: 68, modules: 12 },
                  { title: "Corrosion Engineering Fundamentals", level: "Entry", pct: 45, modules: 8 },
                  { title: "African Pipeline Policy & Regulation", level: "Professional", pct: 20, modules: 10 },
                  { title: "Energy Transition for Engineers", level: "Executive", pct: 0, modules: 6 },
                ].map((course) => (
                  <div key={course.title} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-white truncate pr-2">{course.title}</p>
                      <span className="text-[9px] text-slate-500 shrink-0">{course.modules} modules</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-navy-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-gold-500 to-copper-500 rounded-full transition-all"
                          style={{ width: course.pct > 0 ? `${course.pct}%` : "3px" }}
                        />
                      </div>
                      <span className="text-[9px] text-slate-600 w-8 text-right">
                        {course.pct > 0 ? `${course.pct}%` : "New"}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t border-navy-700 flex items-center justify-between">
                  <p className="text-[10px] text-slate-500">4 courses available · More coming soon</p>
                  <Link href="/dashboard/courses" className="text-[10px] font-bold text-gold-500 hover:text-gold-400 transition-colors uppercase tracking-widest">
                    Open →
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* -- Active Programs ------------------------------------ */}
        {programs.length > 0 && (
          <section className="py-24 bg-navy-900 border-t border-navy-800">
            <div className="max-w-360 mx-auto px-6 lg:px-12">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                <div>
                  <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold mb-3 block">Now Enrolling</span>
                  <h2 className="font-display text-3xl lg:text-4xl font-bold text-white">APRN Programs</h2>
                </div>
                <Link href="/contact" className="text-gold-500 text-sm tracking-widest uppercase hover:underline flex items-center gap-2">
                  Apply Now <i className="fa-solid fa-arrow-right" />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {programs.map((p) => (
                  <div key={p._id} className="glass-panel rounded-sm p-8 border border-navy-700 hover:border-gold-500/40 transition-all group flex flex-col gap-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${LEVEL_COLOR[p.level] ?? LEVEL_COLOR.professional}`}>
                        {p.level.charAt(0).toUpperCase() + p.level.slice(1)}
                      </span>
                      <span className="text-xs text-slate-500 uppercase tracking-widest">
                        {PROGRAM_TYPE_LABEL[p.programType] ?? p.programType}
                        {p.durationWeeks ? ` · ${p.durationWeeks} weeks` : ""}
                      </span>
                      {p.featured && (
                        <span className="ml-auto text-[10px] font-bold text-gold-500 uppercase tracking-widest px-2 py-0.5 border border-gold-500/30 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-xl font-bold text-white group-hover:text-gold-500 transition-colors leading-snug">{p.name}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed flex-1">{p.description}</p>
                    <Link href="/contact" className="text-gold-500 text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all mt-2">
                      Apply or Enquire <i className="fa-solid fa-arrow-right text-xs" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* -- Member access callout ----------------------------- */}
        <section className="py-6 bg-navy-900 border-t border-navy-800">
          <div className="max-w-360 mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              <i className="fa-solid fa-lock-open text-gold-500 mr-1.5" />
              Already an APRN member? Structured online courses with progress tracking are available in your dashboard.
            </p>
            <Link
              href="/dashboard/courses"
              className="shrink-0 text-xs font-bold tracking-widest uppercase text-gold-500 hover:text-gold-400 transition-colors flex items-center gap-1.5"
            >
              Open Training Dashboard <i className="fa-solid fa-arrow-right text-[10px]" />
            </Link>
          </div>
        </section>

        {/* -- CTA ------------------------------------------------ */}
        <section className="py-24 bg-navy-900 border-t border-navy-800 relative overflow-hidden">
          <div className="absolute inset-0">
            <div
              style={{ backgroundImage: "url('/images/pipeline-aerial.png')" }}
              className="w-full h-full bg-cover bg-center opacity-10 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-linear-to-t from-navy-900 via-navy-900/80 to-transparent" />
          </div>
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <h2 className="font-display text-3xl lg:text-5xl font-bold mb-6 text-white leading-tight">
              Africa&apos;s infrastructure future depends on{" "}
              <span className="text-gradient">African engineering capability</span>
            </h2>
            <p className="text-slate-400 mb-10 max-w-2xl mx-auto text-lg">
              Join APRN in building the definitive workforce platform for the continent&apos;s energy
              and pipeline sectors.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4">
              <a
                href="#tracks"
                className="inline-block px-8 py-4 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold tracking-wide transition-all rounded-sm shadow-[0_0_20px_rgba(212,160,23,0.2)]"
              >
                Explore Programs
              </a>
              <a
                href="/about"
                className="inline-block px-8 py-4 glass-panel hover:bg-navy-800 text-white font-semibold tracking-wide transition-all rounded-sm border border-white/10"
              >
                Partner With APRN
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
