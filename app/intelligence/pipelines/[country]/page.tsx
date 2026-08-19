import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StatusPill from "@/components/pipelines/StatusPill";
import {
  COUNTRY_COUNTS, slugToCountry, countryToSlug,
  getPipelinesForCountry, type PipelineFuel, type PipelineStatus,
} from "@/lib/pipelines/data";

interface Props { params: Promise<{ country: string }> }

export async function generateStaticParams() {
  return Object.keys(COUNTRY_COUNTS).map((c) => ({ country: countryToSlug(c) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country: slug } = await params;
  const name = slugToCountry(slug);
  if (!name) return {};
  return {
    title: `${name} Pipelines — APRN Intelligence`,
    description: `Gas, oil and NGL pipelines in ${name}. Filter by status, fuel and operator.`,
  };
}

const FUEL_LABELS: Record<PipelineFuel, string> = { Gas: "Gas", Oil: "Oil", NGL: "NGL" };
const STATUS_ORDER: PipelineStatus[] = ["operating", "proposed", "construction", "shelved", "cancelled", "retired"];

export default async function CountryPipelinesPage({ params }: Props) {
  const { country: slug } = await params;
  const name = slugToCountry(slug);
  if (!name) notFound();

  const pipelines = getPipelinesForCountry(name);
  const count = COUNTRY_COUNTS[name] ?? 0;

  // status breakdown
  const byStatus = STATUS_ORDER.reduce<Record<string, number>>((acc, s) => {
    acc[s] = pipelines.filter((p) => p.status === s).length;
    return acc;
  }, {});

  return (
    <>
      <Navigation />

      {/* Header */}
      <section className="pt-28 pb-6 border-b border-white/5">
        <div className="max-w-360 mx-auto px-10">
          {/* Breadcrumb */}
          <nav style={{ fontSize: 12, color: "#7c8b98", marginBottom: 18, letterSpacing: ".3px" }}>
            <Link href="/intelligence/pipelines" style={{ color: "#7c8b98", textDecoration: "none" }}>Intelligence</Link>
            <span style={{ margin: "0 8px", opacity: .5 }}>›</span>
            <Link href="/intelligence/pipelines" style={{ color: "#7c8b98", textDecoration: "none" }}>Pipelines</Link>
            <span style={{ margin: "0 8px", opacity: .5 }}>›</span>
            <span style={{ color: "#D4A017" }}>{name}</span>
          </nav>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2.5px", color: "#D4A017", textTransform: "uppercase", marginBottom: 14 }}>
                African Pipeline Infrastructure
              </p>
              <h1 style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 800, fontSize: 52, lineHeight: 1, letterSpacing: "-.5px", color: "#e8edf1" }}>
                {name}
              </h1>
              <p style={{ marginTop: 16, fontSize: 13.5, color: "#b6c2cc" }}>
                <strong style={{ color: "#e8edf1" }}>{pipelines.length || count}</strong> pipelines
                {byStatus.operating > 0 && <> · <strong style={{ color: "#e8edf1" }}>{byStatus.operating}</strong> operating</>}
                {byStatus.proposed > 0 && <> · <strong style={{ color: "#e8edf1" }}>{byStatus.proposed}</strong> proposed</>}
                {byStatus.construction > 0 && <> · <strong style={{ color: "#e8edf1" }}>{byStatus.construction}</strong> in construction</>}
              </p>
            </div>
            <button
              style={{
                display: "inline-flex", alignItems: "center", gap: 9,
                border: "1px solid rgba(212,160,23,.35)", color: "#D4A017",
                padding: "11px 18px", fontSize: 11, fontWeight: 700,
                letterSpacing: "1.5px", textTransform: "uppercase",
                background: "rgba(212,160,23,.05)", cursor: "not-allowed",
              }}
              title="Members only"
            >
              <span style={{ fontSize: 11 }}>⌑</span> Export CSV
            </button>
          </div>
        </div>
      </section>

      {/* Results grid */}
      <section className="max-w-360 mx-auto px-10 py-8 pb-20">
        <div style={{ display: "grid", gridTemplateColumns: "230px 1fr", gap: 44 }}>

          {/* Filter rail */}
          <aside>
            <div style={{ paddingBottom: 22, marginBottom: 22, borderBottom: "1px solid rgba(255,255,255,.06)" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#7c8b98", textTransform: "uppercase", marginBottom: 14 }}>Status</p>
              {STATUS_ORDER.map((s) => (
                byStatus[s] > 0 ? (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", fontSize: 13, color: "#c4ced6" }}>
                    <div style={{ width: 14, height: 14, border: "1.5px solid #D4A017", flexShrink: 0, background: "#D4A017", position: "relative" }}>
                      <span style={{ position: "absolute", left: 3, top: 0, color: "#071B2A", fontSize: 10, fontWeight: 900, lineHeight: "14px" }}>✓</span>
                    </div>
                    <span style={{ textTransform: "capitalize" }}>{s}</span>
                    <span style={{ marginLeft: "auto", color: "#7c8b98", fontSize: 11.5 }}>{byStatus[s]}</span>
                  </div>
                ) : (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", fontSize: 13, color: "#7c8b98", opacity: .5 }}>
                    <div style={{ width: 14, height: 14, border: "1.5px solid #15324A", flexShrink: 0 }} />
                    <span style={{ textTransform: "capitalize" }}>{s}</span>
                    <span style={{ marginLeft: "auto", fontSize: 11.5 }}>0</span>
                  </div>
                )
              ))}
            </div>
            <div style={{ paddingBottom: 22, marginBottom: 22, borderBottom: "1px solid rgba(255,255,255,.06)" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#7c8b98", textTransform: "uppercase", marginBottom: 14 }}>Fuel</p>
              {(["Gas", "Oil", "NGL"] as PipelineFuel[]).map((f) => {
                const n = pipelines.filter(p => p.fuel === f).length;
                return (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", fontSize: 13, color: "#c4ced6" }}>
                    <div style={{ width: 14, height: 14, border: `1.5px solid ${n ? "#D4A017" : "#15324A"}`, flexShrink: 0, background: n ? "#D4A017" : "transparent", position: "relative" }}>
                      {n > 0 && <span style={{ position: "absolute", left: 3, top: 0, color: "#071B2A", fontSize: 10, fontWeight: 900, lineHeight: "14px" }}>✓</span>}
                    </div>
                    {FUEL_LABELS[f]}
                    <span style={{ marginLeft: "auto", color: "#7c8b98", fontSize: 11.5 }}>{n}</span>
                  </div>
                );
              })}
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#7c8b98", textTransform: "uppercase", marginBottom: 14 }}>Operator</p>
              <input
                placeholder="Search operator…"
                style={{
                  width: "100%", background: "#0D2436", border: "1px solid rgba(255,255,255,.10)",
                  color: "#e8edf1", padding: "10px 12px", fontFamily: "var(--font-inter)", fontSize: 12.5,
                  outline: "none",
                }}
              />
            </div>
          </aside>

          {/* Pipeline list */}
          <section>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,.10)", marginBottom: 4 }}>
              <p style={{ fontSize: 12, color: "#7c8b98" }}><strong style={{ color: "#e8edf1" }}>{pipelines.length}</strong> pipelines</p>
              <p style={{ fontSize: 12, color: "#c4ced6" }}>Sort: <strong style={{ color: "#D4A017" }}>Length ▾</strong></p>
            </div>

            {pipelines.length === 0 ? (
              <div style={{ padding: "60px 0", textAlign: "center", color: "#7c8b98" }}>
                <p style={{ fontSize: 15, marginBottom: 8 }}>Data loading soon</p>
                <p style={{ fontSize: 13 }}>Pipeline records for {name} will be available once the full dataset is imported.</p>
              </div>
            ) : (
              pipelines.map((p) => (
                <Link
                  key={p.slug}
                  href={`/intelligence/pipelines/${slug}/${p.slug}`}
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
                          <span><span style={{ color: "#7c8b98" }}>Length</span>{" "}<strong style={{ color: "#d6dee4", fontVariantNumeric: "tabular-nums" }}>{p.lengthKm.toLocaleString()} km</strong></span>
                        )}
                        {p.owner && (
                          <span><span style={{ color: "#7c8b98" }}>Owner</span>{" "}<strong style={{ color: "#d6dee4" }}>{p.owner}</strong></span>
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
      </section>

      <Footer />
    </>
  );
}
