"use client";

import { useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────

export type DbDbRow = Record<string, string | null | boolean | number>;

interface TabConfig {
  key: string;
  label: string;
  icon: string;
  table: string;
  primaryField: string;
  secondaryField: string;
  columns: { key: string; label: string; wide?: boolean }[];
}

// ─── Tab definitions ──────────────────────────────────────

const TABS: TabConfig[] = [
  {
    key: "operators",
    label: "Pipeline Operators",
    icon: "fa-industry",
    table: "pipeline_operators",
    primaryField: "company_name",
    secondaryField: "country",
    columns: [
      { key: "company_name", label: "Company", wide: true },
      { key: "country", label: "Country" },
      { key: "type", label: "Type" },
      { key: "contact_person", label: "Contact" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
    ],
  },
  {
    key: "contractors",
    label: "Contractors & EPC",
    icon: "fa-hard-hat",
    table: "contractors_epc",
    primaryField: "company_name",
    secondaryField: "country_hq",
    columns: [
      { key: "company_name", label: "Company", wide: true },
      { key: "country_hq", label: "Country / HQ" },
      { key: "specialisation", label: "Specialisation", wide: true },
      { key: "contact_person", label: "Contact" },
      { key: "email", label: "Email" },
    ],
  },
  {
    key: "engineers",
    label: "Pipeline Engineers",
    icon: "fa-person-digging",
    table: "pipeline_engineers",
    primaryField: "full_name",
    secondaryField: "organisation",
    columns: [
      { key: "full_name", label: "Name" },
      { key: "organisation", label: "Organisation", wide: true },
      { key: "role_specialisation", label: "Role", wide: true },
      { key: "location", label: "Location" },
      { key: "email", label: "Email" },
    ],
  },
  {
    key: "regulators",
    label: "Regulators & Assoc.",
    icon: "fa-scale-balanced",
    table: "regulators_associations",
    primaryField: "organisation",
    secondaryField: "type",
    columns: [
      { key: "organisation", label: "Organisation", wide: true },
      { key: "type", label: "Type" },
      { key: "country_region", label: "Region" },
      { key: "contact_email", label: "Email" },
      { key: "phone", label: "Phone" },
    ],
  },
  {
    key: "sources",
    label: "Research Sources",
    icon: "fa-link",
    table: "research_sources",
    primaryField: "title",
    secondaryField: "category",
    columns: [
      { key: "title", label: "Title", wide: true },
      { key: "url", label: "URL", wide: true },
      { key: "category", label: "Category" },
      { key: "source_type", label: "Type" },
      { key: "added_by", label: "Added By" },
    ],
  },
];

// ─── Field configs per table ──────────────────────────────

const FIELDS: Record<string, { key: string; label: string; multiline?: boolean; type?: string }[]> = {
  pipeline_operators: [
    { key: "company_name", label: "Company Name" },
    { key: "country", label: "Country" },
    { key: "type", label: "Type" },
    { key: "key_pipeline_assets", label: "Key Pipeline Assets", multiline: true },
    { key: "hq_address", label: "HQ Address" },
    { key: "website", label: "Website" },
    { key: "contact_person", label: "Contact Person" },
    { key: "title", label: "Title / Role" },
    { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Phone", type: "tel" },
    { key: "notes", label: "Notes", multiline: true },
  ],
  contractors_epc: [
    { key: "company_name", label: "Company Name" },
    { key: "country_hq", label: "Country / HQ" },
    { key: "specialisation", label: "Specialisation" },
    { key: "key_projects_africa", label: "Key Projects in Africa", multiline: true },
    { key: "address", label: "Address" },
    { key: "website", label: "Website" },
    { key: "contact_person", label: "Contact Person" },
    { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Phone", type: "tel" },
    { key: "notes", label: "Notes", multiline: true },
  ],
  pipeline_engineers: [
    { key: "full_name", label: "Full Name" },
    { key: "organisation", label: "Organisation" },
    { key: "role_specialisation", label: "Role / Specialisation" },
    { key: "qualifications", label: "Qualifications" },
    { key: "location", label: "Location" },
    { key: "linkedin_web", label: "LinkedIn / Web Profile" },
    { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Phone", type: "tel" },
    { key: "notes", label: "Notes", multiline: true },
  ],
  regulators_associations: [
    { key: "organisation", label: "Organisation" },
    { key: "type", label: "Type" },
    { key: "country_region", label: "Country / Region" },
    { key: "relevance_to_aprn", label: "Relevance to APRN", multiline: true },
    { key: "website", label: "Website" },
    { key: "contact_email", label: "Contact Email", type: "email" },
    { key: "key_contact_title", label: "Key Contact / Title" },
    { key: "phone", label: "Phone", type: "tel" },
    { key: "notes", label: "Notes", multiline: true },
  ],
  research_sources: [
    { key: "title", label: "Title" },
    { key: "url", label: "URL", type: "url" },
    { key: "description", label: "Description", multiline: true },
    { key: "category", label: "Category" },
    { key: "source_type", label: "Source Type" },
    { key: "date_published", label: "Date Published", type: "date" },
    { key: "added_by", label: "Added By" },
    { key: "notes", label: "Notes", multiline: true },
  ],
};

// ─── Props ────────────────────────────────────────────────

interface Props {
  initialOperators: DbRow[];
  initialContractors: DbRow[];
  initialEngineers: DbRow[];
  initialRegulators: DbRow[];
  initialSources: DbRow[];
}

// ─── Main Component ───────────────────────────────────────

export default function DatabasePageClient({
  initialOperators,
  initialContractors,
  initialEngineers,
  initialRegulators,
  initialSources,
}: Props) {
  const [activeTab, setActiveTab] = useState("operators");
  const [search, setSearch] = useState("");

  const [data, setData] = useState<Record<string, DbRow[]>>({
    operators: initialOperators,
    contractors: initialContractors,
    engineers: initialEngineers,
    regulators: initialRegulators,
    sources: initialSources,
  });

  // Modal state
  const [modal, setModal] = useState<{ mode: "add" | "edit"; row?: DbRow } | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // AI assist state
  const [aiPanel, setAiPanel] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const tab = TABS.find((t) => t.key === activeTab)!;
  const fields = FIELDS[tab.table];

  const rows = data[activeTab] ?? [];
  const filtered = search.trim()
    ? rows.filter((r) =>
        Object.values(r).some((v) => typeof v === "string" && v.toLowerCase().includes(search.toLowerCase()))
      )
    : rows;

  // ─── CRUD helpers ─────────────────────────────────────

  const openAdd = useCallback(() => {
    setFormData({});
    setModal({ mode: "add" });
  }, []);

  const openEdit = useCallback((row: DbRow) => {
    const stringified = Object.fromEntries(
      Object.entries(row).map(([k, v]) => [k, v != null ? String(v) : ""])
    );
    setFormData(stringified);
    setModal({ mode: "edit", row });
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
    setFormData({});
    setAiPrompt("");
    setAiError("");
    setAiPanel(false);
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      if (modal?.mode === "add") {
        const res = await fetch("/api/admin/database", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ table: tab.table, data: formData }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        setData((prev) => ({ ...prev, [activeTab]: [...(prev[activeTab] ?? []), json.data] }));
      } else if (modal?.mode === "edit" && modal.row?.id) {
        const res = await fetch("/api/admin/database", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ table: tab.table, id: modal.row.id, data: formData }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        setData((prev) => ({
          ...prev,
          [activeTab]: (prev[activeTab] ?? []).map((r) => (r.id === modal.row?.id ? json.data : r)),
        }));
      }
      closeModal();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSaving(false);
    }
  }, [modal, formData, tab.table, activeTab, closeModal]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const res = await fetch("/api/admin/database", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: tab.table, id }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setData((prev) => ({
        ...prev,
        [activeTab]: (prev[activeTab] ?? []).filter((r) => r.id !== id),
      }));
      setDeleteConfirm(null);
    } catch (e) {
      alert((e as Error).message);
    }
  }, [tab.table, activeTab]);

  const handleExport = useCallback(async () => {
    const res = await fetch("/api/admin/database/export");
    if (!res.ok) { alert("Export failed"); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `APRN_Pipeline_Database_${new Date().toISOString().slice(0, 10)}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleAiGenerate = useCallback(async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiError("");
    try {
      const res = await fetch("/api/admin/database/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: tab.table,
          prompt: aiPrompt,
          existingRecord: modal?.mode === "edit" ? formData : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      const stringRecord = Object.fromEntries(
        Object.entries(json.record as Record<string, unknown>).map(([k, v]) => [k, v != null ? String(v) : ""])
      );
      setFormData((prev) => ({ ...prev, ...stringRecord }));
      setAiPanel(false);
      setAiPrompt("");
    } catch (e) {
      setAiError((e as Error).message);
    } finally {
      setAiLoading(false);
    }
  }, [aiPrompt, tab.table, modal?.mode, formData]);

  // ─── Render ───────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6 max-w-360">

      {/* Header */}
      <div className="flex items-start justify-between border-b border-white/5 pb-6">
        <div>
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Pipeline Database
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {rows.length} records &mdash; {tab.label}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 border border-gold-500/30 text-gold-500 hover:bg-gold-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            <i className="fa-solid fa-file-excel text-[11px]" />
            Export Excel
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            <i className="fa-solid fa-plus text-[11px]" />
            Add Record
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-white/5 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => { setActiveTab(t.key); setSearch(""); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap border-b-2 transition-colors ${
              activeTab === t.key
                ? "border-gold-500 text-gold-500"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            <i className={`fa-solid ${t.icon}`} />
            {t.label}
            <span className="text-[9px] bg-navy-800 border border-white/5 px-1.5 py-0.5 text-slate-500">
              {data[t.key]?.length ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[11px]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${tab.label.toLowerCase()}...`}
          className="w-full bg-navy-800 border border-white/5 pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/30"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
          >
            <i className="fa-solid fa-xmark text-[11px]" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-navy-800 border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5">
                {tab.columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-left text-[10px] font-bold tracking-widest uppercase text-slate-500 ${col.wide ? "min-w-48" : "min-w-28"}`}
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-[10px] font-bold tracking-widest uppercase text-slate-500 w-20">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={tab.columns.length + 1} className="px-4 py-12 text-center text-slate-500">
                    {search ? "No results found." : "No records yet. Add the first one."}
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.id ?? ""} className="border-b border-white/5 hover:bg-navy-700/40 transition-colors group">
                    {tab.columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-slate-300">
                        {col.key === "url" && row[col.key] ? (
                          <a
                            href={String(row[col.key]).startsWith("http") ? String(row[col.key]) : `https://${row[col.key]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gold-500 hover:text-gold-400 underline truncate block max-w-xs"
                          >
                            {String(row[col.key])}
                          </a>
                        ) : (
                          <span className="truncate block max-w-xs" title={row[col.key] != null ? String(row[col.key]) : ""}>
                            {row[col.key] != null ? String(row[col.key]) : <span className="text-slate-600">—</span>}
                          </span>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(row)}
                          className="text-slate-500 hover:text-gold-500 transition-colors"
                          title="Edit"
                        >
                          <i className="fa-solid fa-pen text-[10px]" />
                        </button>
                        {deleteConfirm === row.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(row.id!)}
                              className="text-[9px] text-red-400 font-bold"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-[9px] text-slate-500"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(row.id ?? null)}
                            className="text-slate-500 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <i className="fa-solid fa-trash text-[10px]" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record count footer */}
      {search && (
        <p className="text-[10px] text-slate-500">
          Showing {filtered.length} of {rows.length} records
        </p>
      )}

      {/* ── Add / Edit Modal ── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative z-10 h-full w-full max-w-2xl bg-navy-900 border-l border-white/5 flex flex-col overflow-hidden">

            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 shrink-0">
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-gold-500">
                  {modal.mode === "add" ? "New Record" : "Edit Record"}
                </p>
                <h2 className="text-sm font-semibold text-white mt-0.5" style={{ fontFamily: "var(--font-playfair), serif" }}>
                  {tab.label}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAiPanel(!aiPanel)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                    aiPanel
                      ? "bg-gold-500/20 border border-gold-500/40 text-gold-500"
                      : "border border-white/10 text-slate-400 hover:text-gold-500"
                  }`}
                >
                  <i className="fa-solid fa-wand-magic-sparkles text-[10px]" />
                  AI Assist
                </button>
                <button onClick={closeModal} className="text-slate-500 hover:text-white transition-colors">
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            </div>

            {/* AI panel */}
            {aiPanel && (
              <div className="px-6 py-4 bg-navy-800 border-b border-white/5 shrink-0">
                <p className="text-[10px] text-gold-500 font-bold uppercase tracking-widest mb-2">
                  AI Fill
                </p>
                <p className="text-[11px] text-slate-400 mb-3">
                  Describe what to {modal.mode === "edit" ? "update" : "add"} and AI will fill the fields.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAiGenerate()}
                    placeholder={`e.g. "Kenya Pipeline Company, government operator in Nairobi"`}
                    className="flex-1 bg-navy-900 border border-white/10 px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/30"
                  />
                  <button
                    onClick={handleAiGenerate}
                    disabled={aiLoading || !aiPrompt.trim()}
                    className="bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-navy-900 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    {aiLoading ? <i className="fa-solid fa-spinner fa-spin" /> : "Fill"}
                  </button>
                </div>
                {aiError && <p className="text-[11px] text-red-400 mt-2">{aiError}</p>}
              </div>
            )}

            {/* Form fields */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="flex flex-col gap-4">
                {fields.map((f) => (
                  <div key={f.key}>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1.5">
                      {f.label}
                    </label>
                    {f.multiline ? (
                      <textarea
                        value={formData[f.key] ?? ""}
                        onChange={(e) => setFormData((p) => ({ ...p, [f.key]: e.target.value }))}
                        rows={3}
                        className="w-full bg-navy-800 border border-white/10 px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/30 resize-none"
                      />
                    ) : (
                      <input
                        type={f.type ?? "text"}
                        value={formData[f.key] ?? ""}
                        onChange={(e) => setFormData((p) => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full bg-navy-800 border border-white/10 px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/30"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer actions */}
            <div className="px-6 py-4 border-t border-white/5 shrink-0 flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                className="border border-white/10 text-slate-400 hover:text-white px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-navy-900 px-6 py-2 text-xs font-bold uppercase tracking-widest transition-colors"
              >
                {saving ? "Saving..." : modal.mode === "add" ? "Add Record" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
