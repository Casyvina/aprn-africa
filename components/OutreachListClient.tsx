"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Campaign {
  id: string;
  name: string;
  goal: string;
  campaign_type: string;
  status: string;
  created_at: string;
  sent_at: string | null;
  outreach_recipients: { count: number }[];
}

interface Props {
  initialCampaigns: Campaign[];
}

const STATUS_STYLE: Record<string, string> = {
  draft:   "bg-slate-500/10 text-slate-400 border-slate-500/20",
  ready:   "bg-blue-400/10 text-blue-400 border-blue-400/20",
  sending: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  sent:    "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
};

export default function OutreachListClient({ initialCampaigns }: Props) {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [campaignType, setCampaignType] = useState<"general" | "personalized">("general");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate() {
    if (!name.trim() || !goal.trim()) { setError("Name and goal are required."); return; }
    setCreating(true);
    setError("");
    const res = await fetch("/api/admin/outreach/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, goal, campaign_type: campaignType }),
    });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) { setError(data.error ?? "Failed to create"); return; }
    router.push(`/admin/outreach/${data.id}`);
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.preventDefault();
    if (!confirm("Delete this campaign? This cannot be undone.")) return;
    await fetch(`/api/admin/outreach/campaigns/${id}`, { method: "DELETE" });
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-1">Admin</p>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
            Outreach
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            AI-assisted campaigns for engineers, contractors, operators, and regulators.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/outreach/research"
            className="flex items-center gap-2 px-4 py-2.5 border border-white/10 text-xs text-slate-400 hover:text-white hover:border-white/20 transition-colors"
          >
            <i className="fa-solid fa-robot text-[10px]" />
            AI Research
          </Link>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold uppercase tracking-widest text-xs transition-colors"
          >
            <i className="fa-solid fa-plus text-[10px]" />
            New Campaign
          </button>
        </div>
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-navy-800 border border-white/10 w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">New Campaign</h2>
              <button onClick={() => { setShowCreate(false); setError(""); }} className="text-slate-500 hover:text-white">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1.5">
                  Campaign Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. APLS Conference 2026 Invitations"
                  className="w-full bg-navy-900 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/40"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1.5">
                  Goal / Purpose <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  rows={3}
                  placeholder="e.g. Invite EPC contractors and pipeline operators to register for the APLS 2026 conference in Lagos"
                  className="w-full bg-navy-900 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/40 resize-none"
                />
                <p className="text-[10px] text-slate-600 mt-1">Claude uses this to generate the email content.</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">
                  Email Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["general", "personalized"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setCampaignType(t)}
                      className={`p-3 border text-left transition-colors ${
                        campaignType === t
                          ? "bg-gold-500/10 border-gold-500/40"
                          : "border-white/5 hover:border-white/10"
                      }`}
                    >
                      <p className={`text-xs font-bold capitalize ${campaignType === t ? "text-gold-400" : "text-white"}`}>{t}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {t === "general" ? "Same email, merge first name" : "AI writes a unique opener per recipient"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 flex items-center gap-1.5">
                <i className="fa-solid fa-triangle-exclamation text-[10px]" />
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                onClick={handleCreate}
                disabled={creating}
                className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-navy-900 font-bold uppercase tracking-widest text-xs transition-colors"
              >
                {creating ? <><i className="fa-solid fa-circle-notch fa-spin text-[10px]" /> Creating…</> : "Create Campaign"}
              </button>
              <button onClick={() => { setShowCreate(false); setError(""); }} className="px-4 py-2.5 border border-white/10 text-xs text-slate-400 hover:text-white transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign list */}
      {campaigns.length === 0 ? (
        <div className="bg-navy-800 border border-white/5 p-12 text-center">
          <i className="fa-regular fa-paper-plane text-3xl text-slate-700 mb-3" />
          <p className="text-sm text-slate-500">No campaigns yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {campaigns.map((c) => {
            const recipientCount = c.outreach_recipients?.[0]?.count ?? 0;
            return (
              <Link
                key={c.id}
                href={`/admin/outreach/${c.id}`}
                className="flex items-center justify-between gap-4 bg-navy-800 border border-white/5 hover:border-gold-500/20 p-4 transition-colors group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 border ${STATUS_STYLE[c.status] ?? STATUS_STYLE.draft}`}>
                      {c.status.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-600 uppercase tracking-wider">{c.campaign_type}</span>
                  </div>
                  <p className="text-sm font-semibold text-white group-hover:text-gold-400 transition-colors truncate">
                    {c.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{c.goal}</p>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-white">{recipientCount}</p>
                    <p className="text-[10px] text-slate-600">recipients</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-slate-400">
                      {new Date(c.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    {c.sent_at && (
                      <p className="text-[10px] text-emerald-400">
                        Sent {new Date(c.sent_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleDelete(c.id, e)}
                    className="text-slate-700 hover:text-red-400 transition-colors text-xs p-1"
                    title="Delete campaign"
                  >
                    <i className="fa-solid fa-trash-can" />
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
