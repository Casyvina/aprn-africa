export type ArticleCategory = "intelligence" | "research" | "editorial";

export interface ArticleInsight {
  value: string;
  label: string;
  icon: string;
}

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "pullquote"; text: string }
  | { type: "callout"; title: string; text: string };

export interface Article {
  slug: string;
  category: ArticleCategory;
  featured?: boolean;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  author: string;
  authorRole: string;
  excerpt: string;
  heroImage: string;
  insights: ArticleInsight[];
  body: ContentBlock[];
  pullQuote: string;
}

export const categoryMeta: Record<
  ArticleCategory,
  { label: string; badge: string; dot: string }
> = {
  intelligence: {
    label: "Intelligence Brief",
    badge: "bg-sky-400/10 border-sky-400/30 text-sky-400",
    dot: "bg-sky-400",
  },
  research: {
    label: "Research Report",
    badge: "bg-gold-500/10 border-gold-500/30 text-gold-500",
    dot: "bg-gold-500",
  },
  editorial: {
    label: "Editorial Insight",
    badge: "bg-copper-500/10 border-copper-500/30 text-copper-500",
    dot: "bg-copper-500",
  },
};

export const articles: Article[] = [
  {
    slug: "ob3-pipeline-post-construction-assessment",
    category: "intelligence",
    featured: true,
    title: "OB3 Pipeline: Post-Construction Infrastructure Assessment",
    subtitle:
      "A technical intelligence update on the OB3 Oben–Obiafu/Obrikom gas pipeline following final tie-in completion.",
    date: "12 May 2026",
    readTime: "6 min read",
    author: "APRN Intelligence Desk",
    authorRole: "Infrastructure Intelligence Division",
    excerpt:
      "Following confirmed completion of final tie-in operations on the OB3 pipeline corridor, APRN's intelligence division provides a technical assessment of construction outcomes, workforce deployment patterns, and operational readiness projections.",
    heroImage: "/images/pipeline-aerial.png",
    insights: [
      { value: "127 km", label: "Pipeline Corridor", icon: "fa-route" },
      { value: "1.8 Bcf/d", label: "Nameplate Capacity", icon: "fa-gauge-high" },
      { value: "94%", label: "Local Workforce", icon: "fa-hard-hat" },
      { value: "Q2 2026", label: "Operational Target", icon: "fa-calendar-check" },
    ],
    pullQuote:
      "The OB3 corridor represents the most significant midstream gas infrastructure completion in the Niger Delta since the AKK project began its southern phase.",
    body: [
      {
        type: "paragraph",
        text: "The OB3 pipeline, connecting Oben to Obiafu/Obrikom across a 127-kilometre corridor, has achieved final tie-in — a milestone that closes a critical gap in Nigeria's domestic gas transmission network. This intelligence brief provides APRN's technical assessment of the project's operational status and its implications for regional energy security.",
      },
      { type: "heading", text: "Construction Outcomes" },
      {
        type: "paragraph",
        text: "Post-construction surveys indicate that the pipeline has been laid to specification across all three geotechnical zones traversed by the corridor. The Delta soft-soil section, historically the most challenging phase of any Niger Delta midstream project, was completed with a 14% reduction in rework incidents compared to analogous projects in the region over the previous decade.",
      },
      {
        type: "callout",
        title: "APRN Assessment",
        text: "The use of high-density polyethylene sleeving in waterlogged sections has significantly reduced corrosion-initiation risk. APRN recommends a 90-day post-tie-in integrity assessment before full operational ramp-up.",
      },
      { type: "heading", text: "Workforce Intelligence" },
      {
        type: "paragraph",
        text: "An estimated 94% of the construction workforce across peak operations was drawn from Nigerian nationals, with 67% sourced from Delta and Rivers States. This is a notable improvement from the 71% local content figure recorded during Phase 1 of the project in 2019. However, APRN notes a persistent skills gap at the supervisory and inspection engineering tier, where expatriate fill-rate remains at approximately 38%.",
      },
      {
        type: "pullquote",
        text: "Closing the supervisory skills gap is not a recruitment problem — it is a training infrastructure problem. APRN exists to resolve exactly this.",
      },
      {
        type: "paragraph",
        text: "The data reinforces APRN's core institutional thesis: physical infrastructure capacity is outpacing human capital development. Without accelerated investment in pipeline engineering training at the mid-career supervisory level, the local content ambitions of Nigeria's Petroleum Industry Act will remain structurally limited.",
      },
    ],
  },
  {
    slug: "africa-pipeline-engineering-skills-gap",
    category: "research",
    title: "Africa's Pipeline Engineering Skills Gap: A Continental Analysis",
    subtitle:
      "A structured research assessment of engineering workforce shortfalls across Africa's midstream energy infrastructure sector, 2020–2026.",
    date: "28 April 2026",
    readTime: "18 min read",
    author: "Lucy Okeke",
    authorRole: "Founder & President, APRN",
    excerpt:
      "Africa's pipeline infrastructure investment is accelerating. The engineering workforce is not. This report examines the structural drivers, continental scope, and institutional pathways to resolving the most consequential human capital gap in African energy development.",
    heroImage: "/images/engineers-group.png",
    insights: [
      { value: "340,000+", label: "Engineer Shortfall by 2030", icon: "fa-users" },
      { value: "62%", label: "Supervisory Roles Understaffed", icon: "fa-person-circle-exclamation" },
      { value: "14", label: "Countries Assessed", icon: "fa-earth-africa" },
      { value: "$2.3T", label: "Infrastructure Investment Pipeline", icon: "fa-chart-line" },
    ],
    pullQuote:
      "The engineering workforce crisis is not a future risk. It is a present operational constraint shaping every infrastructure procurement decision on the continent today.",
    body: [
      {
        type: "paragraph",
        text: "Africa's pipeline infrastructure investment trajectory is among the most significant in the world. From the East African Crude Oil Pipeline to the Nigeria-Morocco Gas Pipeline, from Mozambique's LNG onshore corridors to South Africa's expanding midstream grid — the scale of planned and committed capital expenditure demands a commensurate engineering workforce. That workforce does not currently exist.",
      },
      { type: "heading", text: "Methodology" },
      {
        type: "paragraph",
        text: "This report draws on APRN's continental workforce database, cross-referenced with national oil company human resource disclosures, engineering council registration data from 14 African member states, and procurement records from major infrastructure projects awarded between 2020 and 2025. Workforce shortfall projections are modelled against announced capital expenditure pipelines through 2030.",
      },
      { type: "heading", text: "Scale of the Deficit" },
      {
        type: "paragraph",
        text: "APRN's analysis identifies a projected deficit of over 340,000 qualified pipeline and midstream engineers across the continent by 2030 — factoring in announced retirement rates, current graduation outputs from relevant engineering programmes, and the engineering intensity ratios of committed infrastructure projects.",
      },
      {
        type: "callout",
        title: "Key Finding",
        text: "The deficit is most acute at the inspection, integrity management, and supervisory engineering tiers. These roles cannot be automated or substituted. They represent the human infrastructure on which physical infrastructure safety depends.",
      },
      {
        type: "pullquote",
        text: "Africa's infrastructure future depends on coordinated engineering capability. Capital without competence produces infrastructure without longevity.",
      },
      { type: "heading", text: "Institutional Response" },
      {
        type: "paragraph",
        text: "APRN's institutional formation responds directly to this analysis. The APRN Training Academy is designed not as a supplementary education programme but as critical infrastructure — an organised, credentialed, and continent-scalable system for producing the pipeline engineering professionals Africa's energy transition requires.",
      },
    ],
  },
  {
    slug: "engineering-capacity-as-national-security",
    category: "editorial",
    title: "Engineering Capacity as National Security: The African Imperative",
    subtitle:
      "Why the absence of indigenous pipeline engineering knowledge is not just an economic problem — it is a sovereignty problem.",
    date: "15 March 2026",
    readTime: "10 min read",
    author: "Lucy Okeke",
    authorRole: "Founder & President, APRN",
    excerpt:
      "When a nation cannot independently operate, inspect, or extend its own pipeline infrastructure, it has not achieved energy independence — regardless of what its policy documents say.",
    heroImage: "/images/female-engineer-site.jpg",
    insights: [
      { value: "47", label: "African Nations with Pipeline Assets", icon: "fa-earth-africa" },
      { value: "<12%", label: "Independently Operated", icon: "fa-gauge" },
      { value: "3×", label: "Expatriate Engineering Premium", icon: "fa-arrow-trend-up" },
      { value: "2030", label: "APRN Capacity Target", icon: "fa-flag-checkered" },
    ],
    pullQuote:
      "The right question is not whether Africa can afford to build its own engineering capacity. The right question is whether Africa can afford not to.",
    body: [
      {
        type: "paragraph",
        text: "There is a distinction that rarely surfaces in the discourse around African infrastructure development — the distinction between owning infrastructure and being able to operate it. Across the continent, there are nations that hold sovereign ownership over pipeline assets running through their territory, yet cannot independently conduct a pipeline integrity assessment, design a compressor station modification, or train their own next generation of midstream engineers. This is not energy independence. It is a more expensive form of dependency.",
      },
      { type: "heading", text: "The Sovereignty Gap" },
      {
        type: "paragraph",
        text: "Engineering knowledge, when indigenous, compounds. A nation with its own pipeline engineering expertise develops institutional memory, localised solutions to localised geological and environmental conditions, and a professional ecosystem that sustains itself across generations. A nation without it is perpetually dependent on foreign expertise at foreign rates — and perpetually vulnerable to the withdrawal of that expertise at moments of political or commercial tension.",
      },
      {
        type: "pullquote",
        text: "Applied engineering without applied knowledge transfer is a temporary solution. APRN exists to make Africa's infrastructure expertise permanent, indigenous, and self-sustaining.",
      },
      {
        type: "callout",
        title: "APRN's Position",
        text: "APRN does not view the engineering skills gap as a development problem to be addressed at the margins of infrastructure policy. We view it as the central constraint on Africa's infrastructure sovereignty — and we have structured our institution accordingly.",
      },
      { type: "heading", text: "What Institutional Response Looks Like" },
      {
        type: "paragraph",
        text: "The response to a sovereignty gap is not a scholarship programme or a short-course series. It is an institution — one with the credibility to certify, the infrastructure to train, the research capacity to inform, and the network to place graduates into the industry. That is what APRN is building: not a response to a skills shortage, but a permanent institution for African engineering intelligence.",
      },
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getRelatedArticles(slug: string, count = 3): Article[] {
  return articles.filter((a) => a.slug !== slug).slice(0, count);
}
