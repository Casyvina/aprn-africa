"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import StatusPill from "./StatusPill";
import type { Pipeline, PipelineFuel, PipelineStatus } from "@/lib/pipelines/data";

const STATUS_ORDER: PipelineStatus[] = ["operating", "proposed", "construction", "shelved", "cancelled", "retired"];
const FUEL_LABELS: Record<PipelineFuel, string> = { Gas: "Gas", Oil: "Oil", NGL: "NGL" };

interface Props {
  pipelines: Pipeline[];
  countrySlug: string;
  totalCount: number;
}

export default function PipelineFilterList({ pipelines, countrySlug, totalCount }: Props) {
  const availableStatuses = useMemo(
    () => STATUS_ORDER.filter((s) => pipelines.some((p) => p.status === s)),
    [pipelines],
  );
  const availableFuels = useMemo(
    () => (["Gas", "Oil", "NGL"] as PipelineFuel[]).filter((f) => pipelines.some((p) => p.fuel === f)),
    [pipelines],
  );

  const [selectedStatuses, setSelectedStatuses] = useState<Set<PipelineStatus>>(new Set(availableStatuses));
  const [selectedFuels, setSelectedFuels] = useState<Set<PipelineFuel>>(new Set(availableFuels));
  const [operatorSearch, setOperatorSearch] = useState("");

  const filtered = useMemo(
    () =>
      pipelines.filter(
        (p) =>
          selectedStatuses.has(p.status) &&
          selectedFuels.has(p.fuel) &&
          (!operatorSearch || (p.owner ?? "").toLowerCase().includes(operatorSearch.toLowerCase())),
      ),
    [pipelines, selectedStatuses, selectedFuels, operatorSearch],
  );

  function toggleStatus(s: PipelineStatus) {
    setSelectedStatuses((prev) => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });
  }

  function toggleFuel(f: PipelineFuel) {
    setSelectedFuels((prev) => {
      const next = new Set(prev);
      next.has(f) ? next.delete(f) : next.add(f);
      return next;
    });
  }

  const byStatus = STATUS_ORDER.reduce<Record<string, number>>((acc, s) => {
    acc[s] = pipelines.filter((p) => p.status === s).length;
    return acc;
  }, {});

  if (pipelines.length === 0) {
    return (
      <div style={{ padding: "60px 0", textAlign: "center", color: "#7c8b98" }}>
        <p style={{ fontSize: 15, marginBottom: 8 }}>Data loading soon</p>
        <p style={{ fontSize: 13 }}>Pipeline records for this country will be available once the full dataset is imported.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "230px 1fr", gap: 44 }}>

      {/* Filter rail */}
      <aside>
        <div style={{ paddingBottom: 22, marginBottom: 22, borderBottom: "1px solid rgba(255,255,255,.06)" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#7c8b98", textTransform: "uppercase", marginBottom: 14 }}>Status</p>
          {STATUS_ORDER.map((s) => {
            const count = byStatus[s] ?? 0;
            const active = count > 0;
            const checked = selectedStatuses.has(s);
            return (
              <div
                key={s}
                onClick={() => active && toggleStatus(s)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "6px 0", fontSize: 13,
                  color: active ? "#c4ced6" : "#7c8b98",
                  opacity: active ? 1 : 0.45,
                  cursor: active ? "pointer" : "default",
                }}
                className={active ? "hover:text-white transition-colors" : ""}
              >
                <div style={{
                  width: 14, height: 14, flexShrink: 0,
                  border: `1.5px solid ${active && checked ? "#D4A017" : "#15324A"}`,
                  background: active && checked ? "#D4A017" : "transparent",
                  position: "relative",
                }}>
                  {active && checked && (
                    <span style={{ position: "absolute", left: 3, top: 0, color: "#071B2A", fontSize: 10, fontWeight: 900, lineHeight: "14px" }}>✓</span>
                  )}
                </div>
                <span style={{ textTransform: "capitalize" }}>{s}</span>
                <span style={{ marginLeft: "auto", color: "#7c8b98", fontSize: 11.5 }}>{count}</span>
              </div>
            );
          })}
        </div>

        <div style={{ paddingBottom: 22, marginBottom: 22, borderBottom: "1px solid rgba(255,255,255,.06)" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#7c8b98", textTransform: "uppercase", marginBottom: 14 }}>Fuel</p>
          {(["Gas", "Oil", "NGL"] as PipelineFuel[]).map((f) => {
            const count = pipelines.filter((p) => p.fuel === f).length;
            const checked = selectedFuels.has(f);
            return (
              <div
                key={f}
                onClick={() => count > 0 && toggleFuel(f)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "6px 0", fontSize: 13,
                  color: count > 0 ? "#c4ced6" : "#7c8b98",
                  opacity: count > 0 ? 1 : 0.45,
                  cursor: count > 0 ? "pointer" : "default",
                }}
                className={count > 0 ? "hover:text-white transition-colors" : ""}
              >
                <div style={{
                  width: 14, height: 14, flexShrink: 0,
                  border: `1.5px solid ${count > 0 && checked ? "#D4A017" : "#15324A"}`,
                  background: count > 0 && checked ? "#D4A017" : "transparent",
                  position: "relative",
                }}>
                  {count > 0 && checked && (
                    <span style={{ position: "absolute", left: 3, top: 0, color: "#071B2A", fontSize: 10, fontWeight: 900, lineHeight: "14px" }}>✓</span>
                  )}
                </div>
                {FUEL_LABELS[f]}
                <span style={{ marginLeft: "auto", color: "#7c8b98", fontSize: 11.5 }}>{count}</span>
              </div>
            );
          })}
        </div>

        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#7c8b98", textTransform: "uppercase", marginBottom: 14 }}>Operator</p>
          <input
            placeholder="Search operator…"
            value={operatorSearch}
            onChange={(e) => setOperatorSearch(e.target.value)}
            style={{
              width: "100%", background: "#0D2436", border: "1px solid rgba(255,255,255,.10)",
              color: "#e8edf1", padding: "10px 12px", fontFamily: "var(--font-inter)", fontSize: 12.5,
              outline: "none",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(212,160,23,.4)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,.10)")}
          />
          {operatorSearch && (
            <button
              onClick={() => setOperatorSearch("")}
              style={{ marginTop: 6, fontSize: 11, color: "#7c8b98", cursor: "pointer", background: "none", border: "none", padding: 0 }}
              className="hover:text-white transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </aside>

      {/* Pipeline list */}
      <section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,.10)", marginBottom: 4 }}>
          <p style={{ fontSize: 12, color: "#7c8b98" }}>
            <strong style={{ color: "#e8edf1" }}>{filtered.length}</strong>
            {filtered.length !== pipelines.length && <span> of {pipelines.length}</span>}
            {" "}pipelines
            {filtered.length !== totalCount && <span style={{ opacity: .6 }}> (full dataset: {totalCount})</span>}
          </p>
          <p style={{ fontSize: 12, color: "#c4ced6" }}>Sort: <strong style={{ color: "#D4A017" }}>Length ▾</strong></p>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: "48px 0", textAlign: "center", color: "#7c8b98" }}>
            <p style={{ fontSize: 14 }}>No pipelines match the current filters.</p>
          </div>
        ) : (
          filtered.map((p) => (
            <Link
              key={p.slug}
              href={`/intelligence/pipelines/${countrySlug}/${p.slug}`}
              style={{ display: "block", textDecoration: "none" }}
            >
              <div
                style={{
                  display: "flex", alignItems: "flex-start", gap: 20,
                  padding: "20px 4px", borderBottom: "1px solid rgba(255,255,255,.06)",
                }}
                className="hover:bg-white/[.015] transition-colors"
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: 19, lineHeight: 1.2, color: "#e8edf1" }}>
                    {p.name}
                  </div>
                  <div style={{ marginTop: 7, fontSize: 12.5, color: "#7c8b98" }}>
                    {p.fromCountry}
                    <span style={{ color: "#C97A2B", margin: "0 7px" }}>→</span>
                    {p.toCountry}
                    {p.countries.length > 2 && (
                      <span style={{ opacity: .5 }}> · {p.countries.length} countries</span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 16, marginTop: 11, fontSize: 11.5, color: "#9fb0bd" }}>
                    {p.lengthKm && (
                      <span>
                        <span style={{ color: "#7c8b98" }}>Length </span>
                        <strong style={{ color: "#d6dee4", fontVariantNumeric: "tabular-nums" }}>{p.lengthKm.toLocaleString()} km</strong>
                      </span>
                    )}
                    {p.owner && (
                      <span>
                        <span style={{ color: "#7c8b98" }}>Owner </span>
                        <strong style={{ color: "#d6dee4" }}>{p.owner}</strong>
                      </span>
                    )}
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", color: "#7c8b98", textTransform: "uppercase" }}>{p.fuel}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12, flexShrink: 0 }}>
                  <StatusPill status={p.status} />
                </div>
              </div>
            </Link>
          ))
        )}
      </section>
    </div>
  );
}
