"use client";

import { useState } from "react";
import Link from "next/link";

// ── Types ────────────────────────────────────────────────────────────────────

interface Recipient {
  id: string;
  recipient_name: string;
  recipient_email: string | null;
  recipient_type: string;
  recipient_id: string;
  status: string;
  personalized_body: string | null;
  sent_at: string | null;
  opened_at: string | null;
  notes: string | null;
}

interface Campaign {
  id: string;
  name: string;
  goal: string;
  campaign_type: string;
  status: string;
  subject: string | null;
  body_template: string | null;
  created_at: string;
  sent_at: string | null;
  outreach_recipients: Recipient[];
}

interface ContactRow {
  id: string;
  email?: string | null;
  contact_email?: string | null;
  company_name?: string | null;
  full_name?: string | null;
  organisation?: string | null;
  contact_person?: string | null;
  country?: string | null;
  country_hq?: string | null;
  country_region?: string | null;
  location?: string | null;
}

interface Props {
  campaign: Campaign;
  operators: ContactRow[];
  contractors: ContactRow[];
  engineers: ContactRow[];
  regulators: ContactRow[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, { dot: string; label: string }> = {
  pending:  { dot: "bg-slate-500",   label: "Pending" },
  sent:     { dot: "bg-blue-400",    label: "Sent" },
  opened:   { dot: "bg-emerald-400", label: "Opened" },
  bounced:  { dot: "bg-red-400",     label: "Bounced" },
  replied:  { dot: "bg-gold-500",    label: "Replied" },
  no_email: { dot: "bg-slate-700",   label: "No Email" },
};

const TYPE_LABELS: Record<string, string> = {
  operator:    "Operator",
  contractor:  "EPC Contractor",
  engineer:    "Engineer",
  regulator:   "Regulator",
};

function contactsFromType(
  type: "operator" | "contractor" | "engineer" | "regulator",
  operators: ContactRow[], contractors: ContactRow[], engineers: ContactRow[], regulators: ContactRow[]
) {
  if (type === "operator")   return operators;
  if (type === "contractor") return contractors;
  if (type === "engineer")   return engineers;
  return regulators;
}

function recipientFrom(row: ContactRow, type: string) {
  const name = row.full_name ?? row.company_name ?? row.organisation ?? "Unknown";
  const email = row.email ?? row.contact_email ?? null;
  return { recipient_type: type, recipient_id: row.id, recipient_name: name, recipient_email: email };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CampaignDetailClient({ campaign, operators, contractors, engineers, regulators }: Props) {
  const [tab, setTab] = useState<"recipients" | "email" | "send" | "results">("recipients");
  const [recipients, setRecipients] = useState<Recipient[]>(campaign.outreach_recipients ?? []);
  const [subject, setSubject] = useState(campaign.subject ?? "");
  const [bodyTemplate, setBodyTemplate] = useState(campaign.body_template ?? "");
  const [campaignStatus, setCampaignStatus] = useState(campaign.status);

  // Recipient picker state
  const [addType, setAddType] = useState<"operator" | "contractor" | "engineer" | "regulator">("operator");
  const [search, setSearch] = useState("");
  const [addingRecipients, setAddingRecipients] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Email gen state
  const [generating, setGenerating] = useState(false);
  const [genMode, setGenMode] = useState<"general" | "personalized">(campaign.campaign_type === "personalized" ? "personalized" : "general");
  const [genError, setGenError] = useState("");

  // Send state
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ sent: number; failed: number; total: number } | null>(null);
  const [sendError, setSendError] = useState("");

  // Reply modal state
  const [replyModal, setReplyModal] = useState<{ id: string; name: string } | null>(null);
  const [replyNote, setReplyNote] = useState("");

  // ── Recipient picker ────────────────────────────────────────────────────────

  const sourceContacts = contactsFromType(addType, operators, contractors, engineers, regulators);
  const existingIds = new Set(recipients.map((r) => r.recipient_id));
  const filtered = sourceContacts.filter((c) => {
    const name = (c.full_name ?? c.company_name ?? c.organisation ?? "").toLowerCase();
    const country = (c.country ?? c.country_hq ?? c.country_region ?? c.location ?? "").toLowerCase();
    const q = search.toLowerCase();
    return !existingIds.has(c.id) && (name.includes(q) || country.includes(q));
  });

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function addSelected() {
    if (!selected.size) return;
    setAddingRecipients(true);
    const toAdd = sourceContacts
      .filter((c) => selected.has(c.id))
      .map((c) => recipientFrom(c, addType));

    const res = await fetch(`/api/admin/outreach/campaigns/${campaign.id}/recipients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipients: toAdd }),
    });
    const data = await res.json();
    setAddingRecipients(false);
    if (!res.ok) return;

    // Optimistic update — add pending rows
    const newRows = toAdd.map((r) => ({
      ...r,
      id: crypto.randomUUID(),
      status: r.recipient_email ? "pending" : "no_email",
      personalized_body: null,
      sent_at: null,
      opened_at: null,
      notes: null,
    })) as Recipient[];
    setRecipients((prev) => [...prev, ...newRows]);
    setSelected(new Set());
    if (data.skipped > 0) alert(`${data.skipped} already in campaign (skipped).`);
  }

  async function removeRecipient(id: string) {
    await fetch(`/api/admin/outreach/campaigns/${campaign.id}/recipients`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipient_row_id: id }),
    });
    setRecipients((prev) => prev.filter((r) => r.id !== id));
  }

  // ── Email generation ────────────────────────────────────────────────────────

  async function generateEmail() {
    setGenerating(true);
    setGenError("");
    const res = await fetch(`/api/admin/outreach/campaigns/${campaign.id}/generate-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: genMode }),
    });
    const data = await res.json();
    setGenerating(false);
    if (!res.ok) { setGenError(data.error ?? "Generation failed"); return; }
    setSubject(data.subject ?? "");
    setBodyTemplate(data.body ?? data.generated?.[0]?.body ?? "");
    if (data.generated) {
      setRecipients((prev) =>
        prev.map((r) => {
          const match = data.generated.find((g: { recipient_id: string; body: string }) => g.recipient_id === r.id);
          return match ? { ...r, personalized_body: match.body } : r;
        })
      );
    }
  }

  async function saveTemplate() {
    await fetch(`/api/admin/outreach/campaigns/${campaign.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, body_template: bodyTemplate, status: "ready" }),
    });
    setCampaignStatus("ready");
  }

  // ── Send ────────────────────────────────────────────────────────────────────

  async function handleSend() {
    setSending(true);
    setSendError("");
    const res = await fetch(`/api/admin/outreach/campaigns/${campaign.id}/send`, { method: "POST" });
    const data = await res.json();
    setSending(false);
    if (!res.ok) { setSendError(data.error ?? "Send failed"); return; }
    setSendResult(data);
    setCampaignStatus("sent");
    setRecipients((prev) =>
      prev.map((r) => {
        const match = data.results?.find((x: { id: string; status: string }) => x.id === r.id);
        return match ? { ...r, status: match.status, sent_at: new Date().toISOString() } : r;
      })
    );
    setTab("results");
  }

  // ── Reply tracking ──────────────────────────────────────────────────────────

  async function markReplied(id: string) {
    await fetch(`/api/admin/outreach/recipients/${id}/reply`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: replyNote }),
    });
    setRecipients((prev) => prev.map((r) => r.id === id ? { ...r, status: "replied", notes: replyNote } : r));
    setReplyModal(null);
    setReplyNote("");
  }

  // ── Stats ────────────────────────────────────────────────────────────────────

  const stats = {
    total:   recipients.length,
    pending: recipients.filter((r) => r.status === "pending").length,
    sent:    recipients.filter((r) => ["sent","opened","replied"].includes(r.status)).length,
    opened:  recipients.filter((r) => ["opened","replied"].includes(r.status)).length,
    replied: recipients.filter((r) => r.status === "replied").length,
    noEmail: recipients.filter((r) => r.status === "no_email").length,
  };

  const TABS = [
    { key: "recipients", label: "Recipients", icon: "fa-users", count: stats.total },
    { key: "email",      label: "Email",      icon: "fa-envelope" },
    { key: "send",       label: "Send",       icon: "fa-paper-plane" },
    { key: "results",    label: "Results",    icon: "fa-chart-simple", count: stats.sent },
  ] as const;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Link href="/admin/outreach" className="text-slate-500 hover:text-gold-500 transition-colors text-xs">← Outreach</Link>
          <span className="text-slate-700 text-xs">/</span>
          <span className="text-slate-400 text-xs truncate">{campaign.name}</span>
        </div>
        <div className="flex items-start justify-between gap-4 mt-3">
          <div>
            <h1 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
              {campaign.name}
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">{campaign.goal}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-[10px] font-bold px-2.5 py-1 border ${
              campaignStatus === "sent" ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" :
              campaignStatus === "ready" ? "bg-blue-400/10 text-blue-400 border-blue-400/20" :
              "bg-slate-500/10 text-slate-400 border-slate-500/20"
            }`}>
              {campaignStatus.toUpperCase()}
            </span>
            <span className="text-[10px] text-slate-600 uppercase tracking-wider">{campaign.campaign_type}</span>
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex gap-6 mt-4">
          {[
            { label: "Recipients", value: stats.total },
            { label: "Sent", value: stats.sent },
            { label: "Opened", value: stats.opened },
            { label: "Replied", value: stats.replied },
            { label: "No Email", value: stats.noEmail },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-base font-bold text-white">{s.value}</p>
              <p className="text-[10px] text-slate-600 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider border-b-2 -mb-px transition-colors ${
              tab === t.key ? "border-gold-500 text-gold-400" : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            <i className={`fa-solid ${t.icon} text-[9px]`} />
            {t.label}
            {"count" in t && t.count !== undefined && (
              <span className="ml-1 text-[9px] bg-white/5 px-1.5 py-0.5">{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab: Recipients ──────────────────────────────────────────────────── */}
      {tab === "recipients" && (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">

          {/* Recipient list */}
          <div className="space-y-2">
            {recipients.length === 0 ? (
              <div className="bg-navy-800 border border-white/5 p-10 text-center">
                <i className="fa-solid fa-users text-3xl text-slate-700 mb-3" />
                <p className="text-sm text-slate-500">No recipients yet. Add contacts from the panel on the right.</p>
              </div>
            ) : (
              recipients.map((r) => {
                const s = STATUS_STYLE[r.status] ?? STATUS_STYLE.pending;
                return (
                  <div key={r.id} className="flex items-center justify-between gap-3 bg-navy-800 border border-white/5 px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-2 h-2 shrink-0 ${s.dot}`} />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{r.recipient_name}</p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {r.recipient_email ?? "No email"} · {TYPE_LABELS[r.recipient_type] ?? r.recipient_type}
                        </p>
                        {r.notes && <p className="text-[10px] text-slate-600 mt-0.5 truncate">Note: {r.notes}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-500">{s.label}</span>
                      {(r.status === "sent" || r.status === "opened") && (
                        <button
                          onClick={() => { setReplyModal({ id: r.id, name: r.recipient_name }); setReplyNote(""); }}
                          className="text-[10px] text-gold-500/70 hover:text-gold-500 transition-colors px-2 py-1 border border-gold-500/20 hover:border-gold-500/40"
                        >
                          Mark replied
                        </button>
                      )}
                      {r.status === "pending" && (
                        <button
                          onClick={() => removeRecipient(r.id)}
                          className="text-slate-700 hover:text-red-400 transition-colors"
                          title="Remove"
                        >
                          <i className="fa-solid fa-xmark text-[10px]" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Add contacts panel */}
          <div className="bg-navy-800 border border-white/5 p-5 space-y-4">
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Add Contacts</p>

            <div className="flex gap-1 flex-wrap">
              {(["operator","contractor","engineer","regulator"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setAddType(t); setSearch(""); setSelected(new Set()); }}
                  className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    addType === t ? "bg-gold-500/10 text-gold-400 border border-gold-500/30" : "border border-white/5 text-slate-500 hover:text-white"
                  }`}
                >
                  {TYPE_LABELS[t]}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or country…"
              className="w-full bg-navy-900 border border-white/10 px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/30"
            />

            <div className="space-y-1 max-h-64 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-xs text-slate-600 py-4 text-center">
                  {search ? "No matches" : "All added already"}
                </p>
              ) : (
                filtered.slice(0, 50).map((c) => {
                  const name = c.full_name ?? c.company_name ?? c.organisation ?? "Unknown";
                  const loc = c.country ?? c.country_hq ?? c.country_region ?? c.location ?? "";
                  const email = c.email ?? c.contact_email;
                  return (
                    <button
                      key={c.id}
                      onClick={() => toggleSelect(c.id)}
                      className={`w-full text-left px-3 py-2 transition-colors ${
                        selected.has(c.id) ? "bg-gold-500/10 border border-gold-500/30" : "border border-transparent hover:bg-white/2"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs text-white truncate">{name}</p>
                          <p className="text-[10px] text-slate-600 truncate">{loc}{loc && email ? " · " : ""}{email ?? "no email"}</p>
                        </div>
                        {selected.has(c.id) && <i className="fa-solid fa-check text-gold-500 text-[10px] shrink-0" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <button
              onClick={addSelected}
              disabled={!selected.size || addingRecipients}
              className="w-full py-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-40 text-navy-900 font-bold uppercase tracking-widest text-[10px] transition-colors"
            >
              {addingRecipients ? "Adding…" : `Add ${selected.size || ""} Selected`}
            </button>
          </div>
        </div>
      )}

      {/* ── Tab: Email ───────────────────────────────────────────────────────── */}
      {tab === "email" && (
        <div className="space-y-5 max-w-3xl">
          <div className="bg-navy-800 border border-white/5 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Email Content</p>
                <p className="text-xs text-slate-600 mt-0.5">Use <code className="text-gold-500">{"{{first_name}}"}</code> as a merge tag.</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={genMode}
                  onChange={(e) => setGenMode(e.target.value as "general" | "personalized")}
                  className="bg-navy-900 border border-white/10 text-xs text-white px-3 py-1.5 focus:outline-none"
                >
                  <option value="general">General</option>
                  <option value="personalized">Personalized</option>
                </select>
                <button
                  onClick={generateEmail}
                  disabled={generating || !recipients.length}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-navy-900 font-bold uppercase tracking-widest text-[10px] transition-colors"
                >
                  {generating ? <><i className="fa-solid fa-circle-notch fa-spin text-[9px]" /> Writing…</> : <><i className="fa-solid fa-wand-magic-sparkles text-[9px]" /> Generate</>}
                </button>
              </div>
            </div>

            {genMode === "personalized" && (
              <div className="flex items-start gap-2 bg-amber-400/5 border border-amber-400/20 px-3 py-2.5">
                <i className="fa-solid fa-circle-info text-amber-400 text-[10px] mt-0.5 shrink-0" />
                <p className="text-xs text-amber-400/90">
                  Personalized mode writes a unique email per recipient — uses Claude Opus, takes ~30 seconds for large lists.
                </p>
              </div>
            )}

            {genError && <p className="text-xs text-red-400">{genError}</p>}

            <div>
              <label className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-1.5">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-navy-900 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/30"
                placeholder="Email subject line…"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-1.5">
                Body {genMode === "general" ? "(template — applies to all)" : "(preview of first recipient)"}
              </label>
              <textarea
                value={bodyTemplate}
                onChange={(e) => setBodyTemplate(e.target.value)}
                rows={16}
                className="w-full bg-navy-900 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/30 resize-y font-mono leading-relaxed"
                placeholder="Email body…"
              />
            </div>

            <button
              onClick={saveTemplate}
              disabled={!subject.trim() || !bodyTemplate.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-navy-900 font-bold uppercase tracking-widest text-xs transition-colors"
            >
              <i className="fa-solid fa-floppy-disk text-[10px]" />
              Save & Mark Ready
            </button>
          </div>

          {/* Personalized preview list */}
          {genMode === "personalized" && recipients.some((r) => r.personalized_body) && (
            <div className="bg-navy-800 border border-white/5 p-5 space-y-3">
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Personalized Drafts</p>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recipients.filter((r) => r.personalized_body).map((r) => (
                  <div key={r.id} className="border border-white/5 p-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{r.recipient_name}</p>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-4">{r.personalized_body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Send ────────────────────────────────────────────────────────── */}
      {tab === "send" && (
        <div className="space-y-5 max-w-xl">
          {!subject || !bodyTemplate ? (
            <div className="bg-amber-400/5 border border-amber-400/20 p-5">
              <p className="text-sm font-semibold text-amber-400 mb-1">Email not ready</p>
              <p className="text-xs text-amber-400/80">Go to the Email tab, generate or write the email, and save it first.</p>
            </div>
          ) : (
            <div className="bg-navy-800 border border-white/5 p-6 space-y-5">
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Send Confirmation</p>

              <div className="space-y-2">
                {[
                  { label: "Subject", value: subject },
                  { label: "Sendable recipients", value: `${stats.pending} of ${stats.total} (${stats.noEmail} have no email)` },
                  { label: "Mode", value: campaign.campaign_type },
                  { label: "From", value: "Joseph Agwuh — APRN Africa <info@aprn-africa.org>" },
                ].map((row) => (
                  <div key={row.label} className="flex gap-4">
                    <span className="text-[10px] font-bold text-slate-600 uppercase w-32 shrink-0 mt-0.5">{row.label}</span>
                    <span className="text-xs text-slate-300">{row.value}</span>
                  </div>
                ))}
              </div>

              {stats.pending > 50 && (
                <div className="flex items-start gap-2 bg-amber-400/5 border border-amber-400/20 px-3 py-2.5">
                  <i className="fa-solid fa-circle-info text-amber-400 text-[10px] mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-400/90">
                    Only the first 50 pending recipients will be sent in this run. Come back and send again for the rest.
                  </p>
                </div>
              )}

              {sendResult && (
                <div className="bg-emerald-400/5 border border-emerald-400/20 p-4">
                  <p className="text-sm font-bold text-emerald-400">
                    Sent {sendResult.sent} / {sendResult.total}
                    {sendResult.failed > 0 && <span className="text-red-400 ml-2">· {sendResult.failed} failed</span>}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Check the Results tab for per-recipient status.</p>
                </div>
              )}

              {sendError && <p className="text-xs text-red-400">{sendError}</p>}

              {!sendResult && (
                <button
                  onClick={handleSend}
                  disabled={sending || stats.pending === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-navy-900 font-bold uppercase tracking-widest text-xs transition-colors"
                >
                  {sending ? (
                    <><i className="fa-solid fa-circle-notch fa-spin text-[10px]" /> Sending…</>
                  ) : (
                    <><i className="fa-solid fa-paper-plane text-[10px]" /> Send to {stats.pending} recipients</>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Results ─────────────────────────────────────────────────────── */}
      {tab === "results" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Sent", value: stats.sent, color: "text-blue-400" },
              { label: "Opened", value: stats.opened, color: "text-emerald-400" },
              { label: "Replied", value: stats.replied, color: "text-gold-500" },
              { label: "Bounced", value: recipients.filter((r) => r.status === "bounced").length, color: "text-red-400" },
            ].map((s) => (
              <div key={s.label} className="bg-navy-800 border border-white/5 p-4">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-1">
            {recipients.filter((r) => r.status !== "pending" && r.status !== "no_email").map((r) => {
              const s = STATUS_STYLE[r.status] ?? STATUS_STYLE.pending;
              return (
                <div key={r.id} className="flex items-center justify-between gap-3 bg-navy-800 border border-white/5 px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-2 h-2 shrink-0 ${s.dot}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{r.recipient_name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{r.recipient_email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] text-slate-500">{s.label}</span>
                    {r.opened_at && (
                      <span className="text-[10px] text-emerald-400/70">
                        opened {new Date(r.opened_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </span>
                    )}
                    {r.notes && <span className="text-[10px] text-slate-600 max-w-xs truncate">{r.notes}</span>}
                    {(r.status === "sent" || r.status === "opened") && (
                      <button
                        onClick={() => { setReplyModal({ id: r.id, name: r.recipient_name }); setReplyNote(""); }}
                        className="text-[10px] text-gold-500/70 hover:text-gold-500 px-2 py-1 border border-gold-500/20 hover:border-gold-500/40 transition-colors"
                      >
                        Mark replied
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {recipients.filter((r) => r.status !== "pending" && r.status !== "no_email").length === 0 && (
              <p className="text-xs text-slate-600 py-6 text-center">No emails sent yet — go to the Send tab.</p>
            )}
          </div>
        </div>
      )}

      {/* ── Reply modal ──────────────────────────────────────────────────────── */}
      {replyModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-navy-800 border border-white/10 w-full max-w-md p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Mark Replied — {replyModal.name}</h3>
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-1.5">
                Note (optional)
              </label>
              <textarea
                value={replyNote}
                onChange={(e) => setReplyNote(e.target.value)}
                rows={3}
                placeholder="What did they say? Any follow-up needed?"
                className="w-full bg-navy-900 border border-white/10 px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/30 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => markReplied(replyModal.id)}
                className="px-4 py-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold uppercase tracking-widest text-xs transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setReplyModal(null)}
                className="px-4 py-2 border border-white/10 text-xs text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
