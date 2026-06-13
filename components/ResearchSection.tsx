import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity/fetch'
import {
  HOMEPAGE_RESEARCH_QUERY,
  type HomepageResearchResult,
  type HomepageResearchCard,
} from '@/lib/queries/research'

// -- Config --------------------------------------------------------------------

const TYPE_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  flagship:      { label: 'Flagship Report',   color: 'text-gold-500 border-gold-500/30 bg-gold-500/5',        icon: 'fa-file-chart-column' },
  'policy-brief':{ label: 'Policy Brief',      color: 'text-blue-400 border-blue-400/30 bg-blue-400/5',        icon: 'fa-gavel'             },
  'working-paper':{ label: 'Working Paper',    color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5', icon: 'fa-microscope'       },
  briefing:      { label: 'Intelligence Brief',color: 'text-copper-500 border-copper-500/30 bg-copper-500/5',   icon: 'fa-bolt'              },
  audit:         { label: 'Audit',             color: 'text-slate-400 border-slate-400/30 bg-slate-400/5',      icon: 'fa-clipboard-check'   },
}

const DEFAULT_TYPE = { label: 'Research Brief', color: 'text-gold-500 border-gold-500/30 bg-gold-500/5', icon: 'fa-file-lines' }

function typeConfig(reportType?: string): { label: string; color: string; icon: string } {
  if (!reportType) return DEFAULT_TYPE
  return TYPE_CONFIG[reportType] ?? DEFAULT_TYPE
}

function formatMonth(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

// -- Fallback data -------------------------------------------------------------

const FALLBACK_FEATURED: HomepageResearchCard = {
  _id: 'fallback-1',
  title: "Africa's Pipeline Infrastructure: 2026 Outlook",
  slug: 'africa-pipeline-infrastructure-2026-outlook',
  reportType: 'flagship',
  publishDate: '2026-01-15',
  executiveSummary: "Africa's pipeline sector enters 2026 at a critical inflection point — 12,400km under construction, $42.5B in tracked CapEx, and the NMGP advancing to bankable feasibility with confirmed US strategic interest.",
  estimatedReadTime: 35,
  topics: [{ name: 'Infrastructure' }, { name: 'Finance' }, { name: 'Geopolitics' }],
}

const FALLBACK_PUBS: HomepageResearchCard[] = [
  {
    _id: 'fallback-2',
    title: 'West Africa Gas Policy Framework: A Decade Review',
    slug: 'west-africa-gas-policy-framework-decade-review',
    reportType: 'policy-brief',
    publishDate: '2026-03-01',
    executiveSummary: 'Reviews ten years of WAGP Treaty performance and draws lessons for the NMGP governance architecture.',
    topics: [{ name: 'Policy' }, { name: 'Geopolitics' }],
  },
  {
    _id: 'fallback-3',
    title: "Africa's Pipeline Training & Research Landscape: A Competitive Analysis",
    slug: 'africa-pipeline-training-research-competitive-analysis-2026',
    reportType: 'working-paper',
    publishDate: '2026-05-01',
    executiveSummary: 'Maps the institutional vacuum that APRN exists to fill across 10+ profiled organisations.',
    topics: [{ name: 'Training' }, { name: 'Policy' }],
  },
]

// -- Component -----------------------------------------------------------------

interface Props {
  badge?: string
  heading?: string
  subtext?: string
  backgroundImageUrl?: string
}

export default async function ResearchSection({
  badge = 'Intelligence Hub',
  heading = 'Research & Intelligence',
  subtext = 'Authoritative analysis on African pipeline infrastructure, regulatory developments, and workforce intelligence — accessible to all network members.',
  backgroundImageUrl,
}: Props) {
  let featured: HomepageResearchCard | null = FALLBACK_FEATURED
  let publications: HomepageResearchCard[] = FALLBACK_PUBS

  try {
    const result = await sanityFetch<HomepageResearchResult>(
      HOMEPAGE_RESEARCH_QUERY, {}, ['researchReport']
    )
    if (result?.featured) featured = result.featured
    if (result?.publications?.length) publications = result.publications
  } catch {
    // use fallbacks
  }

  const cfg = typeConfig(featured?.reportType)

  return (
    <section
      id="research"
      className="py-24 bg-navy-900 border-t border-navy-800 relative"
      style={backgroundImageUrl ? { backgroundImage: `url('${backgroundImageUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    >
      {backgroundImageUrl && <div className="absolute inset-0 bg-navy-900/90" />}
      <div className="max-w-360 mx-auto px-6 md:px-12 relative z-10">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-14 gap-6">
          <div>
            <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold mb-3 block">
              {badge}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              {heading}
            </h2>
            <p className="text-slate-400 mt-3 max-w-lg">
              {subtext}
            </p>
          </div>
          <Link
            href="/research"
            className="shrink-0 px-5 py-2.5 text-sm font-semibold text-gold-500 border border-gold-500/40 hover:bg-gold-500/10 active:scale-95 transition-all rounded-sm whitespace-nowrap cursor-pointer"
          >
            View Full Library <i className="fa-solid fa-arrow-right ml-2" />
          </Link>
        </div>

        {/* Featured + grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Featured card */}
          {featured && (
            <div className="lg:col-span-2 glass-panel rounded-sm p-8 border-l-4 border-gold-500 flex flex-col cursor-pointer hover:-translate-y-0.5 transition-transform duration-200">
              <div className="flex items-center gap-3 mb-5">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}>
                  {cfg.label}
                </span>
                <span className="text-xs text-slate-500">{formatMonth(featured.publishDate)}</span>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-4 leading-snug">
                {featured.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">
                {featured.executiveSummary}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {(featured.topics ?? []).map((t) => (
                  <span
                    key={t.name}
                    className="text-xs px-2.5 py-1 bg-navy-800 text-slate-400 rounded-sm border border-navy-700"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-navy-700 pt-5">
                {featured.estimatedReadTime && (
                  <span className="text-xs text-slate-500">
                    <i className="fa-regular fa-clock mr-1.5" />
                    {featured.estimatedReadTime} min read
                  </span>
                )}
                <Link
                  href={`/research/${featured.slug}`}
                  className="text-sm text-gold-500 font-semibold hover:underline ml-auto"
                >
                  Read Brief <i className="fa-solid fa-arrow-right ml-1" />
                </Link>
              </div>
            </div>
          )}

          {/* Publication cards */}
          <div className={`${featured ? 'lg:col-span-3' : 'lg:col-span-5'} grid grid-cols-1 sm:grid-cols-2 gap-5`}>
            {publications.map((pub) => {
              const pcfg = typeConfig(pub.reportType)
              return (
                <Link
                  key={pub._id}
                  href={`/research/${pub.slug}`}
                  className="glass-panel rounded-sm p-5 border border-navy-700 hover:border-gold-500/40 hover:-translate-y-0.5 transition-all group flex flex-col cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${pcfg.color}`}>
                      {pcfg.label}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-auto">{formatMonth(pub.publishDate)}</span>
                  </div>
                  <div className="flex gap-3 mb-3">
                    <div className="w-8 h-8 rounded-sm bg-navy-800 flex items-center justify-center shrink-0 mt-0.5">
                      <i className={`fa-solid ${pcfg.icon} text-gold-500 text-sm`} />
                    </div>
                    <h4 className="font-display text-sm font-bold text-white leading-snug group-hover:text-gold-500 transition-colors">
                      {pub.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4 flex-1">{pub.executiveSummary}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(pub.topics ?? []).map((t) => (
                      <span
                        key={t.name}
                        className="text-[10px] px-2 py-0.5 bg-navy-800 text-slate-400 rounded-sm border border-navy-700"
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>
                </Link>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}
