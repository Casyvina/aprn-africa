"use client";

import { useEffect, useRef } from "react";

interface PlotlyInstance {
  newPlot: (el: HTMLElement, data: unknown[], layout: unknown, config?: unknown) => void;
  purge: (el: HTMLElement) => void;
}

declare global {
  interface Window {
    Plotly?: PlotlyInstance;
  }
}

// ── Pipeline data ──────────────────────────────────────────────────────────────
// status: "active" | "construction" | "proposed"

const PIPELINES = [
  // ── Active ────────────────────────────────────────────────────────────────
  {
    name: "OB3 Pipeline (Nigeria)",
    status: "active" as const,
    lats: [5.5, 5.3, 5.0, 4.9, 5.2],
    lons: [6.7, 6.4, 6.1, 6.9, 7.2],
  },
  {
    name: "West Africa Gas Pipeline",
    status: "active" as const,
    // Nigeria (Itoki) → Benin (Cotonou) → Togo (Lomé) → Ghana (Tema)
    lats: [6.6, 6.4, 6.1, 5.6],
    lons: [3.3, 2.4, 1.2, -0.1],
  },

  // ── Under Construction ────────────────────────────────────────────────────
  {
    name: "AKK Pipeline (Nigeria)",
    status: "construction" as const,
    // Ajaokuta → Abuja → Kaduna → Kano
    lats: [7.4, 9.1, 10.5, 12.0],
    lons: [6.7, 7.2, 7.4, 8.5],
  },
  {
    name: "EACOP (Uganda–Tanzania)",
    status: "construction" as const,
    // Kabaale, Uganda → Mwanza area → Singida → Tanga, Tanzania
    lats: [0.2, -0.5, -1.5, -3.5, -5.1],
    lons: [31.5, 32.8, 33.5, 35.8, 39.1],
  },

  // ── Proposed ──────────────────────────────────────────────────────────────
  {
    name: "Nigeria–Morocco Gas Pipeline",
    status: "proposed" as const,
    // Coastal Atlantic route — follows West African shoreline north to Tangier
    // Nigeria → Benin → Togo → Ghana → Côte d'Ivoire → Liberia →
    // Sierra Leone → Guinea → Guinea-Bissau → Senegal → Mauritania →
    // Western Sahara → Morocco (Agadir → Casablanca → Tangier)
    lats: [ 4.8,  5.5,  6.3,  6.1,  5.6,  5.3,  6.3,  8.5,  9.5, 11.8, 14.7, 18.1, 23.7, 30.4, 33.6, 35.8],
    lons: [ 7.0,  5.0,  2.4,  1.2, -0.2, -4.0,-10.8,-13.2,-13.7,-15.6,-17.4,-15.9,-15.9, -9.6, -7.6, -5.8],
  },
  {
    name: "Trans-Saharan Gas Pipeline",
    status: "proposed" as const,
    // Kano, Nigeria → Zinder, Niger → Agadez → Tamanrasset, Algeria → Hassi R'Mel → Algiers coast
    lats: [12.0, 13.8, 16.9, 22.8, 32.9, 36.8],
    lons: [ 8.5,  8.9,  7.9,  5.5,  3.3,  3.0],
  },
  {
    name: "Mozambique Gas Corridor",
    status: "proposed" as const,
    // Rovuma basin → Pemba → Nacala → Beira → Maputo
    lats: [-10.7, -13.0, -14.9, -19.8, -25.9],
    lons: [ 40.7,  40.5,  40.7,  34.8,  32.6],
  },
];

// Key city/terminal markers
const TERMINALS = {
  lats: [4.8,  6.5, 7.4, 12.0, 5.6, 6.3,  9.5, 14.7, 35.8,  0.2, -5.1, 12.0, 36.8, -10.7],
  lons: [7.0,  3.4, 6.7,  8.5,-0.1,-10.8,-13.7,-17.4, -5.8, 31.5, 39.1,  8.5,  3.0,  40.7],
  text: [
    "Port Harcourt",
    "Lagos",
    "Ajaokuta",
    "Kano",
    "Tema (Ghana)",
    "Monrovia (Liberia)",
    "Conakry (Guinea)",
    "Dakar (Senegal)",
    "Tangier (Morocco)",
    "Kabaale (Uganda)",
    "Tanga (Tanzania)",
    "Kano / TSGP Origin",
    "Algiers Coast",
    "Rovuma Basin",
  ],
};

const STATUS_STYLE = {
  active:       { color: "#D4A017", dash: "solid",    width: 3   },
  construction: { color: "#E5B83B", dash: "dot",      width: 2.5 },
  proposed:     { color: "#C97A2B", dash: "dash",     width: 2   },
};

function PipelineMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mapRef.current;
    let mounted = true;

    const render = () => {
      if (!mounted || !el || !window.Plotly) return;

      const lineTraces = PIPELINES.map((p) => {
        const style = STATUS_STYLE[p.status];
        return {
          type: "scattergeo",
          lat: p.lats,
          lon: p.lons,
          mode: "lines",
          name: p.name,
          line: { width: style.width, color: style.color, dash: style.dash },
          hovertemplate: `<b>%{meta}</b><extra></extra>`,
          meta: p.name,
        };
      });

      const terminalTrace = {
        type: "scattergeo",
        lat: TERMINALS.lats,
        lon: TERMINALS.lons,
        mode: "markers",
        name: "Key Terminals",
        text: TERMINALS.text,
        hovertemplate: "%{text}<extra></extra>",
        marker: {
          size: 7,
          color: "#D4A017",
          symbol: "circle",
          line: { color: "#071B2A", width: 1.5 },
          opacity: 0.9,
        },
        showlegend: false,
      };

      const layout = {
        geo: {
          scope: "africa",
          showland: true,
          landcolor: "#0D2436",
          showocean: true,
          oceancolor: "#071B2A",
          showlakes: true,
          lakecolor: "#071B2A",
          showcountries: true,
          countrycolor: "#1E3D56",
          countrywidth: 0.6,
          showcoastlines: true,
          coastlinecolor: "#1E3D56",
          bgcolor: "#071B2A",
          projection: { type: "mercator" },
          lataxis: { range: [-38, 40] },
          lonaxis: { range: [-22, 52] },
        },
        paper_bgcolor: "#071B2A",
        plot_bgcolor: "#071B2A",
        margin: { l: 0, r: 0, t: 0, b: 0 },
        legend: {
          font: { color: "#94a3b8", size: 11, family: "Inter, sans-serif" },
          bgcolor: "rgba(7,27,42,0.92)",
          bordercolor: "rgba(212,160,23,0.25)",
          borderwidth: 1,
          x: 0.01,
          y: 0.02,
          tracegroupgap: 4,
        },
        showlegend: true,
        hoverlabel: {
          bgcolor: "#0D2436",
          bordercolor: "#D4A017",
          font: { color: "#ffffff", size: 12, family: "Inter, sans-serif" },
        },
      };

      window.Plotly.newPlot(el, [...lineTraces, terminalTrace], layout, {
        responsive: true,
        displayModeBar: false,
      });
    };

    const poll = () => {
      if (!mounted) return;
      window.Plotly ? render() : setTimeout(poll, 150);
    };

    poll();

    return () => {
      mounted = false;
      if (el && window.Plotly) window.Plotly.purge(el);
    };
  }, []);

  return <div ref={mapRef} className="w-full h-full" />;
}

// ── Section wrapper ────────────────────────────────────────────────────────────

interface MapSectionProps {
  heading?: string
  subtext?: string
  spotlightLabel?: string
  spotlightTitle?: string
  spotlightSubtitle?: string
}

export default function MapSection({
  heading = "Strategic Corridors",
  subtext = "Active, under-construction, and proposed pipeline infrastructure across the continent — tracking $42.5B in capital expenditure.",
  spotlightLabel = "Featured Corridor",
  spotlightTitle = "Nigeria–Morocco Gas Pipeline (NMGP)",
  spotlightSubtitle = "~5,660 km · Atlantic coastline route · 13 nations",
}: MapSectionProps) {
  return (
    <section id="map" className="py-24 bg-navy-900 border-y border-navy-700">
      <div className="max-w-360 mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-2">
              Infrastructure Intelligence
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              {heading}
            </h2>
            <p className="text-slate-400 max-w-xl">{subtext}</p>
          </div>
          {/* Legend */}
          <div className="flex flex-col gap-2 shrink-0">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <span className="w-6 h-0.5 bg-gold-500 inline-block" />
              Active
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <span className="w-6 h-0.5 bg-gold-400 border-b border-dashed border-gold-400 inline-block" />
              Under Construction
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <span className="w-6 h-0.5 border-b-2 border-dashed border-copper-500 inline-block" />
              Proposed
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="glass-panel p-2 w-full h-80 md:h-[500px] lg:h-[600px]">
          <PipelineMap />
        </div>

        {/* NMGP spotlight */}
        <div className="mt-6 glass-panel p-6 border-l-4 border-gold-500">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="shrink-0">
              <span className="text-[10px] font-bold text-gold-500 uppercase tracking-widest block mb-1">
                {spotlightLabel}
              </span>
              <h3 className="font-display text-lg font-bold text-white">
                {spotlightTitle}
              </h3>
              <p className="text-sm text-slate-400 mt-1">{spotlightSubtitle}</p>
            </div>
            <div className="h-px lg:h-10 lg:w-px bg-navy-700 lg:mx-4 shrink-0" />
            {/* Countries in coastal route order */}
            <div className="flex flex-wrap gap-2">
              {[
                "Nigeria", "Benin", "Togo", "Ghana", "Côte d'Ivoire",
                "Liberia", "Sierra Leone", "Guinea", "Guinea-Bissau",
                "Senegal", "Mauritania", "Western Sahara", "Morocco",
              ].map((country, i) => (
                <span
                  key={country}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-navy-800 text-slate-300 border border-navy-700"
                >
                  <span className="text-[9px] text-slate-600 font-bold">{i + 1}</span>
                  {country}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Pipeline stats row */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: "12,400km",  label: "Under construction",  icon: "fa-road" },
            { value: "$42.5B",    label: "Tracked CapEx",       icon: "fa-dollar-sign" },
            { value: "7",         label: "Active corridors",    icon: "fa-route" },
            { value: "13",        label: "NMGP nations",        icon: "fa-flag" },
          ].map((s) => (
            <div key={s.label} className="bg-navy-800 border border-white/5 p-4 flex items-center gap-3">
              <i className={`fa-solid ${s.icon} text-gold-500 text-sm w-4`} />
              <div>
                <p className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>{s.value}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
