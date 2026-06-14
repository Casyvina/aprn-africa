"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { cardReveal, staggerContainer } from "@/lib/animations"

interface Plan {
  name: string
  naira: string
  usd: string
  tagline: string
  note: string
  color: string
  featured?: boolean
}

interface Props {
  plans: Plan[]
}

export default function MembershipTierCards({ plans }: Props) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={staggerContainer}
    >
      {plans.map((plan) => (
        <motion.div
          key={plan.name}
          variants={cardReveal}
          className={`relative bg-navy-800 flex flex-col p-7 border transition-colors hover:border-gold-500/25 ${
            plan.featured
              ? "border-t-2 border-t-gold-500 border border-gold-500/30"
              : "border border-white/5"
          }`}
          // Hover lift — GPU-only transform + shadow
          whileHover={{ scale: 1.02, transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] } }}
        >
          {/* Idle gold glow pulse on featured card */}
          {plan.featured && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ boxShadow: "0 0 0 1px rgba(212,160,23,0)" }}
              animate={{
                boxShadow: [
                  "0 0 0px 1px rgba(212,160,23,0.08)",
                  "0 0 20px 3px rgba(212,160,23,0.18)",
                  "0 0 0px 1px rgba(212,160,23,0.08)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          {plan.featured && (
            <div className="absolute -top-3 left-6">
              <span className="px-3 py-1 bg-gold-500 text-navy-900 text-[9px] font-bold tracking-widest uppercase">
                Most Popular
              </span>
            </div>
          )}

          <p className={`text-[10px] font-bold tracking-widest uppercase mb-3 ${plan.color}`}>
            {plan.name}
          </p>
          <div className="flex items-baseline gap-2 mb-1">
            <span
              className="text-3xl font-bold text-white"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {plan.naira}
            </span>
            <span className="text-xs text-slate-500">/year</span>
          </div>
          <p className="text-xs text-slate-400 mb-1">{plan.tagline}</p>
          <p className="text-[10px] text-slate-500 italic mb-6 flex-1">{plan.note}</p>
          <Link
            href="/register"
            className={`w-full py-3 text-center text-[10px] font-bold tracking-widest uppercase transition-colors ${
              plan.featured
                ? "bg-gold-500 text-navy-900 hover:bg-gold-400"
                : "border border-gold-500/30 text-gold-500 hover:bg-gold-500/10"
            }`}
          >
            Join Now
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
