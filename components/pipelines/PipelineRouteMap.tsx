"use client";

import { useEffect, useRef } from "react";
import type { PipelineStatus } from "@/lib/pipelines/data";

interface PlotlyStatic {
  newPlot: (el: HTMLElement, data: unknown[], layout: unknown, config?: unknown) => Promise<HTMLElement>;
  purge: (el: HTMLElement) => void;
}

const STATUS_COLOR: Record<PipelineStatus, string> = {
  operating:    "#D4A017",
  construction: "#4a90c2",
  proposed:     "#C97A2B",
  shelved:      "#7c8b98",
  cancelled:    "#7c8b98",
  retired:      "#7c8b98",
};

interface Props {
  routeCoords: [number, number][] | null;
  name: string;
  status: PipelineStatus;
  fromCountry: string;
  toCountry: string;
}

export default function PipelineRouteMap({ routeCoords, name, status, fromCountry, toCountry }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mapRef.current;
    if (!el || !routeCoords || routeCoords.length < 2) return;
    let mounted = true;

    const render = () => {
      if (!mounted || !el || !window.Plotly) return;
      const Plotly = window.Plotly as unknown as PlotlyStatic;

      const lons = routeCoords.map((c) => c[0]);
      const lats = routeCoords.map((c) => c[1]);

      // Bounding box with 15% padding
      const minLon = Math.min(...lons), maxLon = Math.max(...lons);
      const minLat = Math.min(...lats), maxLat = Math.max(...lats);
      const padLon = Math.max((maxLon - minLon) * 0.15, 2);
      const padLat = Math.max((maxLat - minLat) * 0.15, 2);

      const color = STATUS_COLOR[status];

      const route = {
        type: "scattergeo",
        lon: lons,
        lat: lats,
        mode: "lines",
        name,
        line: { width: 3, color },
        hovertemplate: `<b>${name}</b><extra></extra>`,
        showlegend: false,
      };

      const startMarker = {
        type: "scattergeo",
        lon: [lons[0]],
        lat: [lats[0]],
        mode: "markers+text",
        text: [fromCountry],
        textposition: "top center",
        textfont: { size: 11, color: "#c4ced6", family: "Inter, sans-serif" },
        marker: { size: 8, color, symbol: "circle", line: { color: "#071B2A", width: 2 } },
        hoverinfo: "skip",
        showlegend: false,
      };

      const endMarker = {
        type: "scattergeo",
        lon: [lons[lons.length - 1]],
        lat: [lats[lats.length - 1]],
        mode: "markers+text",
        text: [toCountry !== fromCountry ? toCountry : ""],
        textposition: "top center",
        textfont: { size: 11, color: "#c4ced6", family: "Inter, sans-serif" },
        marker: { size: 8, color: "#e8edf1", symbol: "circle", line: { color: "#071B2A", width: 2 } },
        hoverinfo: "skip",
        showlegend: false,
      };

      const layout = {
        geo: {
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
          lonaxis: { range: [minLon - padLon, maxLon + padLon] },
          lataxis: { range: [minLat - padLat, maxLat + padLat] },
        },
        paper_bgcolor: "#071B2A",
        plot_bgcolor: "#071B2A",
        margin: { l: 0, r: 0, t: 0, b: 0 },
        showlegend: false,
        hoverlabel: {
          bgcolor: "#0D2436",
          bordercolor: color,
          font: { color: "#ffffff", size: 13, family: "Inter, sans-serif" },
        },
        dragmode: false,
      };

      void Plotly.newPlot(el, [route, startMarker, endMarker], layout, {
        responsive: true,
        displayModeBar: false,
        scrollZoom: false,
      });
    };

    const poll = () => {
      if (!mounted) return;
      window.Plotly ? render() : setTimeout(poll, 150);
    };
    poll();

    return () => {
      mounted = false;
      if (el && window.Plotly) (window.Plotly as unknown as PlotlyStatic).purge(el);
    };
  }, [routeCoords, name, status, fromCountry, toCountry]);

  if (!routeCoords || routeCoords.length < 2) {
    return (
      <div style={{
        height: 260, border: "1px solid rgba(255,255,255,.08)", background: "#0D2436",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 8, color: "#7c8b98",
      }}>
        <i className="fa-solid fa-map-location-dot" style={{ fontSize: 22, opacity: .4 }} />
        <span style={{ fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase" }}>
          Route geometry not available
        </span>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className="w-full"
      style={{ height: 300, border: "1px solid rgba(255,255,255,.08)" }}
    />
  );
}
