import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity/fetch'
import { INTELLIGENCE_TICKER_QUERY, type TickerItem } from '@/lib/queries/intelligence'

const FALLBACK_ITEMS: TickerItem[] = [
  { _id: '1', headline: 'OB3 pipeline commissioning rescheduled to Q4 2026 — NNPCL cites contractor delays',      category: 'project',  corridorCode: 'OB3'  },
  { _id: '2', headline: 'Morocco ONHYM meets US DOE & White House NSC on NMGP — US confirms strategic interest', category: 'project',  corridorCode: 'NMGP' },
  { _id: '3', headline: 'EACOP construction reaches 40% — TotalEnergies confirms 2027 commissioning target',     category: 'project',  corridorCode: 'EACOP'},
  { _id: '4', headline: 'ECOWAS Energy Ministers endorse Regional Gas Infrastructure Directive',                  category: 'policy'                         },
  { _id: '5', headline: 'AfDB approves $2.4B infrastructure bond for Trans-Saharan Gas Pipeline corridor',       category: 'market',   corridorCode: 'TSGP' },
  { _id: '6', headline: 'APRN launches WIMEE Africa — first midstream engineering programme for women',          category: 'training'                        },
]

const CATEGORY_LABEL: Record<string, string> = {
  project:     'PROJECT',
  policy:      'POLICY',
  market:      'MARKET',
  training:    'TRAINING',
  event:       'EVENT',
  partnership: 'PARTNER',
  editorial:   'EDITORIAL',
}

function itemHref(item: TickerItem): string | null {
  if (item.slug) return `/insights/${item.slug}`
  if (item.externalUrl) return item.externalUrl
  return null
}

function TickerItemContent({ item }: { item: TickerItem }) {
  const label = item.corridorCode ?? CATEGORY_LABEL[item.category] ?? item.category.toUpperCase()
  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-gold-500 font-bold text-[10px] tracking-widest shrink-0">{label}</span>
      <span className="text-navy-700">·</span>
      <span className="text-slate-400">{item.headline}</span>
    </span>
  )
}

export default async function IntelligenceStrip() {
  let items: TickerItem[] = FALLBACK_ITEMS

  try {
    const fetched = await sanityFetch<TickerItem[]>(INTELLIGENCE_TICKER_QUERY, {}, ['intelligence', 'insights'])
    if (fetched && fetched.length > 0) items = fetched
  } catch {
    // use fallback
  }

  // duplicate for seamless loop
  const loop = [...items, ...items]

  return (
    <div className="fixed top-20 w-full z-40 bg-navy-800 border-b border-navy-700 h-10 flex items-center overflow-hidden group/strip">
      {/* LIVE label */}
      <div className="absolute left-0 z-10 h-full w-24 bg-linear-to-r from-navy-800 via-navy-800 to-transparent flex items-center px-4 border-r border-navy-700/50 shrink-0 pointer-events-none">
        <span className="text-xs font-bold text-gold-500 uppercase tracking-widest">
          <i className="fa-solid fa-bolt mr-2" />Live
        </span>
      </div>

      {/* Scrolling track — pauses on hover so items are clickable */}
      <div className="flex whitespace-nowrap animate-ticker group-hover/strip:[animation-play-state:paused] pl-24">
        {loop.map((item, i) => {
          const href = itemHref(item)
          const inner = <TickerItemContent item={item} />
          const isExternal = !!item.externalUrl && !item.slug

          return (
            <span key={`${item._id}-${i}`} className="inline-flex items-center gap-8 text-xs font-medium px-8">
              {href ? (
                isExternal ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {inner}
                  </a>
                ) : (
                  <Link
                    href={href}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {inner}
                  </Link>
                )
              ) : (
                inner
              )}
            </span>
          )
        })}
      </div>
    </div>
  )
}
