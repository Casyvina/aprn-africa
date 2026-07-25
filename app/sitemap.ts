import { MetadataRoute } from "next";
import { sanityFetch } from "@/lib/sanity/fetch";
import { groq } from "next-sanity";

const BASE = "https://aprn-africa.org";

// Static public routes with their change frequency and priority
const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE,                    lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0  },
  { url: `${BASE}/research`,      lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9  },
  { url: `${BASE}/insights`,      lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9  },
  { url: `${BASE}/events`,        lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8  },
  { url: `${BASE}/training`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.8  },
  { url: `${BASE}/about`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.7  },
  { url: `${BASE}/leadership`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.7  },
  { url: `${BASE}/partnerships`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.6  },
  { url: `${BASE}/programs`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.6  },
  { url: `${BASE}/certification`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6  },
  { url: `${BASE}/membership`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.7  },
  { url: `${BASE}/newsletter`,    lastModified: new Date(), changeFrequency: "weekly",  priority: 0.5  },
  { url: `${BASE}/contact`,       lastModified: new Date(), changeFrequency: "yearly",  priority: 0.5  },
];

const RESEARCH_SLUGS_QUERY = groq`
  *[_type == "researchReport" && defined(slug.current)]{
    "slug": slug.current, "_updatedAt": _updatedAt
  }
`;

const INSIGHT_SLUGS_QUERY = groq`
  *[_type in ["editorialInsight", "intelligenceUpdate", "publication"] && defined(slug.current)]{
    "slug": slug.current, "_updatedAt": _updatedAt
  }
`;

const EVENT_SLUGS_QUERY = groq`
  *[_type == "event" && defined(slug.current) && status in ["published", "coming_soon"]]{
    "slug": slug.current, "_updatedAt": _updatedAt
  }
`;

const NEWSLETTER_SLUGS_QUERY = groq`
  *[_type == "newsletter" && defined(slug.current)]{
    "slug": slug.current, "_updatedAt": _updatedAt
  }
`;

type SlugRow = { slug: string; _updatedAt?: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [research, insights, events, newsletters] = await Promise.all([
    sanityFetch<SlugRow[]>(RESEARCH_SLUGS_QUERY, {}, ["researchReport"]).catch(() => [] as SlugRow[]),
    sanityFetch<SlugRow[]>(INSIGHT_SLUGS_QUERY, {}, ["editorialInsight", "intelligenceUpdate"]).catch(() => [] as SlugRow[]),
    sanityFetch<SlugRow[]>(EVENT_SLUGS_QUERY, {}, ["event"]).catch(() => [] as SlugRow[]),
    sanityFetch<SlugRow[]>(NEWSLETTER_SLUGS_QUERY, {}, ["newsletter"]).catch(() => [] as SlugRow[]),
  ]);

  const researchUrls: MetadataRoute.Sitemap = (research ?? []).map((r) => ({
    url: `${BASE}/research/${r.slug}`,
    lastModified: r._updatedAt ? new Date(r._updatedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const insightUrls: MetadataRoute.Sitemap = (insights ?? []).map((r) => ({
    url: `${BASE}/insights/${r.slug}`,
    lastModified: r._updatedAt ? new Date(r._updatedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const eventUrls: MetadataRoute.Sitemap = (events ?? []).map((r) => ({
    url: `${BASE}/events/${r.slug}`,
    lastModified: r._updatedAt ? new Date(r._updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const newsletterUrls: MetadataRoute.Sitemap = (newsletters ?? []).map((r) => ({
    url: `${BASE}/newsletter/${r.slug}`,
    lastModified: r._updatedAt ? new Date(r._updatedAt) : new Date(),
    changeFrequency: "yearly",
    priority: 0.4,
  }));

  return [...STATIC_ROUTES, ...researchUrls, ...insightUrls, ...eventUrls, ...newsletterUrls];
}
