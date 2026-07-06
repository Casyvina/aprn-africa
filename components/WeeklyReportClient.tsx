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

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getMondayOfCurrentWeek(offsetWeeks = 0): string {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7) - offsetWeeks * 7);
  return monday.toISOString().slice(0, 10);
}

function getNextMonday(): string {
  const now = new Date();
  const day = now.getDay();
  // If today is Monday (1), use today; otherwise advance to next Monday
  const daysUntilMonday = day === 1 ? 0 : (8 - day) % 7 || 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() + daysUntilMonday);
  return monday.toISOString().slice(0, 10);
}

const DECK_SECTIONS = [
  { key: "priorities", title: "This Week's Priorities" },
  { key: "inProgress", title: "Work in Progress" },
  { key: "decisions", title: "Decisions & Discussion" },
  { key: "lookingAhead", title: "Looking Ahead" },
] as const;

type DeckSectionKey = typeof DECK_SECTIONS[number]["key"];

export default function WeeklyReportClient({ pastReports }: Props) {
  const now = new Date();
  const [mode, setMode] = useState<"weekly" | "monthly" | "deck">("weekly");

  // Weekly state
  const [offsetWeeks, setOffsetWeeks] = useState(0);

  // Monthly state
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  // Shared
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [content, setContent] = useState("");
  const [periodLabel, setPeriodLabel] = useState("");
  const [rawData, setRawData] = useState<unknown>(null);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [downloadingPptx, setDownloadingPptx] = useState(false);
  const [reports, setReports] = useState<PastReport[]>(pastReports);

  // Monday deck state
  const [deckDate, setDeckDate] = useState(getNextMonday());
  const [deckTheme, setDeckTheme] = useState("");
  const [deckSectionLines, setDeckSectionLines] = useState<Record<DeckSectionKey, string>>({
    priorities: "", inProgress: "", decisions: "", lookingAhead: "",
  });
  const [buildingDeck, setBuildingDeck] = useState(false);
  const [deckError, setDeckError] = useState("");

  const currentYear = now.getFullYear();
  const yearOptions = [currentYear - 1, currentYear, currentYear + 1];

  function resetOutput() {
    setContent("");
    setSent(false);
    setError("");
  }

  async function generate() {
    setGenerating(true);
    setError("");
    setContent("");
    setSent(false);
    try {
      const body =
        mode === "monthly"
          ? { mode: "month", year: selectedYear, month: selectedMonth }
          : { mode: "week", offsetWeeks };

      const res = await fetch("/api/admin/weekly-report/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to generate");
      setContent(json.content);
      setPeriodLabel(json.label);
      setRawData(json.rawData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setGenerating(false);
    }
  }

  async function downloadPresentation() {
    setDownloadingPptx(true);
    try {
      const res = await fetch("/api/admin/weekly-report/presentation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, periodLabel, mode }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error((json as { error?: string }).error ?? "Failed to generate presentation");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `APRN-Report-${periodLabel.replace(/[^a-zA-Z0-9]/g, "-")}.pptx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setDownloadingPptx(false);
    }
  }

  async function buildDeck() {
    setBuildingDeck(true);
    setDeckError("");
    try {
      const sections = DECK_SECTIONS.map((s) => ({
        title: s.title,
        lines: deckSectionLines[s.key],
      }));
      const res = await fetch("/api/admin/weekly-report/monday-deck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weekDate: deckDate, theme: deckTheme, sections }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error((json as { error?: string }).error ?? "Failed to build deck");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `APRN-Monday-${deckDate.replace(/-/g, "")}.pptx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setDeckError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setBuildingDeck(false);
    }
  }

  async function send() {
    setSending(true);
    setError("");
    try {
      const weekOf =
        mode === "monthly"
          ? new Date(selectedYear, selectedMonth, 1).toISOString().slice(0, 10)
          : getMondayOfCurrentWeek(offsetWeeks);

      const res = await fetch("/api/admin/weekly-report/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, weekLabel: periodLabel, weekOf, rawData, mode: mode === "monthly" ? "month" : "week" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to send");
      setSent(true);
      setReports((prev) => [
        {
          id: crypto.randomUUID(),
          week_of: weekOf,
          subject: mode === "monthly"
            ? `APRN Monthly Report — ${periodLabel}`
            : `APRN Weekly Report — ${periodLabel}`,
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

  const weekLabels = ["This week", "Last week", "2 weeks ago", "3 weeks ago"];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-1">Admin</p>
        <h1 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
          Reports
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Auto-generated from GitHub, Sanity, and Supabase — reviewed and sent to Lucy.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">

        {/* Main column */}
        <div className="space-y-5">

          {/* Mode tabs + period selector + generate */}
          <div className="bg-navy-800 border border-white/5 p-5 space-y-4">

            {/* Mode toggle */}
            <div>
              <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-3">Report Type</p>
              <div className="flex flex-wrap gap-2">
                {(["weekly", "monthly", "deck"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); resetOutput(); setDeckError(""); }}
                    className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                      mode === m
                        ? "bg-gold-500 text-navy-900"
                        : "border border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {m === "weekly" ? "Weekly" : m === "monthly" ? "Monthly" : "Monday Deck"}
                  </button>
                ))}
              </div>
            </div>

            {/* Period selector — weekly / monthly */}
            {mode !== "deck" && (
              <div>
                <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-3">
                  {mode === "weekly" ? "Report Period" : "Select Month"}
                </p>

                {mode === "weekly" ? (
                  <div className="flex flex-wrap gap-2">
                    {weekLabels.map((label, i) => (
                      <button
                        key={i}
                        onClick={() => { setOffsetWeeks(i); resetOutput(); }}
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
                ) : (
                  <div className="flex items-center gap-3">
                    <select
                      value={selectedMonth}
                      onChange={(e) => { setSelectedMonth(Number(e.target.value)); resetOutput(); }}
                      className="bg-navy-900 border border-white/10 text-white text-xs px-3 py-2 focus:border-gold-500/40 focus:outline-none"
                    >
                      {MONTHS.map((name, i) => (
                        <option key={i} value={i}>{name}</option>
                      ))}
                    </select>
                    <select
                      value={selectedYear}
                      onChange={(e) => { setSelectedYear(Number(e.target.value)); resetOutput(); }}
                      className="bg-navy-900 border border-white/10 text-white text-xs px-3 py-2 focus:border-gold-500/40 focus:outline-none"
                    >
                      {yearOptions.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    <span className="text-xs text-slate-500">
                      {MONTHS[selectedMonth]} {selectedYear}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Monday deck form */}
            {mode === "deck" && (
              <div className="space-y-5">
                {/* Week date + theme */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-2">
                      Meeting Date
                    </label>
                    <input
                      type="date"
                      value={deckDate}
                      onChange={(e) => setDeckDate(e.target.value)}
                      className="w-full bg-navy-900 border border-white/10 text-white text-xs px-3 py-2.5 focus:border-gold-500/40 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-2">
                      Meeting Theme <span className="text-slate-600 normal-case tracking-normal font-normal">optional</span>
                    </label>
                    <input
                      type="text"
                      value={deckTheme}
                      onChange={(e) => setDeckTheme(e.target.value)}
                      placeholder="e.g. Member Launch Preparation"
                      className="w-full bg-navy-900 border border-white/10 text-white text-xs px-3 py-2.5 placeholder-slate-600 focus:border-gold-500/40 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Section inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {DECK_SECTIONS.map((s) => (
                    <div key={s.key}>
                      <label className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-2">
                        {s.title}
                        <span className="ml-1.5 text-slate-700 normal-case tracking-normal font-normal">one item per line</span>
                      </label>
                      <textarea
                        value={deckSectionLines[s.key]}
                        onChange={(e) => setDeckSectionLines((prev) => ({ ...prev, [s.key]: e.target.value }))}
                        rows={5}
                        placeholder={`- item one\n- item two`}
                        className="w-full bg-navy-900 border border-white/10 text-slate-300 text-xs leading-relaxed p-3 resize-y focus:outline-none focus:border-gold-500/30 font-mono placeholder-slate-700"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generate / build buttons */}
            {mode !== "deck" ? (
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
                    Generate {mode === "monthly" ? "Monthly" : "Weekly"} Report
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={buildDeck}
                disabled={buildingDeck}
                className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed text-navy-900 font-bold uppercase tracking-widest text-xs px-5 py-2.5 transition-colors"
              >
                {buildingDeck ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin text-[11px]" />
                    Building deck…
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-file-powerpoint text-[11px]" />
                    Build &amp; Download Deck
                  </>
                )}
              </button>
            )}

            {error && (
              <p className="text-xs text-red-400 flex items-center gap-1.5">
                <i className="fa-solid fa-triangle-exclamation text-[11px]" />
                {error}
              </p>
            )}
            {deckError && (
              <p className="text-xs text-red-400 flex items-center gap-1.5">
                <i className="fa-solid fa-triangle-exclamation text-[11px]" />
                {deckError}
              </p>
            )}
          </div>

          {/* Generated report editor */}
          {content && mode !== "deck" && (
            <div className="bg-navy-800 border border-white/5 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Generated Report</p>
                  <p className="text-xs text-slate-400 mt-0.5">{periodLabel} · Edit before sending</p>
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

              <div className="flex flex-wrap items-center gap-3">
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

                <button
                  onClick={downloadPresentation}
                  disabled={downloadingPptx || !content.trim()}
                  className="flex items-center gap-2 border border-gold-500/30 text-gold-500 hover:bg-gold-500/10 disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-widest text-xs px-5 py-2.5 transition-colors"
                >
                  {downloadingPptx ? (
                    <>
                      <i className="fa-solid fa-circle-notch fa-spin text-[11px]" />
                      Building deck…
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-file-powerpoint text-[11px]" />
                      Download Deck
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!content && !generating && mode !== "deck" && (
            <div className="bg-navy-800 border border-white/5 p-10 text-center">
              <i className="fa-regular fa-newspaper text-3xl text-slate-700 mb-3" />
              <p className="text-sm text-slate-500">
                {mode === "monthly"
                  ? `Select a month and hit Generate to pull that month's full activity.`
                  : `Select a week and hit Generate to pull this week's activity.`}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-navy-800 border border-white/5 p-5">
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-4">Report Archive</p>
            {reports.length === 0 ? (
              <p className="text-xs text-slate-600">No reports sent yet.</p>
            ) : (
              <div className="space-y-2">
                {reports.map((r) => {
                  const isMonthlyReport = r.subject.includes("Monthly");
                  return (
                    <div key={r.id} className="p-3 border border-white/5 hover:border-gold-500/20 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-px border ${
                              isMonthlyReport
                                ? "text-blue-400 border-blue-400/20 bg-blue-400/5"
                                : "text-gold-500 border-gold-500/20 bg-gold-500/5"
                            }`}>
                              {isMonthlyReport ? "Monthly" : "Weekly"}
                            </span>
                          </div>
                          <p className="text-[11px] font-bold text-slate-300 truncate">
                            {new Date(r.week_of).toLocaleDateString("en-GB", {
                              day: isMonthlyReport ? undefined : "numeric",
                              month: "short",
                              year: "numeric",
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
                    </div>
                  );
                })}
              </div>
            )}
          </div>

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
