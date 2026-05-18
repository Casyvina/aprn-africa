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

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

// ── Static fallback stories (shown when no Sanity content is published yet) ───

const FALLBACK_STORIES = [
  { tag: "EACOP",    headline: "East Africa Crude Oil Pipeline: Construction Reaches 40% Completion", summary: "The 1,443 km EACOP corridor connecting Uganda's Albertine Graben to Tanzania's Tanga port marks a critical threshold as TotalEnergies and CNOOC report cross-border pipe-laying milestones." },
  { tag: "AKK",      headline: "Nigeria's AKK Gas Pipeline: Mid-Section Commissioning Delayed to Q3 2026", summary: "NNPCL cites right-of-way clearances and community engagement protocols as contributing factors to the revised commissioning schedule for the 614 km Ajaokuta–Kaduna–Kano gas corridor." },
  { tag: "AAGP",     headline: "Morocco–Nigeria Gas Pipeline: ECOWAS Endorses Route Alignment", summary: "The 5,660 km Africa Atlantic Gas Pipeline receives a formal ECOWAS technical endorsement as the preferred West African energy integration corridor." },
  { tag: "Upstream", headline: "Africa Upstream Outlook: Six Licensing Rounds Scheduled for H2 2026", summary: "Angola, Mozambique, Senegal, Tanzania, Namibia, and South Africa have collectively announced offshore and onshore licensing rounds, signalling a resurgence in continental exploration investment." },
  { tag: "Policy",   headline: "AU Energy Compact: Member States Set 2030 Cross-Border Interconnection Targets", summary: "The African Union's revised energy integration compact sets binding interconnection targets, with pipeline and LNG corridors identified as priority vectors for regional energy security." },
  { tag: "Training", headline: "APRN Launches Pipeline Integrity Management Certification — Cohort 2 Open", summary: "APRN's flagship integrity management programme opens its second cohort with modules covering in-line inspection, cathodic protection, and regulatory compliance across 12 African jurisdictions." },
  { tag: "Data",     headline: "APRN Infrastructure Index: Q1 2026 Capital Expenditure Tracker Released", summary: "The APRN quarterly CAPEX index tracks $9.2 billion in announced infrastructure expenditure across 23 active projects, with East and West Africa accounting for 71% of committed spend." },
  { tag: "Editorial",headline: "Editor's Analysis: Why Pipeline Diplomacy Is the New Energy Geopolitics", summary: "As global energy trade routes are redrawn, Africa's pipeline corridors are instruments of diplomatic leverage and continental integration." },
];

const pillars = [
  { icon: "fa-bolt",           title: "Intelligence Briefs",  description: "Breaking developments across Africa's pipeline and energy infrastructure landscape, curated weekly." },
  { icon: "fa-chart-line",     title: "Market Data",          description: "CAPEX trackers, licensing round calendars, upstream production figures, and corridor status updates." },
  { icon: "fa-pen-nib",        title: "Editorial Analysis",   description: "Strategic commentary from APRN's editorial board on policy, diplomacy, and infrastructure finance." },
  { icon: "fa-graduation-cap", title: "Training Alerts",      description: "Early access to APRN certification programmes, cohort openings, and professional development events." },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function NewsletterPage() {
  const [latest, archive] = await Promise.all([
    sanityFetch<NewsletterIssue | null>(LATEST_NEWSLETTER_QUERY, {}, ["newsletter"]),
    sanityFetch<NewsletterCard[]>(ALL_NEWSLETTERS_QUERY,       {}, ["newsletter"]),
  ]);

  const previewStories  = latest?.stories ?? FALLBACK_STORIES;
  const issueLabel      = latest
    ? `Vol. ${latest.volume}, Issue ${String(latest.issueNumber).padStart(3, "0")}`
    : "Vol. 1, Issue 001";
  const issueDateLabel  = latest ? formatDate(latest.publishDate) : "Wednesday, 14 May 2026";
  const storyCount      = previewStories.length;

  return (
    <>
      <Navigation />
      <main className="bg-navy-900 text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>

        {/* ── Masthead Hero ────────────────────────────────────────── */}
        <section className="pt-32 pb-0 px-6 lg:px-12 border-b border-navy-800 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.5) 39px, rgba(255,255,255,0.5) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.5) 39px, rgba(255,255,255,0.5) 40px)",
            }}
          />
          <div className="max-w-360 mx-auto relative z-10">

            <div className="border-b border-white/10 pb-5 mb-8 flex items-center justify-between flex-wrap gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-gold-500/30 rounded-full bg-gold-500/10">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                <span className="text-xs font-semibold text-gold-500 uppercase tracking-widest">APRN Publishing</span>
              </div>
              <span className="text-[11px] text-slate-600 uppercase tracking-widest">
                Vol. 1 · Est. 2026 · Every Wednesday
              </span>
            </div>

            <div className="text-center pb-12">
              <p className="text-[11px] text-slate-500 uppercase tracking-[0.4em] mb-4">
                Africa&apos;s Pipeline Intelligence Weekly
              </p>
              <h1
                className="text-6xl md:text-8xl lg:text-9xl font-bold leading-none mb-4"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                APRN <span className="text-gold-500">Intelligence</span>
              </h1>
              <p
                className="text-2xl md:text-3xl text-slate-400 font-light tracking-widest uppercase mb-8"
                style={{ fontFamily: "var(--font-oswald), sans-serif" }}
              >
                Briefing
              </p>
              <div className="flex items-center justify-center gap-6 text-[11px] text-slate-600 uppercase tracking-widest">
                <span>Published Every Wednesday</span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span>Free Subscription</span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span>2,400+ Subscribers</span>
              </div>
            </div>

          </div>
        </section>

        {/* ── Ticker bar ───────────────────────────────────────────── */}
        <div className="bg-gold-500 py-2.5 px-6">
          <div className="max-w-360 mx-auto flex items-center gap-6">
            <span
              className="text-navy-900 font-black text-xs uppercase tracking-widest whitespace-nowrap"
              style={{ fontFamily: "var(--font-oswald), sans-serif" }}
            >
              Latest Issue
            </span>
            <div className="flex-1 overflow-hidden">
              <div className="flex flex-wrap gap-4 text-navy-900 text-xs font-semibold uppercase tracking-wider">
                <span>{issueLabel} · {issueDateLabel}</span>
                {previewStories.slice(0, 3).map((s) => (
                  <span key={s.tag}>· {s.tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── What you get ─────────────────────────────────────────── */}
        <section className="py-20 px-6 lg:px-12 border-b border-navy-800">
          <div className="max-w-360 mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-xs text-gold-500 uppercase tracking-widest font-semibold mb-4">What You Receive</p>
                <h2
                  className="text-4xl md:text-5xl font-bold leading-tight mb-6"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  Africa&apos;s Infrastructure Intelligence,{" "}
                  <span className="text-gold-500">In Your Inbox Weekly</span>
                </h2>
                <p className="text-slate-400 leading-relaxed mb-8 text-lg">
                  The APRN Intelligence Briefing is the only dedicated weekly digest covering Africa&apos;s
                  pipeline corridors, upstream developments, energy policy, and infrastructure finance —
                  written by practitioners, for practitioners.
                </p>
                <div className="flex flex-wrap gap-3">
                  {["Pipeline Updates", "Policy Analysis", "CAPEX Data", "Training Alerts", "Market Outlook"].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 bg-navy-800 border border-navy-700 text-xs text-slate-300 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {pillars.map((p) => (
                  <div key={p.title} className="glass-panel border border-navy-700 p-6 rounded-sm">
                    <i className={`fa-solid ${p.icon} text-gold-500 text-xl mb-4 block`} />
                    <h4 className="text-sm font-bold text-white mb-2">{p.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Latest Issue Preview ─────────────────────────────────── */}
        <section className="py-20 px-6 lg:px-12 border-b border-navy-800 bg-navy-800">
          <div className="max-w-360 mx-auto">

            <div className="flex flex-wrap items-end justify-between gap-6 mb-12 pb-6 border-b border-navy-700">
              <div>
                <p className="text-xs text-gold-500 uppercase tracking-widest font-semibold mb-2">
                  Latest Issue Preview
                </p>
                <h2
                  className="text-3xl md:text-4xl font-bold"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  {issueLabel}
                </h2>
                <p className="text-slate-500 text-sm mt-1">{issueDateLabel} · {storyCount} Stories</p>
                {latest?.leadSummary && (
                  <p className="text-slate-400 text-sm mt-3 max-w-2xl leading-relaxed">{latest.leadSummary}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 border border-gold-500/30 bg-gold-500/10 text-gold-500 text-xs font-semibold uppercase tracking-widest rounded-full">
                  Now Circulating
                </span>
                {latest && (
                  <Link
                    href={`/newsletter/${latest.slug}`}
                    className="px-4 py-1.5 border border-white/20 text-white text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-white hover:text-navy-900 transition-colors"
                  >
                    Read Full Issue
                  </Link>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {previewStories.map((story, i) => (
                <div key={i} className="glass-panel border border-navy-700 p-5 rounded-sm flex flex-col gap-3">
                  <span className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">{story.tag}</span>
                  <h4
                    className="text-sm font-bold leading-snug text-white"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    {story.headline}
                  </h4>
                  <p className="text-[12px] text-slate-500 leading-relaxed flex-1">{story.summary}</p>
                  <div className="w-8 h-px bg-gold-500/30" />
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── Archive ───────────────────────────────────────────────── */}
        {archive.length > 1 && (
          <section className="py-16 px-6 lg:px-12 border-b border-navy-800">
            <div className="max-w-360 mx-auto">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-8">Archive</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {archive.map((issue) => (
                  <Link
                    key={issue._id}
                    href={`/newsletter/${issue.slug}`}
                    className="group glass-panel border border-navy-700 hover:border-gold-500/40 transition-colors rounded-sm p-5 flex items-start gap-4"
                  >
                    <div className="shrink-0 w-12 h-12 rounded-sm bg-navy-800 border border-navy-700 flex items-center justify-center">
                      <span
                        className="text-lg font-bold text-gold-500"
                        style={{ fontFamily: "var(--font-oswald), sans-serif" }}
                      >
                        #{issue.issueNumber}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-gold-500 transition-colors leading-snug mb-1">
                        {issue.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 uppercase tracking-wider">
                        {formatDate(issue.publishDate)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Subscribe form ───────────────────────────────────────── */}
        <section className="py-24 px-6 lg:px-12 border-b border-navy-800 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(212,160,23,0.07) 0%, transparent 60%)" }}
          />
          <div className="max-w-2xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <p className="text-xs text-gold-500 uppercase tracking-widest font-semibold mb-4">Free Subscription</p>
              <h2
                className="text-4xl md:text-5xl font-bold leading-tight mb-4"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Join 2,400+ Infrastructure Professionals
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Engineers, policymakers, financiers, and researchers across Africa and its diaspora.
                Receive the briefing free, every Wednesday morning.
              </p>
            </div>
            <div className="glass-panel border border-navy-700 p-8 rounded-sm">
              <NewsletterSignupForm />
            </div>
          </div>
        </section>

        {/* ── Social proof ─────────────────────────────────────────── */}
        <section className="py-16 px-6 lg:px-12 border-b border-navy-800">
          <div className="max-w-360 mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                { stat: "2,400+",  label: "Active Subscribers" },
                { stat: "Vol. 1",  label: "Now Circulating" },
                { stat: "Weekly",  label: "Every Wednesday" },
              ].map((item) => (
                <div key={item.label}>
                  <div
                    className="text-5xl font-bold text-gold-500 mb-2"
                    style={{ fontFamily: "var(--font-oswald), sans-serif" }}
                  >
                    {item.stat}
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section className="py-24 px-6 border-t border-white/5 bg-navy-900 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(ellipse at 50% 50%, rgba(212,160,23,0.05) 0%, transparent 70%)" }}
          />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <p className="text-xs tracking-[0.3em] text-gold-500 mb-6 uppercase">Go Deeper</p>
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-oswald), sans-serif" }}
            >
              Access the Full <span className="text-gold-500">Intelligence Archive</span>
            </h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              The briefing is a window. The APRN Intelligence platform is the full picture —
              research reports, data dashboards, pipeline corridor profiles, and training programmes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/insights"
                className="inline-flex items-center justify-center gap-3 border border-gold-500 px-8 py-4 text-sm font-medium tracking-widest uppercase text-gold-500 hover:bg-gold-500 hover:text-navy-900 transition-all"
              >
                Explore Insights <i className="fa-solid fa-arrow-right" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 border border-white/20 px-8 py-4 text-sm font-medium tracking-widest uppercase hover:bg-white hover:text-navy-900 transition-all"
              >
                Partner With APRN <i className="fa-solid fa-arrow-right" />
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
