import Link from 'next/link'
import Image from 'next/image'
import { sanityFetch } from '@/lib/sanity/fetch'
import { HOMEPAGE_LATEST_QUERY, type HomepageLatestCard } from '@/lib/queries/intelligence'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const CATEGORY_COLOR: Record<string, string> = {
  Editorial:   'text-gold-500 border-gold-500/30 bg-gold-500/5',
  Market:      'text-emerald-400 border-emerald-400/30 bg-emerald-400/5',
  Project:     'text-sky-400 border-sky-400/30 bg-sky-400/5',
  Policy:      'text-violet-400 border-violet-400/30 bg-violet-400/5',
  Training:    'text-copper-500 border-copper-500/30 bg-copper-500/5',
  Partnership: 'text-blue-400 border-blue-400/30 bg-blue-400/5',
  Intelligence:'text-gold-500 border-gold-500/30 bg-gold-500/5',
}

export default async function LatestInsightsSection() {
  let items: HomepageLatestCard[] = []

  try {
    const fetched = await sanityFetch<HomepageLatestCard[]>(
      HOMEPAGE_LATEST_QUERY, {}, ['editorialInsight', 'intelligence']
    )
    if (fetched?.length) items = fetched
  } catch { /* no items — hide section */ }

  if (items.length === 0) return null

  const [lead, ...rest] = items

  return (
    <section className="py-20 bg-navy-800 border-t border-white/5">
      <div className="max-w-360 mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-2">
              Latest From APRN
            </p>
            <h2
              className="text-2xl md:text-3xl font-bold text-white"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              News &amp; Intelligence
            </h2>
          </div>
          <Link
            href="/insights"
            className="shrink-0 text-xs font-bold uppercase tracking-widest text-gold-500 border border-gold-500/30 px-4 py-2 hover:bg-gold-500/10 transition-colors"
          >
            All Insights <i className="fa-solid fa-arrow-right ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Lead card */}
          <div className="lg:col-span-6">
            <Link
              href={lead.slug ? `/insights/${lead.slug}` : '/insights'}
              className="group block bg-navy-900 border border-white/5 hover:border-gold-500/30 transition-colors h-full"
            >
              {lead.heroImage ? (
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={lead.heroImage}
                    alt={lead.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-navy-900 via-transparent to-transparent" />
                </div>
              ) : (
                <div className="h-52 bg-navy-700 flex items-center justify-center">
                  <i className="fa-solid fa-newspaper text-4xl text-gold-500/20" />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 border uppercase tracking-wider ${CATEGORY_COLOR[lead.category] ?? CATEGORY_COLOR.Intelligence}`}>
                    {lead.category}
                  </span>
                  <span className="text-[10px] text-slate-500">{formatDate(lead.publishDate)}</span>
                </div>
                <h3
                  className="text-lg font-bold text-white mb-3 leading-snug group-hover:text-gold-500 transition-colors"
                  style={{ fontFamily: 'var(--font-playfair), serif' }}
                >
                  {lead.title}
                </h3>
                {lead.excerpt && (
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                    {lead.excerpt}
                  </p>
                )}
                {lead.readTime && (
                  <p className="text-[10px] text-slate-600 mt-4 uppercase tracking-widest">
                    <i className="fa-regular fa-clock mr-1.5" />{lead.readTime} min read
                  </p>
                )}
              </div>
            </Link>
          </div>

          {/* Secondary cards */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {rest.map((item) => (
              <Link
                key={item._id}
                href={item.slug ? `/insights/${item.slug}` : '/insights'}
                className="group flex gap-4 bg-navy-900 border border-white/5 hover:border-gold-500/30 transition-colors p-4"
              >
                {item.heroImage && (
                  <div className="relative w-20 h-20 shrink-0 overflow-hidden">
                    <Image
                      src={item.heroImage}
                      alt={item.title}
                      fill
                      sizes="80px"
                      className="object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[9px] font-bold px-2 py-0.5 border uppercase tracking-wider ${CATEGORY_COLOR[item.category] ?? CATEGORY_COLOR.Intelligence}`}>
                      {item.category}
                    </span>
                    <span className="text-[9px] text-slate-600">{formatDate(item.publishDate)}</span>
                  </div>
                  <h4
                    className="text-sm font-bold text-white leading-snug group-hover:text-gold-500 transition-colors line-clamp-2"
                    style={{ fontFamily: 'var(--font-playfair), serif' }}
                  >
                    {item.title}
                  </h4>
                  {item.excerpt && (
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                      {item.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
