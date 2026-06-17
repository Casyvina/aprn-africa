"use client";

import { useState } from "react";

interface PastReport {
  id: string;
  week_of: string;
  subject: string;
  sent_at: string | null;
  sent_by: string | null;
  created_at: string | null;
}

interface Props {
  pastReports: PastReport[];
}

function getMondayOfCurrentWeek(offsetWeeks = 0): string {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7) - offsetWeeks * 7);
  return monday.toISOString().slice(0, 10);
}

export default function WeeklyReportClient({ pastReports }: Props) {
  const [offsetWeeks, setOffsetWeeks] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [content, setContent] = useState("");
  const [weekLabel, setWeekLabel] = useState("");
  const [rawData, setRawData] = useState<unknown>(null);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [reports, setReports] = useState<PastReport[]>(pastReports);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  async function generate() {
    setGenerating(true);
    setError("");
    setContent("");
    setSent(false);
    try {
      const res = await fetch("/api/admin/weekly-report/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offsetWeeks }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to generate");
      setContent(json.content);
      setWeekLabel(json.label);
      setRawData(json.rawData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setGenerating(false);
    }
  }

  async function send() {
    setSending(true);
    setError("");
    try {
      const weekOf = getMondayOfCurrentWeek(offsetWeeks);
      const res = await fetch("/api/admin/weekly-report/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, weekLabel, weekOf, rawData }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to send");
      setSent(true);
      // Prepend to local list
      setReports((prev) => [
        {
          id: crypto.randomUUID(),
          week_of: weekOf,
          subject: `APRN Weekly Report — ${weekLabel}`,
          sent_at: new Date().toISOString(),
          sent_by: "you",
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSending(false);
    }
  }

  const weekLabels = [
    "This week",
    "Last week",
    "2 weeks ago",
    "3 weeks ago",
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-1">Admin</p>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
            Weekly Report
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Auto-generated from GitHub, Sanity, and Supabase — reviewed and sent to Lucy every Monday.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">

        {/* Main column */}
        <div className="space-y-5">

          {/* Week selector + generate */}
          <div className="bg-navy-800 border border-white/5 p-5">
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-3">Report Period</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {weekLabels.map((label, i) => (
                <button
                  key={i}
                  onClick={() => { setOffsetWeeks(i); setContent(""); setSent(false); }}
                  className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                    offsetWeeks === i
                      ? "bg-gold-500 text-navy-900"
                      : "border border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={generate}
              disabled={generating}
              className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed text-navy-900 font-bold uppercase tracking-widest text-xs px-5 py-2.5 transition-colors"
            >
              {generating ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin text-[11px]" />
                  Pulling data & generating…
                </>
              ) : (
                <>
                  <i className="fa-solid fa-bolt text-[11px]" />
                  Generate Report
                </>
              )}
            </button>
            {error && (
              <p className="mt-3 text-xs text-red-400 flex items-center gap-1.5">
                <i className="fa-solid fa-triangle-exclamation text-[11px]" />
                {error}
              </p>
            )}
          </div>

          {/* Generated report editor */}
          {content && (
            <div className="bg-navy-800 border border-white/5 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Generated Report</p>
                  <p className="text-xs text-slate-400 mt-0.5">{weekLabel} · Edit before sending</p>
                </div>
                {sent && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <i className="fa-solid fa-check-circle text-[11px]" />
                    Sent to Lucy
                  </span>
                )}
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={24}
                className="w-full bg-navy-900 border border-white/5 text-slate-300 text-xs leading-relaxed p-4 resize-y focus:outline-none focus:border-gold-500/30 font-mono"
                placeholder="Report content will appear here…"
              />

              {!sent && (
                <button
                  onClick={send}
                  disabled={sending || !content.trim()}
                  className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed text-navy-900 font-bold uppercase tracking-widest text-xs px-5 py-2.5 transition-colors"
                >
                  {sending ? (
                    <>
                      <i className="fa-solid fa-circle-notch fa-spin text-[11px]" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane text-[11px]" />
                      Send to Lucy
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Empty state */}
          {!content && !generating && (
            <div className="bg-navy-800 border border-white/5 p-10 text-center">
              <i className="fa-regular fa-newspaper text-3xl text-slate-700 mb-3" />
              <p className="text-sm text-slate-500">Select a week and hit Generate to pull this week's activity.</p>
            </div>
          )}
        </div>

        {/* Sidebar — past reports */}
        <div className="space-y-4">
          <div className="bg-navy-800 border border-white/5 p-5">
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-4">Report Archive</p>
            {reports.length === 0 ? (
              <p className="text-xs text-slate-600">No reports sent yet.</p>
            ) : (
              <div className="space-y-2">
                {reports.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedReport(selectedReport === r.id ? null : r.id)}
                    className="w-full text-left p-3 border border-white/5 hover:border-gold-500/20 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-slate-300 group-hover:text-white transition-colors truncate">
                          {new Date(r.week_of).toLocaleDateString("en-GB", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </p>
                        <p className="text-[10px] text-slate-600 mt-0.5">
                          {r.sent_at
                            ? `Sent ${new Date(r.sent_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`
                            : "Draft"}
                        </p>
                      </div>
                      {r.sent_at ? (
                        <i className="fa-solid fa-check-circle text-emerald-500 text-[11px] mt-0.5 shrink-0" />
                      ) : (
                        <i className="fa-solid fa-clock text-slate-600 text-[11px] mt-0.5 shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* What gets pulled info box */}
          <div className="bg-navy-800 border border-white/5 p-5">
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-3">Data Sources</p>
            <ul className="space-y-2">
              {[
                { icon: "fa-code-branch", label: "GitHub commits", note: "Needs GITHUB_TOKEN" },
                { icon: "fa-pen-nib", label: "Sanity CMS activity", note: "Published docs" },
                { icon: "fa-users", label: "New members", note: "Supabase profiles" },
                { icon: "fa-credit-card", label: "Payments", note: "Supabase payments" },
                { icon: "fa-database", label: "Database additions", note: "All 5 tables" },
              ].map((s) => (
                <li key={s.label} className="flex items-start gap-2.5">
                  <i className={`fa-solid ${s.icon} text-gold-500 text-[10px] mt-0.5 w-3 text-center shrink-0`} />
                  <div>
                    <p className="text-[11px] text-slate-300">{s.label}</p>
                    <p className="text-[10px] text-slate-600">{s.note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
