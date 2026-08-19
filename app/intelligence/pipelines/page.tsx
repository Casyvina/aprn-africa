import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AfricaMap from "@/components/pipelines/AfricaMap";
import { COUNTRY_COUNTS, countryToSlug } from "@/lib/pipelines/data";

export const metadata: Metadata = {
  title: "African Pipeline Infrastructure — APRN Intelligence",
  description:
    "A continent-wide reference of gas, oil and NGL pipelines across 33 African countries. Search by country, filter by status and fuel type.",
  openGraph: {
    title: "African Pipeline Infrastructure — APRN Africa",
    description: "398 named pipelines · 33 countries · 137,000 km mapped. Real GEM data, enriched with APRN analysis.",
    type: "website",
    url: "https://aprn-africa.org/intelligence/pipelines",
  },
};

const sorted = Object.entries(COUNTRY_COUNTS).sort((a, b) => b[1] - a[1]);
const sortedAZ = [...sorted].sort((a, b) => a[0].localeCompare(b[0]));

export default function PipelinesPage() {
  return (
    <>
      <Navigation />

      {/* Hero */}
      <section className="pt-28 pb-8 border-b border-white/5">
        <div className="max-w-360 mx-auto px-10">
          <p
            style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2.5px", color: "#D4A017", textTransform: "uppercase", marginBottom: 14 }}
          >
            Intelligence · African Pipeline Infrastructure
          </p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
            <div>
              <h1
                style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 800, fontSize: 54, lineHeight: 1, letterSpacing: "-.5px", color: "#e8edf1" }}
              >
                African Pipelines
              </h1>
              <p style={{ marginTop: 14, fontSize: 14, color: "#9fb0bd", maxWidth: 520, lineHeight: 1.65 }}>
                A continent-wide reference of gas, oil and NGL pipelines drawn from Global Energy Monitor data,
                enriched with APRN analysis.
              </p>
            </div>
            <div style={{ display: "flex", gap: 36, flexShrink: 0, paddingBottom: 6 }}>
              {[["398", "Named Pipelines"], ["33", "Countries Covered"], ["137k", "Km Mapped"]].map(([n, l]) => (
                <div key={l} style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 800, fontSize: 38, lineHeight: 1, color: "#E5B83B" }}>{n}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", color: "#7c8b98", textTransform: "uppercase", marginTop: 6, lineHeight: 1.4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Map + sidebar */}
      <section className="max-w-360 mx-auto px-10 py-10">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 40, marginBottom: 48 }}>
          {/* Map */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.8px", color: "#7c8b98", textTransform: "uppercase", marginBottom: 14 }}>
              Segments by country — click a country to view its pipelines
            </p>
            <AfricaMap />
          </div>

          {/* Sidebar */}
          <aside>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.8px", color: "#7c8b98", textTransform: "uppercase", marginBottom: 16 }}>
              Top countries
            </p>
            {sorted.slice(0, 10).map(([name, n]) => {
              const barW = Math.max(4, Math.round((n / sorted[0][1]) * 120));
              return (
                <Link
                  key={name}
                  href={`/intelligence/pipelines/${countryToSlug(name)}`}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,.06)", cursor: "pointer",
                    textDecoration: "none",
                  }}
                  className="group"
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#e8edf1" }} className="group-hover:text-[#E5B83B] transition-colors">{name}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: barW, height: 3, background: "#D4A017", opacity: .6 }} />
                    <span style={{ fontSize: 12, color: "#7c8b98", fontVariantNumeric: "tabular-nums", minWidth: 24, textAlign: "right" }}>{n}</span>
                  </div>
                </Link>
              );
            })}
          </aside>
        </div>

        {/* A–Z country grid */}
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#D4A017", textTransform: "uppercase", marginBottom: 20 }}>
          All 33 countries (A–Z)
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {sortedAZ.map(([name, n]) => (
            <Link
              key={name}
              href={`/intelligence/pipelines/${countryToSlug(name)}`}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                border: "1px solid rgba(255,255,255,.08)", padding: "10px 14px",
                textDecoration: "none", transition: "border-color .15s",
              }}
              className="hover:border-[rgba(212,160,23,0.4)]"
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: "#e8edf1" }}>{name}</span>
              <span style={{ fontSize: 11, color: "#7c8b98", fontVariantNumeric: "tabular-nums" }}>{n}</span>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
