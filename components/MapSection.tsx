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

function PipelineMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    const render = () => {
      if (!mounted || !mapRef.current || !window.Plotly) return;

      const pipelines = [
        {
          lats: [4.9, 10.5, 15.0, 20.0, 25.0, 30.0, 33.0, 35.6],
          lons: [8.3, 7.5, 6.0, 4.0, 2.0, -2.0, -5.0, -5.5],
          name: "Nigeria-Morocco Gas Pipeline",
          status: "proposed",
        },
        {
          lats: [7.4, 9.0, 11.0, 11.1],
          lons: [6.7, 7.2, 7.5, 7.7],
          name: "AKK Pipeline",
          status: "active",
        },
        {
          lats: [2.0, 0.5, -1.0, -3.0, -6.0, -6.8],
          lons: [31.0, 32.0, 33.0, 34.5, 35.5, 39.3],
          name: "East African Crude Oil Pipeline",
          status: "proposed",
        },
        {
          lats: [4.9, 5.5, 6.0, 6.4],
          lons: [6.9, 6.5, 6.2, 5.9],
          name: "OB3 Pipeline",
          status: "active",
        },
      ];

      const lineTraces = pipelines.map((p) => ({
        type: "scattergeo",
        lat: p.lats,
        lon: p.lons,
        mode: "lines",
        name: p.name,
        line: {
          width: 2.5,
          color: p.status === "active" ? "#D4A017" : "#C97A2B",
          dash: p.status === "proposed" ? "dash" : "solid",
        },
        hoverinfo: "name",
      }));

      const terminalTrace = {
        type: "scattergeo",
        lat: [4.9, 11.1, 2.0, -6.8, 4.9, 35.6],
        lon: [8.3, 7.7, 31.0, 39.3, 6.9, -5.5],
        mode: "markers",
        name: "Terminals",
        marker: {
          size: 8,
          color: "#D4A017",
          symbol: "circle",
          line: { color: "#071B2A", width: 1 },
        },
        hoverinfo: "none",
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
          countrycolor: "#15324A",
          showcoastlines: true,
          coastlinecolor: "#15324A",
          bgcolor: "#071B2A",
          projection: { type: "mercator" },
          lataxis: { range: [-38, 38] },
          lonaxis: { range: [-22, 52] },
        },
        paper_bgcolor: "#071B2A",
        plot_bgcolor: "#071B2A",
        margin: { l: 0, r: 0, t: 0, b: 0 },
        legend: {
          font: { color: "#94a3b8", size: 11, family: "Inter, sans-serif" },
          bgcolor: "rgba(13,36,54,0.9)",
          bordercolor: "rgba(212,160,23,0.3)",
          borderwidth: 1,
          x: 0.01,
          y: 0.02,
        },
        showlegend: true,
      };

      window.Plotly.newPlot(mapRef.current, [...lineTraces, terminalTrace], layout, {
        responsive: true,
        displayModeBar: false,
      });
    };

    // Poll until Plotly is available (loaded via CDN script)
    const poll = () => {
      if (!mounted) return;
      if (window.Plotly) {
        render();
      } else {
        setTimeout(poll, 150);
      }
    };

    poll();

    return () => {
      mounted = false;
      if (mapRef.current && window.Plotly) {
        window.Plotly.purge(mapRef.current);
      }
    };
  }, []);

  return <div ref={mapRef} className="w-full h-full" />;
}

export default function MapSection() {
  return (
    <section id="map" className="py-24 bg-navy-900 border-y border-navy-700">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Strategic Corridors
            </h2>
            <p className="text-slate-400 max-w-xl">
              Interactive intelligence on active and proposed pipeline infrastructure driving regional
              integration.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <span className="w-3 h-3 rounded-full bg-gold-500" /> Active
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <span className="w-3 h-3 rounded-full border-2 border-copper-500 border-dashed" /> Proposed
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-sm p-2 w-full h-[600px]">
          <PipelineMap />
        </div>
      </div>
    </section>
  );
}
