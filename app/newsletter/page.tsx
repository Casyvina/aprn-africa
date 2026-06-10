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

// Revalidate every 10 minutes so new Sanity issues appear without a redeploy
export const revalidate = 600;

// -- Helpers -------------------------------------------------------------------

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// -- Tag → icon map ------------------------------------------------------------

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
function tagIcon(tag: string) {
  return TAG_ICON[tag] ?? "fa-bolt";
}

// -- Fallback issue (shown until first issue is published in Sanity) -----------

const FALLBACK_STORIES = [
  {
    tag: "EACOP",
    headline: "East Africa Crude Oil Pipeline: Construction Reaches 40% Completion",
    summary: "The 1,443 km EACOP corridor connecting Uganda's Albertine Graben to Tanzania's Tanga port marks a critical threshold as TotalEnergies and CNOOC report cross-border pipe-laying milestones.",
  },
  {
    tag: "AKK",
    headline: "Nigeria's AKK Gas Pipeline: Mid-Section Commissioning Delayed to Q3 2026",
    summary: "NNPCL cites right-of-way clearances and community engagement protocols as contributing factors to the revised commissioning schedule for the 614 km Ajaokuta–Kaduna–Kano gas corridor.",
  },
  {
    tag: "AAGP",
    headline: "Morocco–Nigeria Gas Pipeline: ECOWAS Endorses Route Alignment",
    summary: "The 5,660 km Africa Atlantic Gas Pipeline receives a formal ECOWAS technical endorsement as the preferred West African energy integration corridor.",
  },
  {
    tag: "Upstream",
    headline: "Africa Upstream Outlook: Six Licensing Rounds Scheduled for H2 2026",
    summary: "Angola, Mozambique, Senegal, Tanzania, Namibia, and South Africa have collectively announced offshore and onshore licensing rounds, signalling a resurgence in continental exploration investment.",
  },
  {
    tag: "Policy",
    headline: "AU Energy Compact: Member States Set 2030 Cross-Border Interconnection Targets",
    summary: "The African Union's revised energy integration compact sets binding interconnection targets, with pipeline and LNG corridors identified as priority vectors for regional energy security.",
  },
  {
    tag: "Training",
    headline: "APRN Launches Pipeline Integrity Management Certification — Cohort 2 Open",
    summary: "APRN's flagship integrity management programme opens its second cohort with modules covering in-line inspection, cathodic protection, and regulatory compliance across 12 African jurisdictions.",
  },
  {
    tag: "Data",
    headline: "APRN Infrastructure Index: Q1 2026 Capital Expenditure Tracker Released",
    summary: "The APRN quarterly CAPEX index tracks $9.2 billion in announced infrastructure expenditure across 23 active projects, with East and West Africa accounting for 71% of committed spend.",
  },
  {
    tag: "Editorial",
    headline: "Editor's Analysis: Why Pipeline Diplomacy Is the New Energy Geopolitics",
    summary: "As global energy trade routes are redrawn, Africa's pipeline corridors are instruments of diplomatic leverage and continental integration.",
  },
];

const FALLBACK_METRICS = [
  { value: "$9.2B", label: "CAPEX Tracked Q1 2026" },
  { value: "23",    label: "Active Projects Monitored" },
  { value: "14",    label: "Nations Engaged" },
];

const UPCOMING_EVENTS = [
  {
    name: "Africa Pipeline Leaders Summit — Morocco 2026",
    location: "Marrakech, Morocco",
    dates: "Oct 2026",
    href: "/events/apls-morocco-2026",
  },
  {
    name: "APRN Annual Intelligence Webinar",
    location: "Virtual",
    dates: "Q3 2026",
    href: "/events",
  },
];

// -- Page ----------------------------------------------------------------------

export default async function NewsletterPage() {
  let latest: NewsletterIssue | null = null;
  let archive: NewsletterCard[] = [];

  try {
    [latest, archive] = await Promise.all([
      sanityFetch<NewsletterIssue | null>(LATEST_NEWSLETTER_QUERY, {}, ["newsletter"]),
      sanityFetch<NewsletterCard[]>(ALL_NEWSLETTERS_QUERY, {}, ["newsletter"]),
    ]);
  } catch { /* show fallback if Sanity unavailable */ }

  const stories      = latest?.stories?.length ? latest.stories : FALLBACK_STORIES;
  const leadStory    = stories[0];
  const otherStories = stories.slice(1);
  const issueLabel   = latest
    ? `Vol. ${latest.volume}, Issue ${String(latest.issueNumber).padStart(3, "0")}`
    : "Vol. 1, Issue 001";
  const issueDateLabel = latest ? formatDate(latest.publishDate) : "Wednesday, 14 May 2026";
  const isFallback     = !latest;

  return (
    <>
      <Navigation />

      {/* Outer wrapper — light gray to make the card pop, like email clients */}
      <div
        className="min-h-screen bg-slate-100 py-10 px-4"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        <div className="max-w-2xl mx-auto">

          {/* Fallback notice */}
          {isFallback && (
            <div className="flex items-center gap-2 mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-sm text-xs text-amber-800">
              <i className="fa-solid fa-circle-info text-amber-500 shrink-0" />
              <span>
                <strong>Preview edition</strong> — no issue has been published yet. This sample shows how each briefing will look.
                Subscribe below to receive the first issue.
              </span>
            </div>
          )}

          {/* -- NEWSLETTER CARD ------------------------------------------- */}
          <div className="bg-white shadow-sm overflow-hidden border border-slate-200">

            {/* MASTHEAD */}
            <header className="px-8 py-8 border-b border-slate-100 flex items-end justify-between">
              <div>
                <h1
                  className="text-4xl font-bold text-navy-900 tracking-tight leading-none mb-1"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  APRN
                </h1>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                  African Pipeline Resource Network
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                  {issueLabel}
                </p>
                <p className="text-[11px] text-slate-400 italic" style={{ fontFamily: "var(--font-playfair), serif" }}>
                  {issueDateLabel}
                </p>
              </div>
            </header>

            {/* GOLD TICKER BAR */}
            <div className="bg-gold-500 px-8 py-2.5 flex items-center gap-4">
              <span
                className="text-navy-900 font-black text-[10px] uppercase tracking-widest whitespace-nowrap"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                {isFallback ? "Sample Issue" : "Latest Issue"}
              </span>
              <div className="flex-1 overflow-hidden">
                <span className="text-navy-900 text-[11px] font-semibold tracking-wide whitespace-nowrap">
                  {issueLabel} · {issueDateLabel}
                  {stories.slice(0, 3).map((s) => ` · ${s.tag}`).join("")}
                </span>
              </div>
            </div>

            {/* FEATURED STORY */}
            <section className="bg-slate-50 pb-10">
              <div className="h-64 overflow-hidden relative">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: "url('/images/hero-pipeline.jpg')",
                    filter: "brightness(0.75)",
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-navy-900/90 via-navy-900/30 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <span className="inline-block bg-gold-500 text-navy-900 text-[10px] font-bold uppercase tracking-wider px-2 py-1 mb-3">
                    {leadStory.tag}
                  </span>
                  <h2
                    className="text-2xl font-bold text-white leading-tight"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    {leadStory.headline}
                  </h2>
                </div>
              </div>

              <div className="px-8 pt-8">
                <p
                  className="text-lg text-navy-900 leading-relaxed mb-5"
                  style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 400 }}
                >
                  {latest?.leadSummary || leadStory.summary}
                </p>
                {"sourceUrl" in leadStory && leadStory.sourceUrl ? (
                  <a
                    href={leadStory.sourceUrl as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-semibold text-navy-900 border-b-2 border-gold-500 pb-0.5 hover:text-gold-500 transition-colors"
                  >
                    Read the Full Analysis <i className="fa-solid fa-arrow-right ml-2 text-xs" />
                  </a>
                ) : (
                  <Link
                    href="/insights"
                    className="inline-flex items-center text-sm font-semibold text-navy-900 border-b-2 border-gold-500 pb-0.5 hover:text-gold-500 transition-colors"
                  >
                    Explore Intelligence Archive <i className="fa-solid fa-arrow-right ml-2 text-xs" />
                  </Link>
                )}
              </div>
            </section>

            {/* QUICK INTELLIGENCE */}
            <section className="px-8 py-10 bg-white border-t border-slate-100">
              <h3 className="text-xs font-bold text-navy-900 uppercase tracking-widest mb-6 flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-gold-500 shrink-0" />
                Quick Intelligence
              </h3>

              <div className="space-y-6">
                {otherStories.slice(0, 6).map((s, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:border-gold-500/40 transition-colors">
                      <i className={`fa-solid ${tagIcon(s.tag)} text-gold-500 text-xs`} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                        {s.tag}
                      </span>
                      <h4
                        className="font-bold text-navy-900 text-sm mb-1 leading-snug"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                      >
                        {s.headline}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{s.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* KEY METRICS STRIP */}
            <section className="bg-navy-900 px-8 py-10 text-white">
              <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-8 text-center">
                Sector Pulse · Q2 2026
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                {FALLBACK_METRICS.map((m, i) => (
                  <div key={m.label} className={i > 0 ? "border-l border-white/10 pl-4" : ""}>
                    <p
                      className="text-3xl font-light text-gold-500 mb-1"
                      style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                      {m.value}
                    </p>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider leading-tight">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* EDITOR'S ANALYSIS — only if real Sanity content */}
            {latest?.editorAnalysis && (
              <section className="px-8 py-10 bg-slate-50 border-t-2 border-t-gold-500">
                <h3 className="text-xs font-bold text-navy-900 uppercase tracking-widest mb-6">
                  Editor&apos;s Analysis
                </h3>
                {latest.pullQuote && (
                  <blockquote className="border-l-2 border-gold-500 pl-5 mb-6">
                    <p
                      className="text-xl text-navy-900 italic leading-relaxed"
                      style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                      &ldquo;{latest.pullQuote}&rdquo;
                    </p>
                  </blockquote>
                )}
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {latest.editorAnalysis}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-gold-500">LO</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy-900">Lucy Okeke</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                      Founder &amp; Executive Director, APRN
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Fallback editorial quote — shown when no Sanity content */}
            {!latest?.editorAnalysis && (
              <section className="px-8 py-10 bg-white border-t border-slate-100">
                <div className="text-center max-w-lg mx-auto">
                  <i className="fa-solid fa-quote-left text-3xl text-slate-200 mb-4 block" />
                  <p
                    className="text-lg text-navy-900 leading-relaxed italic mb-6"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    &ldquo;The narrative is shifting from potential to execution. We are seeing unprecedented alignment
                    between regional governments and private capital to unblock critical infrastructure arteries.&rdquo;
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-gold-500">LO</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-navy-900">Lucy Okeke</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                        Founder &amp; Executive Director, APRN
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* UPCOMING SUMMITS */}
            <section className="px-8 py-10 border-t border-slate-100 bg-white">
              <h3 className="text-xs font-bold text-navy-900 uppercase tracking-widest mb-6">
                Upcoming Summits
              </h3>
              <ul className="space-y-4">
                {UPCOMING_EVENTS.map((ev, i) => (
                  <li
                    key={ev.name}
                    className={`flex items-start justify-between gap-4 ${i < UPCOMING_EVENTS.length - 1 ? "border-b border-slate-50 pb-4" : ""}`}
                  >
                    <div>
                      <h4
                        className="font-bold text-navy-900 text-sm mb-1 leading-snug"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                      >
                        {ev.name}
                      </h4>
                      <p className="text-xs text-slate-500">{ev.location}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-gold-500 block mb-0.5">{ev.dates}</span>
                      <Link
                        href={ev.href}
                        className="text-[10px] text-slate-400 hover:text-navy-900 underline transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* SUBSCRIBE */}
            <section className="px-8 py-10 bg-slate-50 border-t border-slate-100">
              <h3
                className="text-lg font-bold text-navy-900 mb-1"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Join the Intelligence Network
              </h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Receive the APRN Intelligence Briefing every Wednesday — free for all subscribers.
                Engineers, policymakers, financiers, and researchers across Africa and its diaspora.
              </p>
              <NewsletterSignupForm />
            </section>

            {/* NEWSLETTER FOOTER */}
            <footer className="bg-navy-900 px-8 py-10 text-center">
              <h2
                className="text-2xl font-bold text-white mb-3 tracking-tight"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                APRN
              </h2>
              <p className="text-xs text-slate-400 mb-6 max-w-xs mx-auto leading-relaxed">
                African Pipeline Resource Network<br />
                Intelligence for the next era of infrastructure.<br />
                Published every Wednesday.
              </p>
              <div className="flex justify-center gap-3 mb-6">
                {[
                  { icon: "fa-linkedin-in", href: "https://linkedin.com/company/aprn-africa" },
                  { icon: "fa-x-twitter",  href: "https://x.com/aprnafrica" },
                ].map((s) => (
                  <a
                    key={s.icon}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gold-500 hover:text-navy-900 transition-colors"
                  >
                    <i className={`fa-brands ${s.icon} text-sm`} />
                  </a>
                ))}
              </div>
              <div className="flex justify-center gap-4 text-[10px] text-slate-600">
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <span>|</span>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
                <span>|</span>
                <Link href="/newsletter" className="hover:text-white transition-colors">
                  View in Browser
                </Link>
              </div>
            </footer>

          </div>

          {/* PAST ISSUES ARCHIVE — outside the card */}
          {archive.length > 1 && (
            <div className="mt-10">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-5">
                Past Issues
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {archive.slice(1).map((issue) => (
                  <Link
                    key={issue._id}
                    href={`/newsletter/${issue.slug}`}
                    className="group flex items-start gap-4 bg-white border border-slate-200 hover:border-gold-500/40 transition-colors p-4"
                  >
                    <div className="w-12 h-12 bg-navy-900 flex items-center justify-center shrink-0">
                      <span
                        className="text-base font-bold text-gold-500"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                      >
                        #{issue.issueNumber}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-navy-900 group-hover:text-gold-500 transition-colors leading-snug mb-1 truncate">
                        {issue.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 uppercase tracking-wider">
                        {formatShortDate(issue.publishDate)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </>
  );
}
