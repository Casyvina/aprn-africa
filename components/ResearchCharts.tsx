"use client";

import { useEffect, useRef } from "react";

const commonLayout = {
  plot_bgcolor: "transparent",
  paper_bgcolor: "transparent",
  margin: { t: 20, r: 20, b: 40, l: 40 },
  font: { family: "Inter, sans-serif", color: "#6B7280", size: 10 },
  xaxis: { showgrid: false, zeroline: false },
  yaxis: { showgrid: true, gridcolor: "rgba(212, 160, 23, 0.1)", zeroline: false },
  showlegend: false,
};

const plotConfig = { responsive: true, displayModeBar: false };

export default function ResearchCharts() {
  const capexRef = useRef<HTMLDivElement>(null);
  const capacityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let tries = 0;
    const poll = setInterval(() => {
      tries++;
      if (window.Plotly) {
        clearInterval(poll);
        renderCharts();
      } else if (tries > 80) {
        clearInterval(poll);
      }
    }, 150);

    function renderCharts() {
      if (capexRef.current) {
        window.Plotly?.newPlot(
          capexRef.current,
          [
            {
              x: ["2024", "2025", "2026", "2027", "2028", "2029", "2030"],
              y: [12, 15, 18, 24, 30, 35, 42],
              type: "scatter",
              mode: "lines",
              fill: "tozeroy",
              line: { shape: "spline", smoothing: 1.3, color: "#D4A017", width: 3 },
              fillcolor: "rgba(212, 160, 23, 0.08)",
            },
          ],
          { ...commonLayout, yaxis: { ...commonLayout.yaxis, ticksuffix: "B" } },
          plotConfig
        );
      }

      if (capacityRef.current) {
        window.Plotly?.newPlot(
          capacityRef.current,
          [
            {
              x: ["West", "North", "East", "South", "Central"],
              y: [4500, 3800, 2100, 1500, 800],
              type: "bar",
              marker: {
                color: "#0D2436",
                line: { color: "#D4A017", width: 1 },
              },
            },
          ],
          commonLayout,
          plotConfig
        );
      }
    }

    return () => clearInterval(poll);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* CapEx Chart */}
      <div
        className="p-6 rounded-sm"
        style={{
          background: "rgba(13, 36, 54, 0.4)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(212, 160, 23, 0.15)",
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="uppercase tracking-widest text-sm font-bold text-slate-100"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Projected CapEx (2024–2030)
          </h3>
          <span className="text-gold-500 text-xs cursor-pointer hover:text-gold-400">
            <i className="fa-solid fa-download mr-1" /> CSV
          </span>
        </div>
        <div ref={capexRef} className="h-87.5 w-full" />
      </div>

      {/* Capacity Chart */}
      <div
        className="p-6 rounded-sm"
        style={{
          background: "rgba(13, 36, 54, 0.4)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(212, 160, 23, 0.15)",
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="uppercase tracking-widest text-sm font-bold text-slate-100"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Pipeline Capacity Growth by Region
          </h3>
          <span className="text-gold-500 text-xs cursor-pointer hover:text-gold-400">
            <i className="fa-solid fa-download mr-1" /> CSV
          </span>
        </div>
        <div ref={capacityRef} className="h-87.5 w-full" />
      </div>
    </div>
  );
}
