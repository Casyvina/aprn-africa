"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const filters = ["All", "Pipeline Integrity", "Policy & Regulation", "Renewable Integration", "Project Management", "Safety & HSE"];

const papers = [
  {
    tag: "Pipeline Integrity",
    tagColor: "text-gold-500",
    title: "Corrosion Metrics in High-Salinity Coastal Environments",
    authors: "Okonkwo, A. et al.",
    journal: "APRN Technical Journal",
    date: "May 2026",
    readTime: "12 min",
    type: "Research Paper",
    saved: true,
    new: false,
  },
  {
    tag: "Policy & Regulation",
    tagColor: "text-blue-400",
    title: "ECOWAS Tariff Harmonisation Draft Analysis",
    authors: "Mensah, K. & Diallo, F.",
    journal: "APRN Policy Briefs",
    date: "Apr 2026",
    readTime: "8 min",
    type: "Policy Brief",
    saved: false,
    new: true,
  },
  {
    tag: "Renewable Integration",
    tagColor: "text-emerald-400",
    title: "Hydrogen Blending Capacity in Legacy Gas Infrastructure",
    authors: "Nederveen, P.B.",
    journal: "APRN Technical Journal",
    date: "Apr 2026",
    readTime: "15 min",
    type: "Technical Report",
    saved: true,
    new: false,
  },
  {
    tag: "Pipeline Integrity",
    tagColor: "text-gold-500",
    title: "Advanced Corrosion Science in Tropical Marine Environments",
    authors: "Eze, N.",
    journal: "APRN Technical Journal",
    date: "Mar 2026",
    readTime: "18 min",
    type: "Research Paper",
    saved: false,
    new: false,
  },
  {
    tag: "Policy & Regulation",
    tagColor: "text-blue-400",
    title: "Regulatory Frameworks for Transnational Pipeline Infrastructure",
    authors: "Obi, C.E. & Adeyemi, R.",
    journal: "APRN Policy Briefs",
    date: "Mar 2026",
    readTime: "10 min",
    type: "Policy Brief",
    saved: false,
    new: false,
  },
  {
    tag: "Project Management",
    tagColor: "text-purple-400",
    title: "Development Finance Structures for African Pipeline Projects",
    authors: "Asante, K. & Nkosi, B.",
    journal: "APRN Industry Reports",
    date: "Feb 2026",
    readTime: "22 min",
    type: "Industry Report",
    saved: true,
    new: false,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export default function ResearchPage() {
  return (
    <div className="flex flex-col gap-8 max-w-275">

      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6"
        initial="hidden" animate="visible" variants={stagger}
      >
        <motion.div variants={fadeUp}>
          <h2
            className="text-3xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            My Research
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Your personalised intelligence feed — latest papers, briefs, and technical reports.
          </p>
        </motion.div>
        <motion.div variants={fadeUp} className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs pointer-events-none" />
            <input
              type="text"
              placeholder="Search research..."
              className="bg-navy-800 border border-white/10 pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/40 transition-colors w-52"
            />
          </div>
          <button className="px-4 py-2.5 bg-navy-800 border border-white/10 text-xs text-slate-400 hover:text-white hover:border-gold-500/30 transition-colors flex items-center gap-2">
            <i className="fa-solid fa-sliders text-[10px]" />
            Filter
          </button>
        </motion.div>
      </motion.div>

      {/* Stats strip */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        initial="hidden" animate="visible" variants={stagger}
      >
        {[
          { label: "Papers Available", value: "400+", icon: "fa-file-lines" },
          { label: "New This Month",   value: "14",   icon: "fa-sparkles" },
          { label: "Saved by You",     value: "3",    icon: "fa-bookmark" },
          { label: "Topics Tracked",   value: "2",    icon: "fa-tags" },
        ].map((s) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            className="bg-navy-800 border border-white/5 p-4 flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-navy-900 border border-white/5 flex items-center justify-center shrink-0">
              <i className={`fa-solid ${s.icon} text-gold-500 text-xs`} />
            </div>
            <div>
              <p className="text-xl font-bold text-white leading-none" style={{ fontFamily: "var(--font-playfair), serif" }}>
                {s.value}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5 leading-tight">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Membership gate */}
      <motion.div
        className="bg-gold-500/5 border border-gold-500/20 p-5 flex items-start gap-4"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
      >
        <i className="fa-solid fa-lock text-gold-500 text-sm mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-white mb-1">Full archive requires Professional membership</p>
          <p className="text-xs text-slate-400">
            You&apos;re seeing a preview. Upgrade to access all 400+ papers, full text, and downloads.{" "}
            <Link href="/dashboard/membership" className="text-gold-500 hover:text-gold-400 transition-colors">
              View plans →
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Filter tabs */}
      <motion.div
        className="flex flex-wrap gap-2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.3 }}
      >
        {filters.map((f, i) => (
          <button
            key={f}
            className={`px-4 py-2 text-xs font-semibold transition-colors ${
              i === 0
                ? "bg-gold-500 text-navy-900"
                : "bg-navy-800 border border-white/10 text-slate-400 hover:text-white hover:border-gold-500/30"
            }`}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* Sort row */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Showing <span className="text-white">{papers.length}</span> results
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest">Sort:</span>
          {["Latest", "Most Saved", "By Topic"].map((s, i) => (
            <button
              key={s}
              className={`px-3 py-1.5 text-[10px] font-bold tracking-wider transition-colors ${
                i === 0
                  ? "bg-navy-800 border border-gold-500/30 text-gold-500"
                  : "text-slate-500 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Research list */}
      <motion.div
        className="flex flex-col gap-3"
        initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.35 } } }}
      >
        {papers.map((paper) => (
          <motion.div
            key={paper.title}
            variants={fadeUp}
            className="bg-navy-800 border border-white/5 p-6 flex gap-5 hover:border-gold-500/20 transition-colors group cursor-pointer"
          >
            <div className="w-10 h-10 bg-navy-900 border border-white/5 flex items-center justify-center shrink-0 mt-0.5">
              <i className="fa-solid fa-file-lines text-slate-500 group-hover:text-gold-500 transition-colors text-sm" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-0.5 bg-navy-900 border border-white/5 text-[9px] font-bold tracking-widest uppercase ${paper.tagColor}`}>
                  {paper.tag}
                </span>
                <span className="text-[10px] text-slate-500">{paper.type}</span>
                {paper.new && (
                  <span className="px-2 py-0.5 bg-emerald-400/10 border border-emerald-400/20 text-[9px] font-bold tracking-widest text-emerald-400 uppercase">
                    New
                  </span>
                )}
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-gold-400 transition-colors leading-snug">
                {paper.title}
              </h4>
              <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <i className="fa-solid fa-user-pen text-[10px]" />
                  {paper.authors}
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="fa-solid fa-book-open text-[10px]" />
                  {paper.journal}
                </span>
                <span>{paper.date}</span>
                <span>{paper.readTime} read</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Link
                href="/dashboard/membership"
                className="w-8 h-8 bg-navy-900 border border-white/5 flex items-center justify-center hover:border-gold-500/30 transition-colors group/btn"
                title="Read (upgrade required)"
              >
                <i className="fa-solid fa-lock text-slate-600 group-hover/btn:text-gold-500 transition-colors text-[10px]" />
              </Link>
              <button
                className={`w-8 h-8 bg-navy-900 border flex items-center justify-center transition-colors group/btn ${
                  paper.saved
                    ? "border-gold-500/30 text-gold-500"
                    : "border-white/5 text-slate-600 hover:border-gold-500/30 hover:text-gold-500"
                }`}
                title={paper.saved ? "Saved" : "Save"}
              >
                <i className={`text-[10px] ${paper.saved ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"}`} />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-4 border-t border-white/5">
        <p className="text-xs text-slate-500">Page 1 of 28</p>
        <div className="flex gap-2">
          <button disabled className="w-8 h-8 bg-navy-800 border border-white/5 flex items-center justify-center text-slate-600 cursor-not-allowed">
            <i className="fa-solid fa-chevron-left text-[10px]" />
          </button>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              className={`w-8 h-8 border flex items-center justify-center text-xs transition-colors ${
                n === 1
                  ? "bg-gold-500 border-gold-500 text-navy-900 font-bold"
                  : "bg-navy-800 border-white/5 text-slate-400 hover:text-white hover:border-gold-500/30"
              }`}
            >
              {n}
            </button>
          ))}
          <button className="w-8 h-8 bg-navy-800 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <i className="fa-solid fa-chevron-right text-[10px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
