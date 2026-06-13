"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type DocCategory = "Presentations" | "Reports" | "Research" | "Strategy" | "Database";
type ViewMode = "grid" | "list";
type EditTab = "metadata" | "ai";

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
  canView: boolean;
  notes: string;
}

interface MetaRow {
  filename: string;
  display_name: string | null;
  description: string | null;
  doc_date: string | null;
  version: string | null;
  notes: string | null;
  category: string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const CATEGORIES: Array<{ label: string; value: DocCategory | "All" }> = [
  { label: "All",           value: "All" },
  { label: "Presentations", value: "Presentations" },
  { label: "Reports",       value: "Reports" },
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

function filenameToName(filename: string): string {
  return filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function currentMonth(): string {
  return new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function iconForExt(ext: string): string {
  const map: Record<string, string> = {
    PPTX: "fa-file-powerpoint",
    XLSX: "fa-file-excel",
    PDF:  "fa-file-pdf",
    HTML: "fa-chart-bar",
    DOCX: "fa-file-lines",
  };
  return map[ext] ?? "fa-file";
}

function guessCategory(ext: string): DocCategory {
  if (ext === "PPTX") return "Presentations";
  if (ext === "XLSX") return "Database";
  if (ext === "PDF")  return "Reports";
  return "Strategy";
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function DocumentLibraryPage() {
  const [docs, setDocs]           = useState<DocEntry[]>([]);
  const [storageUrls, setStorageUrls] = useState<Record<string, string>>({});
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [search, setSearch]       = useState("");
  const [category, setCategory]   = useState<DocCategory | "All">("All");
  const [viewMode, setViewMode]   = useState<ViewMode>("grid");
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Delete
  const [deletingDoc, setDeletingDoc]     = useState<DocEntry | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError]     = useState<string | null>(null);

  // Edit drawer
  const [editDoc,   setEditDoc]   = useState<DocEntry | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<DocEntry>>({});
  const [editTab,   setEditTab]   = useState<EditTab>("metadata");
  const [editSaving, setEditSaving] = useState(false);

  // AI Edit state
  const [aiInstruction, setAiInstruction] = useState("");
  const [aiEditing,     setAiEditing]     = useState(false);
  const [aiPreviewHtml, setAiPreviewHtml] = useState("");
  const [aiCharCount,   setAiCharCount]   = useState(0);
  const [aiSaving,      setAiSaving]      = useState(false);
  const [aiSaved,       setAiSaved]       = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  // ── Load docs from storage + metadata ──────────────────────────────────────

  const loadDocs = useCallback(async () => {
    setLoadingDocs(true);
    try {
      const [storageRes, metaRes] = await Promise.all([
        fetch("/api/admin/documents"),
        fetch("/api/admin/documents/meta"),
      ]);
      const { files } = await storageRes.json() as { files: Array<{ filename: string; signedUrl: string | null }> };
      const { meta } = await metaRes.json() as { meta: Record<string, MetaRow> };

      const urlMap: Record<string, string> = {};
      const docList: DocEntry[] = (files ?? []).map((f) => {
        if (f.signedUrl) urlMap[f.filename] = f.signedUrl;
        const m = meta?.[f.filename];
        const ext = (f.filename.split(".").pop() ?? "").toUpperCase() || "FILE";
        return {
          id: f.filename,
          name: m?.display_name ?? filenameToName(f.filename),
          version: m?.version ?? "v1",
          date: m?.doc_date ?? currentMonth(),
          category: (m?.category as DocCategory) ?? guessCategory(ext),
          format: ext,
          icon: iconForExt(ext),
          description: m?.description ?? "",
          filename: f.filename,
          canView: ext === "HTML",
          notes: m?.notes ?? "",
        };
      });

      setDocs(docList);
      setStorageUrls(urlMap);
    } catch {
      // non-fatal — show empty state
    } finally {
      setLoadingDocs(false);
    }
  }, []);

  useEffect(() => { loadDocs(); }, [loadDocs]);

  function getDocUrl(doc: DocEntry): string | null {
    return storageUrls[doc.filename] ?? null;
  }

  function getViewUrl(doc: DocEntry): string | null {
    if (!doc.canView || !storageUrls[doc.filename]) return null;
    if (doc.format === "HTML") {
      return `/api/admin/documents/view?filename=${encodeURIComponent(doc.filename)}`;
    }
    return storageUrls[doc.filename] ?? null;
  }

  const filtered = docs.filter((d) => {
    const matchSearch =
      search === "" ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase()) ||
      d.notes.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || d.category === category;
    return matchSearch && matchCat;
  });

  // ── Delete ──────────────────────────────────────────────────────────────────

  async function handleDeleteConfirm() {
    if (!deletingDoc) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      // Remove from Supabase Storage if it's there
      if (storageUrls[deletingDoc.filename]) {
        const res = await fetch(`/api/admin/documents?filename=${encodeURIComponent(deletingDoc.filename)}`, { method: "DELETE" });
        if (!res.ok) {
          const { error } = await res.json() as { error: string };
          throw new Error(error);
        }
      }
      // Remove metadata row (best-effort — ignore failure)
      await fetch(`/api/admin/documents/meta?filename=${encodeURIComponent(deletingDoc.filename)}`, { method: "DELETE" });
      // Always remove from state
      setDocs((prev) => prev.filter((d) => d.id !== deletingDoc.id));
      setStorageUrls((prev) => { const next = { ...prev }; delete next[deletingDoc.filename]; return next; });
      setDeletingDoc(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  }

  // ── Edit drawer ─────────────────────────────────────────────────────────────

  function openEdit(doc: DocEntry) {
    setEditDoc(doc);
    setEditDraft({ name: doc.name, version: doc.version, date: doc.date, category: doc.category, description: doc.description, notes: doc.notes });
    setEditTab("metadata");
    setAiInstruction("");
    setAiPreviewHtml("");
    setAiCharCount(0);
    setAiSaved(false);
    setEditSaving(false);
  }

  async function saveEdit() {
    if (!editDoc) return;
    setEditSaving(true);
    const updated = { ...editDoc, ...editDraft };
    try {
      await fetch("/api/admin/documents/meta", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: editDoc.filename,
          display_name: updated.name,
          version: updated.version,
          doc_date: updated.date,
          description: updated.description,
          notes: updated.notes,
          category: updated.category,
        }),
      });
      setDocs((prev) => prev.map((d) => d.id === editDoc.id ? { ...d, ...editDraft } : d));
      setEditDoc(null);
    } catch {
      // silent — local state still updated
      setDocs((prev) => prev.map((d) => d.id === editDoc.id ? { ...d, ...editDraft } : d));
      setEditDoc(null);
    } finally {
      setEditSaving(false);
    }
  }

  // ── AI Edit ─────────────────────────────────────────────────────────────────

  async function handleAiEdit() {
    if (!editDoc || !aiInstruction.trim()) return;
    setAiEditing(true);
    setAiPreviewHtml("");
    setAiCharCount(0);
    setAiSaved(false);
    let accumulated = "";
    try {
      const res = await fetch("/api/admin/documents/ai-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: editDoc.filename, instruction: aiInstruction }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? "Unknown error");
      }
      if (!res.body) throw new Error("No stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value);
        setAiCharCount(accumulated.length);
      }
      setAiPreviewHtml(accumulated);
    } catch (e) {
      setAiPreviewHtml(`<!-- Error: ${e instanceof Error ? e.message : "Unknown"} -->`);
    } finally {
      setAiEditing(false);
    }
  }

  async function handleSaveAiEdit() {
    if (!editDoc || !aiPreviewHtml) return;
    setAiSaving(true);
    try {
      const res = await fetch("/api/admin/documents/save", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: editDoc.filename, content: aiPreviewHtml }),
      });
      const { signedUrl } = await res.json() as { signedUrl: string | null };
      if (signedUrl) {
        setStorageUrls((prev) => ({ ...prev, [editDoc.filename]: signedUrl }));
      }
      setAiSaved(true);
      setAiPreviewHtml("");
      setAiInstruction("");
    } catch {
      // leave preview in place so user can retry
    } finally {
      setAiSaving(false);
    }
  }

  // ── AI Summarise ─────────────────────────────────────────────────────────────

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

  // ── Upload ──────────────────────────────────────────────────────────────────

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/documents", { method: "POST", body: formData });
      const { filename, signedUrl, error } = await res.json() as { filename: string; signedUrl: string; error?: string };
      if (error) throw new Error(error);
      const ext = (file.name.split(".").pop() ?? "").toUpperCase() || "FILE";
      const cleanName = filenameToName(file.name);
      const docDate = currentMonth();
      const docCategory = guessCategory(ext);

      // Persist initial metadata
      await fetch("/api/admin/documents/meta", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename,
          display_name: cleanName,
          version: "v1",
          doc_date: docDate,
          category: docCategory,
          description: "",
          notes: "",
        }),
      });

      const newDoc: DocEntry = {
        id: filename,
        name: cleanName,
        version: "v1",
        date: docDate,
        category: docCategory,
        format: ext,
        icon: iconForExt(ext),
        description: "",
        filename,
        canView: ext === "HTML",
        notes: "",
      };
      setDocs((prev) => [newDoc, ...prev]);
      if (signedUrl) setStorageUrls((prev) => ({ ...prev, [filename]: signedUrl }));
    } catch {
      // silent — user can retry
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  const cloudCount = Object.keys(storageUrls).length;

  return (
    <div className="flex flex-col gap-6 max-w-6xl">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-1">Strategy Portal</p>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
            Document Library
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {loadingDocs ? "Loading…" : `${docs.length} document${docs.length !== 1 ? "s" : ""}`}
            {cloudCount > 0 && (
              <span className="ml-2 text-[10px] text-emerald-400 font-semibold">
                <i className="fa-solid fa-cloud text-[9px] mr-1" />{cloudCount} in cloud storage
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
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
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-3 flex-wrap items-center">
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

      {/* Loading skeleton */}
      {loadingDocs && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-navy-800 border border-white/5 h-48 animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loadingDocs && filtered.length === 0 && (
        <div className="bg-navy-800 border border-white/5 p-12 text-center">
          <i className="fa-solid fa-folder-open text-slate-600 text-3xl mb-3 block" />
          <p className="text-slate-400 text-sm">
            {docs.length === 0
              ? "No documents yet. Upload your first document to get started."
              : "No documents match your search."}
          </p>
        </div>
      )}

      {/* ── Grid View ─────────────────────────────────────────────────────── */}
      {!loadingDocs && viewMode === "grid" && filtered.length > 0 && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((doc) => (
            <DocCard
              key={doc.id}
              doc={doc}
              docUrl={getDocUrl(doc)}
              viewUrl={getViewUrl(doc)}
              inCloud={!!storageUrls[doc.filename]}
              summary={summaries[doc.id]}
              isLoading={loadingId === doc.id}
              onSummarise={() => summariseDoc(doc)}
              onEdit={() => openEdit(doc)}
              onDelete={() => setDeletingDoc(doc)}
            />
          ))}
        </div>
      )}

      {/* ── List View ─────────────────────────────────────────────────────── */}
      {!loadingDocs && viewMode === "list" && filtered.length > 0 && (
        <div className="border border-white/5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-700">
                {["Document", "Category", "Format", "Version", "Date", "Storage", ""].map((h) => (
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
                  <td className="px-4 py-3">
                    {storageUrls[doc.filename]
                      ? <span className="text-[10px] text-emerald-400"><i className="fa-solid fa-cloud text-[9px] mr-1" />Cloud</span>
                      : <span className="text-[10px] text-slate-600">Not synced</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <ListRowMenu
                      docUrl={getDocUrl(doc)}
                      viewUrl={getViewUrl(doc)}
                      filename={doc.filename}
                      canView={doc.canView}
                      aiLoading={loadingId === doc.id}
                      onSummarise={() => summariseDoc(doc)}
                      onEdit={() => openEdit(doc)}
                      onDelete={() => setDeletingDoc(doc)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Delete Confirmation Modal ─────────────────────────────────────── */}
      {deletingDoc && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70">
          <div className="bg-navy-800 border border-white/10 p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-trash-can text-red-400 text-sm" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Confirm Delete</p>
                <h3 className="text-sm font-bold text-white leading-snug">{deletingDoc.name}</h3>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-2">
              {storageUrls[deletingDoc.filename]
                ? "This will permanently remove the file from cloud storage and cannot be undone."
                : "This will remove the document from the library."}
            </p>
            <p className="text-[11px] text-slate-600 font-mono truncate mb-5">{deletingDoc.filename}</p>
            {deleteError && (
              <p className="text-[11px] text-red-400 mb-3 flex items-center gap-1.5">
                <i className="fa-solid fa-circle-exclamation" /> {deleteError}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setDeletingDoc(null); setDeleteError(null); }}
                disabled={deleteLoading}
                className="flex-1 py-2.5 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-400 disabled:opacity-60 text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                {deleteLoading
                  ? <><i className="fa-solid fa-spinner animate-spin" />Deleting…</>
                  : <><i className="fa-solid fa-trash-can" />Delete</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit / AI Edit Drawer ─────────────────────────────────────────── */}
      {editDoc && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setEditDoc(null)}>
          <div
            className="w-full max-w-lg h-full bg-navy-800 border-l border-white/5 flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-navy-700 shrink-0">
              <div>
                <p className="text-[10px] font-bold text-gold-500 uppercase tracking-widest mb-0.5">Edit Document</p>
                <h3 className="text-base font-bold text-white leading-snug">{editDoc.name}</h3>
              </div>
              <button onClick={() => setEditDoc(null)} className="text-slate-400 hover:text-white p-2">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 shrink-0">
              <button
                onClick={() => setEditTab("metadata")}
                className={`px-5 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                  editTab === "metadata" ? "text-gold-500 border-b-2 border-gold-500" : "text-slate-500 hover:text-white"
                }`}
              >
                Metadata
              </button>
              {editDoc.canView && (
                <button
                  onClick={() => setEditTab("ai")}
                  className={`px-5 py-3 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 ${
                    editTab === "ai" ? "text-gold-500 border-b-2 border-gold-500" : "text-slate-500 hover:text-white"
                  }`}
                >
                  <i className="fa-solid fa-wand-magic-sparkles text-[9px]" />
                  AI Edit
                </button>
              )}
            </div>

            {/* ── Metadata tab ──────────────────────────────────────────── */}
            {editTab === "metadata" && (
              <div className="p-6 flex flex-col gap-5 flex-1 overflow-y-auto">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Document Name</label>
                  <input
                    value={editDraft.name ?? ""}
                    onChange={(e) => setEditDraft((p) => ({ ...p, name: e.target.value }))}
                    className="w-full bg-navy-900 border border-white/10 focus:border-gold-500/40 text-white text-sm px-3 py-2.5 outline-none transition-colors"
                  />
                </div>
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
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Category</label>
                  <select
                    value={editDraft.category ?? "Strategy"}
                    onChange={(e) => setEditDraft((p) => ({ ...p, category: e.target.value as DocCategory }))}
                    className="w-full bg-navy-900 border border-white/10 focus:border-gold-500/40 text-white text-sm px-3 py-2.5 outline-none transition-colors"
                  >
                    {CATEGORIES.filter((c) => c.value !== "All").map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Description</label>
                  <textarea
                    rows={3}
                    value={editDraft.description ?? ""}
                    onChange={(e) => setEditDraft((p) => ({ ...p, description: e.target.value }))}
                    className="w-full bg-navy-900 border border-white/10 focus:border-gold-500/40 text-white text-sm px-3 py-2.5 outline-none transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                    Notes / Context
                    <span className="ml-2 text-slate-600 font-normal normal-case text-[10px]">Internal annotations, status, instructions</span>
                  </label>
                  <textarea
                    rows={4}
                    value={editDraft.notes ?? ""}
                    onChange={(e) => setEditDraft((p) => ({ ...p, notes: e.target.value }))}
                    className="w-full bg-navy-900 border border-white/10 focus:border-gold-500/40 text-white text-sm px-3 py-2.5 outline-none transition-colors resize-none"
                    placeholder="Add notes, context, revision history, or usage instructions…"
                  />
                </div>
                <div className="bg-navy-900 border border-white/5 p-4">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">File Info</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <span>Format: <span className="text-white">{editDoc.format}</span></span>
                    <span>Storage: <span className={storageUrls[editDoc.filename] ? "text-emerald-400" : "text-slate-500"}>{storageUrls[editDoc.filename] ? "Cloud" : "Not synced"}</span></span>
                    <span className="col-span-2 truncate">File: <span className="text-white">{editDoc.filename}</span></span>
                  </div>
                </div>
                <div className="flex gap-3 mt-auto pt-2">
                  <button
                    onClick={saveEdit}
                    disabled={editSaving}
                    className="flex-1 py-3 bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-navy-900 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                  >
                    <i className={`fa-solid ${editSaving ? "fa-spinner animate-spin" : "fa-check"} text-[10px]`} />
                    {editSaving ? "Saving…" : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setEditDoc(null)}
                    className="px-4 py-3 border border-white/10 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* ── AI Edit tab ───────────────────────────────────────────── */}
            {editTab === "ai" && editDoc.canView && (
              <div className="p-6 flex flex-col gap-5 flex-1 overflow-y-auto">
                <div className="bg-navy-900 border border-gold-500/20 p-3">
                  <p className="text-[9px] font-bold text-gold-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <i className="fa-solid fa-wand-magic-sparkles" /> AI Document Editor
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Describe the change you want. Claude will apply it and return the corrected document for your review before saving.
                  </p>
                </div>

                {aiSaved && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 flex items-center gap-2 text-xs text-emerald-400">
                    <i className="fa-solid fa-circle-check" /> Saved to Supabase Storage successfully.
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Edit Instruction</label>
                  <textarea
                    rows={4}
                    value={aiInstruction}
                    onChange={(e) => setAiInstruction(e.target.value)}
                    disabled={aiEditing}
                    placeholder={`Describe the change, for example:\n"Update all 2025 dates to June 2026"\n"Fix grammar and spelling throughout"\n"Add a new section on the Nigeria–Morocco pipeline"`}
                    className="w-full bg-navy-900 border border-white/10 focus:border-gold-500/40 text-white text-sm px-3 py-2.5 outline-none transition-colors resize-none disabled:opacity-60 placeholder-slate-600"
                  />
                </div>

                <button
                  onClick={handleAiEdit}
                  disabled={aiEditing || !aiInstruction.trim()}
                  className="w-full py-3 bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-navy-900 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                  <i className={`fa-solid fa-wand-magic-sparkles text-[9px] ${aiEditing ? "animate-spin" : ""}`} />
                  {aiEditing ? `Generating… ${aiCharCount.toLocaleString()} chars` : "Apply with AI"}
                </button>

                {aiPreviewHtml && !aiEditing && (
                  <div className="flex flex-col gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preview</p>
                        <span className="text-[10px] text-slate-600">{aiPreviewHtml.length.toLocaleString()} chars</span>
                      </div>
                      <iframe
                        srcDoc={aiPreviewHtml}
                        sandbox="allow-same-origin"
                        className="w-full h-64 border border-white/10 bg-white"
                        title="AI-corrected document preview"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveAiEdit}
                        disabled={aiSaving}
                        className="flex-1 py-3 bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-navy-900 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                      >
                        <i className={`fa-solid ${aiSaving ? "fa-spinner animate-spin" : "fa-cloud-arrow-up"} text-[9px]`} />
                        {aiSaving ? "Saving…" : "Save to Library"}
                      </button>
                      <button
                        onClick={() => { setAiPreviewHtml(""); setAiInstruction(""); setAiSaved(false); }}
                        className="px-4 py-3 border border-white/10 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                      >
                        Discard
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── DocCard ───────────────────────────────────────────────────────────────────

function DocCard({
  doc, docUrl, viewUrl, inCloud, summary, isLoading, onSummarise, onEdit, onDelete,
}: {
  doc: DocEntry;
  docUrl: string | null;
  viewUrl: string | null;
  inCloud: boolean;
  summary?: string;
  isLoading: boolean;
  onSummarise: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  return (
    <div className="bg-navy-800 border border-white/5 hover:border-gold-500/20 transition-all flex flex-col">
      {/* Card header */}
      <div className="p-5 flex items-start gap-4 border-b border-white/5">
        <div className="w-12 h-12 bg-navy-900 border border-white/5 flex items-center justify-center shrink-0">
          <i className={`fa-solid ${doc.icon} text-gold-500 text-lg`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 border ${FORMAT_COLOR[doc.format] ?? ""}`}>
              {doc.format}
            </span>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest">{doc.version}</span>
            {inCloud
              ? <span className="text-[9px] text-emerald-400"><i className="fa-solid fa-cloud text-[8px] mr-0.5" />Cloud</span>
              : <span className="text-[9px] text-amber-500/70"><i className="fa-solid fa-cloud-slash text-[8px] mr-0.5" />Not synced</span>
            }
            <span className="text-[9px] text-slate-600 ml-auto">{doc.date}</span>
          </div>
          <h3 className="text-sm font-bold text-white leading-snug">{doc.name}</h3>
          <span className="text-[10px] text-gold-500/60 uppercase tracking-widest">{doc.category}</span>
        </div>

        {/* Kebab menu */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-white hover:bg-navy-700 transition-colors rounded-sm"
            title="Options"
          >
            <i className="fa-solid fa-ellipsis-vertical text-xs" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 z-20 w-44 bg-navy-700 border border-white/10 shadow-xl py-1">
              {viewUrl && (
                <a
                  href={viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-navy-600 hover:text-white transition-colors"
                >
                  <i className="fa-solid fa-eye w-3.5 text-center text-blue-400" /> View
                </a>
              )}
              <button
                onClick={() => { onSummarise(); setMenuOpen(false); }}
                disabled={isLoading}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-navy-600 hover:text-white transition-colors disabled:opacity-50"
              >
                <i className={`fa-solid fa-wand-magic-sparkles w-3.5 text-center text-gold-500/70 ${isLoading ? "animate-spin" : ""}`} />
                {isLoading ? "Summarising…" : summary ? "Re-summarise" : "Summarise"}
              </button>
              <button
                onClick={() => { onEdit(); setMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-navy-600 hover:text-white transition-colors"
              >
                <i className="fa-solid fa-pen w-3.5 text-center text-slate-400" /> Edit
              </button>
              <div className="border-t border-white/5 my-1" />
              <button
                onClick={() => { onDelete(); setMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
              >
                <i className="fa-solid fa-trash-can w-3.5 text-center" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-3 flex-1">
        <p className="text-xs text-slate-400 leading-relaxed">{doc.description || <span className="italic text-slate-600">No description — click Edit to add one.</span>}</p>
        {doc.notes && (
          <div className="mt-3 pt-3 border-t border-white/5">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Notes</p>
            <p className="text-xs text-slate-300 leading-relaxed">{doc.notes}</p>
          </div>
        )}
      </div>

      {/* AI summary */}
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

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/5">
        {!docUrl ? (
          <p className="text-center text-[10px] text-slate-600 italic">Upload to enable downloads</p>
        ) : (
          <a
            href={docUrl}
            download={doc.filename}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-gold-500 hover:bg-gold-400 text-navy-900 text-[10px] font-bold uppercase tracking-wide transition-colors"
          >
            <i className="fa-solid fa-download text-[9px]" /> Download
          </a>
        )}
      </div>
    </div>
  );
}

// ── ListRowMenu ───────────────────────────────────────────────────────────────

function ListRowMenu({
  docUrl, viewUrl, filename, canView, aiLoading, onSummarise, onEdit, onDelete,
}: {
  docUrl: string | null;
  viewUrl: string | null;
  filename: string;
  canView: boolean;
  aiLoading: boolean;
  onSummarise: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  return (
    <div className="relative flex items-center gap-2" ref={ref}>
      {docUrl ? (
        <a
          href={docUrl}
          download={filename}
          className="text-[10px] font-bold text-gold-500 hover:text-gold-400 flex items-center gap-1 whitespace-nowrap"
        >
          <i className="fa-solid fa-download text-[9px]" /> Download
        </a>
      ) : (
        <span className="text-[10px] text-slate-600 italic">Not synced</span>
      )}
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-white hover:bg-navy-600 rounded-sm transition-colors"
        >
          <i className="fa-solid fa-ellipsis-vertical text-[10px]" />
        </button>
        {open && (
          <div className="absolute right-0 top-7 z-20 w-40 bg-navy-700 border border-white/10 shadow-xl py-1">
            {viewUrl && canView && (
              <a href={viewUrl} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-navy-600 hover:text-white transition-colors">
                <i className="fa-solid fa-eye w-3 text-center text-blue-400" /> View
              </a>
            )}
            <button onClick={() => { onSummarise(); setOpen(false); }} disabled={aiLoading}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-navy-600 hover:text-white transition-colors disabled:opacity-50">
              <i className={`fa-solid fa-wand-magic-sparkles w-3 text-center text-gold-500/70 ${aiLoading ? "animate-spin" : ""}`} />
              {aiLoading ? "Working…" : "Summarise"}
            </button>
            <button onClick={() => { onEdit(); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-navy-600 hover:text-white transition-colors">
              <i className="fa-solid fa-pen w-3 text-center text-slate-400" /> Edit
            </button>
            <div className="border-t border-white/5 my-1" />
            <button onClick={() => { onDelete(); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
              <i className="fa-solid fa-trash-can w-3 text-center" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
