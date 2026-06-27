import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NewsletterSignupForm from "@/components/NewsletterSignupForm";
import { sanityFetch } from "@/lib/sanity/fetch";
import {
  LATEST_NEWSLETTER_QUERY,
  ALL_NEWSLETTERS_QUERY,
  type NewsletterIssue,
  type NewsletterCard,
} from "@/lib/queries/newsletter";

export const revalidate = 600;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function issueLabel(vol: number, num: number) {
  return `Vol. ${vol}, Issue ${String(num).padStart(3, "0")}`;
}

// ── Tag icon map ──────────────────────────────────────────────────────────────
const TAG_ICON: Record<string, string> = {
  Policy:      "fa-scale-balanced",
  Training:    "fa-graduation-cap",
  Engineering: "fa-helmet-safety",
  Data:        "fa-chart-bar",
  Editorial:   "fa-pen-nib",
  Upstream:    "fa-fire-flame-curved",
  EACOP:       "fa-route",
  AKK:         "fa-route",
  AAGP:        "fa-route",
  Energy:      "fa-bolt",
};
function tagIcon(tag: string) { return TAG_ICON[tag] ?? "fa-bolt"; }

// ── Fallback for when no issues are published yet ─────────────────────────────
const FALLBACK_STORIES = [
  { tag: "EACOP",     headline: "East Africa Crude Oil Pipeline: Construction Reaches 40% Completion",     summary: "The 1,443 km EACOP corridor connecting Uganda's Albertine Graben to Tanzania's Tanga port marks a critical threshold." },
  { tag: "AKK",       headline: "Nigeria's AKK Gas Pipeline: Mid-Section Commissioning Delayed to Q3 2026", summary: "NNPCL cites right-of-way clearances and community engagement protocols as contributing factors to the revised schedule." },
  { tag: "Policy",    headline: "AU Energy Compact: Member States Set 2030 Cross-Border Targets",           summary: "The African Union's revised energy integration compact sets binding interconnection targets." },
  { tag: "Training",  headline: "APRN Launches Pipeline Integrity Management Certification — Cohort 2",     summary: "APRN's flagship integrity management programme opens its second cohort." },
  { tag: "Data",      headline: "APRN Infrastructure Index: Q1 2026 Capital Expenditure Tracker Released",  summary: "The APRN quarterly CAPEX index tracks $9.2 billion in announced infrastructure expenditure." },
  { tag: "Editorial", headline: "Editor's Analysis: Why Pipeline Diplomacy Is the New Energy Geopolitics",  summary: "As global energy trade routes are redrawn, Africa's pipeline corridors are instruments of diplomatic leverage." },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function NewsletterPage() {
  let latest: NewsletterIssue | null = null;
  let archive: NewsletterCard[] = [];

  try {
    [latest, archive] = await Promise.all([
      sanityFetch<NewsletterIssue | null>(LATEST_NEWSLETTER_QUERY, {}, ["newsletter"]),
      sanityFetch<NewsletterCard[]>(ALL_NEWSLETTERS_QUERY, {}, ["newsletter"]),
    ]);
  } catch { /* fallback */ }

  const stories   = latest?.stories?.length ? latest.stories : FALLBACK_STORIES;
  const pastIssues = archive.length > 1 ? archive.slice(1) : [];

  return (
    <>
      <Navigation />
      <main className="bg-navy-900 text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="relative pt-32 pb-20 border-b border-navy-800 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,.5) 39px,rgba(255,255,255,.5) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,.5) 39px,rgba(255,255,255,.5) 40px)" }}
          />
          <div className="max-w-360 mx-auto px-6 lg:px-12 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                <span className="text-xs font-bold text-gold-500 uppercase tracking-widest">Published Every Wednesday</span>
              </div>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                APRN Intelligence<br />Briefing
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-2xl">
                Africa&apos;s definitive pipeline and energy intelligence digest — covering infrastructure developments, policy shifts, engineering insights, and market intelligence across the continent.
              </p>
              <div className="flex flex-wrap gap-6 text-xs text-slate-500 uppercase tracking-widest mb-10">
                {[
                  { icon: "fa-newspaper",   label: "Weekly briefing" },
                  { icon: "fa-globe-africa", label: "28 countries covered" },
                  { icon: "fa-users",        label: "2,400+ subscribers" },
                  { icon: "fa-lock-open",    label: "Free to subscribe" },
                ].map((m) => (
                  <div key={m.label} className="flex items-center gap-2">
                    <i className={`fa-solid ${m.icon} text-gold-500 text-[10px]`} />
                    {m.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Latest Issue ─────────────────────────────────────────────── */}
        <section className="py-20 border-b border-navy-800">
          <div className="max-w-360 mx-auto px-6 lg:px-12">

            <div className="flex items-center justify-between mb-10">
              <p className="text-xs font-bold text-gold-500 uppercase tracking-widest">Latest Issue</p>
              {latest && (
                <span className="text-xs text-slate-500">
                  {issueLabel(latest.volume, latest.issueNumber)} · {formatDate(latest.publishDate)}
                </span>
              )}
            </div>

            <div className="grid lg:grid-cols-5 gap-5 lg:gap-8">

              {/* Lead story */}
              <div className="lg:col-span-3 bg-navy-800 border border-navy-700 hover:border-gold-500/30 transition-colors p-5 lg:p-8 flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-navy-900 bg-gold-500 px-2.5 py-1 uppercase tracking-widest">
                    {stories[0].tag}
                  </span>
                  <span className="text-[10px] text-slate-600 uppercase tracking-widest">Lead Story</span>
                </div>
                <h2
                  className="text-2xl lg:text-3xl font-bold text-white leading-snug"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  {stories[0].headline}
                </h2>
                <p className="text-slate-400 leading-relaxed text-sm flex-1">{stories[0].summary}</p>
                {latest ? (
                  <Link
                    href={`/newsletter/${latest.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gold-500 hover:text-gold-400 transition-colors mt-auto"
                  >
                    Read full issue <i className="fa-solid fa-arrow-right text-xs" />
                  </Link>
                ) : (
                  <span className="text-xs text-slate-600 italic">Subscribe to read when published</span>
                )}
              </div>

              {/* Other stories */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {stories.slice(1, 5).map((s, i) => (
                  <div
                    key={i}
                    className="flex gap-4 items-start p-4 bg-navy-800 border border-navy-700 hover:border-gold-500/20 transition-colors group"
                  >
                    <div className="w-9 h-9 bg-navy-900 border border-navy-700 flex items-center justify-center shrink-0 group-hover:border-gold-500/30 transition-colors">
                      <i className={`fa-solid ${tagIcon(s.tag)} text-gold-500 text-[10px]`} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">{s.tag}</span>
                      <p
                        className="text-sm font-semibold text-white leading-snug"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                      >
                        {s.headline}
                      </p>
                    </div>
                  </div>
                ))}
                {latest && (
                  <Link
                    href={`/newsletter/${latest.slug}`}
                    className="mt-2 py-3 border border-gold-500/30 text-center text-xs font-bold text-gold-500 uppercase tracking-widest hover:bg-gold-500/10 transition-colors"
                  >
                    Read All {stories.length} Stories
                    <i className="fa-solid fa-arrow-right ml-2 text-[10px]" />
                  </Link>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* ── Past Issues Archive ───────────────────────────────────────── */}
        {pastIssues.length > 0 && (
          <section className="py-20 border-b border-navy-800">
            <div className="max-w-360 mx-auto px-6 lg:px-12">
              <p className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-10">Past Issues</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {pastIssues.map((issue) => (
                  <Link
                    key={issue._id}
                    href={`/newsletter/${issue.slug}`}
                    className="group bg-navy-800 border border-navy-700 hover:border-gold-500/30 transition-all p-6 flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">
                        {issueLabel(issue.volume, issue.issueNumber)}
                      </span>
                      <i className="fa-solid fa-arrow-right text-[10px] text-slate-600 group-hover:text-gold-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <h3
                      className="text-base font-bold text-white group-hover:text-gold-400 transition-colors leading-snug"
                      style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                      {issue.title}
                    </h3>
                    {issue.leadSummary && (
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{issue.leadSummary}</p>
                    )}
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest mt-auto">
                      {formatDate(issue.publishDate)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Subscribe ─────────────────────────────────────────────────── */}
        <section className="py-24">
          <div className="max-w-360 mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-4">Never Miss an Issue</p>
                <h2
                  className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-snug"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  Join the APRN Intelligence Network
                </h2>
                <p className="text-slate-400 leading-relaxed mb-8">
                  Receive the APRN Intelligence Briefing every Wednesday — free for all subscribers. Engineers, policymakers, financiers, and researchers across Africa and its diaspora.
                </p>
                <div className="flex flex-col gap-3 text-sm text-slate-400">
                  {[
                    "Pipeline infrastructure developments across 28 African nations",
                    "Policy and regulatory shifts affecting energy sectors",
                    "Training opportunities and professional development",
                    "Market intelligence and investment signals",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <i className="fa-solid fa-check text-gold-500 text-[10px] mt-1 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-navy-800 border border-navy-700 p-8">
                <p className="text-sm font-bold text-white mb-1">Subscribe Free</p>
                <p className="text-xs text-slate-500 mb-6">Every Wednesday. Unsubscribe anytime.</p>
                <NewsletterSignupForm />
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
