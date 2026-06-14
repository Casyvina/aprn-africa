"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { InsightStat } from "@/lib/queries/homepage";
import { fadeUp, fadeLeft, cardReveal, staggerContainer, useCountUp } from "@/lib/animations";

/** Parses "72%", "$180B", "15+" into { prefix, num, suffix } */
function parseStatValue(raw: string): { prefix: string; num: number; suffix: string } {
  const match = raw.match(/^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/)
  if (!match) return { prefix: "", num: 0, suffix: raw }
  return { prefix: match[1], num: parseFloat(match[2]), suffix: match[3] }
}

function AnimatedStatValue({ value }: { value: string }) {
  const ref   = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const { prefix, num, suffix } = parseStatValue(value)
  const count  = useCountUp(num, 1800, inView)

  return (
    <span ref={ref} className="text-gold-500">
      {prefix}{Number.isInteger(num) ? Math.round(count) : count}{suffix}
    </span>
  )
}

const DEFAULT_STATS: InsightStat[] = [
  { value: "$180B", label: "Pipeline investment projected across Africa by 2030",                         icon: "fa-chart-line" },
  { value: "72%",   label: "Of senior pipeline engineering roles currently filled by non-African talent", icon: "fa-users" },
  { value: "15+",   label: "Continental infrastructure projects stalled due to local skills deficit",     icon: "fa-triangle-exclamation" },
  { value: "12",    label: "AU member states with no domestically certified pipeline standards body",     icon: "fa-file-circle-xmark" },
];

interface WhyNowProps {
  badge?: string
  heading?: string
  intro1?: string
  intro2?: string
  quote?: string
  stats?: InsightStat[]
}

export default function WhyNowSection({
  badge,
  heading,
  intro1,
  intro2,
  quote,
  stats,
}: WhyNowProps) {
  const sectionBadge   = badge   ?? "The Urgency";
  const sectionHeading = heading ?? "Why Africa Needs APRN Now";
  const p1 = intro1 ?? "Africa is entering its most consequential energy decade. Billions in infrastructure capital are flowing \u2014 yet the continent risks repeating the colonial-era pattern of building assets without building the people to own, operate, and govern them.";
  const p2 = intro2 ?? "APRN exists to close that gap permanently: through world-class engineering certification, policy frameworks grounded in African realities, and a living intelligence network that keeps practitioners, regulators, and investors aligned.";
  const pullQuote = quote ?? "Local content requirements without local capacity is policy fiction.";
  const statCards = stats && stats.length > 0 ? stats : DEFAULT_STATS;

  return (
    <section id="why-now" className="py-24 bg-navy-900 relative border-t border-navy-800">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 80% 50%, rgba(201, 122, 43, 0.07) 0%, transparent 60%)",
        }}
      />
      <div className="max-w-360 mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — editorial intro, slides in from left */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.span variants={fadeUp} className="text-gold-500 uppercase tracking-widest text-sm font-semibold mb-4 block">
              {sectionBadge}
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {sectionHeading.includes("APRN Now") ? (
                <>
                  {sectionHeading.split("APRN Now")[0]}
                  <span className="text-gold-500">APRN Now</span>
                </>
              ) : (
                sectionHeading
              )}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 text-lg leading-relaxed mb-8">
              {p1}
            </motion.p>
            <motion.p variants={fadeUp} className="text-slate-400 leading-relaxed mb-8">
              {p2}
            </motion.p>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-5 py-3 glass-panel rounded-sm border-l-4 border-gold-500">
              <i className="fa-solid fa-quote-left text-gold-500 text-xl" />
              <span className="text-sm text-slate-300 italic">
                &ldquo;{pullQuote}&rdquo;
              </span>
            </motion.div>
          </motion.div>

          {/* Right — stat cards stagger in */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
          >
            {statCards.map((s) => (
              <motion.div
                key={s.label}
                variants={cardReveal}
                className="glass-panel p-6 rounded-sm border border-navy-700 hover:border-gold-500/40 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  {s.icon && (
                    <div className="w-10 h-10 rounded-sm bg-gold-500/10 flex items-center justify-center shrink-0 mt-1 group-hover:bg-gold-500/20 transition-colors">
                      <i className={`fa-solid ${s.icon} text-gold-500`} />
                    </div>
                  )}
                  <div>
                    <div className="font-display text-3xl font-bold text-white mb-2">
                      <AnimatedStatValue value={s.value} />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{s.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
