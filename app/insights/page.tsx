import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import InsightGrid from "@/components/InsightGrid";
import { sanityFetch } from "@/lib/sanity/fetch";
import { ALL_INSIGHTS_QUERY, PAGE_SIZE, type InsightCard, type InsightCategory } from "@/lib/queries/insights";

// -- Helpers ------------------------------------------------------------------

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function formatReadTime(mins?: number): string {
  return mins ? `${mins} min read` : "";
}

const categoryMeta: Record<InsightCategory, { label: string; badge: string; dot: string }> = {
  intelligence: {
    label: "Intelligence Brief",
    badge: "bg-sky-400/10 border-sky-400/30 text-sky-400",
    dot: "bg-sky-400",
  },
  research: {
    label: "Research Report",
    badge: "bg-gold-500/10 border-gold-500/30 text-gold-500",
    dot: "bg-gold-500",
  },
  editorial: {
    label: "Editorial Insight",
    badge: "bg-copper-500/10 border-copper-500/30 text-copper-500",
    dot: "bg-copper-500",
  },
  publication: {
    label: "Publication",
    badge: "bg-violet-400/10 border-violet-400/30 text-violet-400",
    dot: "bg-violet-400",
  },
};

// -- Page ---------------------------------------------------------------------

export default async function InsightsPage() {
  const allInsights = await sanityFetch<InsightCard[]>(
    ALL_INSIGHTS_QUERY,
    {},
    ["researchReport", "editorialInsight", "publication"],
  );

  const featured = allInsights.find((a) => a.featured) ?? allInsights[0];
  const rest = allInsights.filter((a) => a.slug !== featured?.slug);
  // initial offset = featured(1) + grid items shown; hasMore if we got a full batch
  const initialOffset = PAGE_SIZE + 1;
  const hasMoreInitial = allInsights.length === PAGE_SIZE + 1;

  if (!featured) {
    return (
      <>
        <Navigation />
        <main className="bg-navy-900 text-white min-h-screen flex items-center justify-center">
          <p className="text-slate-400 text-lg">No insights published yet.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main id="main-content" className="bg-navy-900 text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>

        {/* -- Hero ------------------------------------------------ */}
        <section className="pt-32 pb-16 px-6 lg:px-12 border-b border-navy-800">
          <div className="max-w-360 mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-gold-500/30 rounded-full bg-gold-500/10">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
              <span className="text-xs font-semibold text-gold-500 uppercase tracking-widest">APRN Publishing</span>
            </div>
            <h1
              className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 leading-tight"
              style={{ fontFamily: "var(--font-oswald), sans-serif" }}
            >
              Infrastructure <span className="text-gold-500">Insights</span>
            </h1>
            <p className="text-slate-400 text-xl max-w-2xl leading-relaxed">
              Intelligence briefs, research reports, and editorial insights shaping Africa&apos;s engineering and pipeline future.
            </p>

            {/* Category legend */}
            <div className="flex flex-wrap gap-4 mt-10">
              {(Object.entries(categoryMeta) as [InsightCategory, typeof categoryMeta[InsightCategory]][]).map(([, meta]) => (
                <span
                  key={meta.label}
                  className={`inline-flex items-center gap-2 px-3 py-1 border rounded-full text-xs font-semibold uppercase tracking-wider ${meta.badge}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                  {meta.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* -- Featured Article ------------------------------------- */}
        <section className="py-16 px-6 lg:px-12 border-b border-navy-800">
          <div className="max-w-360 mx-auto">
            <p className="text-xs text-gold-500 uppercase tracking-widest font-semibold mb-8">Featured</p>
            <Link
              href={`/insights/${featured.slug}`}
              className="group block lg:grid lg:grid-cols-12 gap-6 lg:gap-12 items-center"
            >
              <div
                className="lg:col-span-7 aspect-video bg-cover bg-center rounded-sm overflow-hidden mb-8 lg:mb-0 relative"
                style={{ backgroundImage: featured.heroImage ? `url('${featured.heroImage}')` : undefined }}
              >
                <div className="absolute inset-0 bg-navy-900/40 group-hover:bg-navy-900/20 transition-colors" />
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 border rounded-full text-xs font-semibold uppercase tracking-wider ${categoryMeta[featured.category].badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${categoryMeta[featured.category].dot}`} />
                    {categoryMeta[featured.category].label}
                  </span>
                </div>
              </div>
              <div className="lg:col-span-5">
                <h2
                  className="text-3xl lg:text-4xl font-bold mb-4 leading-tight group-hover:text-gold-500 transition-colors"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  {featured.title}
                </h2>
                <p className="text-slate-400 leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 uppercase tracking-wider">
                  <span>{formatDate(featured.publishDate)}</span>
                  {featured.estimatedReadTime && (
                    <>
                      <span className="text-navy-700">·</span>
                      <span>{formatReadTime(featured.estimatedReadTime)}</span>
                    </>
                  )}
                  <span className="text-navy-700">·</span>
                  <span>{featured.authorName}</span>
                </div>
                <div className="mt-6 inline-flex items-center gap-2 text-xs text-gold-500 uppercase tracking-widest font-semibold group-hover:gap-3 transition-all">
                  Read Brief <i className="fa-solid fa-arrow-right text-[10px]" />
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* -- Article Grid ----------------------------------------- */}
        <section className="py-16 px-6 lg:px-12">
          <div className="max-w-360 mx-auto">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-10">All Publications</p>
            <InsightGrid
              initial={rest}
              initialOffset={initialOffset}
              hasMoreInitial={hasMoreInitial}
            />
          </div>
        </section>

        {/* -- CTA ---------------------------------------------------- */}
        <section className="py-24 px-6 border-t border-navy-800 bg-navy-800 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(ellipse at 50% 50%, rgba(212,160,23,0.05) 0%, transparent 70%)" }}
          />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <p className="text-xs tracking-[0.3em] text-gold-500 mb-6 uppercase">Partner With APRN</p>
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-oswald), sans-serif" }}
            >
              Access Africa&apos;s Premier <span className="text-gold-500">Engineering Intelligence</span>
            </h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Commission research, access the full intelligence database, or collaborate on a technical publication.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-3 border border-gold-500 px-8 py-4 text-sm font-medium tracking-widest uppercase text-gold-500 hover:bg-gold-500 hover:text-navy-900 transition-all"
            >
              Get in Touch <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
