import { sanityFetch } from '@/lib/sanity/fetch'
import { INTELLIGENCE_TICKER_QUERY, type TickerItem } from '@/lib/queries/intelligence'

const FALLBACK_ITEMS: TickerItem[] = [
  { _id: '1', headline: 'OB3 pipeline commissioning rescheduled to Q4 2026 — NNPCL cites contractor delays',       category: 'project',  corridorCode: 'OB3'  },
  { _id: '2', headline: 'Morocco ONHYM meets US DOE & White House NSC on NMGP — US confirms strategic interest',  category: 'project',  corridorCode: 'NMGP' },
  { _id: '3', headline: 'EACOP construction reaches 40% — TotalEnergies confirms 2027 commissioning target',      category: 'project',  corridorCode: 'EACOP'},
  { _id: '4', headline: 'ECOWAS Energy Ministers endorse Regional Gas Infrastructure Directive',                   category: 'policy'                         },
  { _id: '5', headline: 'AfDB approves $2.4B infrastructure bond for Trans-Saharan Gas Pipeline corridor',        category: 'market',   corridorCode: 'TSGP' },
  { _id: '6', headline: 'APRN launches WIMEE Africa — first midstream engineering programme for women',           category: 'training'                        },
]

const CATEGORY_LABEL: Record<string, string> = {
  project:     'PROJECT',
  policy:      'POLICY',
  market:      'MARKET',
  training:    'TRAINING',
  event:       'EVENT',
  partnership: 'PARTNER',
}

export default async function IntelligenceStrip() {
  let items: TickerItem[] = FALLBACK_ITEMS

  try {
    const fetched = await sanityFetch<TickerItem[]>(INTELLIGENCE_TICKER_QUERY, {}, ['intelligenceUpdate'])
    if (fetched && fetched.length > 0) items = fetched
  } catch {
    // use fallback
  }

  return (
    <div className="fixed top-20 w-full z-40 bg-navy-800 border-b border-navy-700 h-10 flex items-center overflow-hidden">
      <div className="absolute left-0 z-10 h-full w-24 bg-linear-to-r from-navy-800 to-transparent flex items-center px-4 border-r border-navy-700/50">
        <span className="text-xs font-bold text-gold-500 uppercase tracking-widest">
          <i className="fa-solid fa-bolt mr-2" />Live
        </span>
      </div>
      <div className="flex whitespace-nowrap animate-ticker pr-8">
        {/* Render twice for seamless loop */}
        {[...items, ...items].map((item, i) => (
          <span key={`${item._id}-${i}`} className="inline-flex items-center gap-8 text-xs font-medium px-8">
            <span className="inline-flex items-center gap-2">
              <span className="text-gold-500 font-bold text-[10px] tracking-widest">
                {item.corridorCode ?? CATEGORY_LABEL[item.category] ?? item.category.toUpperCase()}
              </span>
              <span className="text-navy-700">·</span>
              <span className="text-slate-400">{item.headline}</span>
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
