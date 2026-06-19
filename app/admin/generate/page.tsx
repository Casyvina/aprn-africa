"use client";

import { useState } from "react";
import Link from "next/link";

type ContentType = "editorialInsight" | "researchReport" | "publication";

type PublicationType = "op-ed" | "position-paper" | "technical-note" | "event-summary" | "press-release" | "commentary" | "interview";

const TYPE_OPTIONS: { value: ContentType; label: string; desc: string; icon: string }[] = [
  {
    value: "editorialInsight",
    label: "Editorial Insight",
    desc: "Thought leadership & strategic commentary",
    icon: "fa-pen-nib",
  },
  {
    value: "researchReport",
    label: "Research Report",
    desc: "Data-driven working paper or policy brief",
    icon: "fa-flask",
  },
  {
    value: "publication",
    label: "Publication",
    desc: "Op-ed, position paper, technical note, or press release",
    icon: "fa-newspaper",
  },
];

const PUB_TYPE_OPTIONS: { value: PublicationType; label: string }[] = [
  { value: "op-ed",          label: "Op-Ed" },
  { value: "position-paper", label: "Position Paper" },
  { value: "technical-note", label: "Technical Note" },
  { value: "event-summary",  label: "Event Summary" },
  { value: "press-release",  label: "Press Release" },
  { value: "commentary",     label: "Commentary" },
  { value: "interview",      label: "Interview" },
];

interface GenerateResult {
  title: string;
  docId: string;
  slug: string;
  imageUrl?: string | null;
  urlContextUsed?: boolean;
  urlFetchWarning?: string;
}

export default function GenerateContentPage() {
  const [type, setType]           = useState<ContentType>("editorialInsight");
  const [pubType, setPubType]     = useState<PublicationType>("op-ed");
  const [topic, setTopic]         = useState("");
  const [angle, setAngle]         = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [url, setUrl]             = useState("");
  const [loading, setLoading]     = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [error, setError]         = useState("");
  const [result, setResult]       = useState<GenerateResult | null>(null);

  async function handleGenerate() {
    if (!topic.trim()) { setError("Topic is required."); return; }
    setLoading(true);
    setError("");
    setResult(null);
    setLoadingStage(url.trim() ? "Scanning URL…" : "Claude is writing…");

    const res = await fetch("/api/admin/generate-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        pubType: type === "publication" ? pubType : undefined,
        topic,
        angle,
        keyPoints,
        url: url.trim() || undefined,
      }),
    });

    const data = await res.json();
    setLoading(false);
    setLoadingStage("");

    if (!res.ok) {
      setError(data.error ?? "Generation failed. Please try again.");
      return;
    }

    setResult(data);
  }

  return (
    <div className="flex flex-col gap-8 max-w-200">

      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-3 mb-1">
          <Link href="/admin" className="text-slate-500 hover:text-gold-500 transition-colors text-xs">
            ← Admin
          </Link>
          <span className="text-slate-700 text-xs">/</span>
          <span className="text-slate-400 text-xs">Generate Content</span>
        </div>
        <h1
          className="text-2xl font-bold text-white mt-3"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          AI Content Generator
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Claude writes a draft — Tokun reviews and publishes in the Studio.
        </p>
      </div>

      {/* Success state */}
      {result && (
        <div className="flex flex-col gap-5">
          <div className="bg-emerald-400/5 border border-emerald-400/20 p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-check text-emerald-400 text-xs" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Draft Created</p>
                <p className="text-sm font-semibold text-white mt-0.5">{result.title}</p>
              </div>
            </div>

            {/* URL context status */}
            {result.urlContextUsed && (
              <div className="flex items-center gap-2 text-xs text-emerald-400/80">
                <i className="fa-solid fa-link text-[10px]" />
                Reference URL was scraped and used as primary source material.
              </div>
            )}
            {result.urlFetchWarning && (
              <div className="flex items-start gap-2 bg-amber-400/5 border border-amber-400/20 px-3 py-2.5">
                <i className="fa-solid fa-triangle-exclamation text-amber-400 text-[10px] mt-0.5 shrink-0" />
                <p className="text-xs text-amber-400/90 leading-relaxed">
                  <span className="font-bold">URL not used:</span> {result.urlFetchWarning}. Claude wrote from general knowledge — review carefully for accuracy.
                </p>
              </div>
            )}

            <p className="text-xs text-slate-400 leading-relaxed">
              The draft is saved in Sanity. Open the Studio, find it in the Drafts section, add a hero image, and publish.
            </p>
            <div className="flex gap-3">
              <a
                href="/studio"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-gold-500 text-navy-900 text-xs font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors"
              >
                <i className="fa-solid fa-arrow-up-right-from-square mr-2 text-[10px]" />
                Open Studio
              </a>
              <button
                onClick={() => { setResult(null); setTopic(""); setAngle(""); setKeyPoints(""); setUrl(""); setPubType("op-ed"); }}
                className="px-4 py-2.5 border border-white/10 text-xs text-slate-400 hover:text-white hover:border-white/20 transition-colors"
              >
                Generate Another
              </button>
            </div>
          </div>

          {/* Generated hero image */}
          {result.imageUrl && (
            <div className="bg-navy-800 border border-white/5 overflow-hidden">
              <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Generated Hero Image</span>
                <a
                  href={result.imageUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gold-500 hover:text-gold-400 transition-colors flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-download text-[10px]" />
                  Download
                </a>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.imageUrl}
                alt={result.title}
                className="w-full aspect-video object-cover"
              />
              <div className="px-5 py-3">
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Download this image and upload it as the hero image in Sanity Studio. The URL expires after ~24 hours.
                </p>
              </div>
            </div>
          )}

          {!result.imageUrl && (
            <div className="bg-navy-800/50 border border-white/5 border-dashed p-4 flex items-center gap-3">
              <i className="fa-solid fa-image text-slate-600 text-sm" />
              <p className="text-xs text-slate-500">
                Hero image generation skipped — <code className="text-gold-500 text-[10px]">FAL_KEY</code> not set. Add a hero image manually in the Studio.
              </p>
            </div>
          )}
        </div>
      )}

      {!result && (
        <div className="flex flex-col gap-6">

          {/* Content type */}
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-3">
              Content Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setType(opt.value)}
                  className={`p-4 border text-left transition-colors ${
                    type === opt.value
                      ? "bg-gold-500/10 border-gold-500/40"
                      : "bg-navy-800 border-white/5 hover:border-gold-500/20"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <i className={`fa-solid ${opt.icon} text-[10px] ${type === opt.value ? "text-gold-500" : "text-slate-500"}`} />
                    <p className={`text-xs font-bold ${type === opt.value ? "text-gold-400" : "text-white"}`}>
                      {opt.label}
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-500">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Publication sub-type (only when Publication is selected) */}
          {type === "publication" && (
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">
                Publication Type <span className="text-red-400">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {PUB_TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPubType(opt.value)}
                    className={`px-3 py-1.5 border text-xs font-semibold transition-colors ${
                      pubType === opt.value
                        ? "bg-gold-500/15 border-gold-500/50 text-gold-400"
                        : "bg-navy-800 border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* URL input */}
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">
              Reference URL
              <span className="ml-2 text-slate-600 normal-case font-normal tracking-normal">— optional, scraped as research context</span>
            </label>
            <div className="relative">
              <i className="fa-solid fa-link absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-[10px]" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article-or-report"
                className="w-full bg-navy-800 border border-white/10 pl-9 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/40 transition-colors"
              />
            </div>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">
              Topic <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Corrosion management challenges on West African deepwater pipelines"
              className="w-full bg-navy-800 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/40 transition-colors"
            />
          </div>

          {/* Angle */}
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">
              Angle / Focus
              <span className="ml-2 text-slate-600 normal-case font-normal tracking-normal">— what perspective or argument to take</span>
            </label>
            <input
              type="text"
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              placeholder="e.g. Why Nigerian operators are underprepared for the 2030 integrity audit mandate"
              className="w-full bg-navy-800 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/40 transition-colors"
            />
          </div>

          {/* Key points */}
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">
              Key Points to Cover
              <span className="ml-2 text-slate-600 normal-case font-normal tracking-normal">— one per line</span>
            </label>
            <textarea
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              rows={4}
              placeholder={`e.g.\nRegulatory framework gaps at DPR/NMDPRA\nCost of cathodic protection vs risk exposure\nRegional comparison with Ghana and Senegal\nRecommendations for operators`}
              className="w-full bg-navy-800 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/40 transition-colors resize-none"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs text-red-400">
              <i className="fa-solid fa-triangle-exclamation text-[10px]" />
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-4 bg-gold-500 text-navy-900 text-xs font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin text-[10px]" />
                {loadingStage || "Generating…"}
              </>
            ) : (
              <>
                <i className="fa-solid fa-wand-magic-sparkles text-[10px]" />
                Generate Draft
              </>
            )}
          </button>

          <p className="text-[10px] text-slate-600 text-center">
            Draft goes straight into Sanity as unpublished. Tokun reviews, adds hero image, and publishes.
          </p>

        </div>
      )}

    </div>
  );
}
