export type PipelineStatus = "operating" | "proposed" | "construction" | "shelved" | "cancelled" | "retired";
export type PipelineFuel = "Gas" | "Oil" | "NGL";

export interface PipelineSegment {
  name: string;
  from: string;
  to: string;
  lengthKm: number | null;
  status: PipelineStatus;
}

export interface Pipeline {
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
  // editorial — filled by APRN in Studio later
  significance: string | null;
  relatedInsights: { title: string; href: string; type: string }[];
  sourceRelease: string;
}

// Country segment counts — real data from GEM
export const COUNTRY_COUNTS: Record<string, number> = {
  Algeria: 165, Egypt: 89, Libya: 89, Nigeria: 65, Tunisia: 36,
  "South Africa": 15, Ghana: 10, Angola: 8, Tanzania: 7, Morocco: 6,
  Niger: 5, Mozambique: 5, Sudan: 4, Kenya: 4, Chad: 4,
  Benin: 3, Gabon: 3, "South Sudan": 3, Uganda: 3, Zambia: 2,
  Ethiopia: 2, Togo: 2, "Equatorial Guinea": 2, Cameroon: 1,
  Djibouti: 1, Liberia: 1, "Sierra Leone": 1, Guinea: 1,
  Senegal: 1, Mauritania: 1, "Republic of the Congo": 1, Namibia: 1,
};

// Slug → country name map
export function countryToSlug(country: string): string {
  return country.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function slugToCountry(slug: string): string | undefined {
  return Object.keys(COUNTRY_COUNTS).find(c => countryToSlug(c) === slug);
}

// Static placeholder pipelines for Nigeria (Phase 1 — data load comes later)
export const NIGERIA_PIPELINES: Pipeline[] = [
  {
    slug: "nigeria-morocco-gas-pipeline",
    name: "Nigeria–Morocco Gas Pipeline",
    fuel: "Gas", status: "proposed",
    countries: ["Nigeria", "Benin", "Togo", "Ghana", "Ivory Coast", "Liberia", "Sierra Leone", "Guinea", "Guinea-Bissau", "Gambia", "Senegal", "Mauritania", "Morocco"],
    fromCountry: "Nigeria", toCountry: "Morocco",
    lengthKm: 5660, capacityValue: null, capacityUnit: "bcm/y",
    startYear: null, owner: "NNPC", fidStatus: "Pre-FID",
    tracker: "Gas (GGIT)", gemWikiUrl: null,
    segments: [], significance: null, relatedInsights: [], sourceRelease: "GGIT 2025-11",
  },
  {
    slug: "trans-sahara-gas-pipeline",
    name: "Trans-Saharan Gas Pipeline",
    fuel: "Gas", status: "shelved",
    countries: ["Nigeria", "Niger", "Algeria"],
    fromCountry: "Nigeria", toCountry: "Algeria",
    lengthKm: 4128, capacityValue: 30, capacityUnit: "bcm/y",
    startYear: null, owner: "NNPC / Sonatrach", fidStatus: "Pre-FID",
    tracker: "Gas (GGIT)", gemWikiUrl: null,
    segments: [
      { name: "Nigeria section", from: "Warri", to: "Kano", lengthKm: 1037, status: "shelved" },
      { name: "Niger section", from: "Kano", to: "Agadez", lengthKm: 800, status: "shelved" },
      { name: "Algeria section", from: "Agadez", to: "Hassi R'Mel", lengthKm: 2291, status: "shelved" },
    ],
    significance: `First proposed in the 1980s and formalised by a 2009 tripartite agreement between Nigeria, Niger and Algeria, the Trans-Saharan line would move Nigerian gas roughly 4,100 km north to Algeria's Mediterranean coast and on into Europe — bypassing the sea route entirely.\n\nIt has stalled repeatedly on financing, security across the Sahel, and the competing westward Nigeria–Morocco proposal. Europe's search for non-Russian gas after 2022 revived political interest, but no final investment decision has been reached, and APRN classes it as shelved pending a credible funding structure.\n\nFor African engineers, it remains the continent's most consequential unbuilt corridor — a test of whether cross-border gas infrastructure can clear the political and capital barriers the region keeps running into.`,
    relatedInsights: [
      { title: "Nigeria's gas export dilemma: north or west?", href: "/insights", type: "Insight · 6 min" },
      { title: "Financing cross-border pipelines in the Sahel", href: "/research", type: "Research · APRN" },
    ],
    sourceRelease: "GGIT 2025-11",
  },
  {
    slug: "nigeria-crude-oil-products-pipeline-network",
    name: "Nigeria Crude & Oil Products Pipeline Network",
    fuel: "Oil", status: "operating",
    countries: ["Nigeria"],
    fromCountry: "Nigeria", toCountry: "Nigeria",
    lengthKm: 3461, capacityValue: null, capacityUnit: null,
    startYear: null, owner: "NNPC", fidStatus: null,
    tracker: "Oil/NGL (GOIT)", gemWikiUrl: null,
    segments: [], significance: null, relatedInsights: [], sourceRelease: "GOIT 2026-06",
  },
  {
    slug: "nigeria-libya-gas-pipeline",
    name: "Nigeria–Libya Gas Pipeline",
    fuel: "Gas", status: "proposed",
    countries: ["Nigeria", "Niger", "Libya"],
    fromCountry: "Nigeria", toCountry: "Libya",
    lengthKm: 3187, capacityValue: null, capacityUnit: null,
    startYear: null, owner: null, fidStatus: null,
    tracker: "Gas (GGIT)", gemWikiUrl: null,
    segments: [], significance: null, relatedInsights: [], sourceRelease: "GGIT 2025-11",
  },
  {
    slug: "trans-nigeria-gas-pipeline",
    name: "Trans Nigeria Gas Pipeline",
    fuel: "Gas", status: "construction",
    countries: ["Nigeria"],
    fromCountry: "Nigeria", toCountry: "Nigeria",
    lengthKm: 1986, capacityValue: null, capacityUnit: null,
    startYear: null, owner: "NNPC", fidStatus: null,
    tracker: "Gas (GGIT)", gemWikiUrl: null,
    segments: [], significance: null, relatedInsights: [], sourceRelease: "GGIT 2025-11",
  },
  {
    slug: "west-african-gas-pipeline",
    name: "West African Gas Pipeline",
    fuel: "Gas", status: "operating",
    countries: ["Nigeria", "Benin", "Togo", "Ghana"],
    fromCountry: "Nigeria", toCountry: "Ghana",
    lengthKm: 678, capacityValue: 3.2, capacityUnit: "bcm/y",
    startYear: 2008, owner: "WAPCo", fidStatus: null,
    tracker: "Gas (GGIT)", gemWikiUrl: null,
    segments: [], significance: null, relatedInsights: [], sourceRelease: "GGIT 2025-11",
  },
  {
    slug: "escravos-lagos-pipeline-system",
    name: "Escravos–Lagos Pipeline System (ELPS)",
    fuel: "Gas", status: "operating",
    countries: ["Nigeria"],
    fromCountry: "Nigeria", toCountry: "Nigeria",
    lengthKm: 686, capacityValue: null, capacityUnit: null,
    startYear: null, owner: "NNPC", fidStatus: null,
    tracker: "Gas (GGIT)", gemWikiUrl: null,
    segments: [], significance: null, relatedInsights: [], sourceRelease: "GGIT 2025-11",
  },
];

export function getPipelinesForCountry(country: string): Pipeline[] {
  // Phase 1 returns real data for Nigeria, placeholder notice for others
  if (country === "Nigeria") return NIGERIA_PIPELINES;
  return [];
}

export function getPipelineBySlug(country: string, slug: string): Pipeline | undefined {
  return getPipelinesForCountry(country).find(p => p.slug === slug);
}
