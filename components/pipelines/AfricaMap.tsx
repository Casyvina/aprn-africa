"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { COUNTRY_COUNTS, countryToSlug } from "@/lib/pipelines/data";

const MAX = Math.max(...Object.values(COUNTRY_COUNTS));

function countryColor(n: number): string {
  if (!n) return "#0a2035";
  const t = n / MAX;
  if (t < 0.02) return "#132d42";
  if (t < 0.08) return "#1e4a62";
  if (t < 0.20) return "#c97a2b";
  if (t < 0.50) return "#d4a017";
  return "#e5b83b";
}

interface CountryPath { id: string; d: string; cx?: never; cy?: never; r?: never }
interface CountryCircle { id: string; cx: number; cy: number; r: number; d?: never }
type CountryShape = CountryPath | CountryCircle;

const SHAPES: CountryShape[] = [
  { id: "Morocco",                         d: "M195,95 L270,90 L280,115 L260,140 L220,155 L195,145 L185,120 Z" },
  { id: "Algeria",                         d: "M200,155 L270,145 L290,160 L310,155 L330,170 L340,245 L280,265 L230,270 L195,255 L185,220 L190,185 Z" },
  { id: "Tunisia",                         d: "M285,120 L320,118 L330,140 L320,165 L300,160 L285,145 Z" },
  { id: "Libya",                           d: "M310,155 L420,155 L435,180 L440,250 L360,260 L340,245 L330,170 Z" },
  { id: "Egypt",                           d: "M420,155 L510,150 L520,175 L515,235 L440,250 L435,180 Z" },
  { id: "Western Sahara",                  d: "M140,195 L195,195 L190,240 L185,275 L145,270 L130,240 Z" },
  { id: "Mauritania",                      d: "M130,240 L185,275 L190,310 L170,340 L130,345 L105,320 L100,285 Z" },
  { id: "Mali",                            d: "M185,275 L230,270 L260,280 L275,310 L270,355 L235,370 L200,375 L170,360 L170,340 L190,310 Z" },
  { id: "Niger",                           d: "M280,265 L340,260 L380,280 L385,310 L360,345 L320,360 L275,355 L270,310 L275,310 Z" },
  { id: "Chad",                            d: "M380,280 L440,270 L460,295 L460,360 L430,390 L385,385 L360,345 L385,310 Z" },
  { id: "Sudan",                           d: "M440,250 L515,235 L535,255 L540,300 L530,350 L490,370 L460,360 L460,295 L440,270 Z" },
  { id: "Eritrea",                         d: "M535,255 L565,248 L570,270 L555,285 L540,280 L535,265 Z" },
  { id: "Djibouti",                        d: "M565,285 L580,280 L582,298 L568,300 Z" },
  { id: "Ethiopia",                        d: "M530,285 L565,270 L580,285 L600,305 L590,345 L560,360 L530,350 L490,370 L495,335 Z" },
  { id: "Somalia",                         d: "M565,295 L600,305 L620,330 L615,380 L590,395 L570,370 L560,360 L575,340 L590,345 Z" },
  { id: "Nigeria",                         d: "M275,360 L320,360 L360,345 L385,385 L380,415 L350,430 L310,430 L285,415 L265,395 L270,375 Z" },
  { id: "Cameroon",                        d: "M360,345 L385,385 L390,415 L375,440 L355,450 L340,440 L310,430 L350,430 Z" },
  { id: "Equatorial Guinea",               d: "M350,450 L360,445 L368,460 L350,462 Z" },
  { id: "Gabon",                           d: "M355,455 L390,445 L400,470 L388,495 L365,495 L350,475 Z" },
  { id: "Republic of the Congo",           d: "M375,445 L400,445 L415,460 L420,490 L405,510 L388,510 L388,495 L400,470 L390,445 Z" },
  { id: "Democratic Republic of the Congo",d: "M385,390 L430,390 L460,395 L480,430 L490,480 L475,520 L440,540 L410,540 L390,520 L375,500 L388,510 L405,510 L420,490 L415,460 L395,445 L375,440 L380,415 Z" },
  { id: "Central African Republic",        d: "M385,385 L430,390 L460,360 L490,370 L490,395 L460,395 L430,390 Z" },
  { id: "South Sudan",                     d: "M460,360 L530,350 L530,380 L510,405 L490,415 L460,395 L490,370 Z" },
  { id: "Uganda",                          d: "M490,415 L510,405 L530,415 L530,445 L510,455 L490,445 Z" },
  { id: "Kenya",                           d: "M530,380 L560,360 L570,370 L590,395 L580,435 L555,455 L530,445 L530,415 L510,405 Z" },
  { id: "Rwanda",                          d: "M488,448 L500,445 L505,458 L490,460 Z" },
  { id: "Burundi",                         d: "M488,460 L503,458 L508,472 L492,474 Z" },
  { id: "Tanzania",                        d: "M490,445 L510,455 L530,445 L555,455 L580,435 L590,460 L575,495 L545,515 L515,515 L490,500 L480,475 L490,460 L510,455 Z" },
  { id: "Angola",                          d: "M390,520 L410,540 L440,540 L475,520 L490,540 L480,580 L450,600 L415,600 L390,575 L375,545 Z" },
  { id: "Zambia",                          d: "M475,520 L490,500 L515,515 L545,515 L560,540 L555,575 L525,590 L490,585 L480,580 L490,540 Z" },
  { id: "Malawi",                          d: "M545,520 L560,515 L568,540 L558,565 L548,560 L542,540 Z" },
  { id: "Mozambique",                      d: "M545,515 L575,495 L590,520 L585,570 L560,590 L545,580 L555,575 L560,540 Z" },
  { id: "Zimbabwe",                        d: "M490,585 L525,590 L555,575 L558,600 L535,618 L500,618 L482,600 Z" },
  { id: "Botswana",                        d: "M450,600 L480,580 L490,585 L482,600 L470,625 L445,630 L430,610 Z" },
  { id: "Namibia",                         d: "M390,575 L415,600 L430,610 L420,650 L385,660 L360,645 L355,610 L365,580 Z" },
  { id: "South Africa",                    d: "M430,610 L445,630 L470,625 L482,600 L500,618 L510,650 L490,680 L460,690 L420,685 L395,665 L385,660 L420,650 Z" },
  { id: "Eswatini",                        d: "M500,625 L510,620 L514,632 L504,636 Z" },
  { id: "Lesotho",                         d: "M455,658 L466,652 L470,664 L458,668 Z" },
  { id: "Senegal",                         d: "M108,328 L130,325 L145,340 L140,360 L115,365 L100,350 Z" },
  { id: "Guinea-Bissau",                   d: "M103,358 L118,355 L122,368 L108,372 Z" },
  { id: "Guinea",                          d: "M110,365 L140,358 L150,375 L140,395 L115,395 L105,380 Z" },
  { id: "Sierra Leone",                    d: "M108,393 L130,390 L135,408 L118,415 L105,408 Z" },
  { id: "Liberia",                         d: "M122,407 L148,395 L160,408 L155,425 L130,430 L115,420 Z" },
  { id: "Ivory Coast",                     d: "M148,375 L175,368 L200,375 L205,400 L185,418 L155,420 L148,400 Z" },
  { id: "Ghana",                           d: "M200,375 L235,370 L245,395 L240,420 L215,425 L200,415 L205,400 Z" },
  { id: "Togo",                            d: "M240,375 L252,372 L258,395 L252,422 L240,420 L240,395 Z" },
  { id: "Benin",                           d: "M253,372 L272,368 L278,390 L270,420 L252,420 L258,395 Z" },
  { id: "Burkina Faso",                    d: "M175,340 L235,335 L248,358 L240,372 L200,375 L170,362 Z" },
  { id: "Madagascar",                      d: "M590,490 L610,478 L625,510 L620,560 L600,575 L580,555 L578,520 Z" },
];
const CIRCLES: CountryCircle[] = [
  { id: "Mauritius", cx: 640, cy: 565, r: 6 },
];

export default function AfricaMap() {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState({ x: 0, y: 0 });

  function handleClick(id: string) {
    if (COUNTRY_COUNTS[id]) router.push(`/intelligence/pipelines/${countryToSlug(id)}`);
  }

  return (
    <div style={{ position: "relative" }}>
      <svg
        viewBox="0 0 800 860"
        style={{ width: "100%", border: "1px solid rgba(255,255,255,.08)" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {SHAPES.map((s) => {
          const n = COUNTRY_COUNTS[s.id] ?? 0;
          const isHov = hovered === s.id;
          const fill = isHov && n ? "#e5b83b" : countryColor(n);
          const stroke = isHov && n ? "#D4A017" : "#071B2A";
          const sw = isHov && n ? 2 : 1;
          return (
            <path
              key={s.id}
              d={s.d}
              fill={fill}
              stroke={stroke}
              strokeWidth={sw}
              style={{ cursor: n ? "pointer" : "default", transition: "fill .15s" }}
              onMouseEnter={(e) => { setHovered(s.id); setTooltip({ x: e.clientX, y: e.clientY }); }}
              onMouseMove={(e) => setTooltip({ x: e.clientX, y: e.clientY })}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleClick(s.id)}
            />
          );
        })}
        {CIRCLES.map((c) => {
          const n = COUNTRY_COUNTS[c.id] ?? 0;
          return (
            <circle
              key={c.id}
              cx={c.cx} cy={c.cy} r={c.r}
              fill={countryColor(n)}
              stroke="#071B2A" strokeWidth={1}
              style={{ cursor: n ? "pointer" : "default" }}
              onMouseEnter={(e) => { setHovered(c.id); setTooltip({ x: e.clientX, y: e.clientY }); }}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleClick(c.id)}
            />
          );
        })}
      </svg>

      {/* Tooltip */}
      {hovered && COUNTRY_COUNTS[hovered] && (
        <div
          style={{
            position: "fixed", left: tooltip.x + 14, top: tooltip.y - 10,
            background: "#0D2436", border: "1px solid #D4A017",
            padding: "10px 14px", fontSize: 12, pointerEvents: "none",
            zIndex: 100, minWidth: 140,
          }}
        >
          <span style={{ display: "block", fontFamily: "var(--font-playfair), serif", fontSize: 16, color: "#e8edf1", marginBottom: 3 }}>
            {hovered}
          </span>
          <span style={{ color: "#E5B83B", fontWeight: 700 }}>{COUNTRY_COUNTS[hovered]}</span>{" "}
          <span style={{ color: "#7c8b98" }}>segments</span>
        </div>
      )}

      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, fontSize: 11, color: "#7c8b98" }}>
        <span style={{ letterSpacing: ".5px" }}>Segments</span>
        {["#132d42", "#1e4a62", "#c97a2b", "#d4a017", "#e5b83b"].map((bg) => (
          <div key={bg} style={{ width: 22, height: 10, background: bg }} />
        ))}
        <span>1 → 165+</span>
      </div>
    </div>
  );
}
