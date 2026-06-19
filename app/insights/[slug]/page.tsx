import { notFound } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { PortableTextRenderer } from "@/components/PortableTextRenderer";
import NewsletterReadPrompt from "@/components/NewsletterReadPrompt";
import { sanityFetch } from "@/lib/sanity/fetch";
import {
  INSIGHT_BY_SLUG_QUERY,
  INSIGHT_SLUGS_QUERY,
  RELATED_INSIGHTS_QUERY,
  type InsightDetail,
  type InsightCard,
  type InsightCategory,
} from "@/lib/queries/insights";

// -- Helpers -------------------------------------------------------------------

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

const categoryMeta: Record<InsightCategory, { label: string; badge: string; dot: string; bar: string }> = {
  intelligence: {
    label: "Intelligence Brief",
    badge: "bg-sky-400/10 border-sky-400/30 text-sky-400",
    dot: "bg-sky-400",
    bar: "bg-sky-400",
  },
  research: {
    label: "Research Report",
    badge: "bg-gold-500/10 border-gold-500/30 text-gold-500",
    dot: "bg-gold-500",
    bar: "bg-gold-500",
  },
  editorial: {
    label: "Editorial Insight",
    badge: "bg-copper-500/10 border-copper-500/30 text-copper-500",
    dot: "bg-copper-500",
    bar: "bg-copper-500",
  },
  publication: {
    label: "Publication",
    badge: "bg-violet-400/10 border-violet-400/30 text-violet-400",
    dot: "bg-violet-400",
    bar: "bg-violet-400",
  },
};

// -- Static params -------------------------------------------------------------

export const dynamicParams = true;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const slugs = await sanityFetch<Array<{ slug: string }>>(INSIGHT_SLUGS_QUERY);
    return (slugs ?? []).filter((s) => Boolean(s.slug));
  } catch {
    return [];
  }
}

// -- Page ----------------------------------------------------------------------

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [article, related] = await Promise.all([
    sanityFetch<InsightDetail | null>(
      INSIGHT_BY_SLUG_QUERY,
      { slug },
      ["researchReport", "editorialInsight", "publication"],
    ),
    sanityFetch<InsightCard[]>(
      RELATED_INSIGHTS_QUERY,
      { slug },
      ["researchReport", "editorialInsight", "publication"],
    ),
  ]);

  if (!article) notFound();

  const meta = categoryMeta[article.category];

  return (
    <>
      <Navigation />
      <main className="bg-navy-900 text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>

        {/* -- HERO --------------------------------------------------- */}
        <header
          className="relative pt-28 pb-16 lg:pb-24 px-6 lg:px-12 min-h-[60vh] flex items-end overflow-hidden"
          style={
            article.heroImage
              ? { backgroundImage: `url('${article.heroImage}')`, backgroundSize: "cover", backgroundPosition: "center" }
              : undefined
          }
        >
          {/* Gradient overlays — stronger when image present */}
          <div className={`absolute inset-0 bg-linear-to-t from-navy-900 ${article.heroImage ? "via-navy-900/75 to-navy-900/30" : "via-navy-900/95 to-navy-900"}`} />
          {article.heroImage && (
            <div className="absolute inset-0 bg-linear-to-r from-navy-900/80 via-navy-900/40 to-transparent" />
          )}

          {/* Grid texture (only when no image) */}
          {!article.heroImage && (
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.5) 39px, rgba(255,255,255,0.5) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.5) 39px, rgba(255,255,255,0.5) 40px)",
              }}
            />
          )}

          <div className="relative z-10 max-w-360 mx-auto w-full">

            {/* Back link */}
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 text-xs text-slate-400 uppercase tracking-widest hover:text-gold-500 transition-colors mb-10"
            >
              <i className="fa-solid fa-arrow-left text-[10px]" />
              Infrastructure Insights
            </Link>

            <div className="max-w-3xl">
              {/* Category + meta row */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className={`inline-flex items-center gap-2 px-3 py-1 border rounded-full text-xs font-semibold uppercase tracking-wider ${meta.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                  {meta.label}
                </span>
                <span className="text-slate-400 text-xs uppercase tracking-wider">
                  {formatDate(article.publishDate)}
                </span>
                {article.estimatedReadTime && (
                  <>
                    <span className="text-navy-700 hidden sm:block">·</span>
                    <span className="text-slate-400 text-xs uppercase tracking-wider">
                      {article.estimatedReadTime} min read
                    </span>
                  </>
                )}
              </div>

              {/* Title */}
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5 text-white"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                {article.title}
              </h1>

              {/* Subtitle */}
              {article.subtitle && (
                <p className="text-lg lg:text-xl text-slate-300 font-light leading-relaxed max-w-2xl mb-8">
                  {article.subtitle}
                </p>
              )}

              {/* Author row */}
              <div className="flex items-center gap-3 pt-6 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-navy-700 border border-gold-500/30 overflow-hidden shrink-0 flex items-center justify-center">
                  {article.authorImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={article.authorImage}
                      alt={article.authorName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <i className="fa-solid fa-user text-gold-500 text-sm" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{article.authorName}</div>
                  <div className="text-xs text-slate-400">{article.authorRole}</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* -- KEY INSIGHTS ------------------------------------------- */}
        {article.keyInsights && article.keyInsights.length > 0 && (
          <section className="border-b border-navy-800 bg-navy-800/50">
            <div className="max-w-360 mx-auto px-6 lg:px-12 py-10">
              <p className="text-[10px] font-bold text-gold-500 uppercase tracking-widest mb-6">
                Key Intelligence
              </p>
              {/* Mobile: horizontal scroll / Desktop: grid */}
              <div className="flex gap-4 overflow-x-auto pb-2 lg:pb-0 lg:grid lg:grid-cols-4 scrollbar-hide">
                {article.keyInsights.map((insight, i) => (
                  <div
                    key={i}
                    className="shrink-0 w-52 lg:w-auto glass-panel border border-navy-700 p-5 rounded-sm"
                  >
                    {insight.icon && (
                      <i className={`fa-solid ${insight.icon} text-gold-500 mb-3 block text-lg`} />
                    )}
                    <div
                      className="text-3xl font-bold text-white mb-1 leading-none"
                      style={{ fontFamily: "var(--font-oswald), sans-serif" }}
                    >
                      {insight.value}
                    </div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider leading-tight">
                      {insight.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* -- BODY + SIDEBAR ------------------------------------------ */}
        <div className="max-w-360 mx-auto px-6 lg:px-12 py-12 lg:py-20">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

            {/* -- Article body --------------------------------------- */}
            <article className="w-full lg:flex-1 min-w-0">

              {/* Excerpt / executive summary if no body */}
              {(!article.body || article.body.length === 0) && article.excerpt && (
                <div className="border-l-4 border-gold-500 pl-6 mb-10">
                  <p
                    className="text-xl leading-9 text-slate-300 italic"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    {article.excerpt}
                  </p>
                </div>
              )}

              {/* Pull quote (no body) */}
              {article.pullQuote && (!article.body || article.body.length === 0) && (
                <blockquote className="border-l-4 border-gold-500/50 pl-6 my-10">
                  <p
                    className="text-2xl italic leading-relaxed text-gold-500"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    &ldquo;{article.pullQuote}&rdquo;
                  </p>
                  <cite className="block mt-4 text-xs text-slate-500 not-italic uppercase tracking-wider">
                    — {article.authorName}
                  </cite>
                </blockquote>
              )}

              {/* Body text */}
              {article.body && article.body.length > 0 && (
                <div className="prose-article">
                  <PortableTextRenderer value={article.body} />
                </div>
              )}

              {/* Newsletter prompt — fires when reader reaches end of article */}
              {article.body && article.body.length > 0 && <NewsletterReadPrompt />}

              {/* -- Author card (mobile — below body) -- */}
              <div className="lg:hidden mt-12 pt-8 border-t border-navy-800">
                <AuthorCard authorName={article.authorName} authorRole={article.authorRole} publishDate={article.publishDate} category={meta.label} estimatedReadTime={article.estimatedReadTime} />
              </div>
            </article>

            {/* -- Sticky sidebar (desktop only) ----------------------- */}
            <aside className="hidden lg:block w-80 shrink-0">
              <div className="sticky top-28 space-y-5">

                <AuthorCard authorName={article.authorName} authorRole={article.authorRole} publishDate={article.publishDate} category={meta.label} estimatedReadTime={article.estimatedReadTime} />

                {/* Category accent bar */}
                <div className={`h-0.5 w-full rounded-full ${meta.bar}`} />

                {/* CTA */}
                <div className="bg-navy-800 border border-gold-500/20 p-6 rounded-sm">
                  <p className="text-[10px] font-bold text-gold-500 uppercase tracking-widest mb-3">
                    Access Full Intelligence
                  </p>
                  <h4 className="text-sm font-bold text-white mb-2 leading-snug">
                    Partner with APRN
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-5">
                    Institutional partners get access to the full research library, data platform, and weekly intelligence briefings.
                  </p>
                  <Link
                    href="/contact"
                    className="block text-center py-3 text-xs font-bold uppercase tracking-wider bg-gold-500 hover:bg-gold-400 text-navy-900 transition-colors rounded-sm"
                  >
                    Get in Touch
                  </Link>
                  <Link
                    href="/newsletter"
                    className="block text-center py-2.5 mt-2 text-xs font-semibold uppercase tracking-wider border border-navy-700 hover:border-gold-500/40 text-slate-400 hover:text-white transition-colors rounded-sm"
                  >
                    Subscribe to Briefing
                  </Link>
                </div>

              </div>
            </aside>

          </div>
        </div>

        {/* -- PULL QUOTE BANNER --------------------------------------- */}
        {article.pullQuote && article.body && article.body.length > 0 && (
          <section className="py-20 px-6 lg:px-12 bg-navy-800 border-y border-navy-700 relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ backgroundImage: "radial-gradient(ellipse at 50% 50%, rgba(212,160,23,0.06) 0%, transparent 70%)" }}
            />
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <i className="fa-solid fa-quote-left text-gold-500/15 text-7xl mb-6 block" />
              <blockquote
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-6 italic"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                &ldquo;{article.pullQuote}&rdquo;
              </blockquote>
              <cite className="text-slate-500 text-sm not-italic">
                — {article.authorName}, {article.authorRole}
              </cite>
            </div>
          </section>
        )}

        {/* -- MOBILE CTA --------------------------------------------- */}
        <section className="lg:hidden py-12 px-6 bg-navy-800 border-t border-navy-700">
          <div className="text-center">
            <p className="text-xs text-gold-500 uppercase tracking-widest font-semibold mb-3">
              Access Full Intelligence
            </p>
            <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair), serif" }}>
              Partner with APRN
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Get in Touch <i className="fa-solid fa-arrow-right" />
              </Link>
              <Link
                href="/newsletter"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-navy-700 hover:border-gold-500/40 text-slate-300 text-xs uppercase tracking-wider transition-colors"
              >
                Subscribe Free
              </Link>
            </div>
          </div>
        </section>

        {/* -- RELATED RESEARCH --------------------------------------- */}
        {related.length > 0 && (
          <section className="py-16 lg:py-20 px-6 lg:px-12 border-t border-navy-800">
            <div className="max-w-360 mx-auto">
              <div className="flex items-center justify-between mb-8">
                <p className="text-xs font-bold text-gold-500 uppercase tracking-widest">
                  Related Research
                </p>
                <Link
                  href="/insights"
                  className="text-xs text-slate-400 hover:text-gold-500 uppercase tracking-widest transition-colors"
                >
                  All Insights →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((rel) => {
                  const relMeta = categoryMeta[rel.category];
                  return (
                    <Link
                      key={rel._id}
                      href={`/insights/${rel.slug}`}
                      className="group block glass-panel border border-navy-700 hover:border-gold-500/40 transition-all rounded-sm overflow-hidden"
                    >
                      {/* Image or placeholder */}
                      <div
                        className="h-40 bg-cover bg-center relative bg-navy-800"
                        style={{ backgroundImage: rel.heroImage ? `url('${rel.heroImage}')` : undefined }}
                      >
                        <div className="absolute inset-0 bg-navy-900/50 group-hover:bg-navy-900/30 transition-colors" />
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-navy-900 to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 border rounded-full text-[10px] font-semibold uppercase tracking-wider ${relMeta.badge}`}>
                            {relMeta.label}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h4
                          className="text-sm font-bold leading-snug group-hover:text-gold-500 transition-colors mb-2 text-white"
                          style={{ fontFamily: "var(--font-playfair), serif" }}
                        >
                          {rel.title}
                        </h4>
                        {rel.excerpt && (
                          <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">
                            {rel.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 uppercase tracking-wider">
                          <span>{formatDate(rel.publishDate)}</span>
                          {rel.estimatedReadTime && (
                            <>
                              <span>·</span>
                              <span>{rel.estimatedReadTime} min</span>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* -- BOTTOM CTA --------------------------------------------- */}
        <section className="py-24 px-6 border-t border-navy-800 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(ellipse at 50% 50%, rgba(212,160,23,0.05) 0%, transparent 70%)" }}
          />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <p className="text-xs tracking-[0.3em] text-gold-500 mb-6 uppercase">Explore More</p>
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-oswald), sans-serif" }}
            >
              Access Africa&apos;s Premier{" "}
              <span className="text-gold-500">Engineering Intelligence</span>
            </h2>
            <p className="text-slate-400 mb-8 leading-relaxed max-w-xl mx-auto">
              Commission research, access the full intelligence database, or collaborate on a technical publication.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/insights"
                className="inline-flex items-center justify-center gap-3 border border-gold-500 px-8 py-4 text-sm font-medium tracking-widest uppercase text-gold-500 hover:bg-gold-500 hover:text-navy-900 transition-all"
              >
                All Research <i className="fa-solid fa-arrow-right" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 border border-white/20 px-8 py-4 text-sm font-medium tracking-widest uppercase text-white hover:bg-white hover:text-navy-900 transition-all"
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

// -- Author card component (shared between mobile + desktop) -------------------

function AuthorCard({
  authorName,
  authorRole,
  publishDate,
  category,
  estimatedReadTime,
}: {
  authorName: string;
  authorRole: string;
  publishDate: string;
  category: string;
  estimatedReadTime?: number;
}) {
  return (
    <div className="glass-panel border border-navy-700 p-5 rounded-sm">
      <p className="text-[10px] font-bold text-gold-500 uppercase tracking-widest mb-4">Author</p>
      <div className="flex items-center gap-3 mb-5 pb-5 border-b border-navy-700">
        <div className="w-11 h-11 rounded-full bg-navy-700 border border-gold-500/30 flex items-center justify-center shrink-0">
          <i className="fa-solid fa-user text-gold-500 text-sm" />
        </div>
        <div>
          <div className="text-sm font-bold text-white">{authorName}</div>
          <div className="text-xs text-slate-400 leading-tight mt-0.5">{authorRole}</div>
        </div>
      </div>
      <div className="space-y-2.5 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-500">Category</span>
          <span className="text-slate-300 font-medium">{category}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Published</span>
          <span className="text-slate-300 font-medium">
            {new Date(publishDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
        {estimatedReadTime && (
          <div className="flex justify-between">
            <span className="text-slate-500">Read time</span>
            <span className="text-slate-300 font-medium">{estimatedReadTime} min</span>
          </div>
        )}
      </div>
    </div>
  );
}
