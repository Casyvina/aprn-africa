import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ResearchCharts from "@/components/ResearchCharts";
import SaveButton from "@/components/SaveButton";
import { sanityFetch } from "@/lib/sanity/fetch";
import { RESEARCH_PAGE_QUERY, type ResearchPageResult, type ResearchPageCard } from "@/lib/queries/research";

const FALLBACK_FEATURED: ResearchPageCard = {
  _id: "f1",
  title: "Africa's Pipeline Infrastructure: 2026 Outlook",
  slug: "africa-pipeline-infrastructure-2026-outlook",
  reportType: "flagship",
  publishDate: "2026-01-15",
  executiveSummary: "A comprehensive analysis of Africa's 12,400km pipeline construction boom — mapping $42.5B in CapEx across 6 corridors, from the 6,900km NMGP to EACOP, with confirmed US strategic interest.",
  estimatedReadTime: 35,
  pageCount: 84,
  topics: [{ name: "Infrastructure" }, { name: "Finance" }, { name: "Geopolitics" }],
};

const FALLBACK_SECONDARY: ResearchPageCard[] = [
  {
    _id: "f2",
    title: "West Africa Gas Policy Framework: A Decade Review",
    slug: "west-africa-gas-policy-framework-decade-review",
    reportType: "policy-brief",
    publishDate: "2026-03-01",
    executiveSummary: "Ten years of WAGP Treaty performance reviewed — lessons for the NMGP governance architecture.",
    topics: [{ name: "Policy" }, { name: "Geopolitics" }],
  },
  {
    _id: "f3",
    title: "Africa's Pipeline Training & Research Landscape: A Competitive Analysis",
    slug: "africa-pipeline-training-research-competitive-analysis-2026",
    reportType: "working-paper",
    publishDate: "2026-05-01",
    executiveSummary: "Maps every organisation in the African pipeline training space — and the structural gap APRN exists to fill.",
    topics: [{ name: "Training" }, { name: "Policy" }],
  },
];

function formatQuarter(iso: string) {
  const d = new Date(iso);
  const q = Math.ceil((d.getMonth() + 1) / 3);
  return `Q${q} ${d.getFullYear()}`;
}

const TYPE_LABEL: Record<string, string> = {
  flagship: "Flagship Report",
  "policy-brief": "Policy Brief",
  "working-paper": "Working Paper",
  briefing: "Intelligence Brief",
  audit: "Audit",
};

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

export default async function ResearchPage() {
  let featured = FALLBACK_FEATURED;
  let secondary = FALLBACK_SECONDARY;

  try {
    const result = await sanityFetch<ResearchPageResult>(RESEARCH_PAGE_QUERY, {}, ["researchReport"]);
    if (result?.featured) featured = result.featured;
    if (result?.secondary?.length) secondary = result.secondary;
  } catch { /* use fallbacks */ }

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

          {/* Scroll indicator */}
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
              <Link href="/insights" className="text-gold-500 text-sm tracking-widest uppercase hover:text-slate-100 transition-colors mt-6 md:mt-0 flex items-center gap-2"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                All Reports <i className="fa-solid fa-arrow-right" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main feature */}
              <div className="lg:col-span-8 relative group overflow-hidden rounded-sm bg-navy-800">
                <Link href={`/research/${featured.slug}`} className="block cursor-pointer">
                  <div className="h-80 sm:h-110 lg:h-150 w-full relative">
                    <Image
                      src="/images/hero-pipeline.jpg"
                      alt={featured.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-700 mix-blend-luminosity"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-navy-900 via-navy-900/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                      <div className="flex gap-3 mb-4">
                        <span className="px-3 py-1 bg-gold-500 text-navy-900 text-xs font-bold uppercase tracking-wider"
                          style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                          {TYPE_LABEL[featured.reportType] ?? "Report"}
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
                      <p className="text-slate-500 text-lg mb-6 max-w-2xl hidden md:block italic"
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

              {/* Secondary features */}
              <div className="lg:col-span-4 flex flex-col gap-8">
                {secondary.map((card) => (
                  <div
                    key={card._id}
                    className="flex-1 relative group flex flex-col overflow-hidden rounded-sm border border-gold-500/10 hover:border-gold-500/40 transition-colors"
                    style={{ background: "linear-gradient(to bottom, #0D2436, #071B2A)" }}
                  >
                    <Link
                      href={`/research/${card.slug}`}
                      className="flex-1 flex flex-col justify-end p-8 cursor-pointer"
                    >
                      <span className="text-gold-500 text-xs font-bold uppercase tracking-wider mb-4 block"
                        style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                        {TYPE_LABEL[card.reportType] ?? "Report"}
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
                      <span className="text-xs tracking-widest text-slate-100 uppercase border-b border-gold-500/30 pb-1 self-start"
                        style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                        Read Report →
                      </span>
                    </Link>
                    <SaveButton
                      itemId={card._id}
                      itemType="researchReport"
                      itemSlug={card.slug}
                      itemTitle={card.title}
                      className="absolute top-4 right-4 z-10"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* -- CONTINENTAL CORRIDORS + MAP --------------------- */}
        <section id="data-map" className="py-24 bg-navy-800 relative border-y border-gold-500/10">
          <div className="max-w-360 mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Stats side */}
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

              {/* Map visual */}
              <div
                className="relative h-80 md:h-125 w-full rounded-sm overflow-hidden flex items-center justify-center p-4"
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

        {/* -- MACRO ANALYTICS (Plotly charts) ---------------- */}
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
              <div className="w-12 h-12 rounded-full overflow-hidden border border-gold-500 bg-navy-700 flex items-center justify-center">
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

              {/* Partner logos */}
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
