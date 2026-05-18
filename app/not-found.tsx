import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { sanityFetch } from "@/lib/sanity/fetch";
import { groq } from "next-sanity";

// Pull 3 recent insights for the sidebar
const RECENT_INSIGHTS_QUERY = groq`
  *[(_type == "editorialInsight" || _type == "researchReport") && defined(slug.current)]
  | order(publishDate desc, _updatedAt desc)[0...3] {
    "slug": slug.current,
    title,
    "category": select(
      _type == "researchReport"   => "Research Report",
      _type == "editorialInsight" => "Editorial",
      "Intelligence"
    ),
    publishDate,
  }
`;

interface RecentInsight {
  slug: string;
  title: string;
  category: string;
  publishDate: string;
}

export default async function NotFound() {
  const recent = await sanityFetch<RecentInsight[]>(RECENT_INSIGHTS_QUERY).catch(() => []);

  // Static fallbacks if no Sanity content yet
  const insights = recent.length > 0 ? recent : [
    { slug: "eacop-construction-update", title: "EACOP Construction Reaches 40% Completion", category: "Intelligence Brief", publishDate: "2026-05-13" },
    { slug: "akk-commissioning-delay",   title: "AKK Gas Pipeline Mid-Section Commissioning Delayed", category: "Research Report", publishDate: "2026-05-12" },
    { slug: "aagp-ecowas-endorsement",   title: "Morocco–Nigeria AAGP Receives ECOWAS Endorsement", category: "Editorial", publishDate: "2026-05-11" },
  ];

  return (
    <>
      <Navigation />
      <div
        className="min-h-screen bg-navy-900 text-white flex flex-col"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        {/* Grid background layers */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.5) 39px, rgba(255,255,255,0.5) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.5) 39px, rgba(255,255,255,0.5) 40px)",
          }}
        />
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.015]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F5F7FA' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        {/* Main layout — fills between nav and footer */}
        <main className="flex-1 flex flex-col lg:flex-row max-w-360 w-full mx-auto pt-20">

          {/* ── Left: Error content ────────────────────────────────── */}
          <div className="flex-1 flex flex-col justify-center px-6 lg:px-20 py-20 lg:py-0 border-r border-navy-800 relative overflow-hidden">

            {/* Ghost 404 */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
              aria-hidden="true"
            >
              <span
                className="text-[20rem] font-bold leading-none text-white/2 tracking-tighter"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                404
              </span>
            </div>

            <div className="relative z-10 max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-800 border border-navy-700 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                <span className="text-[11px] font-semibold text-gold-500 uppercase tracking-widest">
                  System Error
                </span>
              </div>

              {/* Heading */}
              <h1
                className="text-5xl lg:text-7xl font-bold leading-tight mb-6"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Resource<br />
                <span className="text-white/30">Not Located</span>
              </h1>

              <p className="text-lg lg:text-xl text-slate-400 font-light leading-relaxed mb-12 max-w-xl">
                The infrastructure intelligence resource you requested could not be
                located in our current pipeline architecture. It may have been
                reclassified or temporarily taken offline for analysis.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 px-8 py-3.5 text-sm font-bold uppercase tracking-wider transition-colors shadow-[0_0_20px_rgba(212,160,23,0.2)]"
                >
                  Return Home
                  <i className="fa-solid fa-arrow-right text-xs" />
                </Link>
                <Link
                  href="/insights"
                  className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-3.5 text-sm font-medium uppercase tracking-wider transition-colors"
                >
                  Explore Insights
                </Link>
              </div>
            </div>
          </div>

          {/* ── Right: Sidebar ─────────────────────────────────────── */}
          <aside className="w-full lg:w-100 shrink-0 border-t lg:border-t-0 border-navy-800 bg-navy-800/40 p-8 lg:p-12 flex flex-col justify-center">

            <div className="mb-8">
              <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">
                Recent Infrastructure Insights
              </h3>
              <div className="w-10 h-px bg-gold-500/50" />
            </div>

            <div className="space-y-6">
              {insights.map((item) => (
                <Link
                  key={item.slug}
                  href={`/insights/${item.slug}`}
                  className="group block"
                >
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 font-medium">
                    {item.category}
                  </div>
                  <h4 className="text-slate-300 group-hover:text-white text-sm font-medium leading-snug transition-colors relative">
                    {item.title}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-500 transition-all duration-300 group-hover:w-full block" />
                  </h4>
                </Link>
              ))}
            </div>

            {/* Support card */}
            <div className="mt-12 pt-8 border-t border-navy-700">
              <div className="glass-panel border border-navy-700 rounded-sm p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-sm bg-navy-900 border border-navy-700 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-headset text-gold-500 text-sm" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-white mb-1">Need assistance?</h5>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      Our team can help locate specific institutional data or research.
                    </p>
                    <Link
                      href="/contact"
                      className="text-xs text-gold-500 hover:text-gold-400 transition-colors font-medium uppercase tracking-wider"
                    >
                      Contact Support →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </aside>

        </main>
      </div>
      <Footer />
    </>
  );
}
