import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PipelineFilterList from "@/components/pipelines/PipelineFilterList";
import {
  COUNTRY_COUNTS, slugToCountry, countryToSlug,
  getPipelinesForCountry,
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

export default async function CountryPipelinesPage({ params }: Props) {
  const { country: slug } = await params;
  const name = slugToCountry(slug);
  if (!name) notFound();

  const pipelines = getPipelinesForCountry(name);
  const count = COUNTRY_COUNTS[name] ?? 0;

  const operating = pipelines.filter((p) => p.status === "operating").length;
  const proposed = pipelines.filter((p) => p.status === "proposed").length;
  const construction = pipelines.filter((p) => p.status === "construction").length;

  return (
    <>
      <Navigation />

      {/* Header */}
      <section className="pt-28 pb-6 border-b border-white/5">
        <div className="max-w-360 mx-auto px-10">
          <nav style={{ fontSize: 12, color: "#7c8b98", marginBottom: 18, letterSpacing: ".3px" }}>
            <Link href="/intelligence" style={{ color: "#7c8b98", textDecoration: "none" }}>Intelligence</Link>
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
                {operating > 0 && <> · <strong style={{ color: "#e8edf1" }}>{operating}</strong> operating</>}
                {proposed > 0 && <> · <strong style={{ color: "#e8edf1" }}>{proposed}</strong> proposed</>}
                {construction > 0 && <> · <strong style={{ color: "#e8edf1" }}>{construction}</strong> in construction</>}
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
        <PipelineFilterList pipelines={pipelines} countrySlug={slug} totalCount={count} />
      </section>

      <Footer />
    </>
  );
}
