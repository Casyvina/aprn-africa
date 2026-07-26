import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research Library — Pipeline Intelligence & Policy Reports",
  description:
    "Browse APRN's library of flagship research reports, policy briefs, working papers, and intelligence briefings on African pipeline infrastructure, CapEx flows, and energy transition.",
  openGraph: {
    title: "APRN Research Library — Africa's Pipeline Intelligence",
    description:
      "Flagship reports, policy briefs, and intelligence briefings on African pipeline infrastructure. Covering the NMGP, EACOP, and $42.5B in active CapEx.",
    type: "website",
    url: "https://aprn-africa.org/research",
    images: [{ url: "/images/hero-pipeline.jpg", width: 1200, height: 630, alt: "APRN Research — Africa Pipeline Intelligence" }],
  },
};

import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ResearchCharts from "@/components/ResearchCharts";
import SaveButton from "@/components/SaveButton";
import { sanityFetch } from "@/lib/sanity/fetch";
import { RESEARCH_PAGE_QUERY, type ResearchPageResult, type ResearchPageCard } from "@/lib/queries/research";

function formatQuarter(iso: string) {
  const d = new Date(iso);
  const q = Math.ceil((d.getMonth() + 1) / 3);
  return `Q${q} ${d.getFullYear()}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

const TYPE_LABEL: Record<string, string> = {
  flagship:           "Flagship Report",
  "policy-brief":     "Policy Brief",
  "working-paper":    "Working Paper",
  "white-paper":      "White Paper",
  briefing:           "Intelligence Brief",
  "technical-audit":  "Technical Audit",
  "data-note":        "Data Note",
  "sector-analysis":  "Sector Analysis",
};

function typeLabel(t?: string) {
  return (t && TYPE_LABEL[t]) ?? "Report";
}

const corridorStats = [
  { value: "12,400", unit: "km", label: "Active Construction" },
  { value: "$42.5", unit: "B", label: "CapEx Tracked" },
  { value: "18", unit: "", label: "Trans-National Routes" },
  { value: "4", unit: "", label: "APRN Training Hubs" },
];

const partnerIcons = [
  "fa-solid fa-oil-well",
  "fa-solid fa-building-columns",
  "fa-solid fa-globe",
  "fa-solid fa-industry",
  "fa-solid fa-scale-balanced",
  "fa-solid fa-graduation-cap",
];

// ── Library card ─────────────────────────────────────────────────────────────

function LibraryCard({ card }: { card: ResearchPageCard }) {
  return (
    <div className="relative group flex flex-col bg-navy-800 border border-white/5 hover:border-gold-500/30 transition-colors overflow-hidden">
      {card.coverImageUrl ? (
        <div
          className="h-40 bg-cover bg-center shrink-0"
          style={{ backgroundImage: `url('${card.coverImageUrl}')` }}
        />
      ) : (
        <div className="h-40 shrink-0 bg-navy-700 flex items-center justify-center">
          <i className="fa-regular fa-file-lines text-4xl text-gold-500/20" />
        </div>
      )}
      <Link href={`/research/${card.slug}`} className="flex-1 flex flex-col p-6">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-[10px] font-bold uppercase tracking-widest text-gold-500"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            {typeLabel(card.reportType)}
          </span>
        </div>
        <h3
          className="text-base font-bold text-slate-100 leading-snug mb-3 group-hover:text-gold-500 transition-colors"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          {card.title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 flex-1 italic"
          style={{ fontFamily: "var(--font-playfair), serif" }}>
          {card.executiveSummary}
        </p>
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5 text-xs text-slate-500 uppercase tracking-wider"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          <span>{formatQuarter(card.publishDate)}</span>
          {card.estimatedReadTime && (
            <>
              <span className="text-navy-700">·</span>
              <span>{card.estimatedReadTime} min</span>
            </>
          )}
        </div>
      </Link>
      <SaveButton
        itemId={card._id}
        itemType="researchReport"
        itemSlug={card.slug}
        itemTitle={card.title}
        className="absolute top-3 right-3 z-10"
      />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ResearchPage() {
  const result = await sanityFetch<ResearchPageResult>(RESEARCH_PAGE_QUERY, {}, ["researchReport"]).catch(() => null);

  const featured: ResearchPageCard | null = result?.featured ?? result?.featuredFallback ?? null;
  const secondary: ResearchPageCard[] = result?.secondary ?? [];
  const allReports: ResearchPageCard[] = result?.allReports ?? [];

  // Library grid shows all reports except the one already shown as featured
  const libraryReports = featured
    ? allReports.filter((r) => r._id !== featured._id)
    : allReports;

  const hasContent = allReports.length > 0;

  return (
    <>
      <Navigation />
      <main id="main-content" className="bg-navy-900 text-slate-100">

        {/* -- HERO -------------------------------------------- */}
        <section className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-navy-900">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/pipeline-aerial.png"
              alt="Pipeline aerial"
              fill
              sizes="100vw"
              className="object-cover opacity-25 mix-blend-luminosity"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-navy-900 via-navy-900/80 to-transparent" />
            <div className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(7,27,42,0.9) 100%)" }} />
          </div>

          <div className="relative z-10 max-w-360 mx-auto w-full px-6 lg:px-12 flex flex-col items-center text-center">
            <span className="text-gold-500 tracking-[0.3em] uppercase text-sm mb-6 border-b border-gold-500/30 pb-2"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}>
              Institutional Intelligence
            </span>

            <h1
              className="font-bold leading-[0.85] tracking-tighter text-slate-100 uppercase mb-8 max-w-6xl"
              style={{
                fontFamily: "var(--font-oswald), sans-serif",
                fontSize: "clamp(3rem, 9vw, 110px)",
              }}
            >
              Africa&apos;s Pipeline<br />
              <span className="text-gold-500">Intelligence Platform</span>
            </h1>

            <p
              className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed mb-12 italic"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Strategic engineering research, policy frameworks, and infrastructure data driving the
              next century of African energy transition.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#featured-reports"
                className="px-8 py-4 bg-gold-500 text-navy-900 uppercase tracking-widest text-sm font-bold hover:bg-gold-400 transition-colors flex items-center justify-center gap-3"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                Explore Latest Reports <i className="fa-solid fa-chevron-right" />
              </a>
              <a
                href="#data-map"
                className="px-8 py-4 text-slate-100 uppercase tracking-widest text-sm font-bold hover:bg-white/5 transition-colors border border-gold-500/30"
                style={{
                  background: "rgba(13,36,54,0.4)",
                  backdropFilter: "blur(12px)",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                View Data Catalog
              </a>
            </div>
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
            <span className="text-xs tracking-widest uppercase text-gold-500"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}>Scroll</span>
            <div className="w-px h-12 bg-linear-to-b from-gold-500 to-transparent" />
          </div>
        </section>

        {/* -- FEATURED INTELLIGENCE --------------------------- */}
        <section id="featured-reports" className="py-32 bg-navy-900 relative">
          <div className="max-w-360 mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-gold-500/20 pb-8">
              <div>
                <h2
                  className="text-4xl md:text-6xl uppercase tracking-tighter text-slate-100 mb-2"
                  style={{ fontFamily: "var(--font-oswald), sans-serif" }}
                >
                  Featured <span className="text-gold-500">Intelligence</span>
                </h2>
                <p className="text-slate-500 italic text-lg"
                  style={{ fontFamily: "var(--font-playfair), serif" }}>
                  Quarterly deep-dives into continental mega-projects.
                </p>
              </div>
              {allReports.length > 0 && (
                <Link href="#research-library" className="text-gold-500 text-sm tracking-widest uppercase hover:text-slate-100 transition-colors mt-6 md:mt-0 flex items-center gap-2"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                  All Reports <i className="fa-solid fa-arrow-right" />
                </Link>
              )}
            </div>

            {featured ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main feature */}
                <div className="lg:col-span-8 relative group overflow-hidden bg-navy-800">
                  <Link href={`/research/${featured.slug}`} className="block cursor-pointer">
                    <div className="h-80 sm:h-110 lg:h-150 w-full relative">
                      {featured.coverImageUrl ? (
                        <Image
                          src={featured.coverImageUrl}
                          alt={featured.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 66vw"
                          className="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-700"
                        />
                      ) : (
                        <Image
                          src="/images/hero-pipeline.jpg"
                          alt={featured.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 66vw"
                          className="object-cover opacity-40 group-hover:opacity-25 transition-opacity duration-700 mix-blend-luminosity"
                        />
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-navy-900 via-navy-900/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                        <div className="flex gap-3 mb-4">
                          <span className="px-3 py-1 bg-gold-500 text-navy-900 text-xs font-bold uppercase tracking-wider"
                            style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                            {typeLabel(featured.reportType)}
                          </span>
                          <span
                            className="px-3 py-1 text-gold-500 text-xs font-bold uppercase tracking-wider"
                            style={{ background: "rgba(13,36,54,0.4)", backdropFilter: "blur(12px)", border: "1px solid rgba(212,160,23,0.15)", fontFamily: "var(--font-inter), sans-serif" }}
                          >
                            {formatQuarter(featured.publishDate)}
                          </span>
                        </div>
                        <h3
                          className="text-3xl md:text-5xl uppercase tracking-tighter text-slate-100 mb-4 leading-tight group-hover:text-gold-500 transition-colors"
                          style={{ fontFamily: "var(--font-oswald), sans-serif" }}
                        >
                          {featured.title}
                        </h3>
                        <p className="text-slate-400 text-lg mb-6 max-w-2xl hidden md:block italic"
                          style={{ fontFamily: "var(--font-playfair), serif" }}>
                          {featured.executiveSummary}
                        </p>
                        <div className="flex items-center gap-4 text-sm tracking-widest text-gold-500 uppercase"
                          style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                          {featured.pageCount && <span><i className="fa-regular fa-file-pdf mr-2" />{featured.pageCount} Pages</span>}
                          {featured.estimatedReadTime && <span><i className="fa-regular fa-clock mr-2" />{featured.estimatedReadTime} Min Read</span>}
                        </div>
                      </div>
                    </div>
                  </Link>
                  <SaveButton
                    itemId={featured._id}
                    itemType="researchReport"
                    itemSlug={featured.slug}
                    itemTitle={featured.title}
                    className="absolute top-4 right-4 z-10"
                  />
                </div>

                {/* Secondary column */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                  {secondary.length > 0 ? secondary.map((card) => (
                    <div
                      key={card._id}
                      className="flex-1 relative group flex flex-col overflow-hidden border border-gold-500/10 hover:border-gold-500/40 transition-colors"
                      style={{ background: "linear-gradient(to bottom, #0D2436, #071B2A)" }}
                    >
                      <Link
                        href={`/research/${card.slug}`}
                        className="flex-1 flex flex-col justify-end p-8 cursor-pointer"
                      >
                        <span className="text-gold-500 text-xs font-bold uppercase tracking-wider mb-4 block"
                          style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                          {typeLabel(card.reportType)}
                        </span>
                        <h4
                          className="text-2xl uppercase tracking-tighter text-slate-100 mb-3 group-hover:text-gold-500 transition-colors"
                          style={{ fontFamily: "var(--font-oswald), sans-serif" }}
                        >
                          {card.title}
                        </h4>
                        <p className="text-slate-500 text-sm mb-6 italic"
                          style={{ fontFamily: "var(--font-playfair), serif" }}>
                          {card.executiveSummary}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs tracking-widest text-slate-100 uppercase border-b border-gold-500/30 pb-1"
                            style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                            Read Report →
                          </span>
                          {card.estimatedReadTime && (
                            <span className="text-xs text-slate-500 uppercase tracking-wider"
                              style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                              {card.estimatedReadTime} min
                            </span>
                          )}
                        </div>
                      </Link>
                      <SaveButton
                        itemId={card._id}
                        itemType="researchReport"
                        itemSlug={card.slug}
                        itemTitle={card.title}
                        className="absolute top-4 right-4 z-10"
                      />
                    </div>
                  )) : (
                    /* CTA panel when no secondary reports yet */
                    <div
                      className="flex-1 flex flex-col justify-center p-8 border border-gold-500/10"
                      style={{ background: "linear-gradient(to bottom, #0D2436, #071B2A)" }}
                    >
                      <i className="fa-solid fa-flask text-gold-500/30 text-4xl mb-6" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gold-500 mb-3"
                        style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                        More Reports Coming
                      </p>
                      <p className="text-slate-500 text-sm italic mb-6"
                        style={{ fontFamily: "var(--font-playfair), serif" }}>
                        APRN publishes policy briefs, technical assessments, and flagship reports quarterly.
                      </p>
                      <Link
                        href="/newsletter"
                        className="text-xs font-bold uppercase tracking-widest text-gold-500 hover:text-gold-400 transition-colors border-b border-gold-500/30 pb-1 self-start"
                        style={{ fontFamily: "var(--font-inter), sans-serif" }}
                      >
                        Subscribe for Updates →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Empty state — no reports published yet */
              <div className="border border-gold-500/10 p-16 text-center"
                style={{ background: "linear-gradient(to bottom, #0D2436, #071B2A)" }}>
                <i className="fa-solid fa-flask text-gold-500/20 text-5xl mb-6 block" />
                <p className="text-slate-500 italic text-lg mb-2" style={{ fontFamily: "var(--font-playfair), serif" }}>
                  Research reports are being prepared.
                </p>
                <p className="text-xs text-slate-600 uppercase tracking-widest" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                  Subscribe to the briefing for early access.
                </p>
                <Link href="/newsletter" className="mt-6 inline-block px-6 py-3 bg-gold-500 text-navy-900 text-xs font-bold uppercase tracking-widest hover:bg-gold-400 transition-colors"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                  Subscribe to Briefing
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* -- RESEARCH LIBRARY -------------------------------- */}
        {libraryReports.length > 0 && (
          <section id="research-library" className="py-24 bg-navy-800 border-t border-gold-500/10">
            <div className="max-w-360 mx-auto px-6 lg:px-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gold-500 mb-2"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                    Full Catalog
                  </p>
                  <h2
                    className="text-3xl md:text-5xl uppercase tracking-tighter text-slate-100"
                    style={{ fontFamily: "var(--font-oswald), sans-serif" }}
                  >
                    Research <span className="text-gold-500">Library</span>
                  </h2>
                </div>
                <span className="text-sm text-slate-500 uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                  {libraryReports.length} {libraryReports.length === 1 ? "Report" : "Reports"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {libraryReports.map((card) => (
                  <LibraryCard key={card._id} card={card} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* -- CONTINENTAL CORRIDORS + MAP --------------------- */}
        <section id="data-map" className="py-24 bg-navy-800 relative border-y border-gold-500/10">
          <div className="max-w-360 mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2
                  className="text-5xl uppercase tracking-tighter text-slate-100 mb-6"
                  style={{ fontFamily: "var(--font-oswald), sans-serif" }}
                >
                  Continental <br />
                  <span className="text-gold-500">Corridors</span>
                </h2>
                <p className="text-slate-500 text-lg mb-12 max-w-xl leading-relaxed italic"
                  style={{ fontFamily: "var(--font-playfair), serif" }}>
                  Explore our real-time spatial intelligence database tracking active pipeline
                  construction, proposed routes, and regional capacity metrics across Africa.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                  {corridorStats.map((s) => (
                    <div key={s.label} className="border-l-2 border-gold-500 pl-6">
                      <div
                        className="text-4xl text-slate-100 tracking-tighter mb-1"
                        style={{ fontFamily: "var(--font-oswald), sans-serif" }}
                      >
                        {s.value}
                        <span className="text-gold-500 text-2xl">{s.unit}</span>
                      </div>
                      <div className="text-xs tracking-widest uppercase text-slate-500"
                        style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/#map"
                  className="inline-block px-8 py-4 text-gold-500 uppercase tracking-widest text-sm font-bold hover:bg-gold-500 hover:text-navy-900 transition-colors border border-gold-500"
                  style={{
                    background: "rgba(13,36,54,0.4)",
                    backdropFilter: "blur(12px)",
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                >
                  Launch Interactive Map <i className="fa-solid fa-expand ml-2" />
                </Link>
              </div>

              <div
                className="relative h-80 md:h-125 w-full overflow-hidden flex items-center justify-center p-4"
                style={{
                  background: "rgba(13,36,54,0.4)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(212,160,23,0.15)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: "radial-gradient(#D4A017 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
                <div className="relative z-10 text-center">
                  <i className="fa-solid fa-map-location-dot text-6xl text-gold-500/30 mb-4 block" />
                  <p className="text-sm text-slate-500 uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                    Interactive map available on the main platform
                  </p>
                  <Link href="/#map"
                    className="mt-4 inline-flex items-center gap-2 text-gold-500 text-sm hover:text-gold-400 transition-colors"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                    View Pipeline Map <i className="fa-solid fa-arrow-right" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* -- MACRO ANALYTICS --------------------------------- */}
        <section id="industry-data" className="py-32 bg-navy-900">
          <div className="max-w-360 mx-auto px-6 lg:px-12">
            <div className="text-center mb-20">
              <h2
                className="text-4xl md:text-5xl uppercase tracking-tighter text-slate-100 mb-4"
                style={{ fontFamily: "var(--font-oswald), sans-serif" }}
              >
                Macro <span className="text-gold-500">Analytics</span>
              </h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto italic"
                style={{ fontFamily: "var(--font-playfair), serif" }}>
                Proprietary forecasting models for African energy infrastructure investment.
              </p>
            </div>
            <ResearchCharts />
          </div>
        </section>

        {/* -- STRATEGIC QUOTE --------------------------------- */}
        <section className="py-32 bg-navy-800 border-y border-gold-500/10 relative overflow-hidden">
          <div
            className="absolute right-0 top-0 leading-none opacity-10 pointer-events-none select-none text-slate-100"
            style={{ fontFamily: "var(--font-playfair), serif", fontSize: "300px" }}
          >
            &ldquo;
          </div>
          <div className="max-w-250 mx-auto px-6 text-center relative z-10">
            <blockquote
              className="text-3xl md:text-5xl text-slate-100 leading-snug italic mb-12"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              &ldquo;The next decade of African development is inextricably linked to the{" "}
              <span className="text-gold-500">integrity and expansion</span> of our midstream
              infrastructure. APRN provides the technical truth required for capital deployment.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 overflow-hidden border border-gold-500 bg-navy-700 flex items-center justify-center">
                <i className="fa-solid fa-user text-gold-500" />
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-100 tracking-wider uppercase text-sm"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                  Lucy Okeke
                </div>
                <div className="text-slate-500 text-sm italic"
                  style={{ fontFamily: "var(--font-playfair), serif" }}>
                  Founder, APRN
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* -- FOOTER CTA -------------------------------------- */}
        <section className="bg-navy-900 pt-32 pb-24 border-t border-gold-500/20">
          <div className="max-w-360 mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
              <div>
                <h2
                  className="text-5xl md:text-6xl uppercase tracking-tighter text-slate-100 mb-6 leading-none"
                  style={{ fontFamily: "var(--font-oswald), sans-serif" }}
                >
                  Elevate Your<br />
                  <span className="text-gold-500">Strategic Position</span>
                </h2>
                <p className="text-slate-500 text-xl mb-10 max-w-md italic"
                  style={{ fontFamily: "var(--font-playfair), serif" }}>
                  Join leading engineering firms, policy makers, and investors accessing APRN&apos;s
                  premium intelligence network.
                </p>
                <a
                  href="mailto:info@aprn-africa.org"
                  className="inline-block px-8 py-4 bg-gold-500 text-navy-900 uppercase tracking-widest text-sm font-bold hover:bg-gold-400 transition-colors"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Partner With APRN
                </a>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 opacity-50 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500">
                {partnerIcons.map((icon, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center p-6 border border-gold-500/20"
                  >
                    <i className={`${icon} text-4xl text-slate-100`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
