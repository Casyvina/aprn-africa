"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { COUNTRY_COUNTS, countryToSlug } from "@/lib/pipelines/data";

interface AfricaPlotly {
  newPlot: (el: HTMLElement, data: unknown[], layout: unknown, config?: unknown) => Promise<HTMLElement>;
  purge: (el: HTMLElement) => void;
}

// ── Major African pipeline routes (lat/lon approximations) ────────────────────
const PIPELINE_ROUTES = [
  {
    name: "West African Gas Pipeline",
    status: "operating" as const,
    lats: [6.6, 6.4, 6.1, 5.6],
    lons: [3.3, 2.4, 1.2, -0.1],
  },
  {
    name: "Trans-Saharan Gas Pipeline",
    status: "shelved" as const,
    lats: [12.0, 13.8, 16.9, 22.8, 32.9, 36.8],
    lons: [8.5, 8.9, 7.9, 5.5, 3.3, 3.0],
  },
  {
    name: "Nigeria–Morocco Gas Pipeline",
    status: "proposed" as const,
    lats: [4.8, 5.5, 6.3, 6.1, 5.6, 5.3, 6.3, 8.5, 9.5, 11.8, 14.7, 18.1, 23.7, 30.4, 33.6, 35.8],
    lons: [7.0, 5.0, 2.4, 1.2, -0.2, -4.0, -10.8, -13.2, -13.7, -15.6, -17.4, -15.9, -15.9, -9.6, -7.6, -5.8],
  },
  {
    name: "Trans-Mediterranean Gas Pipeline",
    status: "operating" as const,
    lats: [36.8, 37.1, 37.5, 38.2, 38.7],
    lons: [3.0, 8.5, 10.2, 13.5, 15.1],
  },
  {
    name: "Maghreb–Europe Gas Pipeline",
    status: "operating" as const,
    lats: [32.9, 34.2, 35.8, 36.1, 37.3, 38.1, 40.4],
    lons: [3.3, -1.5, -5.8, -5.5, -5.3, -4.9, -3.7],
  },
  {
    name: "EACOP (Uganda–Tanzania)",
    status: "construction" as const,
    lats: [0.2, -0.5, -1.5, -3.5, -5.1],
    lons: [31.5, 32.8, 33.5, 35.8, 39.1],
  },
  {
    name: "Trans Nigeria Gas Pipeline",
    status: "construction" as const,
    lats: [7.4, 9.1, 10.5, 12.0],
    lons: [6.7, 7.2, 7.4, 8.5],
  },
  {
    name: "Hassi R'Mel–Arzew Gas Pipeline",
    status: "operating" as const,
    lats: [32.9, 33.8, 35.7],
    lons: [3.3, 1.8, -0.2],
  },
  {
    name: "South Valley Gas Pipeline",
    status: "operating" as const,
    lats: [24.1, 26.8, 29.5, 31.2, 30.1],
    lons: [32.9, 30.9, 30.6, 31.2, 31.5],
  },
  {
    name: "Greater Nile Oil Pipeline",
    status: "operating" as const,
    lats: [10.5, 13.2, 15.6, 19.1],
    lons: [31.7, 32.5, 32.8, 37.3],
  },
  {
    name: "Tazama Oil Pipeline",
    status: "operating" as const,
    lats: [-5.1, -8.9, -13.0, -15.4],
    lons: [39.1, 35.7, 32.9, 28.3],
  },
  {
    name: "Niger–Benin Oil Pipeline",
    status: "operating" as const,
    lats: [17.0, 13.5, 9.3, 6.4],
    lons: [8.0, 8.8, 2.0, 2.4],
  },
  {
    name: "Mozambique Gas Corridor",
    status: "proposed" as const,
    lats: [-10.7, -13.0, -14.9, -19.8, -25.9],
    lons: [40.7, 40.5, 40.7, 34.8, 32.6],
  },
];

const STATUS_STYLE = {
  operating:    { color: "#D4A017", dash: "solid",  width: 2.5 },
  construction: { color: "#4a90c2", dash: "dot",    width: 2.5 },
  proposed:     { color: "#C97A2B", dash: "dashdot",width: 2   },
  shelved:      { color: "#7c8b98", dash: "dash",   width: 1.5 },
  cancelled:    { color: "#7c8b98", dash: "dash",   width: 1.5 },
  retired:      { color: "#7c8b98", dash: "dash",   width: 1.5 },
};

// Country name → ISO-3 for choropleth (Plotly needs ISO-3 for country names mode)
// We use locationmode: "country names" so Plotly handles the lookup itself

export default function AfricaMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const el = mapRef.current;
    let mounted = true;

    const render = () => {
      if (!mounted || !el || !window.Plotly) return;
      const Plotly = window.Plotly as unknown as AfricaPlotly;

      const countries = Object.keys(COUNTRY_COUNTS);
      const values = Object.values(COUNTRY_COUNTS);

      // Choropleth — fills each African country by segment count
      const choropleth = {
        type: "choropleth",
        locationmode: "country names",
        locations: countries,
        z: values,
        colorscale: [
          [0,    "#132d42"],
          [0.04, "#1e4a62"],
          [0.15, "#c97a2b"],
          [0.45, "#d4a017"],
          [1.0,  "#e5b83b"],
        ],
        showscale: false,
        marker: {
          line: { color: "#071B2A", width: 0.8 },
        },
        hovertemplate: "<b>%{location}</b><br><span style='color:#D4A017'>%{z} segments</span><extra></extra>",
        name: "",
      };

      // Pipeline route lines
      const routeTraces = PIPELINE_ROUTES.map((p) => ({
        type: "scattergeo",
        lat: p.lats,
        lon: p.lons,
        mode: "lines",
        name: p.name,
        line: {
          width: STATUS_STYLE[p.status].width,
          color: STATUS_STYLE[p.status].color,
          dash: STATUS_STYLE[p.status].dash,
        },
        hovertemplate: `<b>%{meta}</b><extra></extra>`,
        meta: p.name,
        showlegend: false,
      }));

      // Terminal dots
      const terminals = {
        type: "scattergeo",
        lat: [6.6, 4.8, 12.0, 5.6, 0.2, -5.1, 32.9, 30.1, 36.8, -10.7],
        lon: [3.3, 7.0, 8.5, -0.1, 31.5, 39.1, 3.3, 31.5, 3.0, 40.7],
        mode: "markers",
        name: "Key terminals",
        text: ["Lagos", "Port Harcourt", "Kano", "Tema", "Kabaale", "Tanga", "Hassi R'Mel", "Khartoum", "Algiers", "Rovuma"],
        hovertemplate: "%{text}<extra></extra>",
        marker: {
          size: 6,
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
          landcolor: "#0a2035",
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
        showlegend: false,
        hoverlabel: {
          bgcolor: "#0D2436",
          bordercolor: "#D4A017",
          font: { color: "#ffffff", size: 13, family: "Inter, sans-serif" },
        },
        dragmode: false,
      };

      void Plotly.newPlot(
        el,
        [choropleth, ...routeTraces, terminals],
        layout,
        { responsive: true, displayModeBar: false, scrollZoom: false },
      ).then(() => {
        if (!mounted || !el) return;
        type PlotlyEl = HTMLElement & { on?: (ev: string, cb: (d: { points: { location?: string }[] }) => void) => void };
        (el as PlotlyEl).on?.("plotly_click", (data) => {
          const country = data?.points?.[0]?.location;
          if (country && COUNTRY_COUNTS[country]) {
            router.push(`/intelligence/pipelines/${countryToSlug(country)}`);
          }
        });
      });
    };

    const poll = () => {
      if (!mounted) return;
      window.Plotly ? render() : setTimeout(poll, 150);
    };
    poll();

    return () => {
      mounted = false;
      if (el && window.Plotly) (window.Plotly as unknown as AfricaPlotly).purge(el);
    };
  }, [router]);

  return (
    <div>
      <div
        ref={mapRef}
        className="w-full"
        style={{ height: "580px", border: "1px solid rgba(255,255,255,.08)" }}
      />

      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: 16, fontSize: 12, color: "#7c8b98" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 24, height: 2.5, background: "#D4A017", display: "inline-block" }} />
          Operating
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 24, height: 0, borderBottom: "2px dotted #4a90c2", display: "inline-block" }} />
          Construction
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 24, height: 0, borderBottom: "2px dashed #C97A2B", display: "inline-block" }} />
          Proposed
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 24, height: 0, borderBottom: "2px dashed #7c8b98", display: "inline-block" }} />
          Shelved
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", gap: 3 }}>
            {["#132d42", "#1e4a62", "#c97a2b", "#d4a017", "#e5b83b"].map((bg) => (
              <div key={bg} style={{ width: 20, height: 10, background: bg }} />
            ))}
          </div>
          <span>Pipeline density</span>
        </div>
      </div>
    </div>
  );
}
