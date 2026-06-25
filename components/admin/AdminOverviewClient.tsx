"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useCountUp, staggerContainer, fadeUp, cardReveal } from "@/lib/animations"

const TIER_ORDER = ["student", "graduate", "professional", "associate", "corporate", "free"]

interface RecentUser {
  id: string
  name: string
  email: string
  tier: string
  joined: string
}

interface Props {
  totalMembers: number
  profPlus: number
  paidCount: number
  newThisMonth: number
  tierCounts: Record<string, number>
  recentUsers: RecentUser[]
}

function StatCard({
  label,
  value,
  icon,
  accent,
  mounted,
}: {
  label: string
  value: number
  icon: string
  accent: string
  mounted: boolean
}) {
  const counted = useCountUp(value, 1400, mounted)

  return (
    <motion.div
      variants={cardReveal}
      className="bg-navy-800 border border-white/5 p-5"
      style={{ borderLeftWidth: "3px", borderLeftColor: accent }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
    >
      <div className="flex items-center gap-2 mb-3">
        <i className={`fa-solid ${icon} text-[10px]`} style={{ color: accent }} />
        <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500">{label}</p>
      </div>
      <p
        className="text-3xl font-bold text-white"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        {counted}
      </p>
    </motion.div>
  )
}

export default function AdminOverviewClient({
  totalMembers,
  profPlus,
  paidCount,
  newThisMonth,
  tierCounts,
  recentUsers,
}: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const stats = [
    { label: "Total Members", value: totalMembers, icon: "fa-users",     accent: "#D4A017" },
    { label: "Professional+", value: profPlus,     icon: "fa-id-badge",  accent: "#60a5fa" },
    { label: "Paid Members",  value: paidCount,    icon: "fa-id-card",   accent: "#34d399" },
    { label: "New (30 days)", value: newThisMonth, icon: "fa-user-plus", accent: "#a78bfa" },
  ]

  const quickLinks = [
    { href: "/admin/members",  icon: "fa-users",               label: "Manage Members",    desc: "View, search, and update member tiers" },
    { href: "/admin/generate", icon: "fa-wand-magic-sparkles", label: "Generate Content",  desc: "AI-draft an editorial or research report" },
    { href: "/admin/payments", icon: "fa-credit-card",         label: "Payments",          desc: "Review Paystack payment history" },
    { href: "/dashboard",      icon: "fa-arrow-left",          label: "Back to Dashboard", desc: "Return to your member dashboard" },
  ]

  return (
    <div className="flex flex-col gap-8 max-w-275">

      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <h1
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Overview
        </h1>
        <p className="text-sm text-slate-400 mt-1">Platform-wide member and activity summary.</p>
      </div>

      {/* Stats row */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {stats.map((s) => (
          <StatCard key={s.label} {...s} mounted={mounted} />
        ))}
      </motion.div>

      {/* Tier breakdown + Recent signups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Tier breakdown */}
        <div className="bg-navy-800 border border-white/5 p-6">
          <h2 className="text-xs font-bold tracking-widest uppercase text-gold-500 mb-5">
            Members by Tier
          </h2>
          <div className="flex flex-col gap-3">
            {TIER_ORDER.map((tier, i) => {
              const count = tierCounts[tier] ?? 0
              const pct = totalMembers > 0 ? Math.round((count / totalMembers) * 100) : 0
              return (
                <div key={tier}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-white capitalize">{tier}</span>
                    <span className="text-xs text-slate-500">{count} members</span>
                  </div>
                  <div className="h-1.5 bg-navy-900 overflow-hidden">
                    <motion.div
                      className="h-full bg-gold-500"
                      initial={{ width: 0 }}
                      animate={{ width: mounted ? `${pct}%` : "0%" }}
                      transition={{
                        duration: 0.8,
                        delay: 0.1 + i * 0.09,
                        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent signups */}
        <div className="bg-navy-800 border border-white/5 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-bold tracking-widest uppercase text-gold-500">
              Recent Signups
            </h2>
            <Link
              href="/admin/members"
              className="text-[10px] text-slate-500 hover:text-gold-500 transition-colors"
            >
              View all
            </Link>
          </div>
          {recentUsers.length === 0 ? (
            <p className="text-xs text-slate-500">No members yet.</p>
          ) : (
            <motion.div
              className="flex flex-col gap-3"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {recentUsers.map((u) => (
                <motion.div key={u.id} variants={fadeUp} className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-navy-900 border border-gold-500/20 flex items-center justify-center shrink-0">
                    <span className="text-[9px] font-bold text-gold-500">
                      {u.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{u.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{u.email}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[9px] font-bold tracking-widest uppercase text-slate-400 capitalize">{u.tier}</p>
                    <p className="text-[9px] text-slate-600">{u.joined}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

      </div>

      {/* Quick links */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {quickLinks.map((item) => (
          <motion.div
            key={item.href}
            variants={cardReveal}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
          >
            <Link
              href={item.href}
              className="bg-navy-800 border border-white/5 p-5 hover:border-gold-500/20 transition-colors group block"
            >
              <div className="w-8 h-8 bg-navy-900 border border-white/5 flex items-center justify-center mb-3">
                <i className={`fa-solid ${item.icon} text-gold-500 text-[10px]`} />
              </div>
              <p className="text-xs font-bold text-white group-hover:text-gold-400 transition-colors mb-1">
                {item.label}
              </p>
              <p className="text-[10px] text-slate-500">{item.desc}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>

    </div>
  )
}
