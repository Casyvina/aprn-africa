"use client";

import Map, { Source, Layer, Marker, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import type { PipelineStatus } from "@/lib/pipelines/data";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

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
  if (!routeCoords || routeCoords.length < 2) {
    return (
      <div style={{
        height: 300, border: "1px solid rgba(255,255,255,.08)", background: "#0D2436",
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

  if (!MAPBOX_TOKEN) {
    return (
      <div style={{
        height: 300, border: "1px solid rgba(255,255,255,.08)", background: "#0D2436",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#7c8b98", fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase",
      }}>
        Map token not configured
      </div>
    );
  }

  const lons = routeCoords.map((c) => c[0]);
  const lats = routeCoords.map((c) => c[1]);
  const minLon = Math.min(...lons), maxLon = Math.max(...lons);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const padLon = Math.max((maxLon - minLon) * 0.18, 1.5);
  const padLat = Math.max((maxLat - minLat) * 0.18, 1.5);

  const color = STATUS_COLOR[status];

  const geojson = {
    type: "FeatureCollection" as const,
    features: [{
      type: "Feature" as const,
      geometry: { type: "LineString" as const, coordinates: routeCoords },
      properties: { name },
    }],
  };

  const lineLayer = {
    id: "pipeline-route",
    type: "line" as const,
    paint: {
      "line-color": color,
      "line-width": 3.5,
      "line-opacity": 0.95,
    },
    layout: { "line-cap": "round" as const, "line-join": "round" as const },
  };

  const casingLayer = {
    id: "pipeline-route-casing",
    type: "line" as const,
    paint: {
      "line-color": "#000000",
      "line-width": 6,
      "line-opacity": 0.35,
    },
    layout: { "line-cap": "round" as const, "line-join": "round" as const },
  };

  return (
    <div style={{ height: 320, border: "1px solid rgba(255,255,255,.08)", position: "relative" }}>
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          bounds: [[minLon - padLon, minLat - padLat], [maxLon + padLon, maxLat + padLat]],
          fitBoundsOptions: { padding: 40 },
        }}
        mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
        style={{ width: "100%", height: "100%" }}
        scrollZoom={false}
      >
        <NavigationControl position="top-right" />

        <Source id="pipeline" type="geojson" data={geojson}>
          <Layer {...casingLayer} />
          <Layer {...lineLayer} />
        </Source>

        {/* Start terminal */}
        <Marker longitude={lons[0]} latitude={lats[0]} anchor="center">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 11, height: 11, background: color, border: "2px solid #fff",
              borderRadius: "50%", boxShadow: "0 0 0 3px rgba(0,0,0,.4)",
            }} />
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase",
              color: "#fff", background: "rgba(0,0,0,.65)", padding: "2px 6px",
              whiteSpace: "nowrap",
            }}>
              {fromCountry}
            </span>
          </div>
        </Marker>

        {/* End terminal — only label if different country */}
        {toCountry !== fromCountry && (
          <Marker longitude={lons[lons.length - 1]} latitude={lats[lats.length - 1]} anchor="center">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: 11, height: 11, background: "#e8edf1", border: "2px solid #fff",
                borderRadius: "50%", boxShadow: "0 0 0 3px rgba(0,0,0,.4)",
              }} />
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase",
                color: "#fff", background: "rgba(0,0,0,.65)", padding: "2px 6px",
                whiteSpace: "nowrap",
              }}>
                {toCountry}
              </span>
            </div>
          </Marker>
        )}
      </Map>
    </div>
  );
}
