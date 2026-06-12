"use client";

import { useState, useRef } from "react";

// ── Data ────────────────────────────────────────────────────────────────────

const INTERNAL_STAKEHOLDERS = [
  { name: "Lucy Okeke",          role: "Founder & Executive Director", channel: "WhatsApp + Email",  freq: "Daily",   content: "Decisions, updates, strategy",   owner: "Joseph" },
  { name: "Joseph Agwuh",        role: "Director, Applied Engineering", channel: "All channels",     freq: "Daily",   content: "All content & operations",       owner: "Joseph" },
  { name: "Allison Gabriel",     role: "Youth Ambassador",             channel: "WhatsApp + Email",  freq: "Weekly",  content: "Programs, events, campaigns",    owner: "Joseph" },
  { name: "Pieter-Bas Nederveen",role: "Senior Energy Advisor",        channel: "Email",             freq: "Monthly", content: "Strategy reports, briefings",    owner: "Lucy" },
  { name: "Kosie Onuora",        role: "Board Secretary",              channel: "Email + WhatsApp",  freq: "Weekly",  content: "Legal updates, governance",      owner: "Lucy" },
  { name: "Tokunbo Khadijat",    role: "Content Manager",              channel: "Slack / Email",     freq: "Weekly",  content: "Content calendar, drafts",       owner: "Joseph" },
];

const EXTERNAL_STAKEHOLDERS = [
  { name: "PTC Berlin (Rana)",   type: "Strategic Partner",     channel: "Email + LinkedIn",       freq: "Monthly",   content: "Partnership updates, reports",          owner: "Lucy" },
  { name: "EITEP Institute",     type: "Training Partner",      channel: "Email",                  freq: "Monthly",   content: "Training pipeline, curriculum",         owner: "Lucy + Joseph" },
  { name: "NMDPRA",              type: "Government Regulator",  channel: "Formal Email",           freq: "Quarterly", content: "Official APRN reports",                 owner: "Lucy" },
  { name: "NCDMB",               type: "Government Body",       channel: "Formal Email",           freq: "Quarterly", content: "Training compliance reports",           owner: "Lucy" },
  { name: "GIZ Nigeria",         type: "Funder",                channel: "Email + Proposals",      freq: "Monthly",   content: "Funding proposals, impact reports",     owner: "Lucy" },
  { name: "PLAN Members",        type: "Industry Association",  channel: "Newsletter + LinkedIn",  freq: "Monthly",   content: "Research, events, industry news",       owner: "Joseph" },
  { name: "General Members",     type: "APRN Members",          channel: "Newsletter + Dashboard", freq: "Weekly",    content: "Research, training, news",              owner: "Joseph" },
  { name: "Public / Industry",   type: "General Audience",      channel: "Website + LinkedIn + Newsletter", freq: "Weekly", content: "Articles, insights, events",  owner: "Joseph + Tokun" },
];

const CHANNELS = [
  { name: "WhatsApp",    freq: "Daily",    content: "Quick decisions, urgent updates, personal outreach",      audience: "Internal team, close partners" },
  { name: "LinkedIn",    freq: "Weekly",   content: "Thought leadership, research highlights, event promos",   audience: "Industry, funders, public" },
  { name: "Website",     freq: "Weekly",   content: "Research, insights, training programs, events",           audience: "All" },
  { name: "Newsletter",  freq: "Weekly",   content: "Research summaries, training updates, member news",       audience: "Members, partners, subscribers" },
  { name: "Email",       freq: "Weekly",   content: "Partner updates, formal correspondence, proposals",       audience: "Partners, funders, government" },
  { name: "Webinars",    freq: "Monthly",  content: "Technical briefings, policy discussions, training",       audience: "Members, industry professionals" },
];

const APPROVAL_FLOW = [
  { step: "01", title: "Create",  who: "Joseph / Tokunbo",      desc: "Draft content aligned with APRN brand and messaging guidelines" },
  { step: "02", title: "Review",  who: "Joseph Agwuh",          desc: "Technical accuracy, brand consistency, and strategic alignment check" },
  { step: "03", title: "Approve", who: "Lucy Okeke",            desc: "Final sign-off on all public-facing and partner communications" },
  { step: "04", title: "Publish", who: "Joseph / Tokunbo",      desc: "Schedule and publish via appropriate channel (website, newsletter, social)" },
];

const CALENDAR = [
  { week: "Week 1",  items: ["Newsletter issue", "LinkedIn post (research)", "Member digest email"] },
  { week: "Week 2",  items: ["LinkedIn post (training)", "WhatsApp team sync", "Partner update emails"] },
  { week: "Week 3",  items: ["Newsletter issue", "LinkedIn post (event/announcement)", "Website blog post"] },
  { week: "Week 4",  items: ["Monthly webinar", "Partner reports (as needed)", "Board update (Kosie)"] },
];

// ── Sections for sidebar nav ────────────────────────────────────────────────

const SECTIONS = [
  { id: "overview",     label: "Overview & Purpose" },
  { id: "internal",     label: "Internal Stakeholders" },
  { id: "external",     label: "External Stakeholders" },
  { id: "channels",     label: "Channel Strategy" },
  { id: "approval",     label: "Approval Process" },
  { id: "calendar",     label: "Communication Calendar" },
];

// ── Component ───────────────────────────────────────────────────────────────

export default function CommunicationStrategyPage() {
  const [aiOutput, setAiOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const aiRef = useRef<HTMLDivElement>(null);

  async function handleRegenerate() {
    setLoading(true);
    setShowAiPanel(true);
    setAiOutput("");
    setTimeout(() => aiRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

    const context = `APRN Communication Strategy — pan-African pipeline NGO.\nInternal team: Lucy Okeke (Founder), Joseph Agwuh (Engineering Director), Allison Gabriel (Youth Ambassador), Pieter-Bas Nederveen (Advisor), Kosie Onuora (Board Secretary), Tokunbo Khadijat (Content Manager).\nExternal partners: PTC Berlin, EITEP Institute, NMDPRA, NCDMB, GIZ Nigeria.\nChannels: WhatsApp (daily internal), LinkedIn (weekly public), Newsletter (weekly members), Email (partner comms), Webinars (monthly).`;

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
                  { label: "Active Channels", value: "6" },
                  { label: "Approval Stages", value: "4" },
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
            <div className="grid md:grid-cols-2 gap-4">
              {CHANNELS.map((c) => (
                <div key={c.name} className="bg-navy-800 border border-white/5 p-5 rounded-sm hover:border-gold-500/20 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-white">{c.name}</h3>
                    <span className="text-[10px] font-bold text-gold-500 uppercase tracking-widest bg-gold-500/10 border border-gold-500/20 px-2 py-0.5 rounded-full">
                      {c.freq}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-2">{c.content}</p>
                  <p className="text-[10px] text-slate-600 uppercase tracking-wider">
                    <i className="fa-solid fa-users text-[9px] mr-1" />{c.audience}
                  </p>
                </div>
              ))}
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
            <SectionHeader icon="fa-calendar-alt" title="Monthly Communication Calendar" />
            <div className="grid md:grid-cols-2 gap-4">
              {CALENDAR.map((w) => (
                <div key={w.week} className="bg-navy-800 border border-white/5 p-5 rounded-sm">
                  <h3 className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-3">{w.week}</h3>
                  <ul className="space-y-2">
                    {w.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                        <i className="fa-solid fa-check text-[9px] mt-1 text-gold-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
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
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

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
