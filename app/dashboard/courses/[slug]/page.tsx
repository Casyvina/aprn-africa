import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/lib/sanity/fetch";
import { PortableTextRenderer } from "@/components/PortableTextRenderer";
import {
  TRAINING_PROGRAM_BY_SLUG_QUERY,
  TRAINING_PROGRAM_SLUGS_QUERY,
  type TrainingProgramDetail,
} from "@/lib/queries/training";

export const revalidate = 60;
export const dynamicParams = true;

const LEVEL_COLOR: Record<string, string> = {
  foundation:   "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
  intermediate: "text-gold-500 border-gold-500/30 bg-gold-500/5",
  advanced:     "text-blue-400 border-blue-400/30 bg-blue-400/5",
  professional: "text-purple-400 border-purple-400/30 bg-purple-400/5",
  executive:    "text-copper-500 border-copper-500/30 bg-copper-500/5",
};

const TYPE_LABEL: Record<string, string> = {
  "certification":     "Professional Certification",
  "fellowship":        "Fellowship",
  "workshop":          "Workshop",
  "short-course":      "Short Course",
  "executive-program": "Executive Program",
  "apprenticeship":    "Apprenticeship",
};

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const slugs = await sanityFetch<Array<{ slug: string }>>(TRAINING_PROGRAM_SLUGS_QUERY);
    return (slugs ?? []).filter((s) => Boolean(s.slug)).map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = await sanityFetch<Pick<TrainingProgramDetail, "title"> | null>(
    TRAINING_PROGRAM_BY_SLUG_QUERY,
    { slug },
    ["training"],
  );
  if (!program) return {};
  return { title: `${program.title} | APRN Training` };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const program = await sanityFetch<TrainingProgramDetail | null>(
    TRAINING_PROGRAM_BY_SLUG_QUERY,
    { slug },
    ["training"],
  );

  if (!program) notFound();

  const levelKey = program.level?.toLowerCase() ?? "";
  const levelLabel = program.level
    ? program.level.charAt(0).toUpperCase() + program.level.slice(1)
    : null;

  return (
    <div className="flex flex-col gap-8 max-w-275">

      {/* ── Breadcrumb ───────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/dashboard/courses" className="hover:text-gold-500 transition-colors">Training Catalogue</Link>
        <i className="fa-solid fa-chevron-right text-[8px]" />
        <span className="text-slate-400">{program.programCode ?? program.title}</span>
      </div>

      {/* ── Course header ────────────────────────────────────────── */}
      <div className="bg-navy-800 border border-white/5 p-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {program.programCode && (
              <span className="px-2 py-0.5 bg-navy-900 border border-white/5 text-[9px] font-bold tracking-widest text-gold-500 uppercase">
                {program.programCode}
              </span>
            )}
            {levelLabel && (
              <span className={`px-2 py-0.5 border text-[9px] font-bold tracking-widest uppercase ${LEVEL_COLOR[levelKey] ?? "text-slate-400 border-white/10"}`}>
                {levelLabel}
              </span>
            )}
            {program.programType && (
              <span className="px-2 py-0.5 bg-navy-900 border border-white/5 text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                {TYPE_LABEL[program.programType] ?? program.programType}
              </span>
            )}
          </div>
          <h1
            className="text-2xl md:text-3xl font-bold text-white mb-4 leading-snug"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            {program.title}
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">{program.description}</p>

          {/* Quick meta */}
          <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-white/5">
            {[
              program.durationWeeks
                ? { icon: "fa-clock",       label: "Duration", value: `${program.durationWeeks} weeks` }
                : null,
              program.effortPerWeek
                ? { icon: "fa-bolt",        label: "Effort",   value: program.effortPerWeek }
                : null,
              program.moduleCount
                ? { icon: "fa-layer-group", label: "Modules",  value: `${program.moduleCount} modules` }
                : null,
              program.deliveryMode
                ? { icon: "fa-laptop",      label: "Delivery", value: program.deliveryMode.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) }
                : null,
            ].filter(Boolean).map((m) => m && (
              <div key={m.label} className="flex items-center gap-2">
                <i className={`fa-solid ${m.icon} text-gold-500 text-[10px] w-3`} />
                <div>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest">{m.label}</p>
                  <p className="text-xs text-white font-medium">{m.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enrol card */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-navy-900 border border-white/5 p-6 flex flex-col gap-4">
            <div className="text-center pb-4 border-b border-white/5">
              <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Access Level Required</p>
              <p
                className="text-lg font-bold text-gold-500"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Professional
              </p>
              <p className="text-[10px] text-slate-400 mt-1">or Institutional membership</p>
            </div>
            {program.applicationUrl ? (
              <a
                href={program.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 text-center text-xs font-bold tracking-widest uppercase text-navy-900 bg-gold-500 hover:bg-gold-400 transition-colors block"
              >
                Apply Now
              </a>
            ) : (
              <Link
                href="/dashboard/membership"
                className="w-full py-3 text-center text-xs font-bold tracking-widest uppercase text-navy-900 bg-gold-500 hover:bg-gold-400 transition-colors block"
              >
                Upgrade to Enrol
              </Link>
            )}
            {program.applicationDeadline && (
              <p className="text-[10px] text-slate-500 text-center">
                Deadline: {new Date(program.applicationDeadline).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            )}
            {!program.applicationDeadline && (
              <p className="text-[10px] text-slate-500 text-center">
                Full access to all modules, assessments, and certification upon enrolment.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Two-column content ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main — outcomes, curriculum, audience */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Learning outcomes */}
          {program.learningOutcomes && program.learningOutcomes.length > 0 && (
            <div className="bg-navy-800 border border-white/5 p-6">
              <h3
                className="text-base font-bold text-white mb-4 flex items-center gap-2"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                <i className="fa-solid fa-bullseye text-gold-500 text-sm" />
                Learning Outcomes
              </h3>
              <ul className="flex flex-col gap-3">
                {program.learningOutcomes.map((o, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-slate-400 leading-relaxed">
                    <i className="fa-solid fa-check text-gold-500 text-[10px] mt-0.5 shrink-0" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Curriculum */}
          {program.curriculum && (
            <div className="bg-navy-800 border border-white/5 p-6">
              <h3
                className="text-base font-bold text-white mb-5 flex items-center gap-2"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                <i className="fa-solid fa-list-check text-gold-500 text-sm" />
                Curriculum
              </h3>
              <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-headings:font-semibold prose-p:text-slate-400 prose-li:text-slate-400">
                <PortableTextRenderer value={program.curriculum} />
              </div>
            </div>
          )}

          {/* Who should attend */}
          {program.targetAudience && program.targetAudience.length > 0 && (
            <div className="bg-navy-800 border border-white/5 p-6">
              <h3
                className="text-base font-bold text-white mb-4 flex items-center gap-2"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                <i className="fa-solid fa-user-check text-gold-500 text-sm" />
                Who Should Attend
              </h3>
              <ul className="flex flex-col gap-2.5">
                {program.targetAudience.map((a, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-slate-400 leading-relaxed">
                    <i className="fa-solid fa-arrow-right text-gold-500 text-[10px] mt-0.5 shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">

          {/* Instructors */}
          {program.instructors && program.instructors.length > 0 && (
            <div className="bg-navy-800 border border-white/5 p-6">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 pb-3 border-b border-white/5">
                {program.instructors.length === 1 ? "Lead Instructor" : "Instructors"}
              </h3>
              <div className="flex flex-col gap-5">
                {program.instructors.map((inst) => (
                  <div key={inst._id}>
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-10 h-10 bg-gold-500/20 border border-gold-500/30 flex items-center justify-center shrink-0 overflow-hidden">
                        {inst.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={inst.photoUrl} alt={inst.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-bold text-gold-500">
                            {inst.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{inst.name}</p>
                        <p className="text-[10px] text-slate-500 leading-snug mt-0.5">
                          {[inst.title, inst.organization].filter(Boolean).join(" — ")}
                        </p>
                      </div>
                    </div>
                    {inst.bio && (
                      <p className="text-xs text-slate-400 leading-relaxed">{inst.bio}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related programs */}
          {program.relatedPrograms && program.relatedPrograms.length > 0 && (
            <div className="bg-navy-800 border border-white/5 p-6">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 pb-3 border-b border-white/5">
                Related Courses
              </h3>
              <div className="flex flex-col gap-3">
                {program.relatedPrograms.map((rp) => (
                  <Link
                    key={rp._id}
                    href={`/dashboard/courses/${rp.slug}`}
                    className="group flex items-start gap-3 hover:bg-navy-900/50 -mx-2 px-2 py-2 transition-colors"
                  >
                    {rp.programCode && (
                      <span className="px-1.5 py-0.5 bg-navy-900 border border-white/5 text-[8px] font-bold tracking-widest text-gold-500 uppercase shrink-0 mt-0.5">
                        {rp.programCode}
                      </span>
                    )}
                    <p className="text-xs text-slate-400 group-hover:text-white transition-colors leading-snug">
                      {rp.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Need help */}
          <div className="bg-navy-800 border border-white/5 p-6">
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-headset text-gold-500 text-sm mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white mb-1">Questions about this course?</p>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  Our training team can advise on prerequisites and scheduling.
                </p>
                <Link
                  href="/contact"
                  className="text-[11px] text-gold-500 hover:text-gold-400 transition-colors font-medium"
                >
                  Contact Training Team →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
