"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { NetworkMember } from "@/app/dashboard/network/page";

const FIVE_MIN_MS = 5 * 60 * 1000;

function isOnline(lastSeen: string | null): boolean {
  if (!lastSeen) return false;
  return Date.now() - new Date(lastSeen).getTime() < FIVE_MIN_MS;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

export default function NetworkPageClient({
  members,
  totalCount,
}: {
  members: NetworkMember[];
  totalCount: number;
}) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const disciplines = useMemo(() => {
    const set = new Set<string>();
    members.forEach((m) => { if (m.discipline) set.add(m.discipline); });
    return ["All", ...Array.from(set).sort()];
  }, [members]);

  const countries = useMemo(() => {
    const set = new Set<string>();
    members.forEach((m) => { if (m.country) set.add(m.country); });
    return set.size;
  }, [members]);

  const orgs = useMemo(() => {
    const set = new Set<string>();
    members.forEach((m) => { if (m.organisation) set.add(m.organisation); });
    return set.size;
  }, [members]);

  const filtered = useMemo(() => {
    let list = members;
    if (activeFilter !== "All") {
      list = list.filter((m) => m.discipline === activeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.full_name.toLowerCase().includes(q) ||
          m.organisation?.toLowerCase().includes(q) ||
          m.country?.toLowerCase().includes(q) ||
          m.discipline?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [members, activeFilter, search]);

  return (
    <div className="flex flex-col gap-8 max-w-275">

      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6"
        initial="hidden" animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
      >
        <motion.div variants={fadeUp}>
          <h2
            className="text-2xl sm:text-3xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Engineer Network
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Connect with pipeline engineers, researchers, and policymakers across Africa.
          </p>
        </motion.div>
        <motion.div variants={fadeUp} className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search members..."
              className="bg-navy-800 border border-white/10 pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/40 transition-colors w-full sm:w-52"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Stats strip */}
      <motion.div
        className="grid grid-cols-3 gap-4"
        initial="hidden" animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
      >
        {[
          { label: "Members",       value: totalCount > 0 ? `${totalCount}+` : "0", icon: "fa-users" },
          { label: "Countries",     value: countries > 0 ? String(countries) : "—",  icon: "fa-globe-africa" },
          { label: "Organisations", value: orgs > 0 ? `${orgs}+` : "—",             icon: "fa-building" },
        ].map((s) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            className="bg-navy-800 border border-white/5 p-3 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 text-center sm:text-left"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-navy-900 border border-white/5 hidden sm:flex items-center justify-center shrink-0">
              <i className={`fa-solid ${s.icon} text-gold-500 text-xs`} />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-white leading-none" style={{ fontFamily: "var(--font-playfair), serif" }}>
                {s.value}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Membership gate */}
      <motion.div
        className="bg-gold-500/5 border border-gold-500/20 p-5 flex items-start gap-4"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
      >
        <i className="fa-solid fa-lock text-gold-500 text-sm mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-white mb-1">Direct messaging requires Professional membership</p>
          <p className="text-xs text-slate-400">
            Upgrade to connect directly and message engineers.{" "}
            <Link href="/dashboard/membership" className="text-gold-500 hover:text-gold-400 transition-colors">
              View plans →
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Discipline filter */}
      {disciplines.length > 1 && (
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.3 }}
        >
          {disciplines.map((d) => (
            <button
              key={d}
              onClick={() => setActiveFilter(d)}
              className={`px-4 py-2 text-xs font-semibold transition-colors ${
                activeFilter === d
                  ? "bg-gold-500 text-navy-900"
                  : "bg-navy-800 border border-white/10 text-slate-400 hover:text-white hover:border-gold-500/30"
              }`}
            >
              {d}
            </button>
          ))}
        </motion.div>
      )}

      {/* Member grid */}
      {members.length === 0 ? (
        <div className="bg-navy-800 border border-white/5 border-dashed p-12 flex flex-col items-center gap-3 text-center">
          <i className="fa-solid fa-users text-slate-700 text-3xl" />
          <p className="text-sm font-semibold text-slate-400">No members yet</p>
          <p className="text-xs text-slate-600">Members will appear here once they complete their profiles.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-navy-800 border border-white/5 p-10 flex flex-col items-center gap-3 text-center">
          <i className="fa-solid fa-filter text-slate-700 text-2xl" />
          <p className="text-sm text-slate-400">No results for this filter</p>
          <button onClick={() => { setActiveFilter("All"); setSearch(""); }} className="text-xs text-gold-500 hover:text-gold-400 transition-colors">
            Clear filter
          </button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          initial="hidden" animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
        >
          {filtered.map((member) => (
            <motion.div
              key={member.id}
              variants={fadeUp}
              className="bg-navy-800 border border-white/5 p-5 flex flex-col gap-4 hover:border-gold-500/20 transition-colors group"
            >
              <div className="relative self-start">
                {member.avatar_url ? (
                  <img
                    src={member.avatar_url}
                    alt={member.full_name}
                    className="w-12 h-12 object-cover border border-gold-500/20"
                  />
                ) : (
                  <div className="w-12 h-12 bg-navy-900 border border-gold-500/20 flex items-center justify-center">
                    <span
                      className="text-sm font-bold text-gold-500"
                      style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                      {initials(member.full_name)}
                    </span>
                  </div>
                )}
                {isOnline(member.last_seen_at) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-navy-800 rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white group-hover:text-gold-400 transition-colors leading-snug mb-0.5">
                  {member.full_name}
                </p>
                {member.job_title && (
                  <p className="text-xs text-slate-400 leading-snug mb-2">{member.job_title}</p>
                )}
                {member.organisation && (
                  <p className="text-[10px] text-slate-500 truncate">{member.organisation}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {member.country && (
                  <span className="px-2 py-0.5 bg-navy-900 border border-white/5 text-[9px] font-bold tracking-widest text-gold-500 uppercase">
                    {member.country}
                  </span>
                )}
                {member.discipline && (
                  <span className="px-2 py-0.5 bg-navy-900 border border-white/5 text-[9px] text-slate-400 uppercase tracking-wider">
                    {member.discipline}
                  </span>
                )}
              </div>
              <Link
                href={`/dashboard/network/${member.id}`}
                className="w-full py-2 text-center text-[10px] font-bold tracking-widest uppercase text-slate-400 border border-white/10 hover:text-gold-500 hover:border-gold-500/30 transition-colors"
              >
                View Profile
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Results count */}
      {filtered.length > 0 && (
        <div className="text-center py-4 border-t border-white/5">
          <p className="text-xs text-slate-500">
            Showing {filtered.length} of {totalCount} members
          </p>
        </div>
      )}
    </div>
  );
}
