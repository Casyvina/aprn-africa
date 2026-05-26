"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const categories = ["All", "Pipeline Integrity", "Policy & Regulation", "Renewable Integration", "Project Management", "Safety & HSE"];

const courses = [
  {
    code: "APC-101",
    title: "Pipeline Integrity Management Fundamentals",
    category: "Pipeline Integrity",
    duration: "6 weeks",
    level: "Foundation",
    levelColor: "text-emerald-400 border-emerald-400/30",
    modules: 12,
    enrolled: 248,
    description: "Core principles of pipeline integrity assessment, in-line inspection methods, and corrosion management across African operating environments.",
  },
  {
    code: "APC-210",
    title: "Regulatory Frameworks for Transnational Pipelines",
    category: "Policy & Regulation",
    duration: "4 weeks",
    level: "Intermediate",
    levelColor: "text-gold-500 border-gold-500/30",
    modules: 8,
    enrolled: 134,
    description: "ECOWAS energy protocols, bilateral transit agreements, and harmonisation of national pipeline regulations across West and East Africa.",
  },
  {
    code: "APC-305",
    title: "Hydrogen Blending in Legacy Gas Infrastructure",
    category: "Renewable Integration",
    duration: "5 weeks",
    level: "Advanced",
    levelColor: "text-blue-400 border-blue-400/30",
    modules: 10,
    enrolled: 89,
    description: "Technical feasibility, material compatibility, and operational protocols for hydrogen blending in existing African gas transmission networks.",
  },
  {
    code: "APC-150",
    title: "HSE Management in Pipeline Construction",
    category: "Safety & HSE",
    duration: "3 weeks",
    level: "Foundation",
    levelColor: "text-emerald-400 border-emerald-400/30",
    modules: 6,
    enrolled: 310,
    description: "Risk assessment frameworks, contractor safety management, and incident reporting standards aligned with international pipeline construction best practice.",
  },
  {
    code: "APC-280",
    title: "Project Finance for Energy Infrastructure",
    category: "Project Management",
    duration: "6 weeks",
    level: "Intermediate",
    levelColor: "text-gold-500 border-gold-500/30",
    modules: 11,
    enrolled: 172,
    description: "Development finance institutions, bankability criteria, PPP structures, and risk allocation models for African pipeline and energy projects.",
  },
  {
    code: "APC-320",
    title: "Corrosion Science in Tropical Marine Environments",
    category: "Pipeline Integrity",
    duration: "4 weeks",
    level: "Advanced",
    levelColor: "text-blue-400 border-blue-400/30",
    modules: 9,
    enrolled: 67,
    description: "Electrochemical mechanisms, cathodic protection design, and coating selection for offshore and near-shore pipeline assets in sub-Saharan Africa.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

export default function CoursesPage() {
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
              placeholder="Search courses..."
              className="bg-navy-800 border border-white/10 pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/40 transition-colors w-52"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Empty enrolment state */}
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
      <motion.div
        className="flex flex-wrap gap-2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.25 }}
      >
        {categories.map((cat, i) => (
          <button
            key={cat}
            className={`px-4 py-2 text-xs font-semibold transition-colors ${
              i === 0
                ? "bg-gold-500 text-navy-900"
                : "bg-navy-800 border border-white/10 text-slate-400 hover:text-white hover:border-gold-500/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Course grid */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        initial="hidden" animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } } }}
      >
        {courses.map((course) => (
          <motion.div
            key={course.code}
            variants={fadeUp}
            className="bg-navy-800 border border-white/5 p-6 flex flex-col gap-4 hover:border-gold-500/20 transition-colors group cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-navy-900 border border-white/5 text-[9px] font-bold tracking-widest text-gold-500 uppercase">
                    {course.code}
                  </span>
                  <span className={`px-2 py-0.5 border text-[9px] font-bold tracking-widest uppercase ${course.levelColor}`}>
                    {course.level}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white group-hover:text-gold-400 transition-colors leading-snug">
                  {course.title}
                </h4>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{course.description}</p>
            <div className="flex items-center gap-5 text-xs text-slate-500 border-t border-white/5 pt-3 flex-wrap">
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-clock text-[10px]" />
                {course.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-layer-group text-[10px]" />
                {course.modules} modules
              </span>
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-users text-[10px]" />
                {course.enrolled.toLocaleString()} enrolled
              </span>
              <span className="ml-auto px-2 py-0.5 bg-navy-900 border border-white/5 text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                {course.category}
              </span>
            </div>
            <Link
              href="/dashboard/membership"
              className="w-full py-2.5 text-center text-[10px] font-bold tracking-widest uppercase text-gold-500 border border-gold-500/30 hover:bg-gold-500/10 transition-colors"
            >
              Enrol — Upgrade Required
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer CTA */}
      <div className="text-center py-6 border-t border-white/5">
        <p className="text-xs text-slate-500 mb-3">
          Full catalogue access requires a Professional or Institutional membership.
        </p>
        <Link
          href="/dashboard/membership"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gold-500 hover:text-gold-400 transition-colors"
        >
          View Membership Plans <i className="fa-solid fa-arrow-right" />
        </Link>
      </div>
    </div>
  );
}
