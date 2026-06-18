"use client";

import { useState, useEffect, useRef } from "react";

interface PersonnelDoc {
  id: string;
  filename: string;
  storagePath: string;
  signedUrl: string | null;
  size: number;
  display_name: string;
  description: string;
  version: string;
  doc_date: string;
  person: string;
}

function formatSize(bytes: number) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function fileIcon(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf")  return <i className="fa-solid fa-file-pdf text-red-400 text-2xl" />;
  if (ext === "docx" || ext === "doc") return <i className="fa-solid fa-file-word text-sky-400 text-2xl" />;
  if (ext === "pptx") return <i className="fa-solid fa-file-powerpoint text-orange-400 text-2xl" />;
  if (ext === "xlsx") return <i className="fa-solid fa-file-excel text-emerald-400 text-2xl" />;
  return <i className="fa-solid fa-file text-slate-400 text-2xl" />;
}

export default function PersonnelPage() {
  const [docs, setDocs]         = useState<PersonnelDoc[]>([]);
  const [loading, setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [editDoc, setEditDoc]   = useState<PersonnelDoc | null>(null);
  const [editForm, setEditForm] = useState<Partial<PersonnelDoc>>({});
  const [saving, setSaving]     = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<PersonnelDoc | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  async function loadDocs() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/personnel/documents");
      const data = await res.json() as { docs?: PersonnelDoc[]; error?: string };
      if (data.docs) setDocs(data.docs);
    } catch { /* non-fatal */ }
    setLoading(false);
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadDocs(); }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/personnel/documents", { method: "POST", body: formData });
      const data = await res.json() as { error?: string };
      if (data.error) throw new Error(data.error);
      await loadDocs();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await fetch(`/api/admin/personnel/documents?filename=${encodeURIComponent(deleteTarget.filename)}`, { method: "DELETE" });
      setDocs((prev) => prev.filter((d) => d.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch { /* silent */ }
    setDeleteLoading(false);
  }

  function openEdit(doc: PersonnelDoc) {
    setEditDoc(doc);
    setEditForm({
      display_name: doc.display_name,
      description:  doc.description,
      version:      doc.version,
      doc_date:     doc.doc_date,
      person:       doc.person,
    });
  }

  async function handleSaveMeta() {
    if (!editDoc) return;
    setSaving(true);
    try {
      await fetch("/api/admin/documents/meta", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename:     editDoc.storagePath,
          display_name: editForm.display_name ?? editDoc.display_name,
          description:  editForm.description  ?? editDoc.description,
          doc_date:     editForm.doc_date     ?? editDoc.doc_date,
          version:      editForm.version      ?? editDoc.version,
          notes:        editForm.person       ?? editDoc.person,
          category:     "Personnel",
        }),
      });
      setDocs((prev) =>
        prev.map((d) => d.id === editDoc.id ? { ...d, ...editForm } : d)
      );
      setEditDoc(null);
    } catch { /* silent */ }
    setSaving(false);
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-1">Admin · Confidential</p>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
            Personnel Documents
          </h1>
          <p className="text-sm text-slate-400 mt-1">Restricted to Lucy Okeke and Joseph Agwuh only.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <label
            htmlFor="upload-personnel"
            className={`flex items-center gap-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-900 text-[10px] font-bold tracking-widest uppercase cursor-pointer transition-colors ${uploading ? "opacity-60 pointer-events-none" : ""}`}
          >
            <i className={`fa-solid ${uploading ? "fa-spinner animate-spin" : "fa-cloud-arrow-up"} text-xs`} />
            {uploading ? "Uploading…" : "Upload Document"}
          </label>
          <input
            id="upload-personnel"
            type="file"
            ref={fileRef}
            accept=".pdf,.docx,.doc,.pptx,.xlsx,.txt"
            className="hidden"
            onChange={handleUpload}
          />
        </div>
      </div>

      {/* Access notice */}
      <div className="bg-amber-500/5 border border-amber-500/20 px-4 py-3 flex items-start gap-3">
        <i className="fa-solid fa-lock text-amber-400 text-xs mt-0.5 shrink-0" />
        <p className="text-xs text-amber-300/80 leading-relaxed">
          These documents are confidential and are not visible in the general Document Library.
          Files are stored in private cloud storage — download links expire after 1 hour and require login to generate.
          Do not share direct URLs.
        </p>
      </div>

      {uploadError && (
        <div className="bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs text-red-400 flex items-center gap-2">
          <i className="fa-solid fa-circle-exclamation" /> {uploadError}
        </div>
      )}

      {/* Documents */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-navy-800 border border-white/5 h-24 animate-pulse" />
          ))}
        </div>
      ) : docs.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/10">
          <i className="fa-solid fa-folder-open text-4xl text-slate-700 mb-4 block" />
          <p className="text-slate-400 text-sm font-semibold mb-1">No documents yet</p>
          <p className="text-slate-500 text-xs">Upload a PDF, Word, or PowerPoint file to get started.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="bg-navy-800 border border-white/5 p-5 flex items-start gap-5 hover:border-gold-500/20 transition-colors"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-navy-900 border border-white/5 flex items-center justify-center shrink-0">
                {fileIcon(doc.filename)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white leading-snug">{doc.display_name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {doc.filename}
                  {doc.version  && ` · ${doc.version}`}
                  {doc.doc_date && ` · ${doc.doc_date}`}
                  {doc.size > 0 && ` · ${formatSize(doc.size)}`}
                </p>
                {doc.person && (
                  <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5">
                    <i className="fa-solid fa-user text-[10px] text-gold-500/60" />
                    {doc.person}
                  </p>
                )}
                {doc.description && (
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{doc.description}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEdit(doc)}
                  className="w-8 h-8 flex items-center justify-center border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors"
                  title="Edit metadata"
                >
                  <i className="fa-solid fa-pen text-[10px]" />
                </button>
                <a
                  href={`/api/admin/documents/download?filename=${encodeURIComponent(doc.storagePath)}`}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gold-500 hover:bg-gold-400 text-navy-900 text-[10px] font-bold uppercase tracking-wide transition-colors"
                >
                  <i className="fa-solid fa-download text-[9px]" /> Download
                </a>
                <button
                  onClick={() => setDeleteTarget(doc)}
                  className="w-8 h-8 flex items-center justify-center border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40 transition-colors"
                  title="Delete"
                >
                  <i className="fa-solid fa-trash text-[10px]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Edit drawer ──────────────────────────────────────────────────────── */}
      {editDoc && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setEditDoc(null)}>
          <div
            className="w-full max-w-md h-full bg-navy-800 border-l border-white/10 flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-navy-700 shrink-0">
              <div>
                <p className="text-[10px] font-bold text-gold-500 uppercase tracking-widest mb-0.5">Edit Metadata</p>
                <h3 className="text-sm font-bold text-white leading-snug truncate max-w-xs">{editDoc.display_name}</h3>
              </div>
              <button onClick={() => setEditDoc(null)} className="text-slate-400 hover:text-white p-1">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 flex-1 overflow-y-auto">
              <div>
                <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block mb-1.5">Display Name</label>
                <input
                  type="text"
                  value={editForm.display_name ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, display_name: e.target.value }))}
                  className="w-full bg-navy-900 border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block mb-1.5">Person</label>
                <input
                  type="text"
                  value={editForm.person ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, person: e.target.value }))}
                  placeholder="e.g. Joseph Agwuh"
                  className="w-full bg-navy-900 border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-colors placeholder-slate-600"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={editForm.description ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description of this document"
                  className="w-full bg-navy-900 border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-colors resize-none placeholder-slate-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block mb-1.5">Version</label>
                  <input
                    type="text"
                    value={editForm.version ?? ""}
                    onChange={(e) => setEditForm((f) => ({ ...f, version: e.target.value }))}
                    placeholder="e.g. v2"
                    className="w-full bg-navy-900 border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-colors placeholder-slate-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block mb-1.5">Date</label>
                  <input
                    type="text"
                    value={editForm.doc_date ?? ""}
                    onChange={(e) => setEditForm((f) => ({ ...f, doc_date: e.target.value }))}
                    placeholder="e.g. May 2026"
                    className="w-full bg-navy-900 border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-colors placeholder-slate-600"
                  />
                </div>
              </div>
              <div className="bg-navy-900 border border-white/5 p-3 mt-1">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">File</p>
                <p className="text-xs text-slate-400 font-mono truncate">{editDoc.filename}</p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-white/5 flex gap-3">
              <button
                onClick={handleSaveMeta}
                disabled={saving}
                className="flex-1 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-900 text-[10px] font-bold tracking-widest uppercase transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <i className={`fa-solid ${saving ? "fa-spinner animate-spin" : "fa-check"} text-[9px]`} />
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <button
                onClick={() => setEditDoc(null)}
                className="px-4 py-2.5 border border-white/10 text-slate-400 hover:text-white text-[10px] font-bold tracking-widest uppercase transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirmation ──────────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-navy-800 border border-white/10 p-7 max-w-sm w-full mx-4 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-trash-can text-red-400 text-sm" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Confirm Delete</p>
                <h3 className="text-sm font-bold text-white leading-snug">{deleteTarget.display_name}</h3>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              This will permanently remove the file from cloud storage. This cannot be undone.
            </p>
            <p className="text-[10px] text-slate-600 font-mono truncate">{deleteTarget.filename}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleteLoading}
                className="flex-1 py-2.5 border border-white/10 text-slate-400 hover:text-white text-[10px] font-bold tracking-widest uppercase transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-400 text-white text-[10px] font-bold tracking-widest uppercase transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <i className={`fa-solid ${deleteLoading ? "fa-spinner animate-spin" : "fa-trash-can"} text-[9px]`} />
                {deleteLoading ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
