"use client";

import { useState } from "react";
import Link from "next/link";

type IssueStatus = "draft" | "review" | "approved" | "sent";

interface NewsletterRow {
  _id: string;
  slug: string;
  title: string;
  volume: number;
  issueNumber: number;
  publishDate: string;
  status: IssueStatus;
  sentAt?: string;
  recipientCount?: number;
  storyCount: number;
}

interface Props {
  issues: NewsletterRow[];
  subscriberCount: number;
}

const STATUS_STYLE: Record<IssueStatus, string> = {
  draft:    "text-slate-400 bg-slate-400/10 border-slate-400/20",
  review:   "text-gold-500 bg-gold-500/10 border-gold-500/20",
  approved: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  sent:     "text-blue-400 bg-blue-400/10 border-blue-400/20",
};

const STATUS_LABEL: Record<IssueStatus, string> = {
  draft:    "Draft",
  review:   "Under Review",
  approved: "Approved",
  sent:     "Sent",
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function NewsletterDistributionClient({ issues, subscriberCount }: Props) {
  const [rows, setRows] = useState<NewsletterRow[]>(issues);
  const [sending, setSending] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [result, setResult] = useState<{ id: string; sent: number; testOnly: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalSent    = rows.filter((r) => r.status === "sent").length;
  const totalApproved = rows.filter((r) => r.status === "approved").length;

  async function send(issueId: string, testOnly: boolean) {
    setSending(issueId + (testOnly ? ":test" : ":full"));
    setError(null);
    setResult(null);
    setConfirmId(null);
    try {
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueId, testOnly }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Send failed");
      setResult({ id: issueId, sent: json.sent, testOnly });
      if (!testOnly) {
        setRows((prev) =>
          prev.map((r) =>
            r._id === issueId
              ? { ...r, status: "sent", sentAt: new Date().toISOString(), recipientCount: json.sent }
              : r,
          ),
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSending(null);
    }
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-1">Admin · Content</p>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
            Newsletter Distribution
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Control which issues get sent, to whom, and when. Test before blasting.
          </p>
        </div>
        <Link
          href="/studio/structure/newsletter"
          className="flex items-center gap-2 px-4 py-2.5 border border-white/10 hover:border-gold-500/30 text-slate-400 hover:text-gold-500 text-xs font-bold uppercase tracking-widest transition-colors"
        >
          <i className="fa-solid fa-pen-nib text-[10px]" />
          Edit in Studio
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Active Subscribers", value: subscriberCount, icon: "fa-users", highlight: true },
          { label: "Ready to Send",      value: totalApproved,   icon: "fa-circle-check", color: "text-emerald-400" },
          { label: "Issues Sent",        value: totalSent,       icon: "fa-paper-plane",  color: "text-blue-400" },
          { label: "Total Issues",       value: rows.length,     icon: "fa-newspaper",    color: "text-slate-400" },
        ].map((s) => (
          <div key={s.label} className="bg-navy-800 border border-white/5 p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-navy-900 border border-white/5 flex items-center justify-center shrink-0">
              <i className={`fa-solid ${s.icon} text-xs ${s.highlight ? "text-gold-500" : (s.color ?? "text-slate-500")}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-white leading-none" style={{ fontFamily: "var(--font-playfair), serif" }}>
                {s.value}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Workflow guide */}
      <div className="bg-navy-800 border border-white/5 p-5 flex flex-col sm:flex-row items-start gap-5">
        <div className="w-8 h-8 bg-navy-900 border border-white/5 flex items-center justify-center shrink-0 mt-0.5">
          <i className="fa-solid fa-circle-info text-gold-500/60 text-xs" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-white mb-2">How distribution works</p>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
            {["Create in Studio (Claude or Tokunbo)", "Set status → Approved", "Test Send → check your inbox", "Send to All Subscribers"].map((step, i, arr) => (
              <span key={step} className="flex items-center gap-2">
                <span className="bg-navy-900 border border-white/5 px-2 py-0.5 text-[10px] font-bold text-gold-500">{i + 1}</span>
                {step}
                {i < arr.length - 1 && <i className="fa-solid fa-arrow-right text-[9px] text-white/20" />}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Result / Error banner */}
      {result && (
        <div className={`border p-4 flex items-center gap-3 text-sm ${
          result.testOnly
            ? "bg-gold-500/5 border-gold-500/20 text-gold-400"
            : "bg-emerald-400/5 border-emerald-400/20 text-emerald-400"
        }`}>
          <i className={`fa-solid ${result.testOnly ? "fa-flask" : "fa-check-circle"} text-[13px] shrink-0`} />
          {result.testOnly
            ? `Test email sent to ${result.sent} admin address${result.sent !== 1 ? "es" : ""}. Check your inbox before the full send.`
            : `Sent to ${result.sent} subscriber${result.sent !== 1 ? "s" : ""}. Issue marked as sent.`}
          <button onClick={() => setResult(null)} className="ml-auto text-current/40 hover:text-current transition-colors">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 flex items-center gap-3 text-sm text-red-400">
          <i className="fa-solid fa-triangle-exclamation text-[13px] shrink-0" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-400/40 hover:text-red-400 transition-colors">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      )}

      {/* Issue table */}
      {rows.length === 0 ? (
        <div className="bg-navy-800 border border-white/5 border-dashed p-12 flex flex-col items-center gap-3 text-center">
          <i className="fa-regular fa-newspaper text-slate-700 text-3xl" />
          <p className="text-sm font-semibold text-slate-400">No newsletter issues yet</p>
          <p className="text-xs text-slate-600">Create one in Sanity Studio, then come back here to send it.</p>
          <Link href="/studio" className="mt-2 text-xs text-gold-500 hover:text-gold-400 transition-colors">
            Open Studio →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((issue) => {
            const issueLabel = `Vol. ${issue.volume}, Issue ${String(issue.issueNumber).padStart(3, "0")}`;
            const isSendingTest = sending === issue._id + ":test";
            const isSendingFull = sending === issue._id + ":full";
            const isBusy       = isSendingTest || isSendingFull;
            const isConfirming  = confirmId === issue._id;

            return (
              <div
                key={issue._id}
                className={`bg-navy-800 border p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-colors ${
                  issue.status === "approved"
                    ? "border-emerald-400/10 hover:border-emerald-400/20"
                    : "border-white/5"
                }`}
              >
                {/* Issue info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border ${STATUS_STYLE[issue.status ?? "draft"]}`}>
                      {STATUS_LABEL[issue.status ?? "draft"]}
                    </span>
                    <span className="text-[10px] text-slate-500">{issueLabel}</span>
                    {issue.storyCount > 0 && (
                      <span className="text-[10px] text-slate-600">{issue.storyCount} stories</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-white leading-snug">{issue.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500 flex-wrap">
                    <span>{fmtDate(issue.publishDate)}</span>
                    {issue.status === "sent" && issue.sentAt && (
                      <span className="flex items-center gap-1 text-blue-400/70">
                        <i className="fa-solid fa-paper-plane text-[9px]" />
                        Sent {fmtDate(issue.sentAt)} · {issue.recipientCount ?? 0} recipients
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  {issue.status === "approved" && !isConfirming && (
                    <>
                      <button
                        onClick={() => send(issue._id, true)}
                        disabled={isBusy}
                        className="flex items-center gap-1.5 px-3 py-2 border border-white/10 hover:border-gold-500/30 text-slate-400 hover:text-gold-500 text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                      >
                        {isSendingTest
                          ? <><i className="fa-solid fa-circle-notch fa-spin text-[9px]" />Sending…</>
                          : <><i className="fa-solid fa-flask text-[9px]" />Test Send</>}
                      </button>
                      <button
                        onClick={() => setConfirmId(issue._id)}
                        disabled={isBusy}
                        className="flex items-center gap-1.5 px-3 py-2 bg-gold-500 hover:bg-gold-400 text-navy-900 text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                      >
                        <i className="fa-solid fa-paper-plane text-[9px]" />
                        Send to {subscriberCount} subscribers
                      </button>
                    </>
                  )}

                  {/* Inline confirm */}
                  {issue.status === "approved" && isConfirming && (
                    <div className="flex items-center gap-2 bg-navy-900 border border-white/10 px-3 py-2">
                      <span className="text-[10px] text-slate-300">
                        Send to all {subscriberCount} subscribers?
                      </span>
                      <button
                        onClick={() => send(issue._id, false)}
                        disabled={isBusy}
                        className="px-2 py-1 bg-gold-500 hover:bg-gold-400 text-navy-900 text-[9px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                      >
                        {isSendingFull
                          ? <i className="fa-solid fa-circle-notch fa-spin" />
                          : "Confirm"}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="px-2 py-1 border border-white/10 text-slate-400 hover:text-white text-[9px] font-bold uppercase tracking-widest transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {issue.status === "sent" && (
                    <span className="flex items-center gap-1.5 text-[10px] text-blue-400 font-semibold">
                      <i className="fa-solid fa-check-circle text-[9px]" />
                      Delivered
                    </span>
                  )}

                  {(issue.status === "draft" || issue.status === "review") && (
                    <Link
                      href={`/studio/structure/newsletter;${issue._id}`}
                      className="flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-white border border-white/10 hover:border-white/20 px-3 py-2 transition-colors font-bold uppercase tracking-widest"
                    >
                      <i className="fa-solid fa-pen text-[9px]" />
                      Edit in Studio
                    </Link>
                  )}

                  <Link
                    href={`/newsletter/${issue.slug}`}
                    target="_blank"
                    className="w-8 h-8 flex items-center justify-center border border-white/5 hover:border-white/20 text-slate-500 hover:text-white transition-colors"
                    title="Preview online"
                  >
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
