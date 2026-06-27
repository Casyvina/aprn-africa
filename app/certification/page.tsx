import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { sanityFetch } from "@/lib/sanity/fetch";
import { TRAINING_PROGRAMS_QUERY, type TrainingProgramCard } from "@/lib/queries/training";

export const metadata = {
  title: "Professional Certification | APRN Africa",
  description:
    "Earn internationally recognised credentials in pipeline engineering through APRN's structured certification pathways — from Entry to Executive level.",
};

const benefits = [
  {
    icon: "fa-globe",
    title: "International Recognition",
    desc: "APRN credentials are aligned with global pipeline engineering standards and recognised by industry bodies across Africa and beyond.",
  },
  {
    icon: "fa-chart-line",
    title: "Career Advancement",
    desc: "Certified engineers earn an average of 34% more and are 2× more likely to advance into senior roles within five years.",
  },
  {
    icon: "fa-users",
    title: "Professional Network",
    desc: "Join a community of over 15,000 certified pipeline professionals across 32 African countries.",
  },
  {
    icon: "fa-shield-halved",
    title: "Industry Credibility",
    desc: "Stand out to employers, regulators, and project owners with a credential that verifies your technical competence.",
  },
];

const tiers = [
  {
    level: "01",
    name: "APRN Entry Certificate",
    track: "Fundamentals Track",
    icon: "fa-seedling",
    color: "text-emerald-400",
    border: "border-emerald-400/30",
    bg: "bg-emerald-400/5",
    audience: "Recent graduates · Career switchers",
    duration: "3–6 months",
    modules: [
      "Pipeline Design Principles",
      "Material Science Basics",
      "Field Safety Protocols",
      "QHSE Fundamentals",
    ],
    requirements: [
      "Bachelor's degree in Engineering or related field",
      "Completed APRN Fundamentals coursework",
      "Online assessment + practical test",
    ],
  },
  {
    level: "02",
    name: "APRN Professional Certificate",
    track: "Professional Track",
    icon: "fa-certificate",
    color: "text-gold-500",
    border: "border-gold-500/30",
    bg: "bg-gold-500/5",
    audience: "Mid-career engineers · 3–10 yrs experience",
    duration: "6–12 months",
    modules: [
      "Integrity Management Systems",
      "Corrosion Engineering",
      "Risk Assessment & Modelling",
      "Regulatory Compliance",
    ],
    requirements: [
      "APRN Entry Certificate or 3+ years field experience",
      "Completed Professional Track modules",
      "Portfolio review + technical interview",
    ],
  },
  {
    level: "03",
    name: "APRN Executive Fellowship",
    track: "Leadership Track",
    icon: "fa-crown",
    color: "text-copper-500",
    border: "border-copper-500/30",
    bg: "bg-copper-500/5",
    audience: "Senior engineers · Directors · C-suite",
    duration: "12–18 months",
    modules: [
      "Infrastructure Financing",
      "Cross-Border Policy Frameworks",
      "Project Portfolio Leadership",
      "Stakeholder & Board Engagement",
    ],
    requirements: [
      "APRN Professional Certificate or 10+ years experience",
      "Sponsorship from current employer",
      "Capstone project + panel review",
    ],
  },
];

const processSteps = [
  {
    step: "01",
    title: "Submit Application",
    desc: "Complete the online application form. We assess your background and recommend the right certification level.",
    icon: "fa-file-lines",
  },
  {
    step: "02",
    title: "Enrol in Programme",
    desc: "Join your cohort, access structured online modules, and work with industry mentors throughout your study period.",
    icon: "fa-graduation-cap",
  },
  {
    step: "03",
    title: "Assessment",
    desc: "Complete written assessments, practical exercises, and a portfolio submission reviewed by APRN examiners.",
    icon: "fa-clipboard-check",
  },
  {
    step: "04",
    title: "Earn Your Credential",
    desc: "Receive your digitally verified APRN certificate and join the official APRN certified professional registry.",
    icon: "fa-award",
  },
];

export default async function CertificationPage() {
  let programs: TrainingProgramCard[] = [];
  try {
    const fetched = await sanityFetch<TrainingProgramCard[]>(TRAINING_PROGRAMS_QUERY, {}, ["trainingProgram"]);
    if (fetched?.length) {
      programs = fetched.filter(
        (p) => p.programType === "certification" || p.programType === "fellowship"
      );
    }
  } catch { /* show nothing if Sanity unavailable */ }

  return (
    <>
      <Navigation />
      <main className="bg-navy-900 text-white">

        {/* Hero */}
        <section className="relative pt-40 pb-28 min-h-[520px] flex items-center border-b border-gold-500/20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div
              style={{ backgroundImage: "url('/images/hero-pipeline.jpg')" }}
              className="w-full h-full bg-cover bg-center opacity-20 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-navy-900/75" />
            <div className="absolute inset-0 bg-linear-to-r from-navy-900 via-navy-900/80 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-navy-900 via-transparent to-transparent" />
          </div>

          <div className="relative z-20 max-w-360 mx-auto px-6 lg:px-12 w-full">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-gold-500/30 bg-gold-500/5 mb-8">
                <i className="fa-solid fa-certificate text-gold-500 text-xs" />
                <span className="text-xs font-bold text-gold-500 uppercase tracking-widest">
                  Professional Certification
                </span>
              </div>
              <h1
                className="text-5xl md:text-7xl leading-tight mb-8 text-white"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                APRN Professional<br />
                <span className="text-gradient">Certification</span>
              </h1>
              <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mb-10">
                Internationally recognised credentials for Africa's pipeline engineers — from graduate
                entry through to executive leadership.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold text-xs tracking-widest uppercase transition-all"
                >
                  Apply Now <i className="fa-solid fa-arrow-right text-xs" />
                </Link>
                <a
                  href="#tiers"
                  className="inline-flex items-center gap-2 px-8 py-4 glass-panel border border-white/10 hover:border-white/20 text-white font-semibold text-xs tracking-widest uppercase transition-all"
                >
                  View Pathways
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Why Certify */}
        <section className="py-24 bg-navy-900 border-b border-navy-800">
          <div className="max-w-360 mx-auto px-6 lg:px-12">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-gold-500 uppercase tracking-widest text-xs font-semibold mb-4 block">
                Why It Matters
              </span>
              <h2
                className="text-3xl lg:text-4xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                The Value of APRN Certification
              </h2>
              <p className="text-slate-400 text-lg">
                A credential that proves competence, opens doors, and connects you to Africa's leading
                pipeline engineering community.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="bg-navy-800 border border-white/5 p-7 hover:border-gold-500/20 transition-colors group flex flex-col gap-4"
                >
                  <div className="w-10 h-10 bg-navy-900 border border-white/5 flex items-center justify-center group-hover:border-gold-500/30 transition-colors shrink-0">
                    <i className={`fa-solid ${b.icon} text-gold-500 text-sm`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-2">{b.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certification Tiers */}
        <section id="tiers" className="py-24 bg-navy-800 border-b border-navy-700">
          <div className="max-w-360 mx-auto px-6 lg:px-12">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-gold-500 uppercase tracking-widest text-xs font-semibold mb-4 block">
                Certification Pathways
              </span>
              <h2
                className="text-3xl lg:text-5xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Three Levels, One Trajectory
              </h2>
              <p className="text-slate-400 text-lg">
                Every stage of your engineering career has a structured APRN credential.
              </p>
            </div>

            <div className="relative">
              <div className="hidden lg:block absolute top-14 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold-500/20 to-transparent" />

              <div className="grid lg:grid-cols-3 gap-8">
                {tiers.map((tier) => (
                  <div
                    key={tier.level}
                    className={`glass-panel border ${tier.border} p-8 flex flex-col gap-5`}
                  >
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 ${tier.bg} border ${tier.border} flex items-center justify-center shrink-0`}>
                        <i className={`fa-solid ${tier.icon} ${tier.color} text-lg`} />
                      </div>
                      <span
                        className={`text-3xl font-bold ${tier.color} opacity-20`}
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                      >
                        {tier.level}
                      </span>
                    </div>

                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${tier.color} mb-1`}>
                        {tier.track}
                      </p>
                      <h3
                        className="text-lg font-bold text-white leading-snug"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                      >
                        {tier.name}
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-1">{tier.audience}</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Modules</p>
                      <ul className="space-y-1.5">
                        {tier.modules.map((m) => (
                          <li key={m} className="flex items-start gap-2 text-xs text-slate-400">
                            <i className="fa-solid fa-check text-[9px] mt-0.5 text-gold-500 shrink-0" />
                            {m}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className={`border-t ${tier.border} pt-4`}>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Requirements</p>
                      <ul className="space-y-1.5">
                        {tier.requirements.map((r) => (
                          <li key={r} className="flex items-start gap-2 text-[10px] text-slate-500">
                            <i className={`fa-solid fa-circle text-[5px] mt-1.5 ${tier.color} shrink-0`} />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className={`mt-auto pt-4 border-t ${tier.border} flex items-center justify-between`}>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Duration</p>
                        <p className={`text-sm font-semibold ${tier.color} mt-0.5`}>{tier.duration}</p>
                      </div>
                      <Link
                        href="/contact"
                        className={`text-[10px] font-bold uppercase tracking-widest ${tier.color} hover:opacity-80 transition-opacity flex items-center gap-1`}
                      >
                        Apply <i className="fa-solid fa-arrow-right text-[8px]" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Active certification programmes from Sanity */}
        {programs.length > 0 && (
          <section className="py-24 bg-navy-900 border-b border-navy-800">
            <div className="max-w-360 mx-auto px-6 lg:px-12">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                <div>
                  <span className="text-gold-500 uppercase tracking-widest text-xs font-semibold mb-3 block">
                    Open for Enrolment
                  </span>
                  <h2
                    className="text-3xl lg:text-4xl font-bold text-white"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    Current Cohorts
                  </h2>
                </div>
                <Link
                  href="/contact"
                  className="text-gold-500 text-xs tracking-widest uppercase hover:underline flex items-center gap-2"
                >
                  Request Info <i className="fa-solid fa-arrow-right" />
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
                      {p.durationWeeks && (
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                          {p.durationWeeks} weeks
                        </span>
                      )}
                      {p.featured && (
                        <span className="ml-auto text-[9px] font-bold text-emerald-400 uppercase tracking-widest px-2 py-0.5 border border-emerald-400/20 bg-emerald-400/5">
                          Open
                        </span>
                      )}
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
                      className="text-gold-500 text-xs font-bold flex items-center gap-2 group-hover:gap-3 transition-all uppercase tracking-widest"
                    >
                      Apply for This Cohort <i className="fa-solid fa-arrow-right text-[10px]" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Application Process */}
        <section className="py-24 bg-navy-800 border-b border-navy-700">
          <div className="max-w-360 mx-auto px-6 lg:px-12">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-gold-500 uppercase tracking-widest text-xs font-semibold mb-4 block">
                How It Works
              </span>
              <h2
                className="text-3xl lg:text-4xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                The Certification Process
              </h2>
              <p className="text-slate-400">
                From application to credential — a clear, structured path with support at every stage.
              </p>
            </div>

            <div className="relative max-w-5xl mx-auto">
              <div className="hidden md:block absolute top-10 left-0 w-full h-px bg-gold-500/15 z-0" />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                {processSteps.map((s) => (
                  <div key={s.step} className="flex flex-col items-center text-center gap-4">
                    <div className="w-20 h-20 bg-navy-900 border border-gold-500/30 flex flex-col items-center justify-center gap-1 hover:border-gold-500 transition-colors">
                      <i className={`fa-solid ${s.icon} text-gold-500 text-lg`} />
                      <span className="text-[9px] font-bold text-gold-500/50 tracking-widest">{s.step}</span>
                    </div>
                    <h4
                      className="text-sm font-bold text-white"
                      style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                      {s.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ strip */}
        <section className="py-16 bg-navy-900 border-b border-navy-800">
          <div className="max-w-360 mx-auto px-6 lg:px-12">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  q: "Can I certify without a degree?",
                  a: "Yes — the Professional and Executive tracks accept field experience in lieu of formal qualifications. Each application is reviewed on merit.",
                },
                {
                  q: "Is the certification internationally recognised?",
                  a: "APRN credentials are aligned with ASME, API, and ISO pipeline engineering standards. We are pursuing mutual recognition agreements with partner institutions in Europe and the US.",
                },
                {
                  q: "How much does it cost?",
                  a: "Certification fees vary by level and cohort. Contact us for current pricing. Corporate and institutional sponsors can enrol multiple engineers at a reduced rate.",
                },
              ].map((faq) => (
                <div key={faq.q} className="bg-navy-800 border border-white/5 p-7 hover:border-gold-500/20 transition-colors">
                  <h4 className="text-sm font-bold text-white mb-3">{faq.q}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-28 bg-navy-900 relative overflow-hidden">
          <div className="absolute inset-0">
            <div
              style={{ backgroundImage: "url('/images/pipeline-aerial.png')" }}
              className="w-full h-full bg-cover bg-center opacity-10 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-linear-to-t from-navy-900 via-navy-900/60 to-transparent" />
          </div>
          <div className="max-w-3xl mx-auto px-6 relative z-10 text-center">
            <h2
              className="text-3xl lg:text-5xl font-bold mb-6 text-white leading-tight"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Your credential, your continent.
            </h2>
            <p className="text-slate-400 mb-10 text-lg max-w-xl mx-auto">
              Apply for APRN certification and join the community building Africa&apos;s pipeline infrastructure.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-block bg-gold-500 hover:bg-gold-400 text-navy-900 px-10 py-4 text-xs tracking-widest font-bold uppercase transition-all shadow-[0_0_20px_rgba(212,160,23,0.2)]"
              >
                Apply for Certification
              </Link>
              <Link
                href="/training"
                className="inline-block glass-panel border border-white/10 hover:border-white/20 text-white px-10 py-4 text-xs tracking-widest font-bold uppercase transition-all"
              >
                View Training First
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
