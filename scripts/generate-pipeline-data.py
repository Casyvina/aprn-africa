"""
Extracts African pipeline data from GEM XLSX files and writes lib/pipelines/data.ts
Run from project root: python scripts/generate-pipeline-data.py
"""
import openpyxl, re, sys, json
from collections import defaultdict
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

AFRICA = {
    "Algeria","Angola","Benin","Cameroon","Chad","Djibouti","Egypt","Equatorial Guinea",
    "Ethiopia","Gabon","Ghana","Guinea","Guinea-Bissau","Kenya","Liberia","Libya",
    "Mauritania","Morocco","Mozambique","Namibia","Niger","Nigeria",
    "Republic of the Congo","Senegal","Sierra Leone","South Africa","South Sudan",
    "Sudan","Tanzania","Togo","Tunisia","Uganda","Zambia",
}

STATUS_ORDER = ["operating", "construction", "proposed", "shelved", "cancelled", "retired"]

STATUS_MAP = {
    "operating": "operating", "construction": "construction", "proposed": "proposed",
    "shelved": "shelved", "cancelled": "cancelled", "canceled": "cancelled",
    "retired": "retired", "mothballed": "shelved",
}

def norm_status(s):
    if not s: return "proposed"
    return STATUS_MAP.get(str(s).lower().strip(), "proposed")

def best_status(statuses):
    for s in STATUS_ORDER:
        if s in statuses: return s
    return "proposed"

def clean_owner(val):
    if not val: return None
    first = str(val).split(";")[0]
    out = re.sub(r"\s*\[[\d.%]+\]", "", first)
    out = re.sub(r"\s*\[unknown %\]", "", out).strip()
    return out or None

def to_slug(name, fuel=None):
    base = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return f"{base}-{fuel.lower()}" if fuel else base

def parse_countries(val):
    if not val: return []
    raw = str(val)
    # GEM uses comma-separated or semicolon-separated country lists
    sep = ";" if ";" in raw else ","
    return [c.strip() for c in raw.split(sep) if c.strip() and c.strip() != "--"]

def is_african(countries):
    return any(c in AFRICA for c in countries)

def to_num(v):
    if v is None or str(v).strip() in ("", "--", "N/A"): return None
    try: return float(v)
    except: return None

def ts_str(v):
    if v is None: return "null"
    escaped = str(v).replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ").replace("\r", "")
    return f'"{escaped}"'

def ts_num(v):
    n = to_num(v)
    return str(int(n)) if n is not None and n == int(n) else (str(n) if n is not None else "null")

def ts_arr(items):
    return "[" + ", ".join(ts_str(i) for i in items) + "]"

# ── Load gas pipelines ────────────────────────────────────────────────────────
wb = openpyxl.load_workbook("gem-data/GEM-GGIT-Gas-Pipelines-2025-11.xlsx", read_only=True, data_only=True)
ws = wb["Pipelines"]
all_rows = list(ws.iter_rows(values_only=True))
GH = {v: i for i, v in enumerate(all_rows[0])}

gas_groups = defaultdict(list)
for r in all_rows[1:]:
    countries = parse_countries(r[GH["CountriesOrAreas"]])
    if is_african(countries):
        gas_groups[str(r[GH["PipelineName"]] or "")].append(r)

# ── Load oil/NGL pipelines ────────────────────────────────────────────────────
wb2 = openpyxl.load_workbook("gem-data/GEM-GOIT-Oil-NGL-Pipelines-2026-06.xlsx", read_only=True, data_only=True)
ws2 = wb2["Data"]
all_rows2 = list(ws2.iter_rows(values_only=True))
OH = {v: i for i, v in enumerate(all_rows2[0])}

oil_groups = defaultdict(list)
for r in all_rows2[1:]:
    countries = parse_countries(r[OH["CountriesOrAreas"]])
    if is_african(countries):
        oil_groups[str(r[OH["PipelineName"]] or "")].append(r)

# ── Build pipeline objects ────────────────────────────────────────────────────
pipelines = []
used_slugs = set()

def make_slug(name, fuel=None):
    slug = to_slug(name, fuel)
    if slug not in used_slugs:
        used_slugs.add(slug)
        return slug
    # deduplicate
    i = 2
    while f"{slug}-{i}" in used_slugs:
        i += 1
    used_slugs.add(f"{slug}-{i}")
    return f"{slug}-{i}"

def process_gas(name, segs):
    first = segs[0]
    countries_all = []
    for s in segs:
        countries_all += parse_countries(s[GH["CountriesOrAreas"]])
    countries = list(dict.fromkeys(c for c in countries_all if c))  # unique, ordered

    statuses = [norm_status(s[GH["Status"]]) for s in segs]
    status = best_status(statuses)

    lengths = [to_num(s[GH["LengthMergedKm"]]) for s in segs]
    total_len = sum(x for x in lengths if x) or None

    # Build segments (only if >1 segment, or if SegmentName differs from PipelineName)
    seg_objs = []
    for s in segs:
        seg_name = s[GH["SegmentName"]] or name
        if str(seg_name) != str(name):
            seg_objs.append({
                "name": str(seg_name),
                "from": str(s[GH["StartCountryOrArea"]] or s[GH["StartLocation"]] or ""),
                "to": str(s[GH["EndCountryOrArea"]] or s[GH["EndLocation"]] or ""),
                "lengthKm": to_num(s[GH["LengthMergedKm"]]),
                "status": norm_status(s[GH["Status"]]),
            })

    fuel_raw = str(first[GH["Fuel"]] or "Gas")
    fuel = "Gas" if "gas" in fuel_raw.lower() or fuel_raw == "Gas" else "Gas"

    return {
        "slug": make_slug(name),
        "name": str(name),
        "fuel": fuel,
        "status": status,
        "countries": countries,
        "fromCountry": str(first[GH["StartCountryOrArea"]] or countries[0] if countries else ""),
        "toCountry": str(segs[-1][GH["EndCountryOrArea"]] or countries[-1] if countries else ""),
        "lengthKm": round(total_len) if total_len else None,
        "capacityValue": to_num(first[GH["Capacity"]]),
        "capacityUnit": str(first[GH["CapacityUnits"]]) if first[GH["CapacityUnits"]] else None,
        "startYear": int(to_num(first[GH["StartYear1"]])) if to_num(first[GH["StartYear1"]]) else None,
        "owner": clean_owner(first[GH["Owner"]]),
        "fidStatus": str(first[GH["FIDStatus"]]) if first[GH["FIDStatus"]] else None,
        "tracker": "Gas (GGIT)",
        "gemWikiUrl": str(first[GH["Wiki"]]) if first[GH["Wiki"]] else None,
        "segments": seg_objs,
        "significance": None,
        "relatedInsights": [],
        "sourceRelease": "GGIT 2025-11",
    }

def process_oil(name, segs):
    first = segs[0]
    countries_all = []
    for s in segs:
        countries_all += parse_countries(s[OH["CountriesOrAreas"]])
    countries = list(dict.fromkeys(c for c in countries_all if c))

    statuses = [norm_status(s[OH["Status"]]) for s in segs]
    status = best_status(statuses)

    lengths = [to_num(s[OH["LengthMergedKm"]]) for s in segs]
    total_len = sum(x for x in lengths if x) or None

    seg_objs = []
    for s in segs:
        seg_name = s[OH["SegmentName"]] or name
        if str(seg_name) != str(name):
            seg_objs.append({
                "name": str(seg_name),
                "from": str(s[OH["StartCountryOrArea"]] or s[OH["StartLocation"]] or ""),
                "to": str(s[OH["EndCountryOrArea"]] or s[OH["EndLocation"]] or ""),
                "lengthKm": to_num(s[OH["LengthMergedKm"]]),
                "status": norm_status(s[OH["Status"]]),
            })

    fuel_raw = str(first[OH["Fuel"]] or "Oil")
    if "ngl" in fuel_raw.lower(): fuel = "NGL"
    elif "oil" in fuel_raw.lower(): fuel = "Oil"
    else: fuel = "Oil"

    return {
        "slug": make_slug(name, fuel if fuel != "Oil" else None),
        "name": str(name),
        "fuel": fuel,
        "status": status,
        "countries": countries,
        "fromCountry": str(first[OH["StartCountryOrArea"]] or countries[0] if countries else ""),
        "toCountry": str(segs[-1][OH["EndCountryOrArea"]] or countries[-1] if countries else ""),
        "lengthKm": round(total_len) if total_len else None,
        "capacityValue": to_num(first[OH["Capacity"]]),
        "capacityUnit": str(first[OH["CapacityUnits"]]) if first[OH["CapacityUnits"]] else None,
        "startYear": int(to_num(first[OH["StartYear1"]])) if to_num(first[OH["StartYear1"]]) else None,
        "owner": clean_owner(first[OH["Owner"]]),
        "fidStatus": None,
        "tracker": "Oil/NGL (GOIT)",
        "gemWikiUrl": str(first[OH["Wiki"]]) if first[OH["Wiki"]] else None,
        "segments": seg_objs,
        "significance": None,
        "relatedInsights": [],
        "sourceRelease": "GOIT 2026-06",
    }

for name, segs in gas_groups.items():
    if name: pipelines.append(process_gas(name, segs))

for name, segs in oil_groups.items():
    if name: pipelines.append(process_oil(name, segs))

print(f"Total pipelines: {len(pipelines)}", file=sys.stderr)

# ── Compute country counts from real data ─────────────────────────────────────
country_counts = defaultdict(int)
for p in pipelines:
    for c in p["countries"]:
        if c in AFRICA:
            country_counts[c] += 1

print(f"Countries covered: {len(country_counts)}", file=sys.stderr)

# ── Generate TypeScript ───────────────────────────────────────────────────────
def render_pipeline(p):
    segments_ts = ""
    if p["segments"]:
        seg_lines = []
        for s in p["segments"]:
            seg_lines.append(
                f'    {{ name: {ts_str(s["name"])}, from: {ts_str(s["from"])}, to: {ts_str(s["to"])}, '
                f'lengthKm: {ts_num(s["lengthKm"])}, status: "{s["status"]}" }}'
            )
        segments_ts = "[\n" + ",\n".join(seg_lines) + "\n  ]"
    else:
        segments_ts = "[]"

    countries_ts = ts_arr(p["countries"])
    related_ts = "[]"

    return f"""  {{
    slug: {ts_str(p["slug"])},
    name: {ts_str(p["name"])},
    fuel: "{p["fuel"]}",
    status: "{p["status"]}",
    countries: {countries_ts},
    fromCountry: {ts_str(p["fromCountry"])},
    toCountry: {ts_str(p["toCountry"])},
    lengthKm: {ts_num(p["lengthKm"])},
    capacityValue: {ts_num(p["capacityValue"])},
    capacityUnit: {ts_str(p["capacityUnit"])},
    startYear: {"null" if p["startYear"] is None else p["startYear"]},
    owner: {ts_str(p["owner"])},
    fidStatus: {ts_str(p["fidStatus"])},
    tracker: {ts_str(p["tracker"])},
    gemWikiUrl: {ts_str(p["gemWikiUrl"])},
    segments: {segments_ts},
    significance: null,
    relatedInsights: {related_ts},
    sourceRelease: {ts_str(p["sourceRelease"])},
  }}"""

pipeline_ts = ",\n".join(render_pipeline(p) for p in pipelines)

country_counts_entries = ",\n  ".join(
    f'{ts_str(c)}: {n}'
    for c, n in sorted(country_counts.items(), key=lambda x: -x[1])
)

ts_output = f'''export type PipelineStatus = "operating" | "proposed" | "construction" | "shelved" | "cancelled" | "retired";
export type PipelineFuel = "Gas" | "Oil" | "NGL";

export interface PipelineSegment {{
  name: string;
  from: string;
  to: string;
  lengthKm: number | null;
  status: PipelineStatus;
}}

export interface Pipeline {{
  slug: string;
  name: string;
  fuel: PipelineFuel;
  status: PipelineStatus;
  countries: string[];
  fromCountry: string;
  toCountry: string;
  lengthKm: number | null;
  capacityValue: number | null;
  capacityUnit: string | null;
  startYear: number | null;
  owner: string | null;
  fidStatus: string | null;
  tracker: string;
  gemWikiUrl: string | null;
  segments: PipelineSegment[];
  significance: string | null;
  relatedInsights: {{ title: string; href: string; type: string }}[];
  sourceRelease: string;
}}

// Generated from GEM GGIT 2025-11 and GOIT 2026-06 — do not hand-edit
const ALL_PIPELINES: Pipeline[] = [
{pipeline_ts}
];

export const COUNTRY_COUNTS: Record<string, number> = {{
  {country_counts_entries}
}};

export function countryToSlug(country: string): string {{
  return country.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}}

export function slugToCountry(slug: string): string | undefined {{
  return Object.keys(COUNTRY_COUNTS).find(c => countryToSlug(c) === slug);
}}

export function getPipelinesForCountry(country: string): Pipeline[] {{
  return ALL_PIPELINES.filter(p => p.countries.includes(country));
}}

export function getPipelineBySlug(country: string, slug: string): Pipeline | undefined {{
  return ALL_PIPELINES.find(p => p.slug === slug && p.countries.includes(country));
}}
'''

out_path = Path("lib/pipelines/data.ts")
out_path.write_text(ts_output, encoding="utf-8")
print(f"Written to {out_path}", file=sys.stderr)
