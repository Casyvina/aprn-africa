import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StatusPill from "@/components/pipelines/StatusPill";
import {
  COUNTRY_COUNTS, slugToCountry, countryToSlug,
  getPipelineBySlug, getPipelinesForCountry,
} from "@/lib/pipelines/data";

interface Props { params: Promise<{ country: string; slug: string }> }

export async function generateStaticParams() {
  const params: { country: string; slug: string }[] = [];
  Object.keys(COUNTRY_COUNTS).forEach((c) => {
    const cSlug = countryToSlug(c);
    getPipelinesForCountry(c).forEach((p) => {
      params.push({ country: cSlug, slug: p.slug });
    });
  });
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, slug } = await params;
  const name = slugToCountry(country);
  const pipeline = name ? getPipelineBySlug(name, slug) : undefined;
  if (!pipeline) return {};
  return {
    title: `${pipeline.name} — APRN Intelligence`,
    description: `${pipeline.fuel} pipeline · ${pipeline.status} · ${pipeline.countries.join(", ")}. Length: ${pipeline.lengthKm ? pipeline.lengthKm.toLocaleString() + " km" : "—"}.`,
  };
}

export default async function PipelineDetailPage({ params }: Props) {
  const { country: countrySlug, slug } = await params;
  const countryName = slugToCountry(countrySlug);
  if (!countryName) notFound();

  const pipeline = getPipelineBySlug(countryName, slug);
  if (!pipeline) notFound();

  return (
    <>
      <Navigation />

      <section className="pt-28 pb-0">
        <div className="max-w-275 mx-auto px-10">

          {/* Breadcrumb */}
          <nav style={{ fontSize: 12, color: "#7c8b98", marginBottom: 22, letterSpacing: ".3px" }}>
            <Link href="/intelligence/pipelines" style={{ color: "#7c8b98", textDecoration: "none" }}>Intelligence</Link>
            <span style={{ margin: "0 8px", opacity: .5 }}>›</span>
            <Link href="/intelligence/pipelines" style={{ color: "#7c8b98", textDecoration: "none" }}>Pipelines</Link>
            <span style={{ margin: "0 8px", opacity: .5 }}>›</span>
            <Link href={`/intelligence/pipelines/${countrySlug}`} style={{ color: "#7c8b98", textDecoration: "none" }}>{countryName}</Link>
            <span style={{ margin: "0 8px", opacity: .5 }}>›</span>
            <span style={{ color: "#D4A017" }}>{pipeline.name}</span>
          </nav>

          {/* Title row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 40, paddingBottom: 26, borderBottom: "1px solid rgba(255,255,255,.10)" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.6px", color: "#E5B83B", textTransform: "uppercase" }}>{pipeline.fuel}</span>
                <StatusPill status={pipeline.status} />
              </div>
              <h1 style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 800, fontSize: 46, lineHeight: 1.02, letterSpacing: "-.5px", color: "#e8edf1", maxWidth: 640 }}>
                {pipeline.name}
              </h1>
              <div style={{ marginTop: 16, fontSize: 15, color: "#b6c2cc", letterSpacing: ".2px" }}>
                {pipeline.countries.join(" → ")}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexShrink: 0, paddingTop: 6 }}>
              <button style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 16px", fontSize: 11, fontWeight: 700, letterSpacing: "1.4px", textTransform: "uppercase", border: "1px solid rgba(255,255,255,.10)", color: "#c4ced6", background: "transparent", cursor: "pointer" }}>
                ⌑ Save
              </button>
              <button style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 16px", fontSize: 11, fontWeight: 700, letterSpacing: "1.4px", textTransform: "uppercase", border: "1px solid rgba(212,160,23,.35)", color: "#D4A017", background: "rgba(212,160,23,.05)", cursor: "not-allowed" }} title="Members only">
                ⌑ Export
              </button>
            </div>
          </div>

          {/* Key facts strip */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.06)", margin: "30px 0" }}>
            {[
              ["Length",     pipeline.lengthKm ? `${pipeline.lengthKm.toLocaleString()} km` : "—"],
              ["Capacity",   pipeline.capacityValue ? `${pipeline.capacityValue} ${pipeline.capacityUnit ?? ""}` : "—"],
              ["Start year", pipeline.startYear?.toString() ?? "—"],
              ["Owner",      pipeline.owner ?? "—"],
              ["FID Status", pipeline.fidStatus ?? "—"],
            ].map(([k, v]) => (
              <div key={k} style={{ background: "#071B2A", padding: "18px 20px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.6px", color: "#7c8b98", textTransform: "uppercase" }}>{k}</div>
                <div style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: 22, marginTop: 9, color: "#e8edf1", lineHeight: 1.2 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Body */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 50, paddingBottom: 80 }}>
            <div>

              {/* Editorial */}
              {pipeline.significance && (
                <div style={{ marginBottom: 40 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2.2px", color: "#D4A017", textTransform: "uppercase", marginBottom: 16 }}>
                    Why this corridor matters
                  </p>
                  <div style={{ borderLeft: "2px solid #D4A017", paddingLeft: 22 }}>
                    {pipeline.significance.split("\n\n").map((para, i) => (
                      <p key={i} style={{ fontSize: 15.5, lineHeight: 1.72, color: "#cdd6dd", marginBottom: 15 }}>{para}</p>
                    ))}
                    <p style={{ fontSize: 11, color: "#7c8b98", letterSpacing: ".4px", marginTop: 18 }}>
                      APRN editorial note · reviewed by <strong style={{ color: "#b6c2cc", fontWeight: 600 }}>Content Team</strong>
                    </p>
                  </div>
                </div>
              )}

              {/* Segments */}
              {pipeline.segments.length > 0 && (
                <div style={{ marginBottom: 40 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2.2px", color: "#D4A017", textTransform: "uppercase", marginBottom: 16 }}>
                    Route &amp; segments
                  </p>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr>
                        {["Segment", "From → To", "Length", "Status"].map((h) => (
                          <th key={h} style={{ textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", color: "#7c8b98", textTransform: "uppercase", paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,.10)" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pipeline.segments.map((seg) => (
                        <tr key={seg.name}>
                          <td style={{ padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,.06)", color: "#e8edf1", fontWeight: 600 }}>{seg.name}</td>
                          <td style={{ padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,.06)", color: "#c4ced6" }}>{seg.from} → {seg.to}</td>
                          <td style={{ padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,.06)", color: "#c4ced6", fontVariantNumeric: "tabular-nums" }}>{seg.lengthKm ? `${seg.lengthKm.toLocaleString()} km` : "—"}</td>
                          <td style={{ padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,.06)", fontSize: 9.5, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#7c8b98" }}>{seg.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Map placeholder */}
              <div style={{ marginBottom: 40 }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2.2px", color: "#D4A017", textTransform: "uppercase", marginBottom: 16 }}>
                  Route map
                </p>
                <div style={{
                  height: 230, border: "1px solid rgba(255,255,255,.10)", background: "#0D2436",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#7c8b98", fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase",
                }}>
                  Route geometry — GIS layer, later phase
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside>
              {/* Owner */}
              {pipeline.owner && (
                <div style={{ border: "1px solid rgba(255,255,255,.06)", padding: 20, marginBottom: 20 }}>
                  <h4 style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.8px", color: "#7c8b98", textTransform: "uppercase", marginBottom: 14 }}>Owner / Operator</h4>
                  {pipeline.owner.split("/").map((o) => (
                    <div key={o} style={{ fontSize: 14, color: "#e8edf1", fontWeight: 600, marginBottom: 4 }}>{o.trim()}</div>
                  ))}
                </div>
              )}

              {/* Related insights */}
              {pipeline.relatedInsights.length > 0 && (
                <div style={{ border: "1px solid rgba(255,255,255,.06)", padding: 20, marginBottom: 20 }}>
                  <h4 style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.8px", color: "#7c8b98", textTransform: "uppercase", marginBottom: 14 }}>Related Insights</h4>
                  {pipeline.relatedInsights.map((r, i) => (
                    <Link key={i} href={r.href} style={{ display: "block", padding: "12px 0", borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,.06)", textDecoration: "none" }}>
                      <span style={{ display: "block", fontSize: 13, color: "#e8edf1", fontWeight: 600, lineHeight: 1.35 }}>{r.title}</span>
                      <span style={{ fontSize: 10.5, color: "#7c8b98", letterSpacing: ".5px", textTransform: "uppercase", marginTop: 4, display: "block" }}>{r.type}</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Source */}
              <div style={{ border: "1px solid rgba(255,255,255,.06)", padding: 20 }}>
                <h4 style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.8px", color: "#7c8b98", textTransform: "uppercase", marginBottom: 14 }}>Source &amp; Freshness</h4>
                {[
                  ["Dataset", "GEM · " + pipeline.tracker.split(" ")[0]],
                  ["Release", pipeline.sourceRelease],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "7px 0", color: "#c4ced6" }}>
                    <span style={{ color: "#7c8b98" }}>{k}</span>
                    <span>{v}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "7px 0", color: "#c4ced6" }}>
                  <span style={{ color: "#7c8b98" }}>Updated</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#E5B83B", fontWeight: 600 }}>
                    <span style={{ width: 6, height: 6, background: "#E5B83B", borderRadius: "50%" }} />
                    Current
                  </span>
                </div>
                {pipeline.gemWikiUrl && (
                  <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", marginTop: 8, paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span style={{ color: "#7c8b98" }}>GEM Wiki</span>
                    <a href={pipeline.gemWikiUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#D4A017" }}>View source ↗</a>
                  </div>
                )}
              </div>

              {/* Back */}
              <div style={{ marginTop: 24 }}>
                <Link href={`/intelligence/pipelines/${countrySlug}`} style={{ fontSize: 12, color: "#7c8b98", textDecoration: "none", letterSpacing: ".3px" }}>
                  ← Back to {countryName} pipelines
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
