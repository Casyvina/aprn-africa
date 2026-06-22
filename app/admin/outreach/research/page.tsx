"use client";

import { useState } from "react";
import Link from "next/link";

type TargetTable = "pipeline_engineers" | "pipeline_operators" | "contractors_epc" | "regulators_associations";

interface Suggestion {
  id: string;
  target_table: TargetTable;
  suggested_data: Record<string, unknown>;
  source_context: string;
  status: string;
  created_at: string;
}

const TABLE_LABELS: Record<TargetTable, string> = {
  pipeline_engineers:    "Pipeline Engineer",
  pipeline_operators:    "Pipeline Operator",
  contractors_epc:       "EPC Contractor",
  regulators_associations: "Regulator / Association",
};

const TABLE_ICONS: Record<TargetTable, string> = {
  pipeline_engineers:    "fa-user-helmet-safety",
  pipeline_operators:    "fa-industry",
  contractors_epc:       "fa-hard-hat",
  regulators_associations: "fa-landmark",
};

const NAME_FIELD: Record<TargetTable, string> = {
  pipeline_engineers:    "full_name",
  pipeline_operators:    "company_name",
  contractors_epc:       "company_name",
  regulators_associations: "organisation",
};

export default function ResearchPage() {
  const [prompt, setPrompt]   = useState("");
  const [table, setTable]     = useState<TargetTable>("pipeline_engineers");
  const [count, setCount]     = useState(5);
  const [running, setRunning] = useState(false);
  const [error, setError]     = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [pending, setPending]         = useState<Suggestion[]>([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [tab, setTab] = useState<"generate" | "queue">("generate");
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [editData, setEditData]     = useState<Record<string, unknown>>({});

  async function handleResearch() {
    if (!prompt.trim()) { setError("Describe what you're looking for."); return; }
    setRunning(true);
    setError("");
    const res = await fetch("/api/admin/outreach/research", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, target_table: table, count }),
    });
    const data = await res.json();
    setRunning(false);
    if (!res.ok) { setError(data.error ?? "Research failed"); return; }
    setSuggestions(data.suggestions ?? []);
    setTab("queue");
    loadPending();
  }

  async function loadPending() {
    setLoadingPending(true);
    const res = await fetch("/api/admin/outreach/research?status=pending");
    const data = await res.json();
    setLoadingPending(false);
    if (Array.isArray(data)) setPending(data);
  }

  async function accept(id: string, overrideData?: Record<string, unknown>) {
    const res = await fetch(`/api/admin/outreach/research/${id}/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: overrideData ?? null }),
    });
    if (res.ok) {
      setPending((prev) => prev.filter((s) => s.id !== id));
      setSuggestions((prev) => prev.filter((s) => s.id !== id));
      setEditingId(null);
    }
  }

  async function reject(id: string) {
    await fetch(`/api/admin/outreach/research/${id}/reject`, { method: "POST" });
    setPending((prev) => prev.filter((s) => s.id !== id));
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
    setEditingId(null);
  }

  const displayList = tab === "queue" ? pending : suggestions;

  return (
    <div className="space-y-8 max-w-4xl">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Link href="/admin/outreach" className="text-slate-500 hover:text-gold-500 transition-colors text-xs">← Outreach</Link>
          <span className="text-slate-700 text-xs">/</span>
          <span className="text-slate-400 text-xs">AI Research</span>
        </div>
        <h1 className="text-xl font-bold text-white mt-3" style={{ fontFamily: "var(--font-playfair), serif" }}>
          AI Research
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Claude suggests real engineers and companies to add to your database. Every suggestion needs your approval before anything is saved.
        </p>
      </div>

      {/* Research form */}
      <div className="bg-navy-800 border border-white/5 p-6 space-y-5">
        <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">New Research Brief</p>

        <div>
          <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">
            What are you looking for? <span className="text-red-400">*</span>
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="e.g. Pipeline integrity engineers based in East Africa (Kenya, Tanzania, Ethiopia) with experience in high-pressure gas systems"
            className="w-full bg-navy-900 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/40 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">Add to</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(TABLE_LABELS) as TargetTable[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTable(t)}
                  className={`p-3 border text-left transition-colors ${
                    table === t ? "bg-gold-500/10 border-gold-500/40" : "border-white/5 hover:border-white/10"
                  }`}
                >
                  <i className={`fa-solid ${TABLE_ICONS[t]} text-[10px] ${table === t ? "text-gold-500" : "text-slate-500"} mb-1`} />
                  <p className={`text-[10px] font-bold ${table === t ? "text-gold-400" : "text-white"}`}>{TABLE_LABELS[t]}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">
              Suggestions to generate
            </label>
            <div className="flex gap-2">
              {[3, 5, 8, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`px-3 py-2 text-xs font-bold border transition-colors ${
                    count === n ? "bg-gold-500/10 border-gold-500/40 text-gold-400" : "border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-600 mt-2 leading-relaxed">
              AI uses its training knowledge of the African energy sector. Verify names and emails independently before using for outreach.
            </p>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-400 flex items-center gap-1.5">
            <i className="fa-solid fa-triangle-exclamation text-[10px]" />
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleResearch}
            disabled={running}
            className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-navy-900 font-bold uppercase tracking-widest text-xs transition-colors"
          >
            {running ? (
              <><i className="fa-solid fa-circle-notch fa-spin text-[10px]" /> Researching…</>
            ) : (
              <><i className="fa-solid fa-robot text-[10px]" /> Run Research</>
            )}
          </button>
          <button
            onClick={() => { setTab("queue"); loadPending(); }}
            className="flex items-center gap-2 px-4 py-2.5 border border-white/10 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-inbox text-[10px]" />
            Review Queue
          </button>
        </div>
      </div>

      {/* Warning banner */}
      <div className="flex items-start gap-3 bg-amber-400/5 border border-amber-400/20 px-4 py-3">
        <i className="fa-solid fa-triangle-exclamation text-amber-400 text-sm shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-amber-400">Review every suggestion carefully</p>
          <p className="text-xs text-amber-400/80 mt-0.5">
            Claude suggests based on training knowledge — it may hallucinate emails, job titles, or affiliations. Verify names via LinkedIn before adding. Never send outreach to an email address you haven&apos;t independently confirmed.
          </p>
        </div>
      </div>

      {/* Tabs + list */}
      <div>
        <div className="flex border-b border-white/5 mb-4">
          {([
            { key: "generate", label: "From Last Run" },
            { key: "queue",    label: `Review Queue${pending.length ? ` (${pending.length})` : ""}` },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); if (t.key === "queue") loadPending(); }}
              className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider border-b-2 -mb-px transition-colors ${
                tab === t.key ? "border-gold-500 text-gold-400" : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loadingPending && tab === "queue" && (
          <p className="text-xs text-slate-500 py-4"><i className="fa-solid fa-circle-notch fa-spin mr-2" />Loading…</p>
        )}

        {displayList.length === 0 && !loadingPending && (
          <div className="bg-navy-800 border border-white/5 p-10 text-center">
            <i className="fa-solid fa-inbox text-3xl text-slate-700 mb-3" />
            <p className="text-sm text-slate-500">
              {tab === "generate" ? "Run a research brief above to generate suggestions." : "No pending suggestions."}
            </p>
          </div>
        )}

        <div className="space-y-3">
          {displayList.map((s) => {
            const nameKey = NAME_FIELD[s.target_table];
            const name = (s.suggested_data[nameKey] as string) ?? "Unnamed";
            const isEditing = editingId === s.id;
            const data = isEditing ? editData : s.suggested_data;

            return (
              <div key={s.id} className="bg-navy-800 border border-white/5 p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <i className={`fa-solid ${TABLE_ICONS[s.target_table]} text-gold-500 text-[10px]`} />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{TABLE_LABELS[s.target_table]}</span>
                    </div>
                    <p className="text-sm font-semibold text-white">{name}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!isEditing && (
                      <button
                        onClick={() => { setEditingId(s.id); setEditData({ ...s.suggested_data }); }}
                        className="text-[10px] text-slate-400 hover:text-white border border-white/10 px-2.5 py-1 transition-colors"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => accept(s.id, isEditing ? editData : undefined)}
                      className="text-[10px] font-bold text-emerald-400 border border-emerald-400/30 hover:bg-emerald-400/10 px-3 py-1 transition-colors"
                    >
                      <i className="fa-solid fa-check mr-1 text-[9px]" />
                      Accept
                    </button>
                    <button
                      onClick={() => reject(s.id)}
                      className="text-[10px] text-red-400/70 hover:text-red-400 border border-red-400/20 hover:border-red-400/40 px-3 py-1 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>

                {/* Data fields */}
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(data).map(([key, val]) => (
                    <div key={key}>
                      <p className="text-[9px] font-bold text-slate-600 uppercase tracking-wider mb-0.5">{key.replace(/_/g, " ")}</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={(editData[key] as string) ?? ""}
                          onChange={(e) => setEditData((prev) => ({ ...prev, [key]: e.target.value || null }))}
                          className="w-full bg-navy-900 border border-white/10 px-2 py-1 text-xs text-white focus:outline-none focus:border-gold-500/30"
                        />
                      ) : (
                        <p className="text-xs text-slate-400">{val == null ? <span className="text-slate-700">—</span> : String(val)}</p>
                      )}
                    </div>
                  ))}
                </div>

                {s.source_context && (
                  <p className="text-[10px] text-slate-700 border-t border-white/5 pt-2">Brief: {s.source_context}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
