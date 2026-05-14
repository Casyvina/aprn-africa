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

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

// ── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams(): Promise<Array<{ issue: string }>> {
  const slugs = await sanityFetch<Array<{ slug: string }>>(NEWSLETTER_SLUGS_QUERY);
  return slugs.filter((s) => Boolean(s.slug)).map((s) => ({ issue: s.slug }));
}

// ── Page ──────────────────────────────────────────────────────────────────────

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

        {/* ── Back link ──────────────────────────────────────────── */}
        <div className="pt-28 pb-0 px-6 lg:px-12">
          <div className="max-w-[1440px] mx-auto">
            <Link
              href="/newsletter"
              className="inline-flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest hover:text-gold-500 transition-colors"
            >
              <i className="fa-solid fa-arrow-left text-[10px]" />
              APRN Intelligence Briefing
            </Link>
          </div>
        </div>

        {/* ── Issue Header ─────────────────────────────────────────── */}
        <header className="py-16 px-6 lg:px-12 border-b border-navy-800">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs text-gold-500 uppercase tracking-widest font-semibold mb-4">
              {issueLabel}
            </p>
            <h1
              className="text-4xl md:text-6xl font-bold leading-tight mb-6"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {data.title}
            </h1>
            <p className="text-slate-400 text-xl leading-relaxed mb-8 max-w-3xl mx-auto">
              {data.leadSummary}
            </p>
            <div className="flex items-center justify-center gap-6 text-[11px] text-slate-500 uppercase tracking-widest">
              <span>{formatDate(data.publishDate)}</span>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <span>{data.stories.length} Stories</span>
              {data.sentAt && (
                <>
                  <span className="w-1 h-1 rounded-full bg-slate-700" />
                  <span className="text-gold-500">
                    Sent to {data.recipientCount?.toLocaleString() ?? ""} subscribers
                  </span>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ── Stories ──────────────────────────────────────────────── */}
        <section className="py-20 px-6 lg:px-12">
          <div className="max-w-[1440px] mx-auto">
            <p className="text-xs text-gold-500 uppercase tracking-widest font-semibold mb-10">
              This Issue
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              {data.stories.map((story, i) => (
                <article
                  key={i}
                  className="glass-panel border border-navy-700 p-8 rounded-sm flex flex-col gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-gold-500 uppercase tracking-widest px-2.5 py-1 border border-gold-500/30 bg-gold-500/10 rounded-full">
                      {story.tag}
                    </span>
                    <span className="text-[11px] text-slate-600 uppercase tracking-wider">
                      Story {i + 1}
                    </span>
                  </div>
                  <h2
                    className="text-xl font-bold leading-snug text-white"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    {story.headline}
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed">{story.summary}</p>
                  {story.sourceUrl && (
                    <a
                      href={story.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] text-gold-500 uppercase tracking-widest hover:underline"
                    >
                      Source <i className="fa-solid fa-arrow-up-right-from-square text-[9px]" />
                    </a>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Editor's Analysis ────────────────────────────────────── */}
        <section className="py-24 px-6 lg:px-12 bg-navy-800 border-t border-navy-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-navy-800/90" />
          <div className="relative z-10 max-w-4xl mx-auto">
            <p className="text-xs text-gold-500 uppercase tracking-widest font-semibold mb-8 text-center">
              Editor&apos;s Analysis
            </p>
            {data.pullQuote && (
              <div className="text-center mb-12">
                <i className="fa-solid fa-quote-left text-gold-500/20 text-6xl mb-6 block" />
                <blockquote
                  className="text-2xl md:text-3xl font-bold text-white leading-tight italic"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  &ldquo;{data.pullQuote}&rdquo;
                </blockquote>
              </div>
            )}
            <div className="glass-panel border border-navy-700 p-8 rounded-sm">
              <p className="text-slate-300 leading-relaxed text-base whitespace-pre-wrap">
                {data.editorAnalysis}
              </p>
              <div className="mt-6 pt-6 border-t border-navy-700 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-navy-700 border border-gold-500/30 flex items-center justify-center">
                  <i className="fa-solid fa-user text-gold-500 text-xs" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Lucy Okeke</div>
                  <div className="text-[11px] text-slate-500">Founder & Executive Director, APRN</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Subscribe CTA ────────────────────────────────────────── */}
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

        {/* ── Bottom nav ───────────────────────────────────────────── */}
        <section className="py-12 px-6 lg:px-12 border-t border-navy-800">
          <div className="max-w-[1440px] mx-auto flex flex-wrap justify-between items-center gap-4">
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
