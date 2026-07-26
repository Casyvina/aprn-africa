"use client"

import { useState } from "react"

type Mode    = "import" | "patch"
type DocType = "editorialInsight" | "researchReport" | "publication" | "intelligenceUpdate" | "policyFramework"

const DOC_TYPE_LABELS: Record<DocType, string> = {
  editorialInsight:  "Editorial Insight",
  researchReport:    "Research Report",
  publication:       "Publication",
  intelligenceUpdate:"Intelligence Update",
  policyFramework:   "Policy Framework",
}

const DOC_TYPE_FIELDS: Record<DocType, { key: string; value: string; note?: string }[]> = {
  editorialInsight: [
    { key: "# H1 line",                  value: "Title" },
    { key: "**Subtitle:** …",            value: "Subtitle" },
    { key: "**Summary:** …",             value: "Excerpt" },
    { key: "**Publish Date:** …",        value: "Publish date" },
    { key: "**Estimated Read Time:** …", value: "Read time (minutes)" },
    { key: "**Pull Quote:** …",          value: "Pull quote" },
    { key: "## H2 + paragraphs",         value: "Body (Portable Text)" },
  ],
  researchReport: [
    { key: "# H1 line",                  value: "Title" },
    { key: "**Subtitle:** …",            value: "Subtitle" },
    { key: "**Summary:** …",             value: "Executive Summary" },
    { key: "**Publish Date:** …",        value: "Publish date" },
    { key: "**Estimated Read Time:** …", value: "Read time (minutes)" },
    { key: "**Pull Quote:** …",          value: "Pull quote" },
    { key: "## H2 + paragraphs",         value: "Body (Portable Text)" },
  ],
  publication: [
    { key: "# H1 line",                  value: "Title" },
    { key: "**Subtitle:** …",            value: "Subtitle" },
    { key: "**Summary:** …",             value: "Summary" },
    { key: "**Publication Type:** …",    value: "Type", note: "op-ed · position-paper · technical-note · event-summary · press-release · commentary · interview" },
    { key: "**Publish Date:** …",        value: "Publish date" },
    { key: "**Estimated Read Time:** …", value: "Read time (minutes)" },
    { key: "**External URL:** …",        value: "External URL (optional)" },
    { key: "## H2 + paragraphs",         value: "Body (Portable Text)" },
  ],
  intelligenceUpdate: [
    { key: "# H1 line",                  value: "Headline" },
    { key: "**Subtitle:** …",            value: "Subtitle" },
    { key: "**Summary:** …",             value: "Summary" },
    { key: "**Category:** …",            value: "Category", note: "market · project · policy · training · partnership · event · research" },
    { key: "**Priority:** …",            value: "Priority", note: "normal · urgent · featured" },
    { key: "**Publish Date:** …",        value: "Published at" },
    { key: "**Estimated Read Time:** …", value: "Read time (minutes)" },
    { key: "**Pull Quote:** …",          value: "Pull quote" },
    { key: "**External URL:** …",        value: "External URL (optional)" },
    { key: "## H2 + paragraphs",         value: "Body (Portable Text)" },
  ],
  policyFramework: [
    { key: "# H1 line",                  value: "Title" },
    { key: "**Summary:** …",             value: "Summary" },
    { key: "**Framework Type:** …",      value: "Framework type", note: "AU · ECOWAS · EAC · SADC · COMESA · bilateral · national · industry" },
    { key: "**Date Adopted:** …",        value: "Date adopted (YYYY-MM-DD)" },
    { key: "**In Force:** yes/no",        value: "Currently in force" },
    { key: "## H2 + paragraphs",         value: "Body / Full Analysis" },
  ],
}

const STUDIO_SECTION: Record<DocType, string> = {
  editorialInsight:   "Editorial Insights",
  researchReport:     "Research Reports",
  publication:        "Publications",
  intelligenceUpdate: "Intelligence Updates",
  policyFramework:    "Policy Frameworks",
}

export default function ImportArticlePage() {
  const [mode, setMode] = useState<Mode>("import")

  // Import New state
  const [markdown, setMarkdown]             = useState("")
  const [docType, setDocType]               = useState<DocType>("editorialInsight")
  const [importLoading, setImportLoading]   = useState(false)
  const [importResult, setImportResult]     = useState<{ slug: string; studioUrl: string } | null>(null)
  const [importError, setImportError]       = useState<string | null>(null)

  // Patch Existing state
  const [patchSlug, setPatchSlug]           = useState("")
  const [patchContent, setPatchContent]     = useState("")
  const [patchLoading, setPatchLoading]     = useState(false)
  const [patchResult, setPatchResult]       = useState<{
    ok: boolean; documentId: string; slug: string; fieldsApplied: string[]; note: string
  } | null>(null)
  const [patchError, setPatchError]         = useState<string | null>(null)

  async function handleImport() {
    if (!markdown.trim()) return
    setImportLoading(true)
    setImportError(null)
    setImportResult(null)
    try {
      const res  = await fetch("/api/admin/import-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown, docType }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Import failed")
      setImportResult(data)
    } catch (e) {
      setImportError(e instanceof Error ? e.message : "Unknown error")
    } finally {
      setImportLoading(false)
    }
  }

  async function handlePatch() {
    if (!patchSlug.trim() || !patchContent.trim()) return
    setPatchLoading(true)
    setPatchError(null)
    setPatchResult(null)
    try {
      const res  = await fetch("/api/admin/patch-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: patchSlug.trim(), content: patchContent }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Patch failed")
      setPatchResult(data)
    } catch (e) {
      setPatchError(e instanceof Error ? e.message : "Unknown error")
    } finally {
      setPatchLoading(false)
    }
  }

  return (
    <div className="max-w-240 flex flex-col gap-8">

      {/* Header */}
      <div>
        <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-1">Content Tools</p>
        <h1
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Import / Patch Content
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Create a new draft from markdown, or apply field corrections to an existing research report.
        </p>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-3 border-b border-white/5 pb-0">
        {(["import", "patch"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-5 py-2.5 text-xs font-bold uppercase tracking-widest border-b-2 -mb-px transition-colors ${
              mode === m
                ? "border-gold-500 text-gold-500"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            {m === "import" ? "Import New" : "Patch Existing"}
          </button>
        ))}
      </div>

      {/* ── Import New ─────────────────────────────────────────────────────── */}
      {mode === "import" && (
        <>
          {/* Doc type */}
          <div className="flex flex-wrap gap-2">
            {(Object.keys(DOC_TYPE_LABELS) as DocType[]).map((t) => (
              <button
                key={t}
                onClick={() => { setDocType(t); setImportResult(null); setImportError(null) }}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${
                  docType === t
                    ? "bg-gold-500 text-navy-900 border-gold-500"
                    : "bg-transparent text-slate-400 border-white/10 hover:border-gold-500/40 hover:text-white"
                }`}
              >
                {DOC_TYPE_LABELS[t]}
              </button>
            ))}
          </div>

          {/* What gets parsed — type-specific */}
          <div className="bg-navy-800 border border-white/5 p-5 text-xs text-slate-400 flex flex-col gap-1.5">
            <p className="text-[10px] font-bold text-gold-500 uppercase tracking-widest mb-2">
              What gets auto-filled — {DOC_TYPE_LABELS[docType]}
            </p>
            {DOC_TYPE_FIELDS[docType].map(({ key, value, note }) => (
              <div key={key}>
                <p>
                  <span className="text-slate-300 font-medium font-mono">{key}</span>
                  <span className="text-slate-600 mx-2">→</span>
                  {value}
                </p>
                {note && <p className="text-slate-600 ml-4 mt-0.5">{note}</p>}
              </div>
            ))}
            <p className="mt-2 text-slate-500">
              Slug is auto-generated from the title / headline. Hero images and reference fields (authors, topics, corridors) must be added in Studio after import.
            </p>
          </div>

          {/* Textarea */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Paste Markdown
            </label>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder={
                docType === "intelligenceUpdate"
                  ? `# Intelligence Headline Here\n\n**Subtitle:** One-line framing\n**Summary:** Expanded summary for the feed...\n**Category:** project\n**Priority:** normal\n**Publish Date:** 2026-07-26\n**Estimated Read Time:** 5\n**Pull Quote:** The key strategic line.\n**External URL:** https://...\n\n## Background\n\nContent...`
                  : docType === "policyFramework"
                  ? `# Framework Title\n\n**Summary:** Concise overview of the framework...\n**Framework Type:** ECOWAS\n**Date Adopted:** 2022-06-01\n**In Force:** yes\n\n## Overview\n\nAnalysis...`
                  : docType === "publication"
                  ? `# Publication Title\n\n**Subtitle:** One-line framing\n**Summary:** Summary for the listing card...\n**Publication Type:** op-ed\n**Publish Date:** 2026-07-26\n**Estimated Read Time:** 8\n**External URL:** https://...\n\n## Introduction\n\nContent...`
                  : `# Your Article Title\n\n**Subtitle:** One-line framing\n**Summary:** Summary paragraph...\n**Publish Date:** 2026-07-26\n**Estimated Read Time:** 10\n**Pull Quote:** The memorable line.\n\nIntroductory paragraph here...\n\n## First Section\n\nContent...`
              }
              className="w-full h-96 bg-navy-900 border border-white/10 text-slate-300 text-xs font-mono p-4 resize-y focus:outline-none focus:border-gold-500/40 placeholder:text-slate-700"
              spellCheck={false}
            />
            <p className="text-[10px] text-slate-600">{markdown.split("\n").length} lines · {markdown.length} chars</p>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleImport}
              disabled={importLoading || !markdown.trim()}
              className="px-6 py-3 text-xs font-bold uppercase tracking-widest bg-gold-500 hover:bg-gold-400 text-navy-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {importLoading && <i className="fa-solid fa-circle-notch animate-spin" />}
              {importLoading ? "Importing…" : "Create Draft in Sanity"}
            </button>
            {markdown.trim() && (
              <button
                onClick={() => { setMarkdown(""); setImportResult(null); setImportError(null) }}
                className="text-xs text-slate-500 hover:text-white transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {importError && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-400 flex items-start gap-3">
              <i className="fa-solid fa-triangle-exclamation mt-0.5 shrink-0" />
              {importError}
            </div>
          )}

          {importResult && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-circle-check text-emerald-400 text-xl" />
                <div>
                  <p className="text-sm font-bold text-white">Draft created successfully</p>
                  <p className="text-xs text-slate-400 mt-0.5">Slug: <span className="text-slate-300 font-mono">{importResult.slug}</span></p>
                </div>
              </div>
              <div className="flex gap-3">
                <a
                  href="/studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-900 text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Open Sanity Studio
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
                </a>
                <button
                  onClick={() => { setMarkdown(""); setImportResult(null) }}
                  className="px-4 py-2.5 border border-white/10 text-xs text-slate-400 hover:text-white hover:border-white/20 transition-colors"
                >
                  Import Another
                </button>
              </div>
              <p className="text-xs text-slate-500">
                In Studio: find the draft under <span className="text-slate-300">{STUDIO_SECTION[docType]}</span>, add images, fill reference fields, then Publish.
              </p>
            </div>
          )}
        </>
      )}

      {/* ── Patch Existing ─────────────────────────────────────────────────── */}
      {mode === "patch" && (
        <>
          <div className="bg-navy-800 border border-white/5 p-5 text-xs text-slate-400 flex flex-col gap-1.5">
            <p className="text-[10px] font-bold text-gold-500 uppercase tracking-widest mb-2">What gets patched</p>
            <p>Finds an existing <span className="text-slate-300 font-medium">researchReport</span> by slug and overwrites only the fields it can parse from the structured document.</p>
            <p className="mt-1">Fields updated: <span className="text-slate-300">title, subtitle, executive summary, pull quote, report type, publish date, page count, read time, featured flag, key insight stats, SEO meta title, SEO meta description.</span></p>
            <p className="mt-1 text-slate-500">Topics, authors, countries, corridors, and related reports require manual linking in Studio — they need existing document IDs that can&apos;t be resolved from text alone.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Report Slug
            </label>
            <input
              type="text"
              value={patchSlug}
              onChange={(e) => setPatchSlug(e.target.value)}
              placeholder="africa-s-pipeline-infrastructure-2026-outlook"
              className="w-full bg-navy-900 border border-white/10 text-slate-300 text-sm font-mono px-4 py-3 focus:outline-none focus:border-gold-500/40 placeholder:text-slate-700"
              spellCheck={false}
            />
            <p className="text-[10px] text-slate-600">The slug from the report&apos;s URL: aprn-africa.org/research/<span className="text-slate-500">slug-here</span></p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Full-Fields Document
            </label>
            <textarea
              value={patchContent}
              onChange={(e) => setPatchContent(e.target.value)}
              placeholder={`===============================================================\nTITLE\n===============================================================\nYour Report Title\n\n===============================================================\nSUBTITLE\n===============================================================\nOne-line framing\n\n===============================================================\nEXECUTIVE SUMMARY\n===============================================================\nSummary paragraph...\n\n...`}
              className="w-full h-96 bg-navy-900 border border-white/10 text-slate-300 text-xs font-mono p-4 resize-y focus:outline-none focus:border-gold-500/40 placeholder:text-slate-700"
              spellCheck={false}
            />
            <p className="text-[10px] text-slate-600">{patchContent.split("\n").length} lines · {patchContent.length} chars</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handlePatch}
              disabled={patchLoading || !patchSlug.trim() || !patchContent.trim()}
              className="px-6 py-3 text-xs font-bold uppercase tracking-widest bg-gold-500 hover:bg-gold-400 text-navy-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {patchLoading && <i className="fa-solid fa-circle-notch animate-spin" />}
              {patchLoading ? "Patching…" : "Apply Patch to Sanity"}
            </button>
            {(patchSlug || patchContent) && (
              <button
                onClick={() => { setPatchSlug(""); setPatchContent(""); setPatchResult(null); setPatchError(null) }}
                className="text-xs text-slate-500 hover:text-white transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {patchError && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-400 flex items-start gap-3">
              <i className="fa-solid fa-triangle-exclamation mt-0.5 shrink-0" />
              {patchError}
            </div>
          )}

          {patchResult && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-circle-check text-emerald-400 text-xl" />
                <div>
                  <p className="text-sm font-bold text-white">Report patched successfully</p>
                  <p className="text-xs text-slate-400 mt-0.5">Document ID: <span className="text-slate-300 font-mono">{patchResult.documentId}</span></p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Fields applied</p>
                <div className="flex flex-wrap gap-1.5">
                  {patchResult.fieldsApplied.map((f) => (
                    <span key={f} className="px-2 py-0.5 bg-gold-500/10 border border-gold-500/20 text-gold-400 text-[10px] font-mono">{f}</span>
                  ))}
                </div>
              </div>
              {patchResult.note && (
                <p className="text-xs text-slate-500 border-t border-white/5 pt-3">{patchResult.note}</p>
              )}
              <a
                href="/studio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 w-fit px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-900 text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Open Sanity Studio
                <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
              </a>
            </div>
          )}
        </>
      )}

    </div>
  )
}
