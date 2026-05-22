import { notFound } from "next/navigation";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "next-sanity";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TableOfContents from "@/components/TableOfContents";
import { extractHeadings } from "@/lib/extractHeadings";
import { sanityFetch } from "@/lib/sanity/fetch";
import {
  RESEARCH_BY_SLUG_QUERY,
  RESEARCH_SLUGS_QUERY,
  type ResearchReportDetail,
  type RelatedResearchCard,
} from "@/lib/queries/research";

// -- Helpers -------------------------------------------------------------------

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

const REPORT_TYPE_LABELS: Record<string, string> = {
  flagship:              "Flagship Report",
  "policy-brief":        "Policy Brief",
  "technical-assessment":"Technical Assessment",
  briefing:              "Intelligence Brief",
  "sector-analysis":     "Sector Analysis",
};

function reportTypeLabel(type?: string): string {
  if (!type) return "Research Report";
  return REPORT_TYPE_LABELS[type] ?? type.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// -- Light-themed PortableText components -------------------------------------

const lightComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p
        className="leading-8 text-lg mb-6"
        style={{ color: "#1e3a4f", fontFamily: "var(--font-inter), sans-serif" }}
      >
        {children}
      </p>
    ),
    h2: ({ children, value }) => {
      const id = (value?.children ?? []).map(// eslint-disable-next-line @typescript-eslint/no-explicit-any
(c: any) => c.text ?? "").join("").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      return (
        <h2
          id={id}
          className="text-3xl font-bold mt-12 mb-4 pt-6 border-t border-slate-200 scroll-mt-24"
          style={{ color: "#071B2A", fontFamily: "var(--font-playfair), serif" }}
        >
          {children}
        </h2>
      );
    },
    h3: ({ children, value }) => {
      const id = (value?.children ?? []).map(// eslint-disable-next-line @typescript-eslint/no-explicit-any
(c: any) => c.text ?? "").join("").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      return (
        <h3
          id={id}
          className="text-2xl font-bold mt-10 mb-3 scroll-mt-24"
          style={{ color: "#071B2A", fontFamily: "var(--font-playfair), serif" }}
        >
          {children}
        </h3>
      );
    },
    h4: ({ children }) => (
      <h4
        className="text-xl font-bold mt-8 mb-3"
        style={{ color: "#071B2A", fontFamily: "var(--font-playfair), serif" }}
      >
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gold-500 pl-6 my-10 py-1">
        <p
          className="text-xl text-gold-500 italic leading-relaxed"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          {children}
        </p>
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong style={{ fontWeight: 700, color: "#071B2A" }}>{children}</strong>
    ),
    em: ({ children }) => (
      <em style={{ fontStyle: "italic", color: "#1e3a4f" }}>{children}</em>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.blank ? "_blank" : undefined}
        rel={value?.blank ? "noopener noreferrer" : undefined}
        className="text-gold-500 underline underline-offset-2 hover:text-gold-400 transition-colors"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-outside pl-6 space-y-2 mb-6" style={{ color: "#1e3a4f" }}>
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-outside pl-6 space-y-2 mb-6" style={{ color: "#1e3a4f" }}>
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-7">{children}</li>,
    number: ({ children }) => <li className="leading-7">{children}</li>,
  },
  types: {
    image: ({ value }: { value: { asset?: { url?: string }; alt?: string; caption?: string } }) =>
      value.asset?.url ? (
        <figure className="my-10">
          <img src={value.asset.url} alt={value.alt ?? ""} className="w-full rounded-sm" />
          {value.caption && (
            <figcaption className="text-center text-xs text-slate-400 mt-3 uppercase tracking-wider">
              {value.caption}
            </figcaption>
          )}
        </figure>
      ) : null,
  },
};

// -- Static params -------------------------------------------------------------

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const slugs = await sanityFetch<Array<{ slug: string }>>(RESEARCH_SLUGS_QUERY);
  return slugs.filter((s) => Boolean(s.slug));
}

// -- Page ----------------------------------------------------------------------

export default async function ResearchReportPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const report = await sanityFetch<ResearchReportDetail | null>(
    RESEARCH_BY_SLUG_QUERY,
    { slug },
    ["researchReport"],
  );

  if (!report) notFound();

  const related: RelatedResearchCard[] = report.relatedReports ?? [];
  const typeLabel = reportTypeLabel(report.reportType);
  const tocHeadings = extractHeadings(report.body ?? []);

  return (
    <>
      <Navigation />
      <main style={{ backgroundColor: "#F5F7FA", fontFamily: "var(--font-inter), sans-serif" }}>

        {/* -- Cinematic Hero ---------------------------------------- */}
        <header
          className="relative pt-28 pb-16 lg:pb-24 px-6 lg:px-12 min-h-[65vh] flex items-end overflow-hidden"
          style={
            report.coverImageUrl
              ? { backgroundImage: `url('${report.coverImageUrl}')`, backgroundSize: "cover", backgroundPosition: "center" }
              : { backgroundColor: "#071B2A" }
          }
        >
          {/* Gradient overlays */}
          <div className={`absolute inset-0 bg-linear-to-t from-navy-900 ${report.coverImageUrl ? "via-navy-900/70 to-navy-900/30" : "via-navy-900 to-navy-900"}`} />
          <div className="absolute inset-0 bg-linear-to-r from-navy-900 via-navy-900/60 to-transparent" />
          {/* Grid texture when no image */}
          {!report.coverImageUrl && (
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.5) 39px, rgba(255,255,255,0.5) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.5) 39px, rgba(255,255,255,0.5) 40px)",
              }}
            />
          )}

          <div className="relative z-10 w-full max-w-360 mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs uppercase tracking-widest mb-10">
              <Link href="/" className="text-slate-400 hover:text-gold-500 transition-colors">Home</Link>
              <i className="fa-solid fa-chevron-right text-[8px] text-slate-600" />
              <Link href="/research" className="text-slate-400 hover:text-gold-500 transition-colors">Research</Link>
              <i className="fa-solid fa-chevron-right text-[8px] text-slate-600" />
              <span className="text-slate-300 truncate max-w-50">{report.title}</span>
            </nav>

            <div className="grid lg:grid-cols-12 gap-10 items-end">
              {/* Left: title block */}
              <div className="lg:col-span-8">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span
                    className="px-3 py-1 text-xs font-bold uppercase tracking-widest border rounded-full"
                    style={{ backgroundColor: "rgba(212,160,23,0.12)", borderColor: "rgba(212,160,23,0.4)", color: "#D4A017" }}
                  >
                    {typeLabel}
                  </span>
                  <span className="text-slate-400 text-xs uppercase tracking-wider">
                    {formatDate(report.publishDate)}
                  </span>
                </div>

                <h1
                  className="text-4xl lg:text-6xl font-bold leading-tight mb-6 text-white"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  {report.title}
                </h1>

                {report.executiveSummary && (
                  <p className="text-lg leading-relaxed max-w-2xl text-slate-300 font-light"
                    style={{ fontFamily: "var(--font-playfair), serif", fontStyle: "italic" }}
                  >
                    {report.executiveSummary.slice(0, 240)}{report.executiveSummary.length > 240 ? "…" : ""}
                  </p>
                )}
              </div>

              {/* Right: author + download card — floats over hero on desktop */}
              <div className="lg:col-span-4">
                <div className="bg-white/95 backdrop-blur-sm border border-slate-200 p-6 rounded-sm shadow-lg">
                  <div className="text-[10px] font-semibold uppercase tracking-widest mb-4 text-slate-400">
                    Lead Author
                  </div>
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#071B2A" }}>
                      <i className="fa-solid fa-user text-gold-500 text-sm" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: "#071B2A" }}>{report.authorName}</div>
                      <div className="text-xs mt-0.5 text-slate-400">{report.authorRole}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {report.pdfUrl ? (
                      <a
                        href={report.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 text-xs font-bold uppercase tracking-wider transition-colors"
                        style={{ backgroundColor: "#D4A017", color: "#071B2A" }}
                      >
                        <i className="fa-regular fa-file-pdf" />
                        Download PDF
                      </a>
                    ) : (
                      <Link
                        href="/contact"
                        className="flex items-center justify-center gap-2 w-full py-3 text-xs font-bold uppercase tracking-wider"
                        style={{ backgroundColor: "#D4A017", color: "#071B2A" }}
                      >
                        <i className="fa-solid fa-lock text-xs" />
                        Request Access
                      </Link>
                    )}
                    <Link
                      href="/contact"
                      className="flex items-center justify-center w-full py-2.5 text-xs uppercase tracking-wider border border-slate-200 hover:border-slate-400 transition-colors"
                      style={{ color: "#64748b" }}
                    >
                      Partner With APRN →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* -- Content: Executive summary + body + sticky metrics -- */}
        <section className="py-20 px-6 lg:px-12" style={{ backgroundColor: "#F5F7FA" }}>
          <div className="max-w-360 mx-auto grid lg:grid-cols-12 gap-16">

            {/* -- Left: article body (8 cols) -- */}
            <article className="lg:col-span-8">

              {/* Executive summary block */}
              {report.executiveSummary && (
                <div className="mb-14">
                  <p
                    className="text-[10px] font-semibold uppercase tracking-widest mb-5"
                    style={{ color: "#D4A017" }}
                  >
                    Executive Summary
                  </p>
                  <div
                    className="border-l-4 pl-8 py-2"
                    style={{ borderColor: "#D4A017" }}
                  >
                    <p
                      className="text-xl leading-9"
                      style={{
                        color: "#1e3a4f",
                        fontFamily: "var(--font-playfair), serif",
                        fontStyle: "italic",
                      }}
                    >
                      {report.executiveSummary}
                    </p>
                  </div>
                </div>
              )}

              {/* Pull quote (if no body yet) */}
              {report.pullQuote && !report.body?.length && (
                <blockquote className="border-l-4 border-gold-500 pl-6 my-10 py-1">
                  <p
                    className="text-2xl italic leading-relaxed"
                    style={{ color: "#D4A017", fontFamily: "var(--font-playfair), serif" }}
                  >
                    &ldquo;{report.pullQuote}&rdquo;
                  </p>
                </blockquote>
              )}

              {/* Full body */}
              {report.body && report.body.length > 0 && (
                <PortableText value={report.body} components={lightComponents} />
              )}

            </article>

            {/* -- Right: sticky sidebar (4 cols) -- */}
            <aside className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">

                {/* Table of Contents */}
                {tocHeadings.length > 0 && (
                  <TableOfContents headings={tocHeadings} />
                )}

                {/* Key metrics panel */}
                {report.keyInsights && report.keyInsights.length > 0 && (
                  <div className="rounded-sm overflow-hidden" style={{ backgroundColor: "#071B2A" }}>
                    <div className="px-6 py-5 border-b border-navy-800">
                      <p
                        className="text-[10px] font-semibold uppercase tracking-widest"
                        style={{ color: "#D4A017" }}
                      >
                        Key Metrics
                      </p>
                    </div>
                    <div className="p-6 space-y-6">
                      {report.keyInsights.map((metric, i) => (
                        <div
                          key={i}
                          className={i < report.keyInsights!.length - 1 ? "pb-6 border-b border-navy-800" : ""}
                        >
                          <div
                            className="text-4xl font-bold text-white leading-none mb-1"
                            style={{ fontFamily: "var(--font-oswald), sans-serif" }}
                          >
                            {metric.value}
                            {metric.unit && (
                              <span
                                className="text-xl ml-1"
                                style={{ color: "#D4A017" }}
                              >
                                {metric.unit}
                              </span>
                            )}
                          </div>
                          <div
                            className="text-[11px] uppercase tracking-wider mt-1"
                            style={{ color: "#94a3b8" }}
                          >
                            {metric.label}
                          </div>
                          {metric.trend && (
                            <div
                              className="text-xs mt-1.5 font-medium"
                              style={{ color: "#D4A017" }}
                            >
                              {metric.trend}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Publication details */}
                <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm">
                  <p
                    className="text-[10px] font-semibold uppercase tracking-widest mb-4"
                    style={{ color: "#94a3b8" }}
                  >
                    Publication Details
                  </p>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span style={{ color: "#94a3b8" }}>Category</span>
                      <span style={{ color: "#071B2A" }} className="font-medium">{typeLabel}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ color: "#94a3b8" }}>Published</span>
                      <span style={{ color: "#071B2A" }} className="font-medium">{formatDate(report.publishDate)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ color: "#94a3b8" }}>Author</span>
                      <span style={{ color: "#071B2A" }} className="font-medium text-right max-w-35 leading-tight">
                        {report.authorName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div
                  className="border rounded-sm p-6"
                  style={{ backgroundColor: "rgba(212,160,23,0.05)", borderColor: "rgba(212,160,23,0.2)" }}
                >
                  <h4 className="text-sm font-bold mb-2" style={{ color: "#071B2A" }}>
                    Access Full Database
                  </h4>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: "#64748b" }}>
                    APRN partners get access to the complete research library, data platform, and
                    intelligence briefings.
                  </p>
                  <Link
                    href="/contact"
                    className="block text-center py-3 text-xs font-bold uppercase tracking-wider transition-colors"
                    style={{ backgroundColor: "#D4A017", color: "#071B2A" }}
                  >
                    Partner With APRN
                  </Link>
                </div>

              </div>
            </aside>

          </div>
        </section>

        {/* -- Pull Quote banner ------------------------------------- */}
        {report.pullQuote && (
          <section
            className="py-20 px-6 lg:px-12"
            style={{ backgroundColor: "#071B2A" }}
          >
            <div className="max-w-4xl mx-auto text-center">
              <i
                className="fa-solid fa-quote-left text-7xl mb-8 block"
                style={{ color: "rgba(212,160,23,0.15)" }}
              />
              <blockquote
                className="text-3xl md:text-4xl font-bold leading-tight mb-8 italic text-white"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                &ldquo;{report.pullQuote}&rdquo;
              </blockquote>
              <cite className="text-sm not-italic" style={{ color: "#64748b" }}>
                — {report.authorName}, {report.authorRole}
              </cite>
            </div>
          </section>
        )}

        {/* -- Related Research -------------------------------------- */}
        {related.length > 0 && (
          <section className="py-20 px-6 lg:px-12 border-t border-slate-200 bg-white">
            <div className="max-w-360 mx-auto">
              <p
                className="text-[10px] font-semibold uppercase tracking-widest mb-10"
                style={{ color: "#D4A017" }}
              >
                Related Research
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                {related.map((rel) => (
                  <Link
                    key={rel._id}
                    href={`/research/${rel.slug}`}
                    className="group block border-t-2 border-transparent hover:border-gold-500 pt-6 transition-colors"
                  >
                    {rel.coverImageUrl && (
                      <div
                        className="h-44 bg-cover bg-center mb-5 overflow-hidden rounded-sm"
                        style={{ backgroundImage: `url('${rel.coverImageUrl}')` }}
                      />
                    )}
                    <div
                      className="text-[10px] font-bold uppercase tracking-widest mb-2"
                      style={{ color: "#D4A017" }}
                    >
                      {reportTypeLabel(rel.reportType)}
                    </div>
                    <h4
                      className="text-base font-bold leading-snug mb-3 transition-colors group-hover:text-gold-500"
                      style={{ color: "#071B2A", fontFamily: "var(--font-playfair), serif" }}
                    >
                      {rel.title}
                    </h4>
                    <div className="text-xs" style={{ color: "#94a3b8" }}>
                      {formatDate(rel.publishDate)}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* -- Bottom CTA -------------------------------------------- */}
        <section
          className="py-24 px-6 lg:px-12 border-t border-slate-200"
          style={{ backgroundColor: "#F5F7FA" }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.3em] mb-6"
              style={{ color: "#D4A017" }}
            >
              Explore More
            </p>
            <h2
              className="text-3xl md:text-5xl font-bold leading-tight mb-10"
              style={{ color: "#071B2A", fontFamily: "var(--font-oswald), sans-serif" }}
            >
              Africa&apos;s Premier{" "}
              <span style={{ color: "#D4A017" }}>Engineering Intelligence</span>
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/research"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors"
                style={{
                  backgroundColor: "#071B2A",
                  color: "#ffffff",
                }}
              >
                Research Library <i className="fa-solid fa-arrow-right" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 border px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors hover:bg-navy-900 hover:text-white"
                style={{
                  borderColor: "#071B2A",
                  color: "#071B2A",
                }}
              >
                Partner With APRN
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
