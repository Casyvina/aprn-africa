"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { TrainingProgramCard } from "@/lib/queries/training";

const LEVEL_STYLE: Record<string, string> = {
  Foundation:   "text-emerald-400 border-emerald-400/30",
  Intermediate: "text-gold-500 border-gold-500/30",
  Advanced:     "text-blue-400 border-blue-400/30",
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

export default function CoursesPageClient({ courses }: { courses: TrainingProgramCard[] }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filters = useMemo(() => {
    const types = new Set<string>();
    courses.forEach((c) => { if (c.programType) types.add(c.programType); });
    return ["All", ...Array.from(types).sort()];
  }, [courses]);

  const filtered = useMemo(() => {
    let list = courses;
    if (activeFilter !== "All") {
      list = list.filter((c) => c.programType === activeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q));
    }
    return list;
  }, [courses, activeFilter, search]);

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
            className="text-3xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Training Catalogue
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Professionally accredited programmes for pipeline engineers across Africa.
          </p>
        </motion.div>
        <motion.div variants={fadeUp} className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="bg-navy-800 border border-white/10 pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/40 transition-colors w-full sm:w-52"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Enrolment banner — static until enrolment tracking is built */}
      <motion.div
        className="bg-navy-800 border border-white/5 border-dashed p-8 flex flex-col sm:flex-row items-center gap-6"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
      >
        <div className="w-12 h-12 bg-navy-900 border border-white/5 flex items-center justify-center shrink-0">
          <i className="fa-solid fa-graduation-cap text-slate-600 text-lg" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm font-semibold text-white mb-1">No courses enrolled yet</p>
          <p className="text-xs text-slate-400">
            Enrol in any programme below to track your progress from this dashboard.
          </p>
        </div>
      </motion.div>

      {/* Category filter */}
      {filters.length > 1 && (
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.25 }}
        >
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 text-xs font-semibold transition-colors ${
                activeFilter === f
                  ? "bg-gold-500 text-navy-900"
                  : "bg-navy-800 border border-white/10 text-slate-400 hover:text-white hover:border-gold-500/30"
              }`}
            >
              {f}
            </button>
          ))}
        </motion.div>
      )}

      {/* Course grid */}
      {courses.length === 0 ? (
        <div className="bg-navy-800 border border-white/5 border-dashed p-12 flex flex-col items-center gap-3 text-center">
          <i className="fa-solid fa-graduation-cap text-slate-700 text-3xl" />
          <p className="text-sm font-semibold text-slate-400">No training programmes published yet</p>
          <p className="text-xs text-slate-600">Programmes will appear here once added to the content library.</p>
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
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          initial="hidden" animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
        >
          {filtered.map((course) => {
            const levelStyle = LEVEL_STYLE[course.level] ?? "text-slate-400 border-white/10";
            return (
              <motion.div
                key={course._id}
                variants={fadeUp}
                className="bg-navy-800 border border-white/5 p-6 flex flex-col gap-4 hover:border-gold-500/20 transition-colors group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {course.programType && (
                        <span className="px-2 py-0.5 bg-navy-900 border border-white/5 text-[9px] font-bold tracking-widest text-gold-500 uppercase">
                          {course.programType}
                        </span>
                      )}
                      {course.level && (
                        <span className={`px-2 py-0.5 border text-[9px] font-bold tracking-widest uppercase ${levelStyle}`}>
                          {course.level}
                        </span>
                      )}
                      {course.featured && (
                        <span className="px-2 py-0.5 bg-gold-500/10 border border-gold-500/20 text-[9px] font-bold tracking-widest text-gold-500 uppercase">
                          Featured
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-gold-400 transition-colors leading-snug">
                      {course.name}
                    </h4>
                  </div>
                </div>
                {course.description && (
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{course.description}</p>
                )}
                <div className="flex items-center gap-5 text-xs text-slate-500 border-t border-white/5 pt-3 flex-wrap">
                  {course.durationWeeks && (
                    <span className="flex items-center gap-1.5">
                      <i className="fa-solid fa-clock text-[10px]" />
                      {course.durationWeeks} week{course.durationWeeks !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <Link
                  href="/training"
                  className="w-full py-2.5 text-center text-[10px] font-bold tracking-widest uppercase text-gold-500 border border-gold-500/30 hover:bg-gold-500/10 transition-colors"
                >
                  View Programme →
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Footer */}
      <div className="text-center py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          Full catalogue access requires a Professional or Institutional membership.
        </p>
        <div className="flex items-center gap-6">
          <Link
            href="/training"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
          >
            <i className="fa-solid fa-arrow-left text-[10px]" /> Public training programmes
          </Link>
          <Link
            href="/dashboard/membership"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gold-500 hover:text-gold-400 transition-colors"
          >
            View Membership Plans <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>
      </div>
    </div>
  );
}
