"use client"

import { useState } from "react"

export default function ImportArticlePage() {
  const [markdown, setMarkdown]   = useState("")
  const [docType, setDocType]     = useState<"editorialInsight" | "researchReport">("editorialInsight")
  const [loading, setLoading]     = useState(false)
  const [result, setResult]       = useState<{ slug: string; studioUrl: string } | null>(null)
  const [error, setError]         = useState<string | null>(null)

  async function handleImport() {
    if (!markdown.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/admin/import-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown, docType }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Import failed")
      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error")
    } finally {
      setLoading(false)
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
          Import Article from Markdown
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Paste your markdown document and it will be created as a draft in Sanity Studio — ready to review and publish.
        </p>
      </div>

      {/* Doc type */}
      <div className="flex gap-3">
        {(["editorialInsight", "researchReport"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setDocType(t)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${
              docType === t
                ? "bg-gold-500 text-navy-900 border-gold-500"
                : "bg-transparent text-slate-400 border-white/10 hover:border-gold-500/40 hover:text-white"
            }`}
          >
            {t === "editorialInsight" ? "Editorial Insight" : "Research Report"}
          </button>
        ))}
      </div>

      {/* What gets parsed */}
      <div className="bg-navy-800 border border-white/5 p-5 text-xs text-slate-400 flex flex-col gap-1.5">
        <p className="text-[10px] font-bold text-gold-500 uppercase tracking-widest mb-2">What gets auto-filled</p>
        <p><span className="text-slate-300 font-medium"># H1 line</span> → Title</p>
        <p><span className="text-slate-300 font-medium">**Subtitle:** …</span> → Subtitle</p>
        <p><span className="text-slate-300 font-medium">**Summary:** …</span> → Excerpt / Executive Summary</p>
        <p><span className="text-slate-300 font-medium">**Publish Date:** …</span> → Publish date</p>
        <p><span className="text-slate-300 font-medium">**Estimated Read Time:** …</span> → Read time</p>
        <p><span className="text-slate-300 font-medium">**Pull Quote:** …</span> → Pull quote</p>
        <p><span className="text-slate-300 font-medium">## H2 sections + paragraphs</span> → Body (Portable Text)</p>
        <p className="mt-1 text-slate-500">Slug is auto-generated from the title. Hero image must be added in Studio after import.</p>
      </div>

      {/* Textarea */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Paste Markdown
        </label>
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder={`# Your Article Title\n\n**Subtitle:** One-line framing\n**Summary:** Summary paragraph...\n**Publish Date:** 2026-07-25\n**Estimated Read Time:** 10\n**Pull Quote:** The memorable line.\n\nIntroductory paragraph here...\n\n## First Section\n\nContent...`}
          className="w-full h-96 bg-navy-900 border border-white/10 text-slate-300 text-xs font-mono p-4 resize-y focus:outline-none focus:border-gold-500/40 placeholder:text-slate-700"
          spellCheck={false}
        />
        <p className="text-[10px] text-slate-600">{markdown.split("\n").length} lines · {markdown.length} chars</p>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleImport}
          disabled={loading || !markdown.trim()}
          className="px-6 py-3 text-xs font-bold uppercase tracking-widest bg-gold-500 hover:bg-gold-400 text-navy-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading && <i className="fa-solid fa-circle-notch animate-spin" />}
          {loading ? "Importing…" : "Create Draft in Sanity"}
        </button>
        {markdown.trim() && (
          <button
            onClick={() => { setMarkdown(""); setResult(null); setError(null) }}
            className="text-xs text-slate-500 hover:text-white transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-400 flex items-start gap-3">
          <i className="fa-solid fa-triangle-exclamation mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Success */}
      {result && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-circle-check text-emerald-400 text-xl" />
            <div>
              <p className="text-sm font-bold text-white">Draft created successfully</p>
              <p className="text-xs text-slate-400 mt-0.5">Slug: <span className="text-slate-300 font-mono">{result.slug}</span></p>
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
              onClick={() => { setMarkdown(""); setResult(null) }}
              className="px-4 py-2.5 border border-white/10 text-xs text-slate-400 hover:text-white hover:border-white/20 transition-colors"
            >
              Import Another
            </button>
          </div>
          <p className="text-xs text-slate-500">
            In Studio: find the draft under <span className="text-slate-300">Editorial Insights</span>, add a hero image, review the body, then hit Publish.
          </p>
        </div>
      )}

    </div>
  )
}
