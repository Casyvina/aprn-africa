"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import type { PartnerCard } from "@/lib/queries/partners"

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
}

function typeIcon(type: string) {
  const map: Record<string, string> = {
    "energy-company": "fa-oil-well",
    regulatory:       "fa-shield-halved",
    financial:        "fa-building-columns",
    academic:         "fa-graduation-cap",
    multilateral:     "fa-earth-africa",
  }
  return map[type] ?? "fa-landmark"
}

export default function PartnershipsSectionClient({ partners }: { partners: PartnerCard[] }) {
  return (
    <section id="partnerships" className="py-24 bg-navy-800 relative border-t border-navy-700">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 20% 100%, rgba(212, 160, 23, 0.05) 0%, transparent 50%)" }}
      />
      <div className="max-w-360 mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold mb-3 block">
            Institutional Network
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            Partners &amp; Affiliates
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">
            APRN operates within a framework of regulatory, academic, and industry partnerships that
            ensure our programmes align with global standards.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
        >
          {partners.map((p) => (
            <motion.div
              key={p._id}
              variants={fadeUp}
              className="glass-panel p-6 rounded-sm border border-navy-700 hover:border-gold-500/50 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-sm bg-gold-500/10 flex items-center justify-center shrink-0 group-hover:bg-gold-500/20 transition-colors overflow-hidden">
                  {p.logoUrl ? (
                    <Image
                      src={p.logoUrl}
                      alt={p.name}
                      width={48}
                      height={48}
                      className="object-contain w-full h-full p-1"
                    />
                  ) : (
                    <i className={`fa-solid ${typeIcon(p.type)} text-gold-500 text-lg`} />
                  )}
                </div>
                <div>
                  <div className="font-display text-base font-bold text-white mb-0.5 leading-snug">
                    {p.name}
                  </div>
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border border-gold-500/30 text-gold-500 bg-gold-500/5">
                    {p.type.replace("-", " ")}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
