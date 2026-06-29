"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type InfluenceLevel = "High" | "Med" | "Low";
type StakeholderType = "Internal" | "Government" | "Partners" | "Funders" | "Industry" | "Associations" | "Media" | "WIMEE";

interface Stakeholder {
  id: string;
  name: string;
  org?: string;
  type: StakeholderType;
  influence: InfluenceLevel;
  interest: InfluenceLevel;
  relationship: string;
  engagementStrategy: string;
  lastContact?: string;
  ix: number;
  iy: number;
  isCustom?: boolean;
  dbId?: string;
}

interface CustomStakeholderRow {
  id: string;
  name: string;
  org: string | null;
  type: string;
  influence: string;
  interest: string;
  relationship: string | null;
  engagement_strategy: string | null;
  last_contact: string | null;
  ix: number;
  iy: number;
}

// ── Data ─────────────────────────────────────────────────────────────────────

const STATIC_STAKEHOLDERS: Stakeholder[] = [
  // Internal
  { id: "lucy",    name: "Lucy Okeke",          org: "APRN Africa",         type: "Internal",     influence: "High", interest: "High", relationship: "Founder", engagementStrategy: "Daily WhatsApp + email; all key decisions loop through Lucy.",  lastContact: "Today",    ix: 9.5, iy: 9.5 },
  { id: "joseph",  name: "Joseph Agwuh",         org: "APRN Africa",         type: "Internal",     influence: "High", interest: "High", relationship: "Core Team", engagementStrategy: "Daily collaboration; builds and maintains the platform, directs content team on platform usage and tooling.", lastContact: "Today",    ix: 9, iy: 9 },
  { id: "allison", name: "Allison Gabriel",      org: "APRN Africa",         type: "Internal",     influence: "Med",  interest: "High", relationship: "Content & Ambassador", engagementStrategy: "Weekly WhatsApp + email; co-manages content creation with Tokunbo — programs, events, and campaign copy.", lastContact: "This week", ix: 8, iy: 5 },
  { id: "pieter",  name: "Pieter-Bas Nederveen", org: "APRN Africa",         type: "Internal",     influence: "High", interest: "Med",  relationship: "Advisor",    engagementStrategy: "Monthly email briefings; strategic input on international work.", lastContact: "This month", ix: 5, iy: 8 },
  { id: "kosie",   name: "Kosie Onuora",         org: "APRN Africa",         type: "Internal",     influence: "Med",  interest: "Med",  relationship: "Board Secretary", engagementStrategy: "Weekly governance and legal updates via email + WhatsApp.",   lastContact: "This week", ix: 6, iy: 5.5 },
  { id: "tokun",   name: "Tokunbo Khadijat",     org: "APRN Africa",         type: "Internal",     influence: "Med",  interest: "High", relationship: "Content Manager", engagementStrategy: "Leads content creation, calendar management, and publishing across all channels; weekly review with Lucy.", lastContact: "This week", ix: 8.5, iy: 4.5 },
  // Government
  { id: "nmdpra",  name: "NMDPRA",               org: "Govt. Nigeria",       type: "Government",   influence: "High", interest: "Med",  relationship: "Regulator",    engagementStrategy: "Quarterly formal correspondence; invite to APRN events; compliance reporting.", lastContact: "June 2026", ix: 5.5, iy: 8.5 },
  { id: "nuprc",   name: "NUPRC",                org: "Govt. Nigeria",       type: "Government",   influence: "High", interest: "Low",  relationship: "Regulator",    engagementStrategy: "Bi-annual outreach; position APRN as technical standards partner.", lastContact: "Mar 2026", ix: 3, iy: 8 },
  { id: "ncdmb",   name: "NCDMB",                org: "Govt. Nigeria",       type: "Government",   influence: "High", interest: "Med",  relationship: "Mandate Body", engagementStrategy: "Quarterly compliance reports; training programme alignment.", lastContact: "Apr 2026", ix: 5, iy: 8 },
  { id: "mopng",   name: "Ministry of Petroleum",org: "Govt. Nigeria",       type: "Government",   influence: "High", interest: "Low",  relationship: "Policy Maker", engagementStrategy: "Annual formal engagement; position APRN in national energy policy.", lastContact: "Jan 2026", ix: 2.5, iy: 9 },
  // Partners
  { id: "ptc",     name: "PTC Berlin",           org: "Strategic Partner",   type: "Partners",     influence: "Med",  interest: "High", relationship: "Active Partner", engagementStrategy: "Monthly email + LinkedIn; co-branding on events and training.", lastContact: "June 2026", ix: 8, iy: 6 },
  { id: "eitep",   name: "EITEP Institute",      org: "Training Partner",    type: "Partners",     influence: "Med",  interest: "High", relationship: "Active Partner", engagementStrategy: "Monthly curriculum alignment calls; joint programme development.", lastContact: "June 2026", ix: 8.5, iy: 5.5 },
  { id: "worldbank", name: "World Bank",         org: "Development Finance", type: "Partners",     influence: "High", interest: "Med",  relationship: "Prospect",     engagementStrategy: "Targeted proposal with APRN's impact metrics; use AfDB connection.", lastContact: "None", ix: 5, iy: 9 },
  { id: "afdb",    name: "African Dev. Bank",    org: "Development Finance", type: "Partners",     influence: "High", interest: "Med",  relationship: "Prospect",     engagementStrategy: "Formal proposal for training & research funding; leverage policy reports.", lastContact: "None", ix: 5.5, iy: 9 },
  // Funders
  { id: "giz",     name: "GIZ Nigeria",          org: "Development Agency",  type: "Funders",      influence: "High", interest: "High", relationship: "Active Funder", engagementStrategy: "Monthly proposals + impact reports; align with GIZ energy objectives.", lastContact: "June 2026", ix: 8.5, iy: 7.5 },
  { id: "mdgif",   name: "NCDMB MDGIF",          org: "Govt. Fund",          type: "Funders",      influence: "High", interest: "Med",  relationship: "Prospect",     engagementStrategy: "Apply to MDGIF for training infrastructure funding.", lastContact: "None", ix: 5, iy: 7 },
  { id: "isdb",    name: "Islamic Dev. Bank",    org: "Development Finance", type: "Funders",      influence: "High", interest: "Low",  relationship: "Prospect",     engagementStrategy: "Align APRN's gender-inclusion and capacity-building angle for IDB.", lastContact: "None", ix: 3, iy: 7.5 },
  // Industry
  { id: "nnpcl",   name: "NNPCL",                org: "National Oil Co.",    type: "Industry",     influence: "High", interest: "Low",  relationship: "Target",       engagementStrategy: "Position APRN as preferred training partner; leverage Lucy's network.", lastContact: "None", ix: 3, iy: 9.5 },
  { id: "shell",   name: "Shell Nigeria",        org: "IOC",                 type: "Industry",     influence: "High", interest: "Med",  relationship: "Target",       engagementStrategy: "Event sponsorship pitch; co-brand on pipeline integrity research.", lastContact: "None", ix: 5, iy: 7 },
  { id: "total",   name: "TotalEnergies",        org: "IOC",                 type: "Industry",     influence: "High", interest: "Med",  relationship: "Target",       engagementStrategy: "CSR/training alignment; target energy transition content angle.", lastContact: "None", ix: 5.5, iy: 7 },
  { id: "nlng",    name: "NLNG",                 org: "LNG Operator",        type: "Industry",     influence: "High", interest: "Med",  relationship: "Target",       engagementStrategy: "Training partnership for gas pipeline engineers.", lastContact: "None", ix: 6, iy: 7 },
  // Associations
  { id: "plan",    name: "PLAN",                 org: "Industry Assoc.",     type: "Associations", influence: "Med",  interest: "High", relationship: "Engaged",      engagementStrategy: "Monthly newsletter + events; co-host webinars.", lastContact: "May 2026", ix: 8, iy: 5 },
  { id: "nse",     name: "NSE",                  org: "Professional Body",   type: "Associations", influence: "Med",  interest: "Med",  relationship: "Prospect",     engagementStrategy: "CPD point accreditation; joint certification pathway.", lastContact: "None", ix: 5, iy: 5 },
  { id: "coren",   name: "COREN",                org: "Regulatory Body",     type: "Associations", influence: "High", interest: "Med",  relationship: "Prospect",     engagementStrategy: "Accreditation partnership for APRN training programmes.", lastContact: "None", ix: 5, iy: 8 },
  { id: "spe",     name: "SPE Nigeria",          org: "Professional Society",type: "Associations", influence: "Med",  interest: "High", relationship: "Engaged",      engagementStrategy: "Co-host technical events; joint publications.", lastContact: "May 2026", ix: 8, iy: 6 },
  // Media
  { id: "pipegas", name: "Pipeline & Gas Journal",org: "Trade Media",        type: "Media",        influence: "Med",  interest: "High", relationship: "Active",       engagementStrategy: "Monthly press releases; contribute articles and research briefs.", lastContact: "May 2026", ix: 8, iy: 4.5 },
  { id: "wpipe",   name: "World Pipelines",       org: "Trade Media",        type: "Media",        influence: "Med",  interest: "High", relationship: "Active",       engagementStrategy: "Quarterly editorial contributions; event coverage.", lastContact: "Apr 2026", ix: 8, iy: 4 },
  { id: "energyr", name: "The Energy Republic",   org: "Digital Media",      type: "Media",        influence: "Low",  interest: "High", relationship: "Active",       engagementStrategy: "Monthly articles on APRN research and training.", lastContact: "June 2026", ix: 8.5, iy: 3 },
  // WIMEE
  { id: "wimee",   name: "Women in Energy Networks",org: "WIMEE",            type: "WIMEE",        influence: "Med",  interest: "High", relationship: "Prospect",     engagementStrategy: "Align Allison Gabriel ambassador programme; joint women-in-pipeline campaigns.", lastContact: "None", ix: 8, iy: 5.5 },
  { id: "nmdprawk",name: "NMDPRA Women's Programme",org: "Govt. Nigeria",    type: "WIMEE",        influence: "Med",  interest: "Med",  relationship: "Prospect",     engagementStrategy: "Propose APRN training as part of their women's empowerment agenda.", lastContact: "None", ix: 5.5, iy: 4.5 },
];

const FILTER_TABS: Array<{ label: string; value: StakeholderType | "All" }> = [
  { label: "All",          value: "All" },
  { label: "Internal",     value: "Internal" },
  { label: "Government",   value: "Government" },
  { label: "Partners",     value: "Partners" },
  { label: "Funders",      value: "Funders" },
  { label: "Industry",     value: "Industry" },
  { label: "Associations", value: "Associations" },
  { label: "Media",        value: "Media" },
  { label: "WIMEE",        value: "WIMEE" },
];

const TYPE_COLOR: Record<StakeholderType, string> = {
  Internal:     "#D4A017",
  Government:   "#60a5fa",
  Partners:     "#34d399",
  Funders:      "#a78bfa",
  Industry:     "#fb923c",
  Associations: "#f87171",
  Media:        "#94a3b8",
  WIMEE:        "#f472b6",
};

const INF_COLOR: Record<InfluenceLevel, string> = {
  High: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Med:  "text-gold-500 bg-gold-500/10 border-gold-500/20",
  Low:  "text-slate-400 bg-slate-400/10 border-slate-400/20",
};

const INFLUENCE_OPTIONS: InfluenceLevel[] = ["High", "Med", "Low"];
const TYPE_OPTIONS: StakeholderType[] = ["Internal", "Government", "Partners", "Funders", "Industry", "Associations", "Media", "WIMEE"];

const BLANK_FORM = {
  name: "",
  org: "",
  type: "Partners" as StakeholderType,
  influence: "Med" as InfluenceLevel,
  interest: "Med" as InfluenceLevel,
  relationship: "Prospect",
  engagement_strategy: "",
  last_contact: "",
  ix: 5,
  iy: 5,
};

// ── Component ─────────────────────────────────────────────────────────────────

interface StakeholderMeta {
  last_contact_date: string | null;
  notes: string | null;
}

export default function StakeholdersPage() {
  const [filter, setFilter] = useState<StakeholderType | "All">("All");
  const [selected, setSelected] = useState<Stakeholder | null>(null);
  const [aiOutput, setAiOutput] = useState("");
  const [loadingBrief, setLoadingBrief] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [customStakeholders, setCustomStakeholders] = useState<Stakeholder[]>([]);

  const [formOpen, setFormOpen] = useState(false);
  const [editingCustomId, setEditingCustomId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...BLANK_FORM });
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [metaMap, setMetaMap] = useState<Record<string, StakeholderMeta>>({});
  const [editDate, setEditDate]   = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [savingMeta, setSavingMeta] = useState(false);
  const [metaSaved, setMetaSaved]   = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);

  const loadData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/strategy/stakeholders");
      if (res.ok) {
        const { meta, custom } = await res.json() as {
          meta: Record<string, StakeholderMeta>;
          custom: CustomStakeholderRow[];
        };
        setMetaMap(meta ?? {});
        setCustomStakeholders((custom ?? []).map((row) => ({
          id: `custom_${row.id}`,
          dbId: row.id,
          name: row.name,
          org: row.org ?? undefined,
          type: row.type as StakeholderType,
          influence: row.influence as InfluenceLevel,
          interest: row.interest as InfluenceLevel,
          relationship: row.relationship ?? "Prospect",
          engagementStrategy: row.engagement_strategy ?? "",
          lastContact: row.last_contact ?? undefined,
          ix: row.ix,
          iy: row.iy,
          isCustom: true,
        })));
      }
    } catch { /* fallback to static data */ }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadData(); }, [loadData]);

  const ALL_STAKEHOLDERS = [...STATIC_STAKEHOLDERS, ...customStakeholders];

  function displayLastContact(s: Stakeholder): string {
    const db = metaMap[s.id];
    if (db?.last_contact_date) {
      const d = new Date(db.last_contact_date);
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    }
    return s.lastContact ?? "—";
  }

  async function saveMeta() {
    if (!selected) return;
    setSavingMeta(true);
    try {
      const res = await fetch("/api/admin/strategy/stakeholders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stakeholder_id: selected.id,
          last_contact_date: editDate || null,
          notes: editNotes || null,
        }),
      });
      if (res.ok) {
        setMetaMap((prev) => ({
          ...prev,
          [selected.id]: { last_contact_date: editDate || null, notes: editNotes || null },
        }));
        setMetaSaved(true);
        setTimeout(() => setMetaSaved(false), 2000);
      }
    } finally {
      setSavingMeta(false);
    }
  }

  const filtered = filter === "All" ? ALL_STAKEHOLDERS : ALL_STAKEHOLDERS.filter((s) => s.type === filter);

  async function generateBrief(s: Stakeholder) {
    setSelected(s);
    setDrawerOpen(true);
    setAiOutput("");
    setMetaSaved(false);
    const existingMeta = metaMap[s.id];
    setEditDate(existingMeta?.last_contact_date ?? "");
    setEditNotes(existingMeta?.notes ?? "");
    setLoadingBrief(true);
    const context = `${s.name}${s.org ? ` (${s.org})` : ""}, Type: ${s.type}, Influence: ${s.influence}, Interest: ${s.interest}, Relationship: ${s.relationship}. Engagement note: ${s.engagementStrategy}`;
    try {
      const res = await fetch("/api/admin/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "engagement_brief", context }),
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
      setAiOutput("Error generating brief. Please try again.");
    } finally {
      setLoadingBrief(false);
    }
  }

  function openCreate() {
    setEditingCustomId(null);
    setForm({ ...BLANK_FORM });
    setFormError(null);
    setFormOpen(true);
  }

  function openEditCustom(s: Stakeholder) {
    if (!s.isCustom || !s.dbId) return;
    setEditingCustomId(s.dbId);
    setForm({
      name: s.name,
      org: s.org ?? "",
      type: s.type,
      influence: s.influence,
      interest: s.interest,
      relationship: s.relationship,
      engagement_strategy: s.engagementStrategy,
      last_contact: s.lastContact ?? "",
      ix: s.ix,
      iy: s.iy,
    });
    setFormError(null);
    setFormOpen(true);
  }

  async function saveForm() {
    if (!form.name.trim()) { setFormError("Name is required."); return; }
    setFormSaving(true);
    setFormError(null);

    const payload = {
      name: form.name.trim(),
      org: form.org.trim() || undefined,
      type: form.type,
      influence: form.influence,
      interest: form.interest,
      relationship: form.relationship.trim() || undefined,
      engagement_strategy: form.engagement_strategy.trim() || undefined,
      last_contact: form.last_contact.trim() || undefined,
      ix: form.ix,
      iy: form.iy,
    };

    try {
      let res: Response;
      if (editingCustomId) {
        res = await fetch("/api/admin/strategy/stakeholders", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingCustomId, ...payload }),
        });
      } else {
        res = await fetch("/api/admin/strategy/stakeholders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const json = await res.json() as { error?: string };
        setFormError(json.error ?? "Failed to save. Please try again.");
        return;
      }

      const json = await res.json() as { stakeholder?: CustomStakeholderRow };
      const row = json.stakeholder;
      if (row) {
        const mapped: Stakeholder = {
          id: `custom_${row.id}`,
          dbId: row.id,
          name: row.name,
          org: row.org ?? undefined,
          type: row.type as StakeholderType,
          influence: row.influence as InfluenceLevel,
          interest: row.interest as InfluenceLevel,
          relationship: row.relationship ?? "Prospect",
          engagementStrategy: row.engagement_strategy ?? "",
          lastContact: row.last_contact ?? undefined,
          ix: row.ix,
          iy: row.iy,
          isCustom: true,
        };
        if (editingCustomId) {
          setCustomStakeholders((prev) => prev.map((s) => s.dbId === editingCustomId ? mapped : s));
        } else {
          setCustomStakeholders((prev) => [...prev, mapped]);
        }
      }
      setFormOpen(false);
    } catch {
      setFormError("Network error. Check your connection and try again.");
    } finally {
      setFormSaving(false);
    }
  }

  async function deleteCustom(s: Stakeholder) {
    if (!s.dbId) return;
    setDeletingId(s.dbId);
    try {
      await fetch(`/api/admin/strategy/stakeholders?id=${s.dbId}`, { method: "DELETE" });
      setCustomStakeholders((prev) => prev.filter((c) => c.dbId !== s.dbId));
    } finally {
      setDeletingId(null);
    }
  }

  function exportCSV() {
    const headers = ["Name", "Organisation", "Type", "Influence", "Interest", "Relationship", "Engagement Strategy", "Last Contact"];
    const rows = ALL_STAKEHOLDERS.map((s) => [
      s.name, s.org ?? "", s.type, s.influence, s.interest,
      s.relationship, s.engagementStrategy, displayLastContact(s),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aprn-stakeholder-map.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportSVG() {
    if (!svgRef.current) return;
    const NS = "http://www.w3.org/2000/svg";
    const serializer = new XMLSerializer();
    const clone = svgRef.current.cloneNode(true) as SVGSVGElement;

    const bg = document.createElementNS(NS, "rect");
    bg.setAttribute("x", "0"); bg.setAttribute("y", "0");
    bg.setAttribute("width", "500"); bg.setAttribute("height", "450");
    bg.setAttribute("fill", "#0D2436");
    clone.insertBefore(bg, clone.firstChild);
    clone.setAttribute("viewBox", "0 0 500 450");

    const divider = document.createElementNS(NS, "line");
    divider.setAttribute("x1", "20"); divider.setAttribute("y1", "408");
    divider.setAttribute("x2", "480"); divider.setAttribute("y2", "408");
    divider.setAttribute("stroke", "rgba(255,255,255,0.07)");
    divider.setAttribute("stroke-width", "1");
    clone.appendChild(divider);

    Object.entries(TYPE_COLOR).forEach(([type, color], i) => {
      const lx = 35 + (i % 4) * 115;
      const ly = 422 + Math.floor(i / 4) * 16;
      const circle = document.createElementNS(NS, "circle");
      circle.setAttribute("cx", String(lx)); circle.setAttribute("cy", String(ly));
      circle.setAttribute("r", "4"); circle.setAttribute("fill", color);
      clone.appendChild(circle);
      const text = document.createElementNS(NS, "text");
      text.setAttribute("x", String(lx + 8)); text.setAttribute("y", String(ly + 3));
      text.setAttribute("fill", "#94a3b8"); text.setAttribute("font-size", "8");
      text.setAttribute("font-family", "sans-serif");
      text.textContent = type;
      clone.appendChild(text);
    });

    const blob = new Blob([serializer.serializeToString(clone)], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aprn-stakeholder-matrix.svg";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-1">Strategy Portal</p>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
            Stakeholder Map
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {ALL_STAKEHOLDERS.length} stakeholders across {FILTER_TABS.length - 1} categories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
            title="Download full stakeholder table as CSV"
          >
            <i className="fa-solid fa-table text-[10px]" />
            Export CSV
          </button>
          <button
            onClick={exportSVG}
            className="flex items-center gap-2 px-4 py-2.5 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
            title="Download influence × interest matrix as SVG"
          >
            <i className="fa-solid fa-image text-[10px]" />
            Export Matrix
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-900 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            <i className="fa-solid fa-plus text-[10px]" />
            New Stakeholder
          </button>
        </div>
      </div>

      {/* Influence / Interest Matrix */}
      <section>
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <i className="fa-solid fa-chart-scatter text-gold-500 text-xs" />
          Influence × Interest Matrix
        </h2>
        <div className="bg-navy-800 border border-white/5 p-4 rounded-sm">
          <svg ref={svgRef} viewBox="0 0 500 400" className="w-full max-w-2xl mx-auto" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            <rect x="0"   y="0"   width="250" height="200" fill="rgba(212,160,23,0.03)" />
            <rect x="250" y="0"   width="250" height="200" fill="rgba(212,160,23,0.07)" />
            <rect x="0"   y="200" width="250" height="200" fill="rgba(255,255,255,0.01)" />
            <rect x="250" y="200" width="250" height="200" fill="rgba(212,160,23,0.04)" />
            <line x1="250" y1="0" x2="250" y2="400" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <line x1="0" y1="200" x2="500" y2="200" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <text x="125" y="395" textAnchor="middle" fill="#64748b" fontSize="10">Low Interest</text>
            <text x="375" y="395" textAnchor="middle" fill="#64748b" fontSize="10">High Interest</text>
            <text x="8" y="105" textAnchor="middle" fill="#64748b" fontSize="10" transform="rotate(-90, 8, 105)">High Influence</text>
            <text x="8" y="305" textAnchor="middle" fill="#64748b" fontSize="10" transform="rotate(-90, 8, 305)">Low Influence</text>
            <text x="125" y="20" textAnchor="middle" fill="rgba(212,160,23,0.4)" fontSize="9" fontWeight="bold">KEEP INFORMED</text>
            <text x="375" y="20" textAnchor="middle" fill="rgba(212,160,23,0.6)" fontSize="9" fontWeight="bold">KEY PLAYERS</text>
            <text x="125" y="215" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="9" fontWeight="bold">MONITOR</text>
            <text x="375" y="215" textAnchor="middle" fill="rgba(212,160,23,0.4)" fontSize="9" fontWeight="bold">KEEP ENGAGED</text>
            {ALL_STAKEHOLDERS.map((s) => {
              const x = (s.ix / 10) * 480 + 10;
              const y = 390 - (s.iy / 10) * 380;
              const color = TYPE_COLOR[s.type];
              return (
                <g key={s.id} onClick={() => generateBrief(s)} style={{ cursor: "pointer" }}>
                  <circle cx={x} cy={y} r={s.isCustom ? 8 : 7} fill={color} opacity={s.isCustom ? 1 : 0.85}
                    stroke={s.isCustom ? "#fff" : "none"} strokeWidth={s.isCustom ? 1 : 0} />
                  <text x={x} y={y - 10} textAnchor="middle" fill="#fff" fontSize="7" fontWeight="bold">
                    {s.name.split(" ")[0].slice(0, 8)}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="flex flex-wrap gap-3 mt-3 justify-center">
            {Object.entries(TYPE_COLOR).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                <span className="text-[10px] text-slate-400">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Tabs + Table */}
      <section>
        <div className="flex gap-1 flex-wrap mb-4">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors border ${
                filter === tab.value
                  ? "bg-gold-500 text-navy-900 border-gold-500"
                  : "bg-transparent text-slate-400 border-white/10 hover:text-white hover:border-white/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto border border-white/5 rounded-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-700">
                {["Name", "Organisation", "Type", "Influence", "Interest", "Relationship", "Engagement Strategy", "Last Contact", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-gold-500 uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr
                  key={s.id}
                  className={`border-t border-white/5 ${i % 2 === 0 ? "bg-navy-800" : "bg-navy-800/60"} hover:bg-navy-700 transition-colors group`}
                >
                  <td className="px-4 py-3 font-semibold text-white text-xs whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      {s.name}
                      {s.isCustom && (
                        <span className="text-[8px] font-bold text-gold-500/70 border border-gold-500/20 px-1 py-px uppercase tracking-widest">custom</span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{s.org ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ color: TYPE_COLOR[s.type], background: TYPE_COLOR[s.type] + "22", border: `1px solid ${TYPE_COLOR[s.type]}44` }}>
                      {s.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${INF_COLOR[s.influence]}`}>{s.influence}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${INF_COLOR[s.interest]}`}>{s.interest}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{s.relationship}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs max-w-xs">{s.engagementStrategy}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{displayLastContact(s)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => generateBrief(s)}
                        className="text-[10px] font-bold text-gold-500 hover:text-gold-400 uppercase tracking-widest whitespace-nowrap flex items-center gap-1"
                      >
                        <i className="fa-solid fa-wand-magic-sparkles text-[9px]" /> Brief
                      </button>
                      {s.isCustom && (
                        <>
                          <span className="text-white/10">|</span>
                          <button onClick={() => openEditCustom(s)} className="text-[10px] text-slate-400 hover:text-white" title="Edit">
                            <i className="fa-solid fa-pen text-[9px]" />
                          </button>
                          <button
                            onClick={() => deleteCustom(s)}
                            disabled={deletingId === s.dbId}
                            className="text-[10px] text-slate-500 hover:text-red-400 disabled:opacity-40"
                            title="Delete"
                          >
                            {deletingId === s.dbId
                              ? <i className="fa-solid fa-spinner animate-spin text-[9px]" />
                              : <i className="fa-solid fa-trash text-[9px]" />}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Engagement Brief Drawer */}
      {drawerOpen && selected && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setDrawerOpen(false)}>
          <div
            className="w-full max-w-md h-full bg-navy-800 border-l border-white/5 overflow-y-auto flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-navy-700 shrink-0">
              <div>
                <p className="text-[10px] font-bold text-gold-500 uppercase tracking-widest mb-0.5">Engagement Brief</p>
                <h3 className="text-base font-bold text-white">{selected.name}</h3>
                {selected.org && <p className="text-xs text-slate-400">{selected.org}</p>}
              </div>
              <button onClick={() => setDrawerOpen(false)} className="text-slate-400 hover:text-white p-2">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 flex-1">
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 border rounded-full"
                  style={{ color: TYPE_COLOR[selected.type], background: TYPE_COLOR[selected.type] + "22", border: `1px solid ${TYPE_COLOR[selected.type]}44` }}>
                  {selected.type}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${INF_COLOR[selected.influence]}`}>
                  Influence: {selected.influence}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${INF_COLOR[selected.interest]}`}>
                  Interest: {selected.interest}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-navy-900 border border-white/5 p-3 rounded-sm">
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Relationship</p>
                  <p className="text-xs font-semibold text-white">{selected.relationship}</p>
                </div>
                <div className="bg-navy-900 border border-white/5 p-3 rounded-sm">
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Last Contact</p>
                  <p className="text-xs font-semibold text-white">{displayLastContact(selected)}</p>
                </div>
              </div>

              <div className="bg-navy-900 border border-white/5 p-4 rounded-sm">
                <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-2">Engagement Strategy</p>
                <p className="text-xs text-slate-300 leading-relaxed">{selected.engagementStrategy}</p>
              </div>

              <div className="border border-white/10 rounded-sm p-4 space-y-3 bg-navy-900/50">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <i className="fa-solid fa-pen-to-square text-gold-500/60" />
                  Update Contact Log
                </p>
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1">Last Contact Date</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full bg-navy-800 border border-white/10 text-xs text-white px-3 py-2 focus:border-gold-500/50 focus:outline-none scheme-dark"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1">Notes</label>
                  <textarea
                    rows={3}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Meeting notes, next steps, context…"
                    className="w-full bg-navy-800 border border-white/10 text-xs text-white px-3 py-2 placeholder-slate-600 focus:border-gold-500/50 focus:outline-none resize-none"
                  />
                </div>
                <button
                  onClick={saveMeta}
                  disabled={savingMeta}
                  className="w-full py-2 bg-navy-700 hover:bg-navy-600 border border-white/10 hover:border-white/20 disabled:opacity-50 text-xs text-white font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {metaSaved ? (
                    <><i className="fa-solid fa-check text-emerald-400" /><span className="text-emerald-400">Saved</span></>
                  ) : savingMeta ? (
                    <><i className="fa-solid fa-spinner animate-spin" />Saving…</>
                  ) : (
                    <><i className="fa-solid fa-floppy-disk text-slate-400" />Save Contact Log</>
                  )}
                </button>
                {metaMap[selected.id]?.notes && (
                  <div className="pt-2 border-t border-white/5">
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Saved Note</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{metaMap[selected.id].notes}</p>
                  </div>
                )}
              </div>

              <div className="border border-gold-500/20 bg-navy-900 rounded-sm overflow-hidden flex-1">
                <div className="bg-gold-500/10 px-4 py-2 border-b border-gold-500/20 flex items-center gap-2">
                  <i className="fa-solid fa-wand-magic-sparkles text-gold-500 text-[10px]" />
                  <span className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">AI Engagement Brief</span>
                </div>
                <div className="p-4 min-h-32">
                  {loadingBrief && !aiOutput && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-pulse" />
                      Generating brief…
                    </div>
                  )}
                  {aiOutput && (
                    <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {aiOutput}
                      {loadingBrief && <span className="inline-block w-0.5 h-3 bg-gold-500 animate-pulse ml-0.5" />}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => generateBrief(selected)}
                disabled={loadingBrief}
                className="w-full py-2.5 bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-navy-900 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                <i className={`fa-solid fa-wand-magic-sparkles text-[10px] ${loadingBrief ? "animate-spin" : ""}`} />
                {loadingBrief ? "Generating…" : "Regenerate Brief"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Stakeholder Drawer */}
      {formOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setFormOpen(false)} />
          <div
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 bg-navy-900 border-l border-white/10 flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-0.5">
                  {editingCustomId ? "Edit Stakeholder" : "New Stakeholder"}
                </p>
                <h2 className="text-sm font-bold text-white">
                  {editingCustomId ? form.name || "—" : "Add to Stakeholder Map"}
                </h2>
              </div>
              <button onClick={() => setFormOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              <FormField label="Name *">
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Chevron Nigeria"
                  className="w-full bg-navy-800 border border-white/10 text-xs text-white px-3 py-2.5 placeholder-slate-600 focus:border-gold-500/50 focus:outline-none"
                />
              </FormField>

              <FormField label="Organisation">
                <input
                  value={form.org}
                  onChange={(e) => setForm((f) => ({ ...f, org: e.target.value }))}
                  placeholder="e.g. IOC"
                  className="w-full bg-navy-800 border border-white/10 text-xs text-white px-3 py-2.5 placeholder-slate-600 focus:border-gold-500/50 focus:outline-none"
                />
              </FormField>

              <div className="grid grid-cols-3 gap-3">
                <FormField label="Type">
                  <select
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as StakeholderType }))}
                    className="w-full bg-navy-800 border border-white/10 text-xs text-white px-3 py-2.5 focus:border-gold-500/50 focus:outline-none"
                  >
                    {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </FormField>
                <FormField label="Influence">
                  <select
                    value={form.influence}
                    onChange={(e) => setForm((f) => ({ ...f, influence: e.target.value as InfluenceLevel }))}
                    className="w-full bg-navy-800 border border-white/10 text-xs text-white px-3 py-2.5 focus:border-gold-500/50 focus:outline-none"
                  >
                    {INFLUENCE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </FormField>
                <FormField label="Interest">
                  <select
                    value={form.interest}
                    onChange={(e) => setForm((f) => ({ ...f, interest: e.target.value as InfluenceLevel }))}
                    className="w-full bg-navy-800 border border-white/10 text-xs text-white px-3 py-2.5 focus:border-gold-500/50 focus:outline-none"
                  >
                    {INFLUENCE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </FormField>
              </div>

              <FormField label="Relationship Status">
                <input
                  value={form.relationship}
                  onChange={(e) => setForm((f) => ({ ...f, relationship: e.target.value }))}
                  placeholder="e.g. Prospect, Active Partner, Target"
                  className="w-full bg-navy-800 border border-white/10 text-xs text-white px-3 py-2.5 placeholder-slate-600 focus:border-gold-500/50 focus:outline-none"
                />
              </FormField>

              <FormField label="Engagement Strategy">
                <textarea
                  rows={3}
                  value={form.engagement_strategy}
                  onChange={(e) => setForm((f) => ({ ...f, engagement_strategy: e.target.value }))}
                  placeholder="How APRN engages this stakeholder — channels, frequency, goals…"
                  className="w-full bg-navy-800 border border-white/10 text-xs text-white px-3 py-2.5 placeholder-slate-600 focus:border-gold-500/50 focus:outline-none resize-none"
                />
              </FormField>

              <FormField label="Last Contact">
                <input
                  value={form.last_contact}
                  onChange={(e) => setForm((f) => ({ ...f, last_contact: e.target.value }))}
                  placeholder="e.g. June 2026, None"
                  className="w-full bg-navy-800 border border-white/10 text-xs text-white px-3 py-2.5 placeholder-slate-600 focus:border-gold-500/50 focus:outline-none"
                />
              </FormField>

              <div>
                <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">
                  Matrix Position
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Interest (0–10)</label>
                    <input
                      type="number" min="0" max="10" step="0.5"
                      value={form.ix}
                      onChange={(e) => setForm((f) => ({ ...f, ix: parseFloat(e.target.value) || 5 }))}
                      className="w-full bg-navy-800 border border-white/10 text-xs text-white px-3 py-2.5 focus:border-gold-500/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Influence (0–10)</label>
                    <input
                      type="number" min="0" max="10" step="0.5"
                      value={form.iy}
                      onChange={(e) => setForm((f) => ({ ...f, iy: parseFloat(e.target.value) || 5 }))}
                      className="w-full bg-navy-800 border border-white/10 text-xs text-white px-3 py-2.5 focus:border-gold-500/50 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs text-red-400 flex items-center gap-2">
                  <i className="fa-solid fa-circle-exclamation shrink-0" />
                  {formError}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-white/5 shrink-0 flex items-center justify-between gap-3">
              <button
                onClick={() => setFormOpen(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveForm}
                disabled={formSaving || !form.name.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-navy-900 text-xs font-bold tracking-wide uppercase transition-colors"
              >
                {formSaving
                  ? <><i className="fa-solid fa-spinner animate-spin" />Saving…</>
                  : <><i className="fa-solid fa-check" />{editingCustomId ? "Update Stakeholder" : "Add Stakeholder"}</>
                }
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
