import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { sanityFetch } from "@/lib/sanity/fetch";
import { HOMEPAGE_INTEL_QUERY, type HomepageIntelCard } from "@/lib/queries/intelligence";

export const metadata: Metadata = {
  title: "Intelligence — APRN Africa",
  description:
    "African energy infrastructure intelligence: pipeline databases, market analysis, policy tracking and research digests.",
  openGraph: {
    title: "Intelligence — APRN Africa",
    description: "A continent-wide intelligence platform for African energy infrastructure professionals.",
    type: "website",
    url: "https://aprn-africa.org/intelligence",
  },
};

const CATEGORY_LABEL: Record<string, string> = {
  market: "Market",
  project: "Project Update",
  policy: "Policy",
  training: "Training",
  partnership: "Partnership",
  event: "Event",
  research: "Research",
};

export default async function IntelligencePage() {
  const updates = await sanityFetch<HomepageIntelCard[]>(HOMEPAGE_INTEL_QUERY, {}, ["intelligence"]);

  return (
    <>
      <Navigation />

      {/* Hero */}
      <section className="pt-28 pb-12 border-b border-white/5">
        <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-10">
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2.5px", color: "#D4A017", textTransform: "uppercase", marginBottom: 14 }}>
            APRN · Intelligence Platform
          </p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
            <div style={{ maxWidth: 600 }}>
              <h1 style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 800, fontSize: "clamp(1.75rem, 5vw, 3.375rem)", lineHeight: 1, letterSpacing: "-.5px", color: "#e8edf1", marginBottom: 20 }}>
                African Energy Intelligence
              </h1>
              <p style={{ fontSize: 15, color: "#9fb0bd", lineHeight: 1.7 }}>
                Structured data, analysis and briefings on Africa's energy infrastructure — pipelines, corridors, policy frameworks and investment activity, synthesised for professionals.
              </p>
            </div>
            <div className="flex gap-6 sm:gap-9 pt-4 sm:pt-0">
              {[["398", "Named Pipelines"], ["33", "Countries"], ["137k", "Km Mapped"]].map(([n, l]) => (
                <div key={l} style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 800, fontSize: "clamp(1.5rem, 4vw, 2.25rem)", lineHeight: 1, color: "#E5B83B" }}>{n}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", color: "#7c8b98", textTransform: "uppercase", marginTop: 6 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence products */}
      <section className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 py-14">
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#D4A017", textTransform: "uppercase", marginBottom: 24 }}>
          Intelligence Products
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", border: "1px solid rgba(255,255,255,.06)" }}>

          {/* Pipeline Database — live */}
          <Link
            href="/intelligence/pipelines"
            style={{ display: "block", textDecoration: "none", padding: "32px 28px", background: "#0D2436", borderRight: "1px solid rgba(255,255,255,.06)" }}
            className="group hover:bg-navy-700 transition-colors"
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, background: "rgba(212,160,23,.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="fa-solid fa-route" style={{ color: "#D4A017", fontSize: 16 }} />
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", color: "#D4A017", textTransform: "uppercase", border: "1px solid rgba(212,160,23,.35)", padding: "3px 8px" }}>
                Live
              </span>
            </div>
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: 22, color: "#e8edf1", lineHeight: 1.2, marginBottom: 12 }}>
              Pipeline Database
            </h2>
            <p style={{ fontSize: 13, color: "#7c8b98", lineHeight: 1.6, marginBottom: 20 }}>
              398 named pipelines across 33 African countries. Filter by status, fuel type and operator. GEM data enriched with APRN analysis.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#D4A017" }} className="group-hover:gap-3 transition-all">
              Explore pipelines <i className="fa-solid fa-arrow-right" style={{ fontSize: 10 }} />
            </div>
          </Link>

          {/* Intelligence Briefing — members */}
          <Link
            href="/dashboard/intelligence"
            style={{ display: "block", textDecoration: "none", padding: "32px 28px", background: "#0D2436", borderRight: "1px solid rgba(255,255,255,.06)", position: "relative" }}
            className="group hover:bg-navy-700 transition-colors"
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, background: "rgba(201,122,43,.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="fa-solid fa-newspaper" style={{ color: "#C97A2B", fontSize: 16 }} />
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", color: "#C97A2B", textTransform: "uppercase", border: "1px solid rgba(201,122,43,.35)", padding: "3px 8px" }}>
                Members
              </span>
            </div>
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: 22, color: "#e8edf1", lineHeight: 1.2, marginBottom: 12 }}>
              Intelligence Briefing
            </h2>
            <p style={{ fontSize: 13, color: "#7c8b98", lineHeight: 1.6, marginBottom: 20 }}>
              Weekly briefings on project updates, market signals and policy shifts — curated for APRN members.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#C97A2B" }} className="group-hover:gap-3 transition-all">
              Access briefings <i className="fa-solid fa-arrow-right" style={{ fontSize: 10 }} />
            </div>
          </Link>

          {/* Market Intelligence — coming */}
          <div style={{ padding: "32px 28px", background: "#0D2436", borderRight: "1px solid rgba(255,255,255,.06)", opacity: .45 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, background: "rgba(255,255,255,.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="fa-solid fa-chart-line" style={{ color: "#7c8b98", fontSize: 16 }} />
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", color: "#7c8b98", textTransform: "uppercase", border: "1px solid rgba(255,255,255,.1)", padding: "3px 8px" }}>
                Coming Soon
              </span>
            </div>
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: 22, color: "#e8edf1", lineHeight: 1.2, marginBottom: 12 }}>
              Market Intelligence
            </h2>
            <p style={{ fontSize: 13, color: "#7c8b98", lineHeight: 1.6 }}>
              Gas and LNG pricing trends, capacity utilisation and cross-border flow analysis for African energy markets.
            </p>
          </div>

          {/* Policy Tracker — coming */}
          <div style={{ padding: "32px 28px", background: "#0D2436", opacity: .45 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, background: "rgba(255,255,255,.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="fa-solid fa-scale-balanced" style={{ color: "#7c8b98", fontSize: 16 }} />
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", color: "#7c8b98", textTransform: "uppercase", border: "1px solid rgba(255,255,255,.1)", padding: "3px 8px" }}>
                Coming Soon
              </span>
            </div>
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: 22, color: "#e8edf1", lineHeight: 1.2, marginBottom: 12 }}>
              Policy Tracker
            </h2>
            <p style={{ fontSize: 13, color: "#7c8b98", lineHeight: 1.6 }}>
              Regulatory frameworks, PSA terms and fiscal regimes across key African hydrocarbon jurisdictions.
            </p>
          </div>

        </div>
      </section>

      {/* Recent updates from Sanity */}
      {updates.length > 0 && (
        <section style={{ borderTop: "1px solid rgba(255,255,255,.05)" }}>
          <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 py-14">
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#D4A017", textTransform: "uppercase", marginBottom: 28 }}>
              Recent Updates
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", border: "1px solid rgba(255,255,255,.06)" }}>
              {updates.map((u, i) => (
                <div
                  key={u._id}
                  style={{
                    padding: "24px 28px",
                    background: "#0D2436",
                    borderRight: i % 2 === 0 ? "1px solid rgba(255,255,255,.06)" : undefined,
                    borderBottom: "1px solid rgba(255,255,255,.06)",
                  }}
                >
                  <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", color: "#7c8b98", textTransform: "uppercase", marginBottom: 10 }}>
                    {CATEGORY_LABEL[u.category] ?? u.category}
                    {u.corridorName && <span style={{ color: "#C97A2B", marginLeft: 8 }}>· {u.corridorName}</span>}
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#e8edf1", lineHeight: 1.45 }}>{u.headline}</p>
                  {u.summary && (
                    <p style={{ fontSize: 13, color: "#7c8b98", lineHeight: 1.6, marginTop: 8 }}>{u.summary}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Membership CTA */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,.05)", background: "#0D2436" }}>
        <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 py-16" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#D4A017", textTransform: "uppercase", marginBottom: 14 }}>
              Member Access
            </p>
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: 32, color: "#e8edf1", lineHeight: 1.1, marginBottom: 14 }}>
              Full briefings for APRN members
            </h2>
            <p style={{ fontSize: 14, color: "#9fb0bd", maxWidth: 480, lineHeight: 1.65 }}>
              Members receive weekly intelligence briefings, priority access to new datasets, and curated analysis on African pipeline and energy infrastructure.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
            <Link
              href="/membership"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 24px", fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none", background: "#D4A017", color: "#071B2A" }}
              className="hover:bg-gold-400 transition-colors"
            >
              Join Network <i className="fa-solid fa-arrow-right" style={{ fontSize: 10 }} />
            </Link>
            <Link
              href="/login"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 24px", fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none", border: "1px solid rgba(212,160,23,.3)", color: "#D4A017" }}
              className="hover:bg-[rgba(212,160,23,.08)] transition-colors"
            >
              Member Portal
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
