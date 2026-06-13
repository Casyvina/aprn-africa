"use client";

import { useState, useEffect } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

interface PersonnelDoc {
  id: string;
  name: string;
  person: string;
  role: string;
  version: string;
  date: string;
  format: string;
  filename: string;
  description: string;
}

// ── Registry ─────────────────────────────────────────────────────────────────

const PERSONNEL_DOCS: PersonnelDoc[] = [
  {
    id: "employ-joseph",
    name: "Employment Letter — Joseph Agwuh",
    person: "Joseph Agwuh",
    role: "Director, Applied Engineering",
    version: "v2",
    date: "May 2026",
    format: "DOCX",
    filename: "APRN_Employment_Letter_Joseph_Agwuh_v2.docx",
    description: "Official APRN employment letter for Joseph Agwuh.",
  },
  {
    id: "ambassador-allison",
    name: "Ambassador Appointment — Allison Gabriel",
    person: "Allison Gabriel",
    role: "Youth Ambassador",
    version: "v2",
    date: "May 2026",
    format: "DOCX",
    filename: "APRN_Ambassador_Letter_Allison_Gabriel_v2.docx",
    description: "Official APRN Youth Ambassador appointment letter for Allison Gabriel.",
  },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function PersonnelPage() {
  const [storageUrls, setStorageUrls] = useState<Record<string, string>>({});
  const [uploading, setUploading]     = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/documents")
      .then((r) => r.json())
      .then(({ files }: { files: Array<{ filename: string; signedUrl: string }> }) => {
        const map: Record<string, string> = {};
        (files ?? []).forEach((f) => { if (f.signedUrl) map[f.filename] = f.signedUrl; });
        setStorageUrls(map);
      })
      .catch(() => {});
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, expectedFilename: string) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(expectedFilename);
    setUploadError(null);
    try {
      const formData = new FormData();
      // rename to the canonical filename on upload
      formData.append("file", new File([file], expectedFilename, { type: file.type }));
      const res = await fetch("/api/admin/documents", { method: "POST", body: formData });
      const { signedUrl, error } = await res.json() as { signedUrl?: string; error?: string };
      if (error) throw new Error(error);
      if (signedUrl) setStorageUrls((prev) => ({ ...prev, [expectedFilename]: signedUrl }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
      e.target.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">

      {/* Header */}
      <div>
        <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-1">Admin</p>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
          Personnel Documents
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Restricted to Lucy Okeke and Joseph Agwuh only.
        </p>
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

      {/* Document cards */}
      <div className="flex flex-col gap-4">
        {PERSONNEL_DOCS.map((doc) => {
          const url = storageUrls[doc.filename] ?? null;
          const isUploading = uploading === doc.filename;
          const inputId = `upload-${doc.id}`;
          return (
            <div key={doc.id} className="bg-navy-800 border border-white/5 p-6 flex items-start gap-5">
              <div className="w-12 h-12 bg-navy-900 border border-white/5 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-file-word text-sky-400 text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="text-sm font-bold text-white leading-snug">{doc.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{doc.role} · {doc.version} · {doc.date}</p>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{doc.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {url ? (
                      <>
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <i className="fa-solid fa-cloud text-[9px]" />Cloud
                        </span>
                        <a
                          href={url}
                          download={doc.filename}
                          className="flex items-center gap-1.5 px-3 py-2 bg-gold-500 hover:bg-gold-400 text-navy-900 text-[10px] font-bold uppercase tracking-wide transition-colors"
                        >
                          <i className="fa-solid fa-download text-[9px]" /> Download
                        </a>
                      </>
                    ) : (
                      <label
                        htmlFor={inputId}
                        className={`flex items-center gap-1.5 px-3 py-2 border border-amber-500/30 bg-amber-500/5 text-amber-400 hover:text-amber-300 text-[10px] font-bold uppercase tracking-wide transition-colors cursor-pointer ${isUploading ? "opacity-60 pointer-events-none" : ""}`}
                        title="Upload this document to cloud storage"
                      >
                        <i className={`fa-solid ${isUploading ? "fa-spinner animate-spin" : "fa-cloud-arrow-up"} text-[9px]`} />
                        {isUploading ? "Uploading…" : "Upload File"}
                      </label>
                    )}
                    <input
                      id={inputId}
                      type="file"
                      accept=".docx"
                      className="hidden"
                      onChange={(e) => handleUpload(e, doc.filename)}
                    />
                  </div>
                </div>
                {!url && !isUploading && (
                  <p className="mt-2 text-[10px] text-slate-600 italic">
                    File not in cloud storage yet. Upload the .docx file to enable secure download.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
