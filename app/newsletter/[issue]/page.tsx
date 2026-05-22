import { notFound } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NewsletterSignupForm from "@/components/NewsletterSignupForm";
import { sanityFetch } from "@/lib/sanity/fetch";
import {
  NEWSLETTER_BY_SLUG_QUERY,
  NEWSLETTER_SLUGS_QUERY,
  type NewsletterIssue,
} from "@/lib/queries/newsletter";

// -- Helpers -------------------------------------------------------------------

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

// -- Static params -------------------------------------------------------------

export async function generateStaticParams(): Promise<Array<{ issue: string }>> {
  const slugs = await sanityFetch<Array<{ slug: string }>>(NEWSLETTER_SLUGS_QUERY);
  return slugs.filter((s) => Boolean(s.slug)).map((s) => ({ issue: s.slug }));
}

// -- Page ----------------------------------------------------------------------

export default async function NewsletterIssuePage({
  params,
}: {
  params: Promise<{ issue: string }>;
}) {
  const { issue: slug } = await params;

  const data = await sanityFetch<NewsletterIssue | null>(
    NEWSLETTER_BY_SLUG_QUERY,
    { slug },
    ["newsletter"],
  );

  if (!data) notFound();

  const issueLabel = `Vol. ${data.volume}, Issue ${String(data.issueNumber).padStart(3, "0")}`;

  return (
    <>
      <Navigation />
      <main className="bg-navy-900 text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>

        {/* -- Cinematic Issue Header -------------------------------- */}
        <header className="relative pt-28 pb-16 lg:pb-24 px-6 lg:px-12 min-h-[55vh] flex items-end overflow-hidden border-b border-navy-800">
          {/* Pipeline image backdrop */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-luminosity"
            style={{ backgroundImage: "url('/images/pipeline-aerial.png')" }}
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-linear-to-t from-navy-900 via-navy-900/80 to-navy-900/40" />
          <div className="absolute inset-0 bg-linear-to-r from-navy-900 via-navy-900/70 to-transparent" />
          {/* Grid texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.5) 39px, rgba(255,255,255,0.5) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.5) 39px, rgba(255,255,255,0.5) 40px)",
            }}
          />

          <div className="relative z-10 w-full max-w-360 mx-auto">
            {/* Back link */}
            <Link
              href="/newsletter"
              className="inline-flex items-center gap-2 text-xs text-slate-400 uppercase tracking-widest hover:text-gold-500 transition-colors mb-8 block"
            >
              <i className="fa-solid fa-arrow-left text-[10px]" />
              APRN Intelligence Briefing
            </Link>

            <div className="max-w-4xl">
              {/* Issue badge */}
              <div className="flex items-center gap-3 flex-wrap mb-5">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                  <span className="text-xs font-bold text-gold-500 uppercase tracking-widest">{issueLabel}</span>
                </span>
                {data.sentAt && (
                  <span className="text-[11px] text-gold-500/70 uppercase tracking-widest">
                    Sent to {data.recipientCount?.toLocaleString() ?? ""} subscribers
                  </span>
                )}
              </div>

              {/* Title */}
              <h1
                className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                {data.title}
              </h1>

              {/* Lead summary */}
              {data.leadSummary && (
                <p className="text-base lg:text-xl text-slate-300 leading-relaxed mb-8 max-w-3xl font-light">
                  {data.leadSummary}
                </p>
              )}

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 uppercase tracking-widest">
                <span>{formatDate(data.publishDate)}</span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span>{data.stories.length} Stories</span>
              </div>
            </div>
          </div>
        </header>

        {/* -- Stories ------------------------------------------------ */}
        <section className="py-20 px-6 lg:px-12">
          <div className="max-w-360 mx-auto">
            <p className="text-xs text-gold-500 uppercase tracking-widest font-semibold mb-10">
              This Issue
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              {data.stories.map((story, i) => (
                <article
                  key={i}
                  className="glass-panel border border-navy-700 hover:border-gold-500/30 transition-colors p-8 rounded-sm flex flex-col gap-4"
                >
                  <span className="text-[10px] font-bold text-gold-500 uppercase tracking-widest px-2.5 py-1 border border-gold-500/30 bg-gold-500/10 rounded-full self-start">
                    {story.tag}
                  </span>
                  <h2
                    className="text-xl font-bold leading-snug text-white"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    {story.headline}
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed flex-1">{story.summary}</p>
                  {story.sourceUrl && (
                    <a
                      href={story.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] text-gold-500 uppercase tracking-widest hover:underline self-start"
                    >
                      Source <i className="fa-solid fa-arrow-up-right-from-square text-[9px]" />
                    </a>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* -- Editor's Analysis -------------------------------------- */}
        {(data.pullQuote || data.editorAnalysis) && (
          <section className="py-24 px-6 lg:px-12 bg-navy-800 border-t border-navy-700">
            <div className="max-w-4xl mx-auto">
              <p className="text-xs text-gold-500 uppercase tracking-widest font-semibold mb-10 text-center">
                Editor&apos;s Analysis
              </p>

              {data.pullQuote && (
                <div className="text-center mb-12">
                  <i className="fa-solid fa-quote-left text-gold-500/20 text-5xl mb-6 block" />
                  <blockquote
                    className="text-2xl md:text-3xl font-bold text-white leading-tight italic"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    &ldquo;{data.pullQuote}&rdquo;
                  </blockquote>
                </div>
              )}

              {data.editorAnalysis && (
                <div className="glass-panel border border-navy-700 p-8 rounded-sm">
                  <p className="text-slate-300 leading-relaxed text-base whitespace-pre-wrap">
                    {data.editorAnalysis}
                  </p>
                  <div className="mt-8 pt-6 border-t border-navy-700 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-sm bg-gold-500/10 border border-gold-500/30 flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-pen-nib text-gold-500 text-sm" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Lucy Okeke</div>
                      <div className="text-xs text-slate-500">Founder &amp; Executive Director, APRN</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* -- Subscribe CTA ------------------------------------------ */}
        <section className="py-20 px-6 lg:px-12 border-t border-navy-800">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs text-gold-500 uppercase tracking-widest font-semibold mb-4">Never Miss an Issue</p>
              <h2
                className="text-3xl font-bold mb-4"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Subscribe Free — Every Wednesday
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Join 2,400+ engineers, policymakers, and financiers following Africa&apos;s infrastructure story.
              </p>
            </div>
            <div className="glass-panel border border-navy-700 p-8 rounded-sm">
              <NewsletterSignupForm />
            </div>
          </div>
        </section>

        {/* -- Bottom nav --------------------------------------------- */}
        <section className="py-12 px-6 lg:px-12 border-t border-navy-800">
          <div className="max-w-360 mx-auto flex flex-wrap justify-between items-center gap-4">
            <Link
              href="/newsletter"
              className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-gold-500 uppercase tracking-widest transition-colors"
            >
              <i className="fa-solid fa-arrow-left text-[10px]" />
              All Issues
            </Link>
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 text-xs text-gold-500 hover:text-gold-400 uppercase tracking-widest transition-colors"
            >
              Full Intelligence Archive
              <i className="fa-solid fa-arrow-right text-[10px]" />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
