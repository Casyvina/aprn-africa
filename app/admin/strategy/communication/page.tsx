"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

interface WaGroup {
  id: string;
  name: string;
  member_count: string;
  manager: string;
  last_broadcast: string;
}

interface DbChannel {
  id: string;
  name: string;
  freq: string;
  content: string;
  audience: string;
  owner: string;
  notes: string;
  whatsapp_groups: WaGroup[];
}

interface CalItem {
  id: string;
  week_number: number;
  week_label: string;
  item: string;
  owner: string;
  sort_order: number;
}

// ── Static data ───────────────────────────────────────────────────────────────

const INTERNAL_STAKEHOLDERS = [
  { name: "Lucy Okeke",           role: "Founder & Executive Director", channel: "WhatsApp + Email",   freq: "Daily",   content: "Decisions, updates, strategy",         owner: "Lucy" },
  { name: "Joseph Agwuh",         role: "Director, Applied Engineering", channel: "All channels",      freq: "Daily",   content: "Platform development, tech oversight",  owner: "Joseph" },
  { name: "Allison Gabriel",      role: "Youth Ambassador",             channel: "WhatsApp + Email",   freq: "Weekly",  content: "Programs, events, campaigns",          owner: "Tokunbo" },
  { name: "Pieter-Bas Nederveen", role: "Senior Energy Advisor",        channel: "Email",              freq: "Monthly", content: "Strategy reports, briefings",          owner: "Lucy" },
  { name: "Kosie Onuora",         role: "Board Secretary",              channel: "Email + WhatsApp",   freq: "Weekly",  content: "Legal updates, governance",            owner: "Lucy" },
  { name: "Tokunbo Khadijat",     role: "Content Manager",              channel: "Slack / Email",      freq: "Weekly",  content: "Content calendar, drafts, publishing", owner: "Lucy" },
];

const EXTERNAL_STAKEHOLDERS = [
  { name: "PTC Berlin (Rana)",    type: "Strategic Partner",    channel: "Email + LinkedIn",          freq: "Monthly",   content: "Partnership updates, reports",     owner: "Lucy" },
  { name: "EITEP Institute",      type: "Training Partner",     channel: "Email",                     freq: "Monthly",   content: "Training pipeline, curriculum",    owner: "Lucy + Joseph" },
  { name: "NMDPRA",               type: "Government Regulator", channel: "Formal Email",              freq: "Quarterly", content: "Official APRN reports",            owner: "Lucy" },
  { name: "NCDMB",                type: "Government Body",      channel: "Formal Email",              freq: "Quarterly", content: "Training compliance reports",      owner: "Lucy" },
  { name: "GIZ Nigeria",          type: "Funder",               channel: "Email + Proposals",         freq: "Monthly",   content: "Funding proposals, impact reports", owner: "Lucy" },
  { name: "PLAN Members",         type: "Industry Association", channel: "Newsletter + LinkedIn",     freq: "Monthly",   content: "Research, events, industry news",  owner: "Tokunbo" },
  { name: "General Members",      type: "APRN Members",         channel: "Newsletter + Dashboard",    freq: "Weekly",    content: "Research, training, news",         owner: "Tokunbo" },
  { name: "Public / Industry",    type: "General Audience",     channel: "Website + LinkedIn + Newsletter", freq: "Weekly", content: "Articles, insights, events",  owner: "Tokunbo + Allison" },
];

const CHANNELS = [
  { id: "whatsapp",   name: "WhatsApp",   freq: "Daily",   content: "Quick decisions, urgent updates, personal outreach",    audience: "Internal team, close partners", owner: "Lucy / Joseph" },
  { id: "linkedin",   name: "LinkedIn",   freq: "Weekly",  content: "Thought leadership, research highlights, event promos", audience: "Industry, funders, public",     owner: "Tokunbo + Allison" },
  { id: "website",    name: "Website",    freq: "Weekly",  content: "Research, insights, training programs, events",         audience: "All",                           owner: "Tokunbo" },
  { id: "newsletter", name: "Newsletter", freq: "Weekly",  content: "Research summaries, training updates, member news",     audience: "Members, partners, subscribers", owner: "Tokunbo" },
  { id: "email",      name: "Email",      freq: "Weekly",  content: "Partner updates, formal correspondence, proposals",     audience: "Partners, funders, government", owner: "Lucy" },
  { id: "webinars",   name: "Webinars",   freq: "Monthly", content: "Technical briefings, policy discussions, training",     audience: "Members, industry professionals", owner: "Lucy + Joseph" },
];

const APPROVAL_FLOW = [
  { step: "01", title: "Create",  who: "Tokunbo / Allison",  desc: "Draft content aligned with APRN brand and messaging guidelines" },
  { step: "02", title: "Review",  who: "Tokunbo + Joseph",   desc: "Content quality and brand check (Tokunbo); technical accuracy check (Joseph)" },
  { step: "03", title: "Approve", who: "Lucy Okeke",         desc: "Final sign-off on all public-facing and partner communications" },
  { step: "04", title: "Publish", who: "Tokunbo Khadijat",   desc: "Schedule and publish via appropriate channel (website, newsletter, social)" },
];

const STATIC_CALENDAR = [
  { week: "Week 1", weekNum: 1, items: [
    { id: "s1a", item: "Newsletter issue",               owner: "Tokunbo" },
    { id: "s1b", item: "LinkedIn post (research)",        owner: "Tokunbo" },
    { id: "s1c", item: "Member digest email",             owner: "Tokunbo" },
  ]},
  { week: "Week 2", weekNum: 2, items: [
    { id: "s2a", item: "LinkedIn post (training)",        owner: "Allison" },
    { id: "s2b", item: "WhatsApp team sync",              owner: "Joseph" },
    { id: "s2c", item: "Partner update emails",           owner: "Lucy" },
  ]},
  { week: "Week 3", weekNum: 3, items: [
    { id: "s3a", item: "Newsletter issue",                owner: "Tokunbo" },
    { id: "s3b", item: "LinkedIn post (event/announcement)", owner: "Allison" },
    { id: "s3c", item: "Website blog post",               owner: "Tokunbo" },
  ]},
  { week: "Week 4", weekNum: 4, items: [
    { id: "s4a", item: "Monthly webinar",                 owner: "Lucy" },
    { id: "s4b", item: "Partner reports (as needed)",     owner: "Lucy" },
    { id: "s4c", item: "Board update (Kosie)",            owner: "Lucy" },
  ]},
];

const SECTIONS = [
  { id: "overview",  label: "Overview & Purpose" },
  { id: "internal",  label: "Internal Stakeholders" },
  { id: "external",  label: "External Stakeholders" },
  { id: "channels",  label: "Channel Strategy" },
  { id: "approval",  label: "Approval Process" },
  { id: "calendar",  label: "Communication Calendar" },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function CommunicationStrategyPage() {
  // ── AI panel ──
  const [aiOutput, setAiOutput]       = useState("");
  const [loading, setLoading]         = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const aiRef = useRef<HTMLDivElement>(null);

  // ── Channel editing ──
  const [channelOverrides, setChannelOverrides] = useState<Record<string, DbChannel>>({});
  const [editingChannel, setEditingChannel]     = useState<string | null>(null);
  const [editForm, setEditForm]                 = useState<Partial<DbChannel> & { whatsapp_groups: WaGroup[] }>({ whatsapp_groups: [] });
  const [savingChannel, setSavingChannel]       = useState(false);
  const [channelSaved, setChannelSaved]         = useState(false);

  // ── Calendar ──
  const [calItems, setCalItems]         = useState<CalItem[] | null>(null); // null = loading
  const [addingToWeek, setAddingToWeek] = useState<number | null>(null);
  const [newItem, setNewItem]           = useState({ item: "", owner: "" });
  const [deletingId, setDeletingId]     = useState<string | null>(null);
  const [addingItem, setAddingItem]     = useState(false);
  const [editingCalId, setEditingCalId] = useState<string | null>(null);
  const [editCalDraft, setEditCalDraft] = useState({ item: "", owner: "" });
  const [savingCalId, setSavingCalId]   = useState<string | null>(null);
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  // ── Load on mount ──────────────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    try {
      const [chRes, calRes] = await Promise.all([
        fetch("/api/admin/strategy/channels"),
        fetch("/api/admin/strategy/calendar"),
      ]);
      if (chRes.ok) {
        const { channels } = await chRes.json() as { channels: Record<string, DbChannel> };
        setChannelOverrides(channels ?? {});
      }
      if (calRes.ok) {
        const { items } = await calRes.json() as { items: CalItem[] };
        setCalItems(items ?? []);
      } else {
        setCalItems([]);
      }
    } catch {
      setCalItems([]);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadData(); }, [loadData]);

  // ── Merged channel data ───────────────────────────────────────────────────

  function mergedChannel(ch: (typeof CHANNELS)[0]) {
    const ov = channelOverrides[ch.id] as Partial<DbChannel> | undefined;
    if (!ov) return ch;
    return {
      id:       ch.id,
      name:     ov.name     ?? ch.name,
      freq:     ov.freq     ?? ch.freq,
      content:  ov.content  ?? ch.content,
      audience: ov.audience ?? ch.audience,
      owner:    ov.owner    ?? ch.owner,
      notes:    ov.notes    ?? "",
      whatsapp_groups: ov.whatsapp_groups ?? [],
    };
  }

  // ── Calendar helpers ──────────────────────────────────────────────────────

  const useStaticCal = !calItems || calItems.length === 0;

  const calByWeek = useStaticCal
    ? STATIC_CALENDAR.map((w) => ({ week: w.week, weekNum: w.weekNum, items: w.items as CalItem[] }))
    : [1, 2, 3, 4].map((wn) => ({
        week: `Week ${wn}`,
        weekNum: wn,
        items: calItems.filter((i) => i.week_number === wn).sort((a, b) => a.sort_order - b.sort_order),
      }));

  async function handleDeleteCalItem(id: string) {
    if (useStaticCal) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/strategy/calendar?id=${id}`, { method: "DELETE" });
      setCalItems((prev) => (prev ?? []).filter((i) => i.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  function startEditCalItem(calItem: CalItem) {
    setEditingCalId(calItem.id);
    setEditCalDraft({ item: calItem.item, owner: calItem.owner ?? "" });
  }

  async function saveCalEdit(id: string) {
    if (!editCalDraft.item.trim()) return;
    setSavingCalId(id);
    try {
      const res = await fetch("/api/admin/strategy/calendar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, item: editCalDraft.item.trim(), owner: editCalDraft.owner.trim() }),
      });
      if (res.ok) {
        setCalItems((prev) => (prev ?? []).map((i) =>
          i.id === id ? { ...i, item: editCalDraft.item.trim(), owner: editCalDraft.owner.trim() } : i
        ));
        setEditingCalId(null);
      }
    } finally {
      setSavingCalId(null);
    }
  }

  async function moveCalItem(id: string, weekNum: number, direction: "up" | "down") {
    if (useStaticCal || !calItems) return;
    const weekItems = calItems.filter((i) => i.week_number === weekNum).sort((a, b) => a.sort_order - b.sort_order);
    const idx = weekItems.findIndex((i) => i.id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= weekItems.length) return;

    const a = weekItems[idx];
    const b = weekItems[swapIdx];
    setReorderingId(id);
    try {
      await Promise.all([
        fetch("/api/admin/strategy/calendar", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: a.id, sort_order: b.sort_order }),
        }),
        fetch("/api/admin/strategy/calendar", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: b.id, sort_order: a.sort_order }),
        }),
      ]);
      setCalItems((prev) => (prev ?? []).map((i) => {
        if (i.id === a.id) return { ...i, sort_order: b.sort_order };
        if (i.id === b.id) return { ...i, sort_order: a.sort_order };
        return i;
      }));
    } finally {
      setReorderingId(null);
    }
  }

  async function handleAddCalItem() {
    if (!newItem.item.trim() || addingToWeek === null) return;
    setAddingItem(true);
    try {
      const res = await fetch("/api/admin/strategy/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          week_number: addingToWeek,
          week_label: `Week ${addingToWeek}`,
          item: newItem.item.trim(),
          owner: newItem.owner.trim(),
        }),
      });
      if (res.ok) {
        const { item } = await res.json() as { item: CalItem };
        setCalItems((prev) => [...(prev ?? []), item]);
        setNewItem({ item: "", owner: "" });
        setAddingToWeek(null);
      }
    } finally {
      setAddingItem(false);
    }
  }

  // ── Channel edit drawer ───────────────────────────────────────────────────

  function openEdit(channelId: string) {
    const ch = CHANNELS.find((c) => c.id === channelId);
    if (!ch) return;
    const merged = mergedChannel(ch);
    setEditForm({
      id:             channelId,
      name:           merged.name,
      freq:           merged.freq,
      content:        merged.content,
      audience:       merged.audience,
      owner:          merged.owner ?? "",
      notes:          (merged as { notes?: string }).notes ?? "",
      whatsapp_groups: (merged as { whatsapp_groups?: WaGroup[] }).whatsapp_groups ?? [],
    });
    setEditingChannel(channelId);
    setChannelSaved(false);
  }

  function closeEdit() {
    setEditingChannel(null);
    setEditForm({ whatsapp_groups: [] });
  }

  function addWaGroup() {
    setEditForm((f) => ({
      ...f,
      whatsapp_groups: [
        ...(f.whatsapp_groups ?? []),
        { id: crypto.randomUUID(), name: "", member_count: "", manager: "", last_broadcast: "" },
      ],
    }));
  }

  function removeWaGroup(id: string) {
    setEditForm((f) => ({
      ...f,
      whatsapp_groups: (f.whatsapp_groups ?? []).filter((g) => g.id !== id),
    }));
  }

  function updateWaGroup(id: string, field: keyof WaGroup, value: string) {
    setEditForm((f) => ({
      ...f,
      whatsapp_groups: (f.whatsapp_groups ?? []).map((g) =>
        g.id === id ? { ...g, [field]: value } : g
      ),
    }));
  }

  async function saveChannel() {
    if (!editForm.id) return;
    setSavingChannel(true);
    try {
      const res = await fetch("/api/admin/strategy/channels", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setChannelOverrides((prev) => ({
          ...prev,
          [editForm.id!]: editForm as DbChannel,
        }));
        setChannelSaved(true);
        setTimeout(() => { setChannelSaved(false); closeEdit(); }, 1200);
      }
    } finally {
      setSavingChannel(false);
    }
  }

  // ── AI panel ──────────────────────────────────────────────────────────────

  async function handleRegenerate() {
    setLoading(true);
    setShowAiPanel(true);
    setAiOutput("");
    setTimeout(() => aiRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

    const context = `APRN Communication Strategy — pan-African pipeline NGO.\nInternal team: Lucy Okeke (Founder & ED — strategy and approvals), Joseph Agwuh (Engineering Director — platform development and tech oversight), Tokunbo Khadijat (Content Manager — content creation, calendar, and publishing), Allison Gabriel (Youth Ambassador — programs, events, campaigns), Pieter-Bas Nederveen (Advisor), Kosie Onuora (Board Secretary).\nContent flow: Tokunbo/Allison create → Tokunbo/Joseph review → Lucy approves → Tokunbo publishes.\nExternal partners: PTC Berlin, EITEP Institute, NMDPRA, NCDMB, GIZ Nigeria.\nChannels: WhatsApp (daily internal), LinkedIn (weekly public), Newsletter (weekly members), Email (partner comms), Webinars (monthly).`;

    try {
      const res = await fetch("/api/admin/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "regenerate_comms", context }),
      });
      if (!res.body) throw new Error("No stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setAiOutput((prev) => prev + decoder.decode(value));
      }
    } catch {
      setAiOutput("Error generating content. Please check your ANTHROPIC_API_KEY and try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex gap-0 min-h-screen -m-6 md:-m-8">

      {/* Sidebar */}
      <aside className="hidden lg:flex w-52 shrink-0 flex-col border-r border-white/5 bg-navy-900 sticky top-0 h-screen overflow-y-auto py-6">
        <p className="px-5 text-[9px] font-bold tracking-widest text-slate-500 uppercase mb-3">Sections</p>
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="px-5 py-2 text-xs text-slate-400 hover:text-gold-500 hover:bg-navy-800 transition-colors"
          >
            {s.label}
          </a>
        ))}
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 z-30 bg-navy-900 border-b border-white/5 px-6 md:px-10 py-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-0.5">Strategy Portal</p>
            <h1 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
              Communication Strategy
            </h1>
          </div>
          <button
            onClick={handleRegenerate}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-navy-900 text-xs font-bold tracking-wide uppercase transition-colors"
          >
            <i className={`fa-solid fa-wand-magic-sparkles text-xs ${loading ? "animate-spin" : ""}`} />
            {loading ? "Generating…" : "Regenerate with AI"}
          </button>
        </div>

        <div className="px-6 md:px-10 py-8 flex flex-col gap-12 max-w-5xl">

          {/* 1. Overview */}
          <section id="overview">
            <SectionHeader icon="fa-bullseye" title="Overview & Purpose" />
            <div className="bg-navy-800 border border-white/5 border-l-4 border-l-gold-500 p-6 rounded-sm">
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                This document defines APRN Africa&apos;s internal and external communication strategy — establishing clear channels, frequencies, content types, and ownership for every key relationship. It ensures that Lucy Okeke, the leadership team, and all partners receive the right information at the right time through the right channel.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {[
                  { label: "Internal Stakeholders", value: "6" },
                  { label: "External Stakeholders", value: "8+" },
                  { label: "Active Channels",       value: "6" },
                  { label: "Approval Stages",       value: "4" },
                ].map((s) => (
                  <div key={s.label} className="bg-navy-900 border border-white/5 p-3 text-center">
                    <div className="text-2xl font-bold text-gold-500 mb-1" style={{ fontFamily: "var(--font-playfair), serif" }}>{s.value}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 2. Internal Stakeholders */}
          <section id="internal">
            <SectionHeader icon="fa-users" title="Internal Stakeholders" />
            <StakeholderTable
              cols={["Name", "Role", "Channel", "Frequency", "Content Type", "Owner"]}
              rows={INTERNAL_STAKEHOLDERS.map((s) => [s.name, s.role, s.channel, s.freq, s.content, s.owner])}
            />
          </section>

          {/* 3. External Stakeholders */}
          <section id="external">
            <SectionHeader icon="fa-globe" title="External Stakeholders" />
            <StakeholderTable
              cols={["Name / Organisation", "Type", "Channel", "Frequency", "Content Type", "Owner"]}
              rows={EXTERNAL_STAKEHOLDERS.map((s) => [s.name, s.type, s.channel, s.freq, s.content, s.owner])}
            />
          </section>

          {/* 4. Channel Strategy */}
          <section id="channels">
            <SectionHeader icon="fa-satellite-dish" title="Channel Strategy" />
            <p className="text-xs text-slate-500 mb-4 -mt-2">
              Click <i className="fa-solid fa-pen-to-square mx-0.5" /> on any card to update details or manage WhatsApp groups.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {CHANNELS.map((staticCh) => {
                const ch = mergedChannel(staticCh);
                const hasGroups = ch.id === "whatsapp" && (ch as { whatsapp_groups?: WaGroup[] }).whatsapp_groups?.length;
                return (
                  <div key={ch.id} className="bg-navy-800 border border-white/5 p-5 rounded-sm hover:border-gold-500/20 transition-colors group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{ch.name}</h3>
                        {channelOverrides[ch.id] && (
                          <span className="text-[9px] text-gold-500 border border-gold-500/30 px-1.5 py-px rounded-full">edited</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gold-500 uppercase tracking-widest bg-gold-500/10 border border-gold-500/20 px-2 py-0.5 rounded-full">
                          {ch.freq}
                        </span>
                        <button
                          onClick={() => openEdit(ch.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center text-slate-400 hover:text-gold-500 hover:bg-navy-700 rounded-sm"
                          title="Edit channel"
                        >
                          <i className="fa-solid fa-pen-to-square text-[10px]" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-2">{ch.content}</p>
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">
                      <i className="fa-solid fa-users text-[9px] mr-1" />{ch.audience}
                    </p>
                    {ch.owner && (
                      <p className="text-[10px] text-slate-600 uppercase tracking-wider">
                        <i className="fa-solid fa-user text-[9px] mr-1" />Owner: {ch.owner}
                      </p>
                    )}
                    {hasGroups && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <p className="text-[10px] font-bold text-gold-500/70 uppercase tracking-widest mb-2">
                          <i className="fa-brands fa-whatsapp mr-1" />WhatsApp Groups
                        </p>
                        <div className="space-y-1">
                          {((ch as { whatsapp_groups?: WaGroup[] }).whatsapp_groups ?? []).map((g) => (
                            <div key={g.id} className="flex items-center justify-between text-[11px] text-slate-400">
                              <span className="font-medium text-slate-300">{g.name}</span>
                              <span className="text-slate-500">{g.member_count} members · {g.manager}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 5. Approval Process */}
          <section id="approval">
            <SectionHeader icon="fa-check-double" title="Content Approval Process" />
            <div className="grid md:grid-cols-4 gap-4">
              {APPROVAL_FLOW.map((step, i) => (
                <div key={step.step} className="relative">
                  {i < APPROVAL_FLOW.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-full w-full h-px bg-gold-500/20 z-10" style={{ left: "calc(100% - 1px)", width: "calc(100% - 0px)" }} />
                  )}
                  <div className="bg-navy-800 border border-white/5 p-5 rounded-sm hover:border-gold-500/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-500 font-bold text-sm mb-3">
                      {step.step}
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">{step.title}</h3>
                    <p className="text-[11px] font-semibold text-gold-500 mb-2">{step.who}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Calendar */}
          <section id="calendar">
            <div className="flex items-center justify-between mb-5">
              <SectionHeader icon="fa-calendar-alt" title="Monthly Communication Calendar" />
              {useStaticCal && calItems !== null && (
                <span className="text-[10px] text-slate-600 italic">DB not connected — showing defaults</span>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {calByWeek.map((w) => (
                <div key={w.week} className="bg-navy-800 border border-white/5 p-5 rounded-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-gold-500 uppercase tracking-widest">{w.week}</h3>
                    {!useStaticCal && (
                      <button
                        onClick={() => { setAddingToWeek(w.weekNum); setNewItem({ item: "", owner: "" }); }}
                        className="text-[10px] text-slate-500 hover:text-gold-500 transition-colors flex items-center gap-1"
                      >
                        <i className="fa-solid fa-plus text-[9px]" />Add
                      </button>
                    )}
                  </div>
                  <ul className="space-y-2">
                    {w.items.map((calItem, itemIdx) => (
                      <li key={calItem.id} className="group/item">
                        {editingCalId === calItem.id ? (
                          <div className="space-y-2">
                            <input
                              autoFocus
                              value={editCalDraft.item}
                              onChange={(e) => setEditCalDraft((p) => ({ ...p, item: e.target.value }))}
                              onKeyDown={(e) => { if (e.key === "Enter") saveCalEdit(calItem.id); if (e.key === "Escape") setEditingCalId(null); }}
                              className="w-full bg-navy-900 border border-gold-500/40 text-xs text-white px-3 py-2 focus:outline-none"
                            />
                            <div className="flex gap-2">
                              <input
                                value={editCalDraft.owner}
                                onChange={(e) => setEditCalDraft((p) => ({ ...p, owner: e.target.value }))}
                                placeholder="Owner"
                                className="flex-1 bg-navy-900 border border-white/10 text-xs text-white px-3 py-1.5 placeholder-slate-600 focus:border-gold-500/50 focus:outline-none"
                              />
                              <button
                                onClick={() => saveCalEdit(calItem.id)}
                                disabled={savingCalId === calItem.id}
                                className="px-3 py-1.5 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-navy-900 text-xs font-bold transition-colors"
                              >
                                {savingCalId === calItem.id ? <i className="fa-solid fa-spinner animate-spin" /> : "Save"}
                              </button>
                              <button
                                onClick={() => setEditingCalId(null)}
                                className="px-3 py-1.5 text-slate-500 hover:text-white text-xs border border-white/10 hover:border-white/20 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2 min-w-0">
                              <i className="fa-solid fa-check text-[9px] mt-1 text-gold-500 shrink-0" />
                              <span className="text-sm text-slate-300 truncate">{calItem.item}</span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {calItem.owner && (
                                <span className="text-[10px] text-slate-600">{calItem.owner}</span>
                              )}
                              {!useStaticCal && (
                                <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => moveCalItem(calItem.id, w.weekNum, "up")}
                                    disabled={itemIdx === 0 || reorderingId === calItem.id}
                                    className="text-slate-600 hover:text-slate-300 text-[9px] disabled:opacity-20"
                                    title="Move up"
                                  >
                                    <i className="fa-solid fa-chevron-up" />
                                  </button>
                                  <button
                                    onClick={() => moveCalItem(calItem.id, w.weekNum, "down")}
                                    disabled={itemIdx === w.items.length - 1 || reorderingId === calItem.id}
                                    className="text-slate-600 hover:text-slate-300 text-[9px] disabled:opacity-20"
                                    title="Move down"
                                  >
                                    <i className="fa-solid fa-chevron-down" />
                                  </button>
                                  <button
                                    onClick={() => startEditCalItem(calItem)}
                                    className="text-slate-600 hover:text-gold-500 text-[10px]"
                                    title="Edit item"
                                  >
                                    <i className="fa-solid fa-pen text-[9px]" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCalItem(calItem.id)}
                                    disabled={deletingId === calItem.id}
                                    className="text-slate-600 hover:text-red-400 text-[10px] disabled:opacity-40"
                                    title="Remove item"
                                  >
                                    {deletingId === calItem.id
                                      ? <i className="fa-solid fa-spinner animate-spin" />
                                      : <i className="fa-solid fa-xmark" />
                                    }
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>

                  {/* Inline add form */}
                  {!useStaticCal && addingToWeek === w.weekNum && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <input
                        autoFocus
                        value={newItem.item}
                        onChange={(e) => setNewItem((p) => ({ ...p, item: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === "Enter") handleAddCalItem(); if (e.key === "Escape") setAddingToWeek(null); }}
                        placeholder="New item…"
                        className="w-full bg-navy-900 border border-white/10 text-xs text-white px-3 py-2 mb-2 placeholder-slate-600 focus:border-gold-500/50 focus:outline-none"
                      />
                      <div className="flex gap-2">
                        <input
                          value={newItem.owner}
                          onChange={(e) => setNewItem((p) => ({ ...p, owner: e.target.value }))}
                          placeholder="Owner (e.g. Tokunbo)"
                          className="flex-1 bg-navy-900 border border-white/10 text-xs text-white px-3 py-2 placeholder-slate-600 focus:border-gold-500/50 focus:outline-none"
                        />
                        <button
                          onClick={handleAddCalItem}
                          disabled={addingItem || !newItem.item.trim()}
                          className="px-3 py-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-navy-900 text-xs font-bold transition-colors"
                        >
                          {addingItem ? <i className="fa-solid fa-spinner animate-spin" /> : "Add"}
                        </button>
                        <button
                          onClick={() => setAddingToWeek(null)}
                          className="px-3 py-2 text-slate-500 hover:text-white text-xs border border-white/10 hover:border-white/20 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {useStaticCal && calItems !== null && (
              <p className="mt-3 text-[11px] text-slate-600">
                <i className="fa-solid fa-circle-info mr-1" />
                Run the Supabase migration to enable live calendar editing (add &amp; remove items).
              </p>
            )}
          </section>

          {/* AI Output Panel */}
          {showAiPanel && (
            <section ref={aiRef} className="border border-gold-500/30 bg-navy-800 rounded-sm overflow-hidden">
              <div className="bg-gold-500/10 border-b border-gold-500/20 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-wand-magic-sparkles text-gold-500 text-xs" />
                  <span className="text-xs font-bold text-gold-500 uppercase tracking-widest">AI-Enhanced Strategy</span>
                </div>
                <button onClick={() => setShowAiPanel(false)} className="text-slate-500 hover:text-white text-xs">
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
              <div className="p-6">
                {loading && !aiOutput && (
                  <div className="flex items-center gap-3 text-slate-400 text-sm">
                    <span className="w-2 h-2 bg-gold-500 rounded-full animate-pulse" />
                    Claude is analysing your communication strategy…
                  </div>
                )}
                {aiOutput && (
                  <div className="prose prose-invert prose-sm max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {aiOutput}
                    {loading && <span className="inline-block w-1 h-4 bg-gold-500 animate-pulse ml-0.5" />}
                  </div>
                )}
              </div>
            </section>
          )}

        </div>
      </div>

      {/* Channel Edit Drawer */}
      {editingChannel && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={closeEdit}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-md z-50 bg-navy-900 border-l border-white/10 flex flex-col shadow-2xl overflow-hidden">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-0.5">Edit Channel</p>
                <h2 className="text-sm font-bold text-white">{editForm.name}</h2>
              </div>
              <button onClick={closeEdit} className="text-slate-500 hover:text-white transition-colors">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {/* Drawer body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

              <Field label="Channel Name">
                <input
                  value={editForm.name ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full bg-navy-800 border border-white/10 text-xs text-white px-3 py-2.5 placeholder-slate-600 focus:border-gold-500/50 focus:outline-none"
                />
              </Field>

              <Field label="Frequency">
                <input
                  value={editForm.freq ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, freq: e.target.value }))}
                  placeholder="e.g. Daily, Weekly, Monthly"
                  className="w-full bg-navy-800 border border-white/10 text-xs text-white px-3 py-2.5 placeholder-slate-600 focus:border-gold-500/50 focus:outline-none"
                />
              </Field>

              <Field label="Content Types">
                <textarea
                  rows={2}
                  value={editForm.content ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, content: e.target.value }))}
                  className="w-full bg-navy-800 border border-white/10 text-xs text-white px-3 py-2.5 placeholder-slate-600 focus:border-gold-500/50 focus:outline-none resize-none"
                />
              </Field>

              <Field label="Audience">
                <input
                  value={editForm.audience ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, audience: e.target.value }))}
                  className="w-full bg-navy-800 border border-white/10 text-xs text-white px-3 py-2.5 placeholder-slate-600 focus:border-gold-500/50 focus:outline-none"
                />
              </Field>

              <Field label="Owner">
                <input
                  value={editForm.owner ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, owner: e.target.value }))}
                  placeholder="e.g. Tokunbo"
                  className="w-full bg-navy-800 border border-white/10 text-xs text-white px-3 py-2.5 placeholder-slate-600 focus:border-gold-500/50 focus:outline-none"
                />
              </Field>

              <Field label="Notes (internal)">
                <textarea
                  rows={2}
                  value={editForm.notes ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Any internal notes about this channel…"
                  className="w-full bg-navy-800 border border-white/10 text-xs text-white px-3 py-2.5 placeholder-slate-600 focus:border-gold-500/50 focus:outline-none resize-none"
                />
              </Field>

              {/* WhatsApp groups (only show for whatsapp channel) */}
              {editingChannel === "whatsapp" && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                      <i className="fa-brands fa-whatsapp text-green-500 mr-1.5" />
                      WhatsApp Groups
                    </label>
                    <button
                      onClick={addWaGroup}
                      className="text-[10px] text-gold-500 hover:text-gold-400 flex items-center gap-1 transition-colors"
                    >
                      <i className="fa-solid fa-plus text-[9px]" />Add group
                    </button>
                  </div>
                  {(editForm.whatsapp_groups ?? []).length === 0 && (
                    <p className="text-[11px] text-slate-600 italic">No groups added yet.</p>
                  )}
                  <div className="space-y-4">
                    {(editForm.whatsapp_groups ?? []).map((g) => (
                      <div key={g.id} className="bg-navy-800 border border-white/5 p-4 rounded-sm space-y-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Group</span>
                          <button
                            onClick={() => removeWaGroup(g.id)}
                            className="text-[10px] text-slate-600 hover:text-red-400 transition-colors"
                          >
                            <i className="fa-solid fa-trash-can" />
                          </button>
                        </div>
                        <input
                          value={g.name}
                          onChange={(e) => updateWaGroup(g.id, "name", e.target.value)}
                          placeholder="Group name"
                          className="w-full bg-navy-900 border border-white/10 text-xs text-white px-3 py-2 placeholder-slate-600 focus:border-gold-500/50 focus:outline-none"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={g.member_count}
                            onChange={(e) => updateWaGroup(g.id, "member_count", e.target.value)}
                            placeholder="Members (e.g. 47)"
                            className="bg-navy-900 border border-white/10 text-xs text-white px-3 py-2 placeholder-slate-600 focus:border-gold-500/50 focus:outline-none"
                          />
                          <input
                            value={g.manager}
                            onChange={(e) => updateWaGroup(g.id, "manager", e.target.value)}
                            placeholder="Manager"
                            className="bg-navy-900 border border-white/10 text-xs text-white px-3 py-2 placeholder-slate-600 focus:border-gold-500/50 focus:outline-none"
                          />
                        </div>
                        <input
                          value={g.last_broadcast}
                          onChange={(e) => updateWaGroup(g.id, "last_broadcast", e.target.value)}
                          placeholder="Last broadcast (e.g. 10 Jun 2026)"
                          className="w-full bg-navy-900 border border-white/10 text-xs text-white px-3 py-2 placeholder-slate-600 focus:border-gold-500/50 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Drawer footer */}
            <div className="px-6 py-4 border-t border-white/5 shrink-0 flex items-center justify-between gap-3">
              <button
                onClick={closeEdit}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveChannel}
                disabled={savingChannel}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-navy-900 text-xs font-bold tracking-wide uppercase transition-colors"
              >
                {channelSaved ? (
                  <><i className="fa-solid fa-check" />Saved!</>
                ) : savingChannel ? (
                  <><i className="fa-solid fa-spinner animate-spin" />Saving…</>
                ) : (
                  <><i className="fa-solid fa-floppy-disk" />Save Changes</>
                )}
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-8 h-8 bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0">
        <i className={`fa-solid ${icon} text-gold-500 text-xs`} />
      </div>
      <h2 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
        {title}
      </h2>
    </div>
  );
}

function StakeholderTable({ cols, rows }: { cols: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-sm border border-white/5">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-navy-700">
            {cols.map((c) => (
              <th key={c} className="px-4 py-3 text-left text-[10px] font-bold text-gold-500 uppercase tracking-widest whitespace-nowrap">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={`border-t border-white/5 ${i % 2 === 0 ? "bg-navy-800" : "bg-navy-800/60"} hover:bg-navy-700 transition-colors`}>
              {row.map((cell, j) => (
                <td key={j} className={`px-4 py-3 text-slate-300 text-xs ${j === 0 ? "font-semibold text-white" : ""}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
