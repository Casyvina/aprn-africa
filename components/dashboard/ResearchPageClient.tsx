"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { DashboardResearchCard } from "@/lib/queries/research";

const TOPIC_COLOR: Record<string, string> = {
  "Pipeline Integrity": "text-gold-500",
  "Policy & Regulation": "text-blue-400",
  "Policy": "text-blue-400",
  "Renewable Integration": "text-emerald-400",
  "Renewable": "text-emerald-400",
  "Project Management": "text-purple-400",
  "Safety & HSE": "text-red-400",
  "HSE": "text-red-400",
  "Safety": "text-red-400",
  "Research": "text-cyan-400",
};

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

function isNew(publishDate: string) {
  return Date.now() - new Date(publishDate).getTime() < THIRTY_DAYS;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

function topicColor(topics: { name: string }[]) {
  return TOPIC_COLOR[topics?.[0]?.name ?? ""] ?? "text-slate-400";
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };

export default function ResearchPageClient({
  papers,
  savedMap,
}: {
  papers: DashboardResearchCard[];
  savedMap: Record<string, string>;
}) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [localSaved, setLocalSaved] = useState<Record<string, string>>(savedMap);
  const [saving, setSaving] = useState<string | null>(null);

  const filters = useMemo(() => {
    const names = new Set<string>();
    papers.forEach((p) => p.topics?.forEach((t) => names.add(t.name)));
    return ["All", ...Array.from(names).sort()];
  }, [papers]);

  const filtered = useMemo(() => {
    let list = papers;
    if (activeFilter !== "All") {
      list = list.filter((p) => p.topics?.some((t) => t.name === activeFilter));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.title.toLowerCase().includes(q) || p.authorName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [papers, activeFilter, search]);

  const newCount = useMemo(() => papers.filter((p) => isNew(p.publishDate)).length, [papers]);
  const savedCount = Object.keys(localSaved).length;

  async function toggleSave(paper: DashboardResearchCard) {
    if (saving) return;
    setSaving(paper._id);
    const rowId = localSaved[paper._id];
    try {
      if (rowId) {
        await fetch(`/api/dashboard/saved?id=${rowId}`, { method: "DELETE" });
        setLocalSaved((prev) => {
          const next = { ...prev };
          delete next[paper._id];
          return next;
        });
      } else {
        const res = await fetch("/api/dashboard/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            item_id: paper._id,
            item_type: "research",
            item_slug: paper.slug,
            item_title: paper.title,
          }),
        });
        if (res.ok) {
          const { id } = (await res.json()) as { id: string };
          setLocalSaved((prev) => ({ ...prev, [paper._id]: id }));
        }
      }
    } catch { /* network error — state stays consistent */ }
    setSaving(null);
  }

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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search research..."
              className="bg-navy-800 border border-white/10 pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/40 transition-colors w-52"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Stats strip */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        initial="hidden" animate="visible" variants={stagger}
      >
        {[
          { label: "Papers Available", value: papers.length > 0 ? `${papers.length}+` : "0", icon: "fa-file-lines" },
          { label: "New This Month",   value: String(newCount),   icon: "fa-sparkles" },
          { label: "Saved by You",     value: String(savedCount), icon: "fa-bookmark" },
          { label: "Topics",           value: String(filters.length - 1), icon: "fa-tags" },
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

      {/* Membership gate — only shown when there are papers */}
      {papers.length > 0 && (
        <motion.div
          className="bg-gold-500/5 border border-gold-500/20 p-5 flex items-start gap-4"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
        >
          <i className="fa-solid fa-lock text-gold-500 text-sm mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-white mb-1">Full archive requires Professional membership</p>
            <p className="text-xs text-slate-400">
              Upgrade to access full text, downloads, and the complete archive.{" "}
              <Link href="/dashboard/membership" className="text-gold-500 hover:text-gold-400 transition-colors">
                View plans →
              </Link>
            </p>
          </div>
        </motion.div>
      )}

      {/* Filter tabs */}
      {filters.length > 1 && (
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.3 }}
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

      {/* Sort row */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Showing <span className="text-white">{filtered.length}</span> result{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Content */}
      {papers.length === 0 ? (
        <div className="bg-navy-800 border border-white/5 border-dashed p-12 flex flex-col items-center justify-center gap-3 text-center">
          <i className="fa-solid fa-file-lines text-slate-700 text-3xl" />
          <p className="text-sm font-semibold text-slate-400">No research published yet</p>
          <p className="text-xs text-slate-600">Research reports will appear here once added to the content library.</p>
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
          className="flex flex-col gap-3"
          initial="hidden" animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
        >
          {filtered.map((paper) => {
            const isSaved = paper._id in localSaved;
            const primaryTopic = paper.topics?.[0]?.name ?? paper.reportType;
            return (
              <motion.div
                key={paper._id}
                variants={fadeUp}
                className="bg-navy-800 border border-white/5 p-6 flex gap-5 hover:border-gold-500/20 transition-colors group"
              >
                <div className="w-10 h-10 bg-navy-900 border border-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <i className="fa-solid fa-file-lines text-slate-500 group-hover:text-gold-500 transition-colors text-sm" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {primaryTopic && (
                      <span className={`px-2 py-0.5 bg-navy-900 border border-white/5 text-[9px] font-bold tracking-widest uppercase ${topicColor(paper.topics ?? [])}`}>
                        {primaryTopic}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500">{paper.reportType}</span>
                    {isNew(paper.publishDate) && (
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
                      {paper.authorName}
                    </span>
                    <span>{fmtDate(paper.publishDate)}</span>
                    {paper.estimatedReadTime && (
                      <span>{paper.estimatedReadTime} min read</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Link
                    href={`/research/${paper.slug}`}
                    className="w-8 h-8 bg-navy-900 border border-white/5 flex items-center justify-center hover:border-gold-500/30 transition-colors group/btn"
                    title="Read"
                  >
                    <i className="fa-solid fa-arrow-up-right-from-square text-slate-600 group-hover/btn:text-gold-500 transition-colors text-[10px]" />
                  </Link>
                  <button
                    onClick={() => toggleSave(paper)}
                    disabled={saving === paper._id}
                    className={`w-8 h-8 bg-navy-900 border flex items-center justify-center transition-colors ${
                      isSaved
                        ? "border-gold-500/30 text-gold-500"
                        : "border-white/5 text-slate-600 hover:border-gold-500/30 hover:text-gold-500"
                    }`}
                    title={isSaved ? "Remove bookmark" : "Save"}
                  >
                    {saving === paper._id ? (
                      <i className="fa-solid fa-circle-notch fa-spin text-[10px] text-slate-500" />
                    ) : (
                      <i className={`text-[10px] ${isSaved ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"}`} />
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
