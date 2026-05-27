import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

/* ─── Member data ───────────────────────────────────────────────── */
const MEMBERS: Record<string, {
  initials: string; name: string; title: string; org: string;
  country: string; discipline: string; connections: number; online: boolean;
  memberSince: string; bio: string; expertise: string[];
  contributions: { type: string; title: string; year: string; venue: string }[];
  related: string[];
}> = {
  "adaeze-okonkwo": {
    initials: "AO", name: "Adaeze Okonkwo", title: "Senior Pipeline Engineer",
    org: "NNPC Ltd", country: "Nigeria", discipline: "Pipeline Integrity",
    connections: 34, online: true, memberSince: "Jan 2024",
    bio: "Adaeze has over 12 years of experience in pipeline integrity management across Nigeria's onshore and offshore network. She leads corrosion assessment programmes for over 800 km of NNPC trunk lines and has championed the adoption of inline inspection technologies that reduced unplanned shutdowns by 40%. She is a founding member of APRN and serves on the Technical Standards subcommittee.",
    expertise: ["Inline Inspection (ILI)", "Corrosion Assessment", "Risk-Based Inspection", "Pipeline SCADA", "ASME B31.8", "Integrity Management Systems"],
    contributions: [
      { type: "Paper", title: "Corrosion Rate Prediction in Aging Nigerian Trunk Lines Using Machine Learning", year: "2024", venue: "APRN Annual Pipeline Conference" },
      { type: "Presentation", title: "ILI Data Integration for Real-Time Integrity Decisions", year: "2023", venue: "SPE Nigeria Annual Conference" },
      { type: "Paper", title: "A Framework for Risk-Based Inspection Planning in Sub-Saharan Pipelines", year: "2022", venue: "Journal of Pipeline Engineering" },
    ],
    related: ["miriam-essien", "emmanuel-kofi", "taiwo-ogunbiyi"],
  },
  "kwabena-mensah": {
    initials: "KM", name: "Kwabena Mensah", title: "Energy Policy Analyst",
    org: "Ghana National Gas Company", country: "Ghana", discipline: "Policy & Regulation",
    connections: 21, online: false, memberSince: "Mar 2024",
    bio: "Kwabena specialises in natural gas regulatory frameworks and cross-border energy policy across West Africa. At Ghana National Gas Company he advises on pipeline tariff structures, gas commercialisation agreements, and alignment with the ECOWAS energy protocol. He holds an MSc in Energy Policy from the University of Exeter and has contributed to three national gas master plans.",
    expertise: ["Gas Policy & Tariffs", "ECOWAS Energy Protocol", "Pipeline Concessions", "Cross-Border Agreements", "Gas Commercialisation", "Regulatory Compliance"],
    contributions: [
      { type: "Policy Brief", title: "Harmonising Gas Pipeline Tariffs Across ECOWAS: A Roadmap", year: "2024", venue: "APRN Policy Series" },
      { type: "Presentation", title: "Domestic Gas Pricing and Pipeline Access: Lessons from Ghana", year: "2023", venue: "African Energy Week" },
    ],
    related: ["rukayat-adeyemi", "fatima-diallo", "bongani-nkosi"],
  },
  "fatima-diallo": {
    initials: "FD", name: "Fatima Diallo", title: "Project Manager — Upstream",
    org: "Société Nationale de Pétrole", country: "Senegal", discipline: "Project Engineering",
    connections: 47, online: true, memberSince: "Feb 2024",
    bio: "Fatima oversees upstream project delivery for Senegal's nascent oil and gas sector, managing capital projects worth over $200 M across the Sangomar and MSGBC basin developments. With 15 years of project engineering experience in West Africa and North Africa, she brings deep expertise in EPCI contracting, schedule risk, and stakeholder management across multi-jurisdictional projects.",
    expertise: ["EPCI Project Management", "Upstream Development", "Capital Project Scheduling", "Contract Strategy", "Risk Management", "Subsea Infrastructure"],
    contributions: [
      { type: "Paper", title: "Building Local Content Capacity in Senegal's Emerging Upstream Sector", year: "2024", venue: "SPE ATCE" },
      { type: "Presentation", title: "EPCI Contracting Strategies for First-of-Kind Offshore Projects in West Africa", year: "2023", venue: "Offshore West Africa Conference" },
      { type: "Paper", title: "Schedule Risk Mitigation in Multi-Party Deepwater Projects", year: "2022", venue: "Journal of Petroleum Technology" },
    ],
    related: ["kwabena-mensah", "bongani-nkosi", "adaeze-okonkwo"],
  },
  "taiwo-ogunbiyi": {
    initials: "TO", name: "Taiwo Ogunbiyi", title: "HSE Lead",
    org: "Seplat Energy", country: "Nigeria", discipline: "HSE",
    connections: 18, online: false, memberSince: "Apr 2024",
    bio: "Taiwo leads health, safety, and environment operations for Seplat Energy's Western Asset, covering a pipeline network spanning the Niger Delta. He has championed a behaviour-based safety programme that delivered a 60% reduction in lost-time incidents over three years and has built HSE capability programmes that trained over 500 local contractors. He is a Chartered Member of IOSH.",
    expertise: ["Behaviour-Based Safety", "Process Safety Management", "HSE Leadership", "Incident Investigation", "IOSH / NEBOSH", "Emergency Response"],
    contributions: [
      { type: "Presentation", title: "Behaviour-Based Safety in Niger Delta Pipeline Operations", year: "2023", venue: "APRN Annual Conference" },
      { type: "Paper", title: "Contractor HSE Capability Development: A Practical Framework", year: "2022", venue: "Society of Petroleum Engineers" },
    ],
    related: ["adaeze-okonkwo", "miriam-essien", "rukayat-adeyemi"],
  },
  "miriam-essien": {
    initials: "ME", name: "Miriam Essien", title: "Research Fellow — Corrosion Science",
    org: "University of Lagos", country: "Nigeria", discipline: "Research",
    connections: 56, online: true, memberSince: "Jan 2024",
    bio: "Miriam is one of Africa's leading researchers in pipeline corrosion science, with a focus on microbiologically influenced corrosion (MIC) and inhibitor chemistry in tropical environments. She leads the Corrosion Engineering Research Group at UNILAG and has secured over ₦180 M in research grants from PTDF and international foundations. She mentors 12 postgraduate students and has authored 34 peer-reviewed papers.",
    expertise: ["Microbiologically Influenced Corrosion", "Corrosion Inhibitor Development", "Electrochemical Testing", "Materials Characterisation", "Flow Assurance", "Research Mentorship"],
    contributions: [
      { type: "Paper", title: "MIC in Tropical Subsea Pipelines: A New Predictive Model", year: "2024", venue: "Corrosion Science (Elsevier)" },
      { type: "Paper", title: "Novel Plant-Derived Corrosion Inhibitors for Carbon Steel in Sour Service", year: "2024", venue: "Journal of Materials Chemistry" },
      { type: "Paper", title: "Electrochemical Assessment of Pipeline Steel in Nigerian Crude Environments", year: "2023", venue: "NACE CORROSION Conference" },
    ],
    related: ["adaeze-okonkwo", "emmanuel-kofi", "taiwo-ogunbiyi"],
  },
  "bongani-nkosi": {
    initials: "BN", name: "Bongani Nkosi", title: "Renewable Integration Engineer",
    org: "Eskom Holdings", country: "South Africa", discipline: "Renewable Energy",
    connections: 29, online: false, memberSince: "May 2024",
    bio: "Bongani works at the intersection of pipeline infrastructure and the energy transition, developing models for hydrogen blending and repurposing natural gas networks for clean energy transport. At Eskom he leads feasibility studies for green hydrogen injection corridors in the Highveld region. He holds an MEng in Energy Systems from Stellenbosch University and advises IRENA on African hydrogen pathways.",
    expertise: ["Hydrogen Blending & Transport", "Renewable Integration", "Gas Network Repurposing", "Energy Transition Modelling", "IRENA Frameworks", "Grid-Scale Storage"],
    contributions: [
      { type: "Paper", title: "Hydrogen Blending in Existing South African Gas Networks: Technical Constraints and Opportunities", year: "2024", venue: "International Journal of Hydrogen Energy" },
      { type: "Presentation", title: "Decarbonisation Pathways for Sub-Saharan Pipeline Infrastructure", year: "2023", venue: "African Energy Week" },
    ],
    related: ["fatima-diallo", "kwabena-mensah", "rukayat-adeyemi"],
  },
  "emmanuel-kofi": {
    initials: "EK", name: "Emmanuel Kofi", title: "Pipeline Design Engineer",
    org: "Tullow Oil Ghana", country: "Ghana", discipline: "Pipeline Integrity",
    connections: 38, online: true, memberSince: "Feb 2024",
    bio: "Emmanuel specialises in the design and engineering assurance of offshore and onshore pipeline systems for deepwater projects off Ghana's coast. He has led front-end engineering for over 350 km of subsea flowlines and contributed to the Jubilee Phase 2 tie-back scope at Tullow. He is a Chartered Engineer (CEng) with the Institution of Mechanical Engineers and holds CSWIP 3.2 certification.",
    expertise: ["Subsea Pipeline Design", "CAESAR II Stress Analysis", "Deepwater Flow Assurance", "DNV-ST-F101", "FEED & EPCI Assurance", "Cathodic Protection"],
    contributions: [
      { type: "Paper", title: "Thermal Expansion and Lateral Buckling Management in West African Deepwater Flowlines", year: "2023", venue: "Offshore Technology Conference" },
      { type: "Presentation", title: "Engineering Assurance Lessons from Jubilee Phase 2 Subsea Tie-Back", year: "2022", venue: "SPE Ghana Annual Conference" },
    ],
    related: ["adaeze-okonkwo", "miriam-essien", "fatima-diallo"],
  },
  "rukayat-adeyemi": {
    initials: "RA", name: "Rukayat Adeyemi", title: "Regulatory Affairs Specialist",
    org: "Nigerian Midstream & Downstream Petroleum Regulatory Authority", country: "Nigeria", discipline: "Policy & Regulation",
    connections: 12, online: false, memberSince: "Jun 2024",
    bio: "Rukayat is a regulatory specialist focused on licensing, compliance, and policy enforcement in Nigeria's midstream and downstream sector under the Petroleum Industry Act 2021. She has processed over 40 pipeline construction and operating licences and is developing a digital compliance monitoring platform for the Authority. She is completing an LLM in Energy and Natural Resources Law.",
    expertise: ["PIA 2021 Compliance", "Pipeline Licensing", "Midstream Regulation", "Permit & Concession Management", "Enforcement & Sanctions", "Energy Law"],
    contributions: [
      { type: "Policy Brief", title: "PIA 2021 Implications for Midstream Pipeline Operators: A Compliance Guide", year: "2024", venue: "APRN Policy Series" },
      { type: "Presentation", title: "Digitalising Regulatory Oversight of Pipeline Infrastructure in Nigeria", year: "2023", venue: "Nigeria Energy Summit" },
    ],
    related: ["kwabena-mensah", "taiwo-ogunbiyi", "bongani-nkosi"],
  },
};

const MEMBER_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(MEMBERS).map(([id, m]) => [id, m.name])
);

/* ─── Metadata ──────────────────────────────────────────────────── */
export function generateStaticParams() {
  return Object.keys(MEMBERS).map((id) => ({ id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const m = MEMBERS[params.id];
  if (!m) return {};
  return { title: `${m.name} — APRN Network` };
}

/* ─── Page ──────────────────────────────────────────────────────── */
const disciplineIcon: Record<string, string> = {
  "Pipeline Integrity":  "fa-shield-halved",
  "Policy & Regulation": "fa-scale-balanced",
  "Project Engineering": "fa-diagram-project",
  "HSE":                 "fa-helmet-safety",
  "Research":            "fa-flask",
  "Renewable Energy":    "fa-solar-panel",
};

const typeIcon: Record<string, string> = {
  "Paper":         "fa-file-lines",
  "Presentation":  "fa-person-chalkboard",
  "Policy Brief":  "fa-file-contract",
};

export default function MemberProfilePage({ params }: { params: { id: string } }) {
  const m = MEMBERS[params.id];
  if (!m) notFound();

  return (
    <div className="flex flex-col gap-8 max-w-275">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/dashboard/network" className="hover:text-gold-500 transition-colors">
          Engineer Network
        </Link>
        <i className="fa-solid fa-chevron-right text-[9px]" />
        <span className="text-slate-400">{m.name}</span>
      </div>

      {/* Profile header */}
      <div className="bg-navy-800 border border-white/5 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">

          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 bg-navy-900 border border-gold-500/30 flex items-center justify-center">
              <span
                className="text-2xl font-bold text-gold-500"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                {m.initials}
              </span>
            </div>
            {m.online && (
              <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-navy-800 rounded-full" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
              <div>
                <h1
                  className="text-2xl font-bold text-white leading-tight"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  {m.name}
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">{m.title}</p>
              </div>
              <span className={`px-2 py-1 text-[9px] font-bold tracking-widest uppercase border ${m.online ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/8" : "text-slate-500 border-white/10"}`}>
                {m.online ? "Online" : "Offline"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 mb-4">
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-building text-[10px]" />
                {m.org}
              </span>
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-location-dot text-[10px]" />
                {m.country}
              </span>
              <span className="flex items-center gap-1.5">
                <i className={`fa-solid ${disciplineIcon[m.discipline] ?? "fa-briefcase"} text-[10px]`} />
                {m.discipline}
              </span>
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-calendar text-[10px]" />
                Member since {m.memberSince}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/membership"
                className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 text-navy-900 text-[10px] font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors"
              >
                <i className="fa-solid fa-lock text-[9px]" />
                Connect — Upgrade to unlock
              </Link>
              <Link
                href="/dashboard/membership"
                className="flex items-center gap-2 px-5 py-2.5 border border-white/10 text-slate-400 text-[10px] font-bold tracking-widest uppercase hover:text-gold-500 hover:border-gold-500/30 transition-colors"
              >
                <i className="fa-solid fa-lock text-[9px]" />
                Message
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Main column ─────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* About */}
          <section className="bg-navy-800 border border-white/5 p-6">
            <h2 className="text-xs font-bold tracking-widest uppercase text-gold-500 mb-4">About</h2>
            <p className="text-sm text-slate-300 leading-relaxed">{m.bio}</p>
          </section>

          {/* Expertise */}
          <section className="bg-navy-800 border border-white/5 p-6">
            <h2 className="text-xs font-bold tracking-widest uppercase text-gold-500 mb-4">Areas of Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {m.expertise.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-navy-900 border border-white/5 text-[10px] font-semibold text-slate-300 tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* Contributions */}
          <section className="bg-navy-800 border border-white/5 p-6">
            <h2 className="text-xs font-bold tracking-widest uppercase text-gold-500 mb-4">
              Contributions &amp; Publications
            </h2>
            <div className="flex flex-col gap-4">
              {m.contributions.map((c, i) => (
                <div key={i} className="flex gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                  <div className="w-8 h-8 bg-navy-900 border border-white/5 flex items-center justify-center shrink-0 mt-0.5">
                    <i className={`fa-solid ${typeIcon[c.type] ?? "fa-file"} text-gold-500 text-[10px]`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white leading-snug mb-1">{c.title}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 bg-navy-900 border border-white/5 text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                        {c.type}
                      </span>
                      <span className="text-[10px] text-slate-500">{c.venue}</span>
                      <span className="text-[10px] text-slate-600">{c.year}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Shared connections (gated) */}
          <section className="bg-navy-800 border border-white/5 p-6">
            <h2 className="text-xs font-bold tracking-widest uppercase text-gold-500 mb-4">
              Shared Connections
            </h2>
            <div className="bg-gold-500/5 border border-gold-500/20 p-4 flex items-start gap-3">
              <i className="fa-solid fa-lock text-gold-500 text-sm mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white mb-1">
                  {m.connections} connections visible to Professional members
                </p>
                <p className="text-xs text-slate-400">
                  Upgrade your membership to see shared connections and request introductions.{" "}
                  <Link href="/dashboard/membership" className="text-gold-500 hover:text-gold-400 transition-colors">
                    View plans →
                  </Link>
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* ── Sidebar ──────────────────────────────────── */}
        <div className="flex flex-col gap-6">

          {/* Stats */}
          <div className="bg-navy-800 border border-white/5 p-6">
            <h2 className="text-xs font-bold tracking-widest uppercase text-gold-500 mb-4">Network Stats</h2>
            <div className="flex flex-col gap-4">
              {[
                { label: "Connections",    value: m.connections.toString(), icon: "fa-users" },
                { label: "Contributions",  value: m.contributions.length.toString(), icon: "fa-file-lines" },
                { label: "Member since",   value: m.memberSince, icon: "fa-calendar" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-navy-900 border border-white/5 flex items-center justify-center shrink-0">
                    <i className={`fa-solid ${s.icon} text-gold-500 text-[10px]`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-none">{s.value}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Membership badge */}
          <div className="bg-navy-800 border border-white/5 p-6">
            <h2 className="text-xs font-bold tracking-widest uppercase text-gold-500 mb-4">Membership</h2>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-id-card text-gold-500 text-xs" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">APRN Professional Member</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Verified since {m.memberSince}</p>
              </div>
            </div>
          </div>

          {/* Similar members */}
          <div className="bg-navy-800 border border-white/5 p-6">
            <h2 className="text-xs font-bold tracking-widest uppercase text-gold-500 mb-4">Similar Members</h2>
            <div className="flex flex-col gap-3">
              {m.related.map((rid) => {
                const rel = MEMBERS[rid];
                if (!rel) return null;
                return (
                  <Link
                    key={rid}
                    href={`/dashboard/network/${rid}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-8 h-8 bg-navy-900 border border-gold-500/20 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-gold-500">{rel.initials}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white group-hover:text-gold-400 transition-colors truncate">
                        {MEMBER_NAMES[rid]}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">{rel.title}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Back link */}
          <Link
            href="/dashboard/network"
            className="flex items-center justify-center gap-2 py-3 border border-white/10 text-[10px] font-bold tracking-widest uppercase text-slate-400 hover:text-white hover:border-white/20 transition-colors"
          >
            <i className="fa-solid fa-arrow-left text-[9px]" />
            Back to Network
          </Link>

        </div>
      </div>
    </div>
  );
}
