"use client";

import { useState } from "react";

// ── Format Presets ────────────────────────────────────────────────────────────

const FORMATS = [
  {
    id: "event_banner",
    label: "Event Banner",
    dimensions: "1920 × 1080",
    icon: "fa-calendar-star",
    desc: "Conference, webinar cover",
    aspect: { w: 160, h: 90 },
  },
  {
    id: "linkedin",
    label: "LinkedIn Post",
    dimensions: "1200 × 627",
    icon: "fa-linkedin",
    desc: "Feed post, article cover",
    aspect: { w: 160, h: 84 },
  },
  {
    id: "newsletter",
    label: "Newsletter Header",
    dimensions: "1200 × 400",
    icon: "fa-envelope-open-text",
    desc: "Email + digest header",
    aspect: { w: 160, h: 53 },
  },
  {
    id: "research_cover",
    label: "Research Cover",
    dimensions: "800 × 1000",
    icon: "fa-book-open",
    desc: "Report + document hero",
    aspect: { w: 80, h: 100 },
  },
  {
    id: "social_square",
    label: "Social Square",
    dimensions: "1080 × 1080",
    icon: "fa-grid-2",
    desc: "Instagram, Twitter/X",
    aspect: { w: 90, h: 90 },
  },
];

const BRAND_CONTEXT =
  "Professional, authoritative visual for APRN Africa — pan-African pipeline research and networking organisation. " +
  "Dark navy blue palette (#071B2A), gold accents (#D4A017). African pipeline infrastructure context. " +
  "Clean corporate style. No text or typography overlays.";

const SUGGESTIONS: Record<string, string[]> = {
  event_banner: [
    "Grand pipeline engineering conference in an African city, aerial view, dramatic lighting",
    "Pipeline infrastructure corridor across sub-Saharan African terrain at golden hour",
    "Panel of African energy professionals on stage at an APRN summit",
  ],
  linkedin: [
    "African pipeline engineers in discussion at a modern control room, professional photography",
    "Aerial view of pipeline network crossing African savannah, corporate visual style",
    "Handshake between African energy professionals, pipeline in background",
  ],
  newsletter: [
    "Wide panorama of African pipeline infrastructure, navy sky, gold sunrise",
    "Abstract pipeline corridor with warm gold light, banner format",
  ],
  research_cover: [
    "Abstract data visualisation overlay on African pipeline map, navy and gold, book cover style",
    "Engineering blueprint technical drawing with African continent map, corporate",
    "Close-up of pipeline valves and instrumentation, dramatic professional lighting",
  ],
  social_square: [
    "Bold close-up of pipeline valve against deep navy background, gold industrial lighting",
    "Portrait of an African pipeline engineer in professional PPE, confident pose",
    "APRN Africa abstract logo concept in navy and gold, minimal corporate style",
  ],
};

interface GenerationResult {
  url: string;
  width: number;
  height: number;
  seed: number;
  format: string;
  prompt: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ContentStudioPage() {
  const [format, setFormat] = useState("event_banner");
  const [prompt, setPrompt] = useState("");
  const [includeBrand, setIncludeBrand] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<GenerationResult[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const selectedFormat = FORMATS.find((f) => f.id === format) ?? FORMATS[0];
  const suggestions = SUGGESTIONS[format] ?? SUGGESTIONS.event_banner;

  async function generate() {
    if (!prompt.trim()) return;
    setGenerating(true);
    setResult(null);
    setError("");
    setSaveMsg("");
    try {
      const res = await fetch("/api/admin/content-studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, format, includeBrandContext: includeBrand }),
      });
      const data = await res.json() as GenerationResult & { error?: string };
      if (!res.ok || data.error) throw new Error(data.error ?? "Generation failed");
      setResult(data);
      setHistory((prev) => [data, ...prev].slice(0, 8));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setGenerating(false);
    }
  }

  async function saveToLibrary() {
    if (!result) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const imgRes = await fetch(result.url);
      const blob = await imgRes.blob();
      const filename = `aprn-${result.format}-${result.seed}.jpg`;
      const formData = new FormData();
      formData.append("file", new File([blob], filename, { type: "image/jpeg" }));
      const res = await fetch("/api/admin/documents", { method: "POST", body: formData });
      const { error: saveError } = await res.json() as { error?: string };
      if (saveError) throw new Error(saveError);
      setSaveMsg(`Saved as "${filename}" in Document Library`);
    } catch (e) {
      setSaveMsg(`Save failed: ${e instanceof Error ? e.message : "Unknown"}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-7 max-w-5xl">

      {/* Header */}
      <div>
        <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-1">Admin · Content</p>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
          Content Studio
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Generate branded images for social media, newsletters, events, and research — powered by Fal.ai Flux Pro.
        </p>
      </div>

      {/* Format presets */}
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Choose Format</p>
        <div className="flex gap-3 flex-wrap">
          {FORMATS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id)}
              className={`flex flex-col items-center gap-2.5 p-4 border transition-all min-w-24 ${
                format === f.id
                  ? "border-gold-500/60 bg-gold-500/10 text-white"
                  : "border-white/10 bg-navy-800 text-slate-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {/* Aspect ratio preview box */}
              <div
                className={`border flex items-center justify-center flex-shrink-0 ${
                  format === f.id ? "border-gold-500/40 bg-gold-500/10" : "border-white/10 bg-navy-700"
                }`}
                style={{
                  width: Math.max(28, Math.round(f.aspect.w * 0.55)),
                  height: Math.max(18, Math.round(f.aspect.h * 0.55)),
                }}
              >
                <i className={`fa-solid ${f.icon} text-[9px] ${format === f.id ? "text-gold-500" : "text-slate-600"}`} />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold whitespace-nowrap leading-tight">{f.label}</p>
                <p className="text-[9px] text-slate-600 whitespace-nowrap">{f.dimensions}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main two-column layout */}
      <div className="grid lg:grid-cols-[1fr_1fr] gap-6">

        {/* ── Input panel ──────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="bg-navy-800 border border-white/5 p-5 flex flex-col gap-5">

            {/* Prompt */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                Describe your image
              </label>
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={generating}
                placeholder={`e.g. "${suggestions[0]}"`}
                className="w-full bg-navy-900 border border-white/10 focus:border-gold-500/40 text-white text-sm px-3 py-2.5 outline-none transition-colors resize-none disabled:opacity-60 placeholder-slate-600 leading-relaxed"
              />
            </div>

            {/* Quick suggestions */}
            <div>
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-2">
                Quick prompts for {selectedFormat.label}
              </p>
              <div className="flex flex-col gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setPrompt(s)}
                    className="text-left text-[10px] text-slate-500 hover:text-slate-200 transition-colors border border-white/5 hover:border-white/10 px-3 py-2 bg-navy-900 leading-snug"
                  >
                    <i className="fa-solid fa-wand-magic-sparkles text-[8px] mr-2 text-gold-500/50" />
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand context toggle */}
            <div className="border border-white/5 bg-navy-900 p-3.5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <i className="fa-solid fa-shield-halved text-gold-500/60 text-[9px]" />
                  APRN Brand Context
                </p>
                <button
                  onClick={() => setIncludeBrand((v) => !v)}
                  className={`text-[9px] font-bold px-2.5 py-1 border transition-colors ${
                    includeBrand
                      ? "border-gold-500/40 bg-gold-500/10 text-gold-500"
                      : "border-white/10 text-slate-600 hover:text-white"
                  }`}
                >
                  {includeBrand ? "ON" : "OFF"}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">{BRAND_CONTEXT}</p>
            </div>

            {/* Generate button */}
            <button
              onClick={generate}
              disabled={generating || !prompt.trim()}
              className="w-full py-3.5 bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-navy-900 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              <i className={`fa-solid ${generating ? "fa-spinner animate-spin" : "fa-image"} text-[11px]`} />
              {generating ? "Generating with Flux Pro…" : `Generate ${selectedFormat.label}`}
            </button>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 flex items-start gap-2">
                <i className="fa-solid fa-circle-exclamation mt-0.5 shrink-0" />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* ── Result panel ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="bg-navy-800 border border-white/5 overflow-hidden">

            {/* Image area */}
            <div className="relative bg-navy-900 min-h-64 flex items-center justify-center">
              {generating && (
                <div className="flex flex-col items-center gap-4 p-16 text-center">
                  <div className="w-10 h-10 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
                  <div>
                    <p className="text-xs text-slate-400">Generating with Flux Pro…</p>
                    <p className="text-[10px] text-slate-600 mt-1">Usually 15–30 seconds</p>
                  </div>
                </div>
              )}

              {!generating && !result && (
                <div className="flex flex-col items-center gap-3 p-12 text-center">
                  <div
                    className="border border-white/10 bg-navy-800 flex items-center justify-center"
                    style={{
                      width: Math.max(60, Math.round(selectedFormat.aspect.w * 0.7)),
                      height: Math.max(40, Math.round(selectedFormat.aspect.h * 0.7)),
                    }}
                  >
                    <i className={`fa-solid ${selectedFormat.icon} text-slate-700 text-lg`} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Your image will appear here</p>
                    <p className="text-[10px] text-slate-700 mt-0.5">{selectedFormat.dimensions} · {selectedFormat.desc}</p>
                  </div>
                </div>
              )}

              {result && !generating && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={result.url}
                  alt="AI generated image"
                  className="w-full h-auto block"
                />
              )}
            </div>

            {/* Result actions */}
            {result && !generating && (
              <div className="p-4 border-t border-white/5 flex flex-col gap-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-[9px] text-slate-500">
                    <span className="text-white font-semibold">{result.width} × {result.height}px</span>
                    <span className="mx-1.5">·</span>
                    Seed {result.seed}
                  </p>
                  <span className="text-[9px] font-bold px-2 py-0.5 border border-gold-500/20 bg-gold-500/10 text-gold-500">
                    {FORMATS.find((f) => f.id === result.format)?.label ?? result.format}
                  </span>
                </div>

                <div className="flex gap-2">
                  <a
                    href={result.url}
                    download={`aprn-${result.format}-${result.seed}.jpg`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-900 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
                  >
                    <i className="fa-solid fa-download text-[9px]" /> Download
                  </a>
                  <button
                    onClick={saveToLibrary}
                    disabled={saving}
                    className="flex-1 py-2.5 border border-white/10 hover:border-emerald-500/30 text-slate-400 hover:text-emerald-400 disabled:opacity-60 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
                  >
                    <i className={`fa-solid ${saving ? "fa-spinner animate-spin" : "fa-cloud-arrow-up"} text-[9px]`} />
                    {saving ? "Saving…" : "Save to Library"}
                  </button>
                </div>

                {saveMsg && (
                  <p className={`text-[10px] flex items-center gap-1.5 ${saveMsg.startsWith("Save failed") ? "text-red-400" : "text-emerald-400"}`}>
                    <i className={`fa-solid ${saveMsg.startsWith("Save failed") ? "fa-circle-exclamation" : "fa-circle-check"} text-[9px]`} />
                    {saveMsg}
                  </p>
                )}

                {/* Prompt used */}
                <details className="group">
                  <summary className="text-[9px] font-bold text-slate-600 uppercase tracking-widest cursor-pointer hover:text-slate-400 transition-colors">
                    Prompt used
                  </summary>
                  <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">{result.prompt}</p>
                </details>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Generation history ────────────────────────────────────────────── */}
      {history.length > 1 && (
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
            Session history — {history.length} generation{history.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
            {history.map((h, i) => (
              <button
                key={i}
                onClick={() => { setResult(h); setFormat(h.format); }}
                title={FORMATS.find((f) => f.id === h.format)?.label}
                className={`aspect-square bg-navy-800 border overflow-hidden transition-all group relative ${
                  result?.seed === h.seed ? "border-gold-500/60" : "border-white/5 hover:border-white/20"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={h.url} alt={`Gen ${i + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-navy-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <i className="fa-solid fa-eye text-white text-xs" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Usage note */}
      <div className="bg-navy-800 border border-white/5 p-4 flex items-start gap-3">
        <i className="fa-solid fa-circle-info text-slate-600 text-sm mt-0.5 shrink-0" />
        <div className="text-[10px] text-slate-500 leading-relaxed">
          <span className="font-bold text-slate-400">Flux Pro v1.1</span> — ~15–30s per image · ~$0.05/image · images are hosted by Fal.ai and expire after 24h.
          Use <span className="font-bold text-slate-400">Save to Library</span> to keep images permanently in Supabase Storage.
        </div>
      </div>
    </div>
  );
}
