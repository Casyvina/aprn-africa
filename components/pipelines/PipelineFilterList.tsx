"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import StatusPill from "./StatusPill";
import type { Pipeline, PipelineFuel, PipelineStatus } from "@/lib/pipelines/data";

const STATUS_ORDER: PipelineStatus[] = ["operating", "proposed", "construction", "shelved", "cancelled", "retired"];
const FUEL_LABELS: Record<PipelineFuel, string> = { Gas: "Gas", Oil: "Oil", NGL: "NGL" };
const PAGE_SIZE = 12;

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
  const [page, setPage] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const resultsRef = useRef<HTMLElement>(null);

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

  useEffect(() => { setPage(0); }, [selectedStatuses, selectedFuels, operatorSearch]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const activeFilterDiff = useMemo(() => {
    const deselected =
      availableStatuses.filter((s) => !selectedStatuses.has(s)).length +
      availableFuels.filter((f) => !selectedFuels.has(f)).length;
    return deselected + (operatorSearch ? 1 : 0);
  }, [availableStatuses, availableFuels, selectedStatuses, selectedFuels, operatorSearch]);

  function toggleStatus(s: PipelineStatus) {
    setSelectedStatuses((prev) => { const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n; });
  }
  function toggleFuel(f: PipelineFuel) {
    setSelectedFuels((prev) => { const n = new Set(prev); n.has(f) ? n.delete(f) : n.add(f); return n; });
  }
  function clearFilters() {
    setSelectedStatuses(new Set(availableStatuses));
    setSelectedFuels(new Set(availableFuels));
    setOperatorSearch("");
  }
  function changePage(next: number) {
    setPage(next);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  const filterRail = (
    <aside>
      {/* Status */}
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
                padding: "7px 0", fontSize: 13,
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

      {/* Fuel */}
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
                padding: "7px 0", fontSize: 13,
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

      {/* Operator search */}
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

      {/* Clear all */}
      {activeFilterDiff > 0 && (
        <button
          onClick={clearFilters}
          style={{
            marginTop: 22, width: "100%", padding: "9px 0",
            fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase",
            color: "#D4A017", border: "1px solid rgba(212,160,23,.3)", background: "transparent", cursor: "pointer",
          }}
          className="hover:bg-gold-500/10 transition-colors"
        >
          Clear filters
        </button>
      )}
    </aside>
  );

  return (
    <div>
      {/* Mobile filter toggle */}
      <div className="md:hidden mb-5">
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%",
            border: "1px solid rgba(255,255,255,.12)", padding: "12px 16px",
            fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase",
            color: activeFilterDiff > 0 ? "#D4A017" : "#c4ced6",
            background: "transparent", cursor: "pointer",
          }}
        >
          <i className="fa-solid fa-sliders" style={{ fontSize: 13 }} />
          Filters
          {activeFilterDiff > 0 && (
            <span style={{
              background: "#D4A017", color: "#071B2A",
              fontSize: 10, fontWeight: 800, padding: "1px 6px",
            }}>
              {activeFilterDiff}
            </span>
          )}
          <i
            className={`fa-solid fa-chevron-${filtersOpen ? "up" : "down"}`}
            style={{ fontSize: 10, marginLeft: "auto" }}
          />
        </button>

        {filtersOpen && (
          <div style={{
            border: "1px solid rgba(255,255,255,.08)", borderTop: "none",
            padding: "20px 16px", background: "#0D2436", marginBottom: 20,
          }}>
            {filterRail}
          </div>
        )}
      </div>

      {/* Desktop grid layout */}
      <div className="md:grid md:gap-x-11" style={{ gridTemplateColumns: "230px 1fr" }}>

        {/* Filter rail — desktop only (mobile handled above) */}
        <div className="hidden md:block">
          {filterRail}
        </div>

        {/* Pipeline results */}
        <section ref={resultsRef}>
          {/* Results header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,.10)", marginBottom: 4,
          }}>
            <p style={{ fontSize: 12, color: "#7c8b98" }}>
              <strong style={{ color: "#e8edf1" }}>{filtered.length}</strong>
              {filtered.length !== pipelines.length && <span> of {pipelines.length}</span>}
              {" "}pipelines
              {filtered.length !== totalCount && (
                <span style={{ opacity: .6 }}> (full dataset: {totalCount})</span>
              )}
            </p>
            {totalPages > 1 && (
              <p style={{ fontSize: 12, color: "#7c8b98" }}>
                Page <strong style={{ color: "#c4ced6" }}>{page + 1}</strong> / {totalPages}
              </p>
            )}
          </div>

          {/* Pipeline rows */}
          {paginated.length === 0 ? (
            <div style={{ padding: "48px 0", textAlign: "center", color: "#7c8b98" }}>
              <p style={{ fontSize: 14 }}>No pipelines match the current filters.</p>
            </div>
          ) : (
            paginated.map((p) => (
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
                  className="hover:bg-white/1.5 transition-colors"
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: "var(--font-playfair), serif", fontWeight: 700,
                      fontSize: 18, lineHeight: 1.2, color: "#e8edf1",
                    }}>
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
                    <div style={{
                      display: "flex", flexWrap: "wrap", gap: 14, marginTop: 11,
                      fontSize: 11.5, color: "#9fb0bd",
                    }}>
                      {p.lengthKm && (
                        <span>
                          <span style={{ color: "#7c8b98" }}>Length </span>
                          <strong style={{ color: "#d6dee4", fontVariantNumeric: "tabular-nums" }}>
                            {p.lengthKm.toLocaleString()} km
                          </strong>
                        </span>
                      )}
                      {p.owner && (
                        <span>
                          <span style={{ color: "#7c8b98" }}>Owner </span>
                          <strong style={{ color: "#d6dee4" }}>{p.owner}</strong>
                        </span>
                      )}
                      <span style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: "1.5px",
                        color: "#7c8b98", textTransform: "uppercase",
                      }}>
                        {p.fuel}
                      </span>
                    </div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <StatusPill status={p.status} />
                  </div>
                </div>
              </Link>
            ))
          )}

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "24px 4px", marginTop: 8,
            }}>
              <button
                onClick={() => changePage(page - 1)}
                disabled={page === 0}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "10px 18px", fontSize: 11, fontWeight: 700,
                  letterSpacing: "1.5px", textTransform: "uppercase",
                  border: `1px solid ${page === 0 ? "rgba(255,255,255,.06)" : "rgba(255,255,255,.14)"}`,
                  color: page === 0 ? "#3a4d5c" : "#c4ced6",
                  background: "transparent", cursor: page === 0 ? "default" : "pointer",
                  transition: "border-color .15s, color .15s",
                }}
                className={page > 0 ? "hover:border-gold-500/40 hover:text-white" : ""}
              >
                <i className="fa-solid fa-arrow-left" style={{ fontSize: 10 }} />
                Previous
              </button>

              <div style={{ display: "flex", gap: 4 }}>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const idx = totalPages <= 7
                    ? i
                    : page < 4
                    ? i
                    : page > totalPages - 5
                    ? totalPages - 7 + i
                    : page - 3 + i;
                  return (
                    <button
                      key={idx}
                      onClick={() => changePage(idx)}
                      style={{
                        width: 32, height: 32, fontSize: 12, fontWeight: 600,
                        border: idx === page ? "1px solid #D4A017" : "1px solid rgba(255,255,255,.08)",
                        color: idx === page ? "#D4A017" : "#7c8b98",
                        background: idx === page ? "rgba(212,160,23,.08)" : "transparent",
                        cursor: "pointer", transition: "all .15s",
                      }}
                      className={idx !== page ? "hover:border-white/20 hover:text-white" : ""}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => changePage(page + 1)}
                disabled={page === totalPages - 1}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "10px 18px", fontSize: 11, fontWeight: 700,
                  letterSpacing: "1.5px", textTransform: "uppercase",
                  border: `1px solid ${page === totalPages - 1 ? "rgba(255,255,255,.06)" : "rgba(255,255,255,.14)"}`,
                  color: page === totalPages - 1 ? "#3a4d5c" : "#c4ced6",
                  background: "transparent",
                  cursor: page === totalPages - 1 ? "default" : "pointer",
                  transition: "border-color .15s, color .15s",
                }}
                className={page < totalPages - 1 ? "hover:border-gold-500/40 hover:text-white" : ""}
              >
                Next
                <i className="fa-solid fa-arrow-right" style={{ fontSize: 10 }} />
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
