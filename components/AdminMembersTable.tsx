"use client";

import { useState, useMemo } from "react";

const TIERS = ["all", "free", "student", "graduate", "professional", "associate", "corporate"] as const;

// Computed at module load — stable reference, no impure call during render
const MONTH_AGO = Date.now() - 30 * 24 * 60 * 60 * 1000;

const TIER_BADGE: Record<string, string> = {
  free:         "bg-navy-900 text-slate-400 border-white/10",
  student:      "bg-blue-400/10 text-blue-400 border-blue-400/20",
  graduate:     "bg-teal-400/10 text-teal-400 border-teal-400/20",
  professional: "bg-gold-500/10 text-gold-500 border-gold-500/20",
  associate:    "bg-violet-400/10 text-violet-400 border-violet-400/20",
  corporate:    "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
};

export interface Member {
  id:           string;
  email:        string;
  fullName:     string;
  tier:         string;
  country:      string;
  discipline:   string;
  organisation: string;
  topics:       string[];
  joinedAt:     string;
  lastActiveAt: string;
  updatedAt:    string;
}

interface Props { members: Member[] }

type SavingState = "idle" | "saving" | "done" | "error";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30)  return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function initials(name: string, email: string): string {
  const src = name || email;
  return src.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function AdminMembersTable({ members }: Props) {
  const [search,      setSearch]      = useState("");
  const [tierFilter,  setTierFilter]  = useState("all");
  const [page,        setPage]        = useState(1);
  const [saving,      setSaving]      = useState<Record<string, SavingState>>({});
  const [tierOverride,setTierOverride]= useState<Record<string, string>>({});
  const [selected,    setSelected]    = useState<Member | null>(null);
  const [drawerTier,  setDrawerTier]  = useState("");
  const [drawerSaving,setDrawerSaving]= useState<SavingState>("idle");

  const PAGE_SIZE = 20;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return members.filter((m) => {
      const match = !q || m.email.toLowerCase().includes(q) || m.fullName.toLowerCase().includes(q);
      const t = tierOverride[m.id] ?? m.tier;
      return match && (tierFilter === "all" || t === tierFilter);
    });
  }, [members, search, tierFilter, tierOverride]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openDrawer(m: Member) {
    setSelected(m);
    setDrawerTier(tierOverride[m.id] ?? m.tier);
    setDrawerSaving("idle");
  }

  async function handleTierChange(memberId: string, newTier: string) {
    setSaving((p) => ({ ...p, [memberId]: "saving" }));
    try {
      const res = await fetch("/api/admin/update-tier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: memberId, tier: newTier }),
      });
      if (!res.ok) throw new Error();
      setTierOverride((p) => ({ ...p, [memberId]: newTier }));
      setSaving((p) => ({ ...p, [memberId]: "done" }));
      setTimeout(() => setSaving((p) => ({ ...p, [memberId]: "idle" })), 2000);
    } catch {
      setSaving((p) => ({ ...p, [memberId]: "error" }));
      setTimeout(() => setSaving((p) => ({ ...p, [memberId]: "idle" })), 3000);
    }
  }

  async function handleDrawerSave() {
    if (!selected) return;
    setDrawerSaving("saving");
    try {
      const res = await fetch("/api/admin/update-tier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selected.id, tier: drawerTier }),
      });
      if (!res.ok) throw new Error();
      setTierOverride((p) => ({ ...p, [selected.id]: drawerTier }));
      setDrawerSaving("done");
      setTimeout(() => setDrawerSaving("idle"), 2000);
    } catch {
      setDrawerSaving("error");
      setTimeout(() => setDrawerSaving("idle"), 3000);
    }
  }

  // Stats
  const paid = members.filter((m) => (tierOverride[m.id] ?? m.tier) !== "free").length;
  const professional = members.filter((m) => ["professional","associate","corporate"].includes(tierOverride[m.id] ?? m.tier)).length;
  const newThisMonth = members.filter((m) => new Date(m.joinedAt).getTime() > MONTH_AGO).length;

  return (
    <div className="flex flex-col gap-6 max-w-275">

      {/* Page header */}
      <div className="border-b border-white/5 pb-5">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
          Members
        </h1>
        <p className="text-sm text-slate-400 mt-1">Manage and update all registered members.</p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Members",    value: members.length, border: "border-l-gold-500",   icon: "fa-users"    },
          { label: "Professional+",    value: professional,   border: "border-l-blue-400",   icon: "fa-id-card"  },
          { label: "Paid Members",     value: paid,           border: "border-l-emerald-400",icon: "fa-circle-check" },
          { label: "New This Month",   value: newThisMonth,   border: "border-l-violet-400", icon: "fa-user-plus"},
        ].map((s) => (
          <div key={s.label} className={`bg-navy-800 border border-white/5 border-l-4 ${s.border} p-5 flex flex-col justify-between h-24`}>
            <span className="text-xs text-slate-400">{s.label}</span>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
                {s.value}
              </span>
              <i className={`fa-solid ${s.icon} text-slate-600 text-sm`} />
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-navy-800 border border-white/5 flex flex-col">

        {/* Toolbar */}
        <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {TIERS.map((t) => (
              <button
                key={t}
                onClick={() => { setTierFilter(t); setPage(1); }}
                className={`px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-colors ${
                  tierFilter === t
                    ? "bg-gold-500 text-navy-900"
                    : "bg-navy-900 border border-white/10 text-slate-400 hover:text-white hover:border-gold-500/30"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-[10px] pointer-events-none" />
              <input
                type="text"
                placeholder="Search name or email…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="bg-navy-900 border border-white/10 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/40 transition-colors w-56"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="border-b border-white/5">
              <tr>
                <th className="px-5 py-3 text-[9px] font-bold tracking-widest uppercase text-slate-500">Member</th>
                <th className="px-5 py-3 text-[9px] font-bold tracking-widest uppercase text-slate-500 hidden sm:table-cell">Country</th>
                <th className="px-5 py-3 text-[9px] font-bold tracking-widest uppercase text-slate-500 hidden md:table-cell">Discipline</th>
                <th className="px-5 py-3 text-[9px] font-bold tracking-widest uppercase text-slate-500">Tier</th>
                <th className="px-5 py-3 text-[9px] font-bold tracking-widest uppercase text-slate-500 hidden lg:table-cell">Joined</th>
                <th className="px-5 py-3 text-[9px] font-bold tracking-widest uppercase text-slate-500 hidden lg:table-cell">Last Active</th>
                <th className="px-5 py-3 text-[9px] font-bold tracking-widest uppercase text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-xs text-slate-500">
                    No members match your search.
                  </td>
                </tr>
              ) : (
                paginated.map((m) => {
                  const effectiveTier = tierOverride[m.id] ?? m.tier;
                  const badge = TIER_BADGE[effectiveTier] ?? TIER_BADGE["free"];
                  const state = saving[m.id] ?? "idle";
                  const joined = new Date(m.joinedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" });

                  return (
                    <tr key={m.id} className="hover:bg-navy-900/60 transition-colors group">
                      {/* Name + email */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-navy-900 border border-gold-500/20 flex items-center justify-center shrink-0">
                            <span className="text-[9px] font-bold text-gold-500">
                              {initials(m.fullName, m.email)}
                            </span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-white truncate max-w-36">
                              {m.fullName || <span className="text-slate-500 italic">No name</span>}
                            </span>
                            <span className="text-[10px] text-slate-500 truncate max-w-36">{m.email}</span>
                          </div>
                        </div>
                      </td>
                      {/* Country */}
                      <td className="px-5 py-4 text-slate-400 hidden sm:table-cell">
                        {m.country || <span className="text-slate-600">—</span>}
                      </td>
                      {/* Discipline */}
                      <td className="px-5 py-4 text-slate-400 hidden md:table-cell max-w-36 truncate">
                        {m.discipline || <span className="text-slate-600">—</span>}
                      </td>
                      {/* Tier badge */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 border text-[9px] font-bold tracking-widest uppercase ${badge}`}>
                          {effectiveTier}
                        </span>
                      </td>
                      {/* Joined */}
                      <td className="px-5 py-4 text-slate-500 hidden lg:table-cell">{joined}</td>
                      {/* Last active */}
                      <td className="px-5 py-4 text-slate-500 hidden lg:table-cell">
                        {timeAgo(m.lastActiveAt)}
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* View drawer */}
                          <button
                            onClick={() => openDrawer(m)}
                            className="w-7 h-7 flex items-center justify-center bg-navy-900 border border-white/5 text-slate-500 hover:text-gold-500 hover:border-gold-500/30 transition-colors"
                            title="View profile"
                          >
                            <i className="fa-solid fa-arrow-up-right-from-square text-[9px]" />
                          </button>
                          {/* Inline tier change */}
                          {state === "saving" ? (
                            <i className="fa-solid fa-spinner fa-spin text-gold-500 text-[10px] mx-2" />
                          ) : state === "done" ? (
                            <i className="fa-solid fa-check text-emerald-400 text-[10px] mx-2" />
                          ) : state === "error" ? (
                            <i className="fa-solid fa-triangle-exclamation text-red-400 text-[10px] mx-2" />
                          ) : (
                            <select
                              value={effectiveTier}
                              onChange={(e) => handleTierChange(m.id, e.target.value)}
                              className="bg-navy-900 border border-white/10 px-2 py-1 text-[9px] text-white focus:outline-none focus:border-gold-500/40 transition-colors cursor-pointer"
                            >
                              {["free","student","graduate","professional","associate","corporate"].map((t) => (
                                <option key={t} value={t} className="bg-navy-900 capitalize">{t}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} members
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-white/10 hover:bg-navy-900 hover:text-white transition-colors disabled:opacity-40"
            >
              Prev
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const n = page <= 3 ? i + 1 : page - 2 + i;
              if (n < 1 || n > totalPages) return null;
              return (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`px-3 py-1 border transition-colors ${
                    n === page
                      ? "border-gold-500/40 bg-gold-500/10 text-gold-500"
                      : "border-white/10 hover:bg-navy-900 hover:text-white"
                  }`}
                >
                  {n}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border border-white/10 hover:bg-navy-900 hover:text-white transition-colors disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ── Member Detail Drawer ────────────────────────────────────── */}
      {selected && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-navy-900/60 z-40"
            onClick={() => setSelected(null)}
          />
          {/* Drawer */}
          <aside className="fixed top-0 right-0 h-full w-full max-w-sm bg-navy-800 border-l border-white/10 z-50 flex flex-col overflow-hidden">

            {/* Drawer header */}
            <div className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-navy-900/80 shrink-0">
              <h2 className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
                Member Profile
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-white hover:bg-navy-800 border border-transparent hover:border-white/10 transition-colors"
              >
                <i className="fa-solid fa-xmark text-xs" />
              </button>
            </div>

            {/* Drawer body */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">

              {/* Avatar + name */}
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-20 h-20 bg-navy-900 border-2 border-gold-500/30 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gold-500" style={{ fontFamily: "var(--font-playfair), serif" }}>
                    {initials(selected.fullName, selected.email)}
                  </span>
                </div>
                <div>
                  <p className="text-base font-bold text-white">
                    {selected.fullName || <span className="text-slate-400 italic">No name</span>}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{selected.email}</p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 border text-[9px] font-bold tracking-widest uppercase ${TIER_BADGE[tierOverride[selected.id] ?? selected.tier] ?? TIER_BADGE["free"]}`}>
                  {tierOverride[selected.id] ?? selected.tier}
                </span>
              </div>

              {/* Info rows */}
              <div className="flex flex-col gap-0 border border-white/5">
                {[
                  { label: "Country",      value: selected.country      || "—" },
                  { label: "Discipline",   value: selected.discipline   || "—" },
                  { label: "Organisation", value: selected.organisation || "—" },
                  { label: "Joined",       value: new Date(selected.joinedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
                  { label: "Last Active",  value: timeAgo(selected.lastActiveAt) },
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-4 px-4 py-3 border-b border-white/5 last:border-0">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 w-24 shrink-0 pt-0.5">{row.label}</span>
                    <span className="text-xs text-white break-words min-w-0">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Topics */}
              {selected.topics.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-3">Topics of Interest</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.topics.map((t) => (
                      <span key={t} className="px-2.5 py-1 bg-navy-900 border border-white/5 text-[10px] text-slate-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Change tier */}
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-3">Change Membership Tier</p>
                <select
                  value={drawerTier}
                  onChange={(e) => setDrawerTier(e.target.value)}
                  className="w-full bg-navy-900 border border-white/10 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/40 transition-colors"
                >
                  {["free","student","graduate","professional","associate","corporate"].map((t) => (
                    <option key={t} value={t} className="bg-navy-900 capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Drawer footer */}
            <div className="p-5 border-t border-white/5 bg-navy-900/60 shrink-0">
              <button
                onClick={handleDrawerSave}
                disabled={drawerSaving === "saving"}
                className="w-full py-3 bg-gold-500 text-navy-900 text-xs font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {drawerSaving === "saving" && <i className="fa-solid fa-spinner fa-spin text-[10px]" />}
                {drawerSaving === "done"    && <i className="fa-solid fa-check text-[10px]" />}
                {drawerSaving === "saving" ? "Saving…" : drawerSaving === "done" ? "Saved!" : "Save Changes"}
              </button>
              {drawerSaving === "error" && (
                <p className="text-center text-xs text-red-400 mt-2">Failed to save. Try again.</p>
              )}
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
