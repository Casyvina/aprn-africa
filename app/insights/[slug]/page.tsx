import { notFound } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  articles,
  getArticleBySlug,
  getRelatedArticles,
  categoryMeta,
  type ContentBlock,
} from "@/lib/articles";

export function generateStaticParams(): Array<{ slug: string }> {
  return articles.map((a) => ({ slug: a.slug }));
}

function ArticleBlock({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p
          className="text-slate-300 leading-8 text-lg mb-6"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          {block.text}
        </p>
      );
    case "heading":
      return (
        <h3
          className="text-2xl font-bold text-white mt-12 mb-4 pt-4 border-t border-navy-800"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          {block.text}
        </h3>
      );
    case "pullquote":
      return (
        <blockquote className="border-l-4 border-gold-500 pl-6 my-10 py-1">
          <p
            className="text-xl text-gold-500 italic leading-relaxed"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            {block.text}
          </p>
        </blockquote>
      );
    case "callout":
      return (
        <div className="glass-panel border border-gold-500/20 rounded-sm p-6 my-8">
          <div className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-3">
            {block.title}
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{block.text}</p>
        </div>
      );
    default:
      return null;
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(slug, 3);
  const meta = categoryMeta[article.category];

  return (
    <>
      <Navigation />
      <main className="bg-navy-900 text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>

        {/* ── Back link ──────────────────────────────────────────── */}
        <div className="pt-28 pb-0 px-6 lg:px-12">
          <div className="max-w-[1440px] mx-auto">
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest hover:text-gold-500 transition-colors"
            >
              <i className="fa-solid fa-arrow-left text-[10px]" />
              Infrastructure Insights
            </Link>
          </div>
        </div>

        {/* ── Article Hero ───────────────────────────────────────── */}
        <header className="py-16 px-6 lg:px-12 border-b border-navy-800">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className={`inline-flex items-center gap-2 px-3 py-1 border rounded-full text-xs font-semibold uppercase tracking-wider ${meta.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
              <span className="text-slate-500 text-xs uppercase tracking-wider">{article.date}</span>
              <span className="text-navy-700">·</span>
              <span className="text-slate-500 text-xs uppercase tracking-wider">{article.readTime}</span>
            </div>

            <h1
              className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-white"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {article.title}
            </h1>

            <p className="text-xl text-slate-400 leading-relaxed mb-8 max-w-3xl">
              {article.subtitle}
            </p>

            <div className="flex items-center gap-4 pt-6 border-t border-navy-800">
              <div className="w-10 h-10 rounded-full bg-navy-700 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-user text-gold-500 text-sm" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{article.author}</div>
                <div className="text-xs text-slate-500">{article.authorRole}</div>
              </div>
            </div>
          </div>
        </header>

        {/* ── Featured Image ──────────────────────────────────────── */}
        <div
          className="w-full h-[480px] bg-cover bg-center relative"
          style={{ backgroundImage: `url('${article.heroImage}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/30 to-transparent" />
        </div>

        {/* ── Key Insights Panel ─────────────────────────────────── */}
        <section className="py-16 px-6 lg:px-12 bg-navy-800 border-b border-navy-700">
          <div className="max-w-[1440px] mx-auto">
            <p className="text-xs text-gold-500 uppercase tracking-widest font-semibold mb-8">Key Intelligence</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {article.insights.map((insight, i) => (
                <div key={i} className="glass-panel border border-navy-700 p-6 rounded-sm">
                  <i className={`fa-solid ${insight.icon} text-gold-500 mb-4 block text-xl`} />
                  <div
                    className="text-3xl font-bold text-white mb-1"
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

        {/* ── Body + Sidebar ─────────────────────────────────────── */}
        <section className="py-20 px-6 lg:px-12">
          <div className="max-w-[1440px] mx-auto grid lg:grid-cols-12 gap-16">

            {/* Article body */}
            <article className="lg:col-span-8">
              {article.body.map((block, i) => (
                <ArticleBlock key={i} block={block} />
              ))}
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">

                {/* Author */}
                <div className="glass-panel border border-navy-700 p-6 rounded-sm">
                  <h4 className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-4">Author</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-navy-700 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
                      <i className="fa-solid fa-user text-gold-500 text-sm" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{article.author}</div>
                      <div className="text-xs text-slate-500 leading-tight mt-0.5">{article.authorRole}</div>
                    </div>
                  </div>
                </div>

                {/* Publication details */}
                <div className="glass-panel border border-navy-700 p-6 rounded-sm">
                  <h4 className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-4">
                    Publication Details
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Category</span>
                      <span className="text-slate-300">{meta.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Published</span>
                      <span className="text-slate-300">{article.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Read time</span>
                      <span className="text-slate-300">{article.readTime}</span>
                    </div>
                  </div>
                </div>

                {/* Sidebar CTA */}
                <div className="glass-panel border border-gold-500/30 p-6 rounded-sm">
                  <h4 className="text-sm font-bold text-white mb-2">Partner With APRN</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Access APRN&apos;s full intelligence network, research database, and training programmes.
                  </p>
                  <Link
                    href="/contact"
                    className="block text-center bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold text-xs py-3 rounded-sm transition-colors uppercase tracking-wider"
                  >
                    Get in Touch
                  </Link>
                </div>

              </div>
            </aside>

          </div>
        </section>

        {/* ── Strategic Commentary ───────────────────────────────── */}
        <section className="py-24 px-6 lg:px-12 bg-navy-800 border-t border-navy-700 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url('${article.heroImage}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.08,
            }}
          />
          <div className="absolute inset-0 bg-navy-800/90" />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <i className="fa-solid fa-quote-left text-gold-500/20 text-7xl mb-8 block" />
            <blockquote
              className="text-3xl md:text-4xl font-bold text-white leading-tight mb-8 italic"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              &ldquo;{article.pullQuote}&rdquo;
            </blockquote>
            <cite className="text-slate-400 text-sm not-italic">
              — {article.author}, {article.authorRole}
            </cite>
          </div>
        </section>

        {/* ── Related Research ───────────────────────────────────── */}
        {related.length > 0 && (
          <section className="py-20 px-6 lg:px-12 border-t border-navy-800">
            <div className="max-w-[1440px] mx-auto">
              <p className="text-xs text-gold-500 uppercase tracking-widest font-semibold mb-10">
                Related Research
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                {related.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/insights/${rel.slug}`}
                    className="group glass-panel border border-navy-700 hover:border-gold-500/40 transition-colors rounded-sm overflow-hidden block"
                  >
                    <div
                      className="h-40 bg-cover bg-center relative"
                      style={{ backgroundImage: `url('${rel.heroImage}')` }}
                    >
                      <div className="absolute inset-0 bg-navy-900/50 group-hover:bg-navy-900/30 transition-colors" />
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 border rounded-full text-[10px] font-semibold uppercase tracking-wider ${categoryMeta[rel.category].badge}`}>
                          {categoryMeta[rel.category].label}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h4
                        className="text-base font-bold leading-snug group-hover:text-gold-500 transition-colors mb-2"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                      >
                        {rel.title}
                      </h4>
                      <div className="text-[11px] text-slate-500 uppercase tracking-wider">
                        {rel.date} · {rel.readTime}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA ───────────────────────────────────────────────── */}
        <section className="py-32 px-6 border-t border-white/10 bg-navy-900 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 50% 50%, rgba(212,160,23,0.06) 0%, transparent 70%)",
            }}
          />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <p className="text-xs tracking-[0.3em] text-gold-500 mb-8 uppercase">Explore More</p>
            <h2
              className="text-3xl md:text-5xl font-bold leading-tight mb-12 text-white"
              style={{ fontFamily: "var(--font-oswald), sans-serif" }}
            >
              Access Africa&apos;s Premier{" "}
              <span className="text-gold-500">Engineering Intelligence</span>
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/insights"
                className="inline-flex items-center justify-center gap-3 border border-gold-500 px-8 py-4 text-sm font-medium tracking-widest uppercase text-gold-500 hover:bg-gold-500 hover:text-navy-900 transition-all"
              >
                All Research <i className="fa-solid fa-arrow-right" />
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
