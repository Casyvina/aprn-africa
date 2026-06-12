"use client";

import { useState, useRef } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type DocCategory = "Presentations" | "Reports" | "Letters" | "Research" | "Strategy" | "Database";
type ViewMode = "grid" | "list";

interface DocEntry {
  id: string;
  name: string;
  version: string;
  date: string;
  category: DocCategory;
  format: string;
  icon: string;
  description: string;
  filename: string;
  canView: boolean; // HTML files can be viewed in browser
  notes: string;    // editable per-doc notes
}

// ── Static document registry ──────────────────────────────────────────────────

const INITIAL_DOCS: DocEntry[] = [
  {
    id: "pres-v11",
    name: "APRN Presentation",
    version: "v11", date: "June 2026", category: "Presentations",
    format: "PPTX", icon: "fa-file-powerpoint",
    description: "Main APRN corporate presentation covering mission, team, programs, and partnerships.",
    filename: "APRN_Presentation_v11.pptx",
    canView: false, notes: "",
  },
  {
    id: "ci-v8",
    name: "Competitive Intelligence Report",
    version: "v8", date: "June 2026", category: "Reports",
    format: "HTML", icon: "fa-chart-bar",
    description: "Deep analysis of APRN's competitive landscape across African pipeline training and research organisations.",
    filename: "APRN_Competitive_Intelligence_Report_v8.html",
    canView: true, notes: "",
  },
  {
    id: "brand-v2",
    name: "Brand Guidelines",
    version: "v2", date: "May 2026", category: "Strategy",
    format: "HTML", icon: "fa-palette",
    description: "Official APRN brand guidelines including colour palette, typography, logo usage, and tone of voice.",
    filename: "APRN_Brand_Guidelines_v2.html",
    canView: true, notes: "",
  },
  {
    id: "membership",
    name: "Membership Structure",
    version: "v1", date: "May 2026", category: "Strategy",
    format: "DOCX", icon: "fa-id-card",
    description: "APRN membership tiers, pricing, benefits structure, and eligibility criteria.",
    filename: "APRN_Membership_Structure.docx",
    canView: false, notes: "",
  },
  {
    id: "employ-joseph",
    name: "Employment Letter — Joseph Agwuh",
    version: "v2", date: "May 2026", category: "Letters",
    format: "DOCX", icon: "fa-file-word",
    description: "Official APRN employment letter for Joseph Agwuh, Director of Applied Engineering.",
    filename: "APRN_Employment_Letter_Joseph_Agwuh_v2.docx",
    canView: false, notes: "",
  },
  {
    id: "ambassador-allison",
    name: "Ambassador Letter — Allison Gabriel",
    version: "v2", date: "May 2026", category: "Letters",
    format: "DOCX", icon: "fa-file-word",
    description: "Official APRN Youth Ambassador appointment letter for Allison Gabriel.",
    filename: "APRN_Ambassador_Letter_Allison_Gabriel_v2.docx",
    canView: false, notes: "",
  },
  {
    id: "research-brief",
    name: "Research Briefing — 11 Questions",
    version: "v1", date: "May 2026", category: "Research",
    format: "DOCX", icon: "fa-file-lines",
    description: "Internal research briefing document covering 11 key strategic questions for APRN's research agenda.",
    filename: "APRN_Research_Briefing_11_Questions.docx",
    canView: false, notes: "",
  },
  {
    id: "pipeline-db",
    name: "Pipeline Industry Database",
    version: "v1", date: "June 2026", category: "Database",
    format: "XLSX", icon: "fa-file-excel",
    description: "Master database of African pipeline operators, contacts, project status, and market intelligence.",
    filename: "APRN_Pipeline_Database_Master.xlsx",
    canView: false, notes: "",
  },
  {
    id: "progress-june",
    name: "APRN Progress Report — June 2026",
    version: "v1", date: "June 2026", category: "Reports",
    format: "HTML", icon: "fa-chart-line",
    description: "Internal progress report covering all APRN activities, milestones, and KPIs for June 2026.",
    filename: "APRN_Progress_Report_June2026.html",
    canView: true, notes: "",
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

// ── Component ─────────────────────────────────────────────────────────────────

export default function DocumentLibraryPage() {
  const [docs, setDocs] = useState<DocEntry[]>(INITIAL_DOCS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<DocCategory | "All">("All");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Edit drawer
  const [editDoc, setEditDoc] = useState<DocEntry | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<DocEntry>>({});

  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = docs.filter((d) => {
    const matchSearch = search === "" ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase()) ||
      d.notes.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || d.category === category;
    return matchSearch && matchCat;
  });

  // ── AI Summarise ────────────────────────────────────────────────────────────

  async function summariseDoc(doc: DocEntry) {
    setLoadingId(doc.id);
    setSummaries((prev) => ({ ...prev, [doc.id]: "" }));
    const context = `Document: "${doc.name}" (${doc.format}, ${doc.version}, ${doc.date}). Description: ${doc.description}${doc.notes ? `. Additional context: ${doc.notes}` : ""}`;
    try {
      const res = await fetch("/api/admin/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "summarise_document", context }),
      });
      if (!res.body) throw new Error("No stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setSummaries((prev) => ({ ...prev, [doc.id]: (prev[doc.id] ?? "") + decoder.decode(value) }));
      }
    } catch {
      setSummaries((prev) => ({ ...prev, [doc.id]: "Error generating summary. Please try again." }));
    } finally {
      setLoadingId(null);
    }
  }

  // ── Edit modal ─────────────────────────────────────────────────────────────

  function openEdit(doc: DocEntry) {
    setEditDoc(doc);
    setEditDraft({ name: doc.name, version: doc.version, date: doc.date, description: doc.description, notes: doc.notes });
  }

  function saveEdit() {
    if (!editDoc) return;
    setDocs((prev) => prev.map((d) => d.id === editDoc.id ? { ...d, ...editDraft } : d));
    setEditDoc(null);
  }

  // ── Upload ──────────────────────────────────────────────────────────────────

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setTimeout(() => {
      const ext = file.name.split(".").pop()?.toUpperCase() ?? "FILE";
      const newDoc: DocEntry = {
        id: `upload-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
        version: "v1",
        date: new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
        category: "Strategy",
        format: ext,
        icon: ext === "PPTX" ? "fa-file-powerpoint" : ext === "XLSX" ? "fa-file-excel" : ext === "PDF" ? "fa-file-pdf" : "fa-file-lines",
        description: "Newly uploaded document.",
        filename: file.name,
        canView: ext === "HTML",
        notes: "",
      };
      setDocs((prev) => [newDoc, ...prev]);
      setUploading(false);
      e.target.value = "";
    }, 1200);
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6 max-w-6xl">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-1">Strategy Portal</p>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
            Document Library
          </h1>
          <p className="text-sm text-slate-400 mt-1">{docs.length} documents · All APRN strategic files in one place</p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-navy-900 text-xs font-bold uppercase tracking-wide transition-colors"
        >
          <i className={`fa-solid ${uploading ? "fa-spinner animate-spin" : "fa-upload"} text-xs`} />
          {uploading ? "Uploading…" : "Upload Document"}
        </button>
        <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.pptx,.xlsx,.html" />
      </div>

      {/* Toolbar: Search + Filter + View toggle */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-3 flex-wrap items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-52">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs pointer-events-none" />
            <input
              type="text"
              placeholder="Search name, description, notes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-navy-800 border border-white/5 py-2.5 pl-9 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/40 transition-colors"
            />
          </div>
          {/* View toggle */}
          <div className="flex border border-white/10 overflow-hidden shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 text-xs transition-colors ${viewMode === "grid" ? "bg-gold-500 text-navy-900" : "bg-transparent text-slate-400 hover:text-white"}`}
              title="Grid view"
            >
              <i className="fa-solid fa-grip" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 text-xs transition-colors border-l border-white/10 ${viewMode === "list" ? "bg-gold-500 text-navy-900" : "bg-transparent text-slate-400 hover:text-white"}`}
              title="List view"
            >
              <i className="fa-solid fa-list" />
            </button>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-1 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`px-3 py-1.5 text-xs font-semibold border transition-colors ${
                category === c.value
                  ? "bg-gold-500 text-navy-900 border-gold-500"
                  : "bg-transparent text-slate-400 border-white/10 hover:text-white"
              }`}
            >
              {c.label}
              {c.value !== "All" && (
                <span className="ml-1.5 text-[9px] opacity-60">
                  {docs.filter((d) => d.category === c.value).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="bg-navy-800 border border-white/5 p-12 text-center">
          <i className="fa-solid fa-folder-open text-slate-600 text-3xl mb-3 block" />
          <p className="text-slate-400 text-sm">No documents match your search.</p>
        </div>
      )}

      {/* ── Grid View ─────────────────────────────────────────────────────── */}
      {viewMode === "grid" && filtered.length > 0 && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((doc) => (
            <DocCard
              key={doc.id}
              doc={doc}
              summary={summaries[doc.id]}
              isLoading={loadingId === doc.id}
              onSummarise={() => summariseDoc(doc)}
              onEdit={() => openEdit(doc)}
            />
          ))}
        </div>
      )}

      {/* ── List View ─────────────────────────────────────────────────────── */}
      {viewMode === "list" && filtered.length > 0 && (
        <div className="border border-white/5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-700">
                {["Document", "Category", "Format", "Version", "Date", "Notes", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-gold-500 uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc, i) => (
                <tr key={doc.id} className={`border-t border-white/5 ${i % 2 === 0 ? "bg-navy-800" : "bg-navy-800/60"} hover:bg-navy-700 transition-colors group`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <i className={`fa-solid ${doc.icon} text-gold-500 text-sm w-5 text-center shrink-0`} />
                      <div>
                        <p className="font-semibold text-white text-xs leading-snug">{doc.name}</p>
                        {doc.notes && <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-xs">{doc.notes}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{doc.category}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 border ${FORMAT_COLOR[doc.format] ?? FORMAT_COLOR.PDF}`}>
                      {doc.format}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{doc.version}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{doc.date}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 max-w-xs truncate">{doc.notes || <span className="text-slate-600 italic">No notes</span>}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {doc.canView && (
                        <a
                          href={`/documents/${doc.filename}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 whitespace-nowrap"
                        >
                          <i className="fa-solid fa-eye text-[9px]" /> View
                        </a>
                      )}
                      <a
                        href={`/documents/${doc.filename}`}
                        download={doc.filename}
                        className="text-[10px] font-bold text-gold-500 hover:text-gold-400 flex items-center gap-1 whitespace-nowrap"
                      >
                        <i className="fa-solid fa-download text-[9px]" /> Download
                      </a>
                      <button
                        onClick={() => summariseDoc(doc)}
                        disabled={loadingId === doc.id}
                        className="text-[10px] font-bold text-slate-400 hover:text-white flex items-center gap-1 whitespace-nowrap disabled:opacity-50"
                      >
                        <i className={`fa-solid fa-wand-magic-sparkles text-[9px] ${loadingId === doc.id ? "animate-spin" : ""}`} />
                        AI
                      </button>
                      <button
                        onClick={() => openEdit(doc)}
                        className="text-[10px] font-bold text-slate-400 hover:text-white flex items-center gap-1 whitespace-nowrap"
                      >
                        <i className="fa-solid fa-pen text-[9px]" /> Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Edit Drawer ───────────────────────────────────────────────────── */}
      {editDoc && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setEditDoc(null)}>
          <div
            className="w-full max-w-lg h-full bg-navy-800 border-l border-white/5 flex flex-col shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-navy-700 shrink-0">
              <div>
                <p className="text-[10px] font-bold text-gold-500 uppercase tracking-widest mb-0.5">Edit Document</p>
                <h3 className="text-base font-bold text-white">{editDoc.name}</h3>
              </div>
              <button onClick={() => setEditDoc(null)} className="text-slate-400 hover:text-white p-2">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5 flex-1">
              {/* Name */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Document Name</label>
                <input
                  value={editDraft.name ?? ""}
                  onChange={(e) => setEditDraft((p) => ({ ...p, name: e.target.value }))}
                  className="w-full bg-navy-900 border border-white/10 focus:border-gold-500/40 text-white text-sm px-3 py-2.5 outline-none transition-colors"
                />
              </div>

              {/* Version + Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Version</label>
                  <input
                    value={editDraft.version ?? ""}
                    onChange={(e) => setEditDraft((p) => ({ ...p, version: e.target.value }))}
                    className="w-full bg-navy-900 border border-white/10 focus:border-gold-500/40 text-white text-sm px-3 py-2.5 outline-none transition-colors"
                    placeholder="e.g. v2"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Date</label>
                  <input
                    value={editDraft.date ?? ""}
                    onChange={(e) => setEditDraft((p) => ({ ...p, date: e.target.value }))}
                    className="w-full bg-navy-900 border border-white/10 focus:border-gold-500/40 text-white text-sm px-3 py-2.5 outline-none transition-colors"
                    placeholder="e.g. June 2026"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={editDraft.description ?? ""}
                  onChange={(e) => setEditDraft((p) => ({ ...p, description: e.target.value }))}
                  className="w-full bg-navy-900 border border-white/10 focus:border-gold-500/40 text-white text-sm px-3 py-2.5 outline-none transition-colors resize-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                  Notes / Context
                  <span className="ml-2 text-slate-600 font-normal normal-case text-[10px]">Internal annotations, status updates, usage instructions</span>
                </label>
                <textarea
                  rows={5}
                  value={editDraft.notes ?? ""}
                  onChange={(e) => setEditDraft((p) => ({ ...p, notes: e.target.value }))}
                  className="w-full bg-navy-900 border border-white/10 focus:border-gold-500/40 text-white text-sm px-3 py-2.5 outline-none transition-colors resize-none"
                  placeholder="Add notes, context, revision history, or instructions for this document…"
                />
              </div>

              {/* Read-only info */}
              <div className="bg-navy-900 border border-white/5 p-4 rounded-sm">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">File Info</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                  <span>Format: <span className="text-white">{editDoc.format}</span></span>
                  <span>Category: <span className="text-white">{editDoc.category}</span></span>
                  <span className="col-span-2 truncate">File: <span className="text-white">{editDoc.filename}</span></span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-auto pt-2">
                <button
                  onClick={saveEdit}
                  className="flex-1 py-3 bg-gold-500 hover:bg-gold-400 text-navy-900 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-check text-[10px]" /> Save Changes
                </button>
                <button
                  onClick={() => setEditDoc(null)}
                  className="px-4 py-3 border border-white/10 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── DocCard ───────────────────────────────────────────────────────────────────

function DocCard({
  doc, summary, isLoading, onSummarise, onEdit,
}: {
  doc: DocEntry;
  summary?: string;
  isLoading: boolean;
  onSummarise: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="bg-navy-800 border border-white/5 hover:border-gold-500/20 transition-all flex flex-col group">

      {/* Card header */}
      <div className="p-5 flex items-start gap-4 border-b border-white/5">
        <div className="w-12 h-12 bg-navy-900 border border-white/5 flex items-center justify-center shrink-0 group-hover:border-gold-500/20 transition-colors">
          <i className={`fa-solid ${doc.icon} text-gold-500 text-lg`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 border ${FORMAT_COLOR[doc.format] ?? ""}`}>
              {doc.format}
            </span>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest">{doc.version}</span>
            <span className="text-[9px] text-slate-600 ml-auto">{doc.date}</span>
          </div>
          <h3 className="text-sm font-bold text-white leading-snug">{doc.name}</h3>
          <span className="text-[10px] text-gold-500/60 uppercase tracking-widest">{doc.category}</span>
        </div>
      </div>

      {/* Description */}
      <div className="px-5 py-3 flex-1">
        <p className="text-xs text-slate-400 leading-relaxed">{doc.description}</p>
        {doc.notes && (
          <div className="mt-3 pt-3 border-t border-white/5">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Notes</p>
            <p className="text-xs text-slate-300 leading-relaxed">{doc.notes}</p>
          </div>
        )}
      </div>

      {/* AI Summary */}
      {(summary || isLoading) && (
        <div className="mx-5 mb-3 border border-gold-500/20 bg-navy-900 p-3">
          <p className="text-[9px] font-bold text-gold-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <i className="fa-solid fa-wand-magic-sparkles" /> AI Summary
          </p>
          {isLoading && !summary ? (
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-pulse" /> Generating…
            </div>
          ) : (
            <p className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap">
              {summary}
              {isLoading && <span className="inline-block w-0.5 h-3 bg-gold-500 animate-pulse ml-0.5" />}
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="px-5 py-3 border-t border-white/5 flex items-center gap-1.5 flex-wrap">
        {doc.canView && (
          <a
            href={`/documents/${doc.filename}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 bg-navy-700 hover:bg-navy-600 border border-white/10 hover:border-blue-400/30 text-blue-400 text-[10px] font-bold uppercase tracking-wide transition-colors"
          >
            <i className="fa-solid fa-eye text-[9px]" /> View
          </a>
        )}
        <a
          href={`/documents/${doc.filename}`}
          download={doc.filename}
          className="flex items-center gap-1.5 px-3 py-2 bg-gold-500 hover:bg-gold-400 text-navy-900 text-[10px] font-bold uppercase tracking-wide transition-colors"
        >
          <i className="fa-solid fa-download text-[9px]" /> Download
        </a>
        <button
          onClick={onSummarise}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-2 border border-white/10 hover:border-gold-500/30 text-slate-400 hover:text-white text-[10px] font-bold uppercase tracking-wide transition-colors disabled:opacity-50"
        >
          <i className={`fa-solid fa-wand-magic-sparkles text-[9px] ${isLoading ? "animate-spin" : ""}`} />
          {summary ? "Re-summarise" : isLoading ? "Working…" : "Summarise"}
        </button>
        <button
          onClick={onEdit}
          className="ml-auto flex items-center gap-1.5 px-3 py-2 border border-white/10 hover:border-white/30 text-slate-400 hover:text-white text-[10px] font-bold uppercase tracking-wide transition-colors"
        >
          <i className="fa-solid fa-pen text-[9px]" /> Edit
        </button>
      </div>
    </div>
  );
}
