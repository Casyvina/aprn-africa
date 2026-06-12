"use client";

import { useState, useRef } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type DocCategory = "Presentations" | "Reports" | "Letters" | "Research" | "Strategy" | "Database";

interface Document {
  id: string;
  name: string;
  version: string;
  date: string;
  category: DocCategory;
  format: string;
  icon: string;
  description: string;
  filename: string;
}

// ── Data ─────────────────────────────────────────────────────────────────────

const DOCUMENTS: Document[] = [
  {
    id: "pres-v11",
    name: "APRN Presentation",
    version: "v11",
    date: "June 2026",
    category: "Presentations",
    format: "PPTX",
    icon: "fa-file-powerpoint",
    description: "Main APRN corporate presentation covering mission, team, programs, and partnerships.",
    filename: "APRN_Presentation_v11.pptx",
  },
  {
    id: "ci-v8",
    name: "Competitive Intelligence Report",
    version: "v8",
    date: "June 2026",
    category: "Reports",
    format: "HTML",
    icon: "fa-chart-bar",
    description: "Deep analysis of APRN's competitive landscape across African pipeline training and research organisations.",
    filename: "APRN_Competitive_Intelligence_Report_v8.html",
  },
  {
    id: "brand-v2",
    name: "Brand Guidelines",
    version: "v2",
    date: "May 2026",
    category: "Strategy",
    format: "HTML",
    icon: "fa-palette",
    description: "Official APRN brand guidelines including colour palette, typography, logo usage, and tone of voice.",
    filename: "APRN_Brand_Guidelines_v2.html",
  },
  {
    id: "membership",
    name: "Membership Structure",
    version: "v1",
    date: "May 2026",
    category: "Strategy",
    format: "HTML",
    icon: "fa-id-card",
    description: "APRN membership tiers, pricing, benefits structure, and eligibility criteria.",
    filename: "APRN_Membership_Structure.html",
  },
  {
    id: "employ-joseph",
    name: "Employment Letter — Joseph Agwuh",
    version: "v2",
    date: "May 2026",
    category: "Letters",
    format: "DOCX",
    icon: "fa-file-word",
    description: "Official APRN employment letter for Joseph Agwuh, Director of Applied Engineering.",
    filename: "APRN_Employment_Letter_Joseph_Agwuh_v2.docx",
  },
  {
    id: "ambassador-allison",
    name: "Ambassador Letter — Allison Gabriel",
    version: "v2",
    date: "May 2026",
    category: "Letters",
    format: "DOCX",
    icon: "fa-file-word",
    description: "Official APRN Youth Ambassador appointment letter for Allison Gabriel.",
    filename: "APRN_Ambassador_Letter_Allison_Gabriel_v2.docx",
  },
  {
    id: "research-brief",
    name: "Research Briefing — 11 Questions",
    version: "v1",
    date: "May 2026",
    category: "Research",
    format: "DOCX",
    icon: "fa-file-lines",
    description: "Internal research briefing document covering 11 key strategic questions for APRN's research agenda.",
    filename: "APRN_Research_Briefing_11_Questions.docx",
  },
  {
    id: "pipeline-db",
    name: "Pipeline Industry Database",
    version: "v1",
    date: "June 2026",
    category: "Database",
    format: "XLSX",
    icon: "fa-file-excel",
    description: "Master database of African pipeline operators, contacts, project status, and market intelligence.",
    filename: "APRN_Pipeline_Database_Master.xlsx",
  },
  {
    id: "progress-june",
    name: "APRN Progress Report — June 2026",
    version: "v1",
    date: "June 2026",
    category: "Reports",
    format: "HTML",
    icon: "fa-chart-line",
    description: "Internal progress report covering all APRN activities, milestones, and KPIs for June 2026.",
    filename: "APRN_Progress_Report_June2026.html",
  },
];

const CATEGORIES: Array<{ label: string; value: DocCategory | "All" }> = [
  { label: "All",           value: "All" },
  { label: "Presentations", value: "Presentations" },
  { label: "Reports",       value: "Reports" },
  { label: "Letters",       value: "Letters" },
  { label: "Research",      value: "Research" },
  { label: "Strategy",      value: "Strategy" },
  { label: "Database",      value: "Database" },
];

const FORMAT_COLOR: Record<string, string> = {
  PPTX: "text-orange-400 border-orange-400/20 bg-orange-400/10",
  HTML: "text-blue-400 border-blue-400/20 bg-blue-400/10",
  DOCX: "text-sky-400 border-sky-400/20 bg-sky-400/10",
  XLSX: "text-emerald-400 border-emerald-400/20 bg-emerald-400/10",
  PDF:  "text-red-400 border-red-400/20 bg-red-400/10",
};

// ── Component ────────────────────────────────────────────────────────────────

export default function DocumentLibraryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<DocCategory | "All">("All");
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = DOCUMENTS.filter((d) => {
    const matchSearch = search === "" || d.name.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || d.category === category;
    return matchSearch && matchCat;
  });

  async function summariseDoc(doc: Document) {
    if (summaries[doc.id]) return; // already done
    setLoadingId(doc.id);
    const context = `Document: "${doc.name}" (${doc.format}, ${doc.version}, ${doc.date}). Description: ${doc.description}`;
    try {
      const res = await fetch("/api/admin/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "summarise_document", context }),
      });
      if (!res.body) throw new Error("No stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      setSummaries((prev) => ({ ...prev, [doc.id]: "" }));
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setSummaries((prev) => ({ ...prev, [doc.id]: (prev[doc.id] ?? "") + chunk }));
      }
    } catch {
      setSummaries((prev) => ({ ...prev, [doc.id]: "Error generating summary." }));
    } finally {
      setLoadingId(null);
    }
  }

  function handleUploadClick() {
    fileRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    // Simulate upload (real implementation would call Supabase Storage)
    setTimeout(() => {
      setUploading(false);
      alert(`"${file.name}" uploaded successfully. (Connect Supabase Storage to persist.)`);
      e.target.value = "";
    }, 1500);
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-1">Strategy Portal</p>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
            Document Library
          </h1>
          <p className="text-sm text-slate-400 mt-1">{DOCUMENTS.length} documents · All APRN strategic files in one place</p>
        </div>
        <button
          onClick={handleUploadClick}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-navy-900 text-xs font-bold uppercase tracking-wide transition-colors"
        >
          <i className={`fa-solid ${uploading ? "fa-spinner animate-spin" : "fa-upload"} text-xs`} />
          {uploading ? "Uploading…" : "Upload Document"}
        </button>
        <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.pptx,.xlsx,.html" />
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs pointer-events-none" />
          <input
            type="text"
            placeholder="Search documents…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-navy-800 border border-white/5 py-2.5 pl-9 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/40 transition-colors"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`px-3 py-2 text-xs font-semibold border transition-colors ${
                category === c.value
                  ? "bg-gold-500 text-navy-900 border-gold-500"
                  : "bg-transparent text-slate-400 border-white/10 hover:text-white"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      {filtered.length === 0 ? (
        <div className="bg-navy-800 border border-white/5 p-12 text-center">
          <i className="fa-solid fa-folder-open text-slate-600 text-3xl mb-3 block" />
          <p className="text-slate-400 text-sm">No documents match your search.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((doc) => (
            <div key={doc.id} className="bg-navy-800 border border-white/5 hover:border-gold-500/20 transition-all flex flex-col">
              {/* Card header */}
              <div className="p-5 flex items-start gap-4 border-b border-white/5">
                <div className="w-12 h-12 bg-navy-900 border border-white/5 flex items-center justify-center shrink-0">
                  <i className={`fa-solid ${doc.icon} text-gold-500 text-lg`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 border ${FORMAT_COLOR[doc.format] ?? FORMAT_COLOR.PDF}`}>
                      {doc.format}
                    </span>
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest">{doc.version}</span>
                    <span className="text-[9px] text-slate-600 ml-auto">{doc.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug">{doc.name}</h3>
                  <span className="text-[10px] text-gold-500/70 uppercase tracking-widest">{doc.category}</span>
                </div>
              </div>

              {/* Description */}
              <div className="px-5 py-3 flex-1">
                <p className="text-xs text-slate-400 leading-relaxed">{doc.description}</p>
              </div>

              {/* AI Summary (if generated) */}
              {summaries[doc.id] && (
                <div className="mx-5 mb-3 border border-gold-500/20 bg-navy-900 p-3">
                  <p className="text-[9px] font-bold text-gold-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <i className="fa-solid fa-wand-magic-sparkles" /> AI Summary
                  </p>
                  <p className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {summaries[doc.id]}
                    {loadingId === doc.id && <span className="inline-block w-0.5 h-3 bg-gold-500 animate-pulse ml-0.5" />}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="px-5 py-3 border-t border-white/5 flex items-center gap-2">
                <a
                  href={`/APRN-downloads/${doc.filename}`}
                  download={doc.filename}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gold-500 hover:bg-gold-400 text-navy-900 text-[10px] font-bold uppercase tracking-wide transition-colors"
                >
                  <i className="fa-solid fa-download text-[9px]" /> Download
                </a>
                <button
                  onClick={() => summariseDoc(doc)}
                  disabled={loadingId === doc.id || !!summaries[doc.id]}
                  className="flex items-center gap-1.5 px-3 py-2 border border-white/10 hover:border-gold-500/30 text-slate-400 hover:text-white text-[10px] font-bold uppercase tracking-wide transition-colors disabled:opacity-50"
                >
                  <i className={`fa-solid fa-wand-magic-sparkles text-[9px] ${loadingId === doc.id ? "animate-spin" : ""}`} />
                  {summaries[doc.id] ? "Summarised" : loadingId === doc.id ? "Working…" : "Summarise"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
