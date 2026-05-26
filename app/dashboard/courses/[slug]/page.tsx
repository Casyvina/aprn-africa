import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

const courses: Record<string, Course> = {
  "apc-101": {
    code: "APC-101",
    slug: "apc-101",
    title: "Pipeline Integrity Management Fundamentals",
    category: "Pipeline Integrity",
    duration: "6 weeks",
    effort: "6–8 hrs/week",
    level: "Foundation",
    levelColor: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
    modules: 12,
    enrolled: 248,
    startDate: "Rolling intake",
    description:
      "Core principles of pipeline integrity assessment, in-line inspection methods, and corrosion management across African operating environments. This programme equips engineers with the frameworks and tools needed to assess, manage, and report pipeline integrity in compliance with international standards.",
    outcomes: [
      "Apply ILI data interpretation to detect and classify pipeline anomalies",
      "Design and implement a Pipeline Integrity Management Plan (PIMP)",
      "Conduct risk-based inspections aligned with ASME B31.8S and API 1160",
      "Prepare integrity assessment reports for regulatory and management audiences",
    ],
    audience: [
      "Entry-level pipeline engineers (0–5 years experience)",
      "Inspection and maintenance technicians transitioning to engineering roles",
      "HSE professionals with pipeline operations exposure",
      "Recent engineering graduates in petroleum, mechanical, or chemical disciplines",
    ],
    instructor: {
      name: "Prof. Ngozi Eze",
      title: "Chair, Pipeline Engineering — University of Lagos",
      bio: "Professor Eze has 22 years of research and industry experience in pipeline integrity and corrosion science across West and Central Africa. She holds a PhD in Materials Engineering from Imperial College London and has published over 40 peer-reviewed papers.",
      initials: "NE",
    },
    curriculum: [
      { week: "Week 1–2", title: "Integrity Fundamentals & Failure Modes", topics: ["Pipeline failure mechanisms", "Regulatory landscape in Africa", "Risk matrix construction", "Introduction to ASME B31.8S"] },
      { week: "Week 3–4", title: "In-Line Inspection & Data Interpretation", topics: ["ILI tool types: MFL, UT, geometry tools", "Signal analysis and defect classification", "Fitness-for-service assessments", "Reporting to operators and regulators"] },
      { week: "Week 5", title: "Corrosion Management", topics: ["Internal and external corrosion mechanisms", "Cathodic protection systems", "Coating selection for tropical environments", "Inhibitor injection strategies"] },
      { week: "Week 6", title: "PIMP Development & Case Studies", topics: ["Building a Pipeline Integrity Management Plan", "African case studies: NNPC, TotalEnergies West Africa", "Stakeholder communication", "Final assessment and certification"] },
    ],
    related: ["apc-320", "apc-150"],
  },
  "apc-210": {
    code: "APC-210",
    slug: "apc-210",
    title: "Regulatory Frameworks for Transnational Pipelines",
    category: "Policy & Regulation",
    duration: "4 weeks",
    effort: "5–6 hrs/week",
    level: "Intermediate",
    levelColor: "text-gold-500 border-gold-500/30 bg-gold-500/5",
    modules: 8,
    enrolled: 134,
    startDate: "Rolling intake",
    description:
      "ECOWAS energy protocols, bilateral transit agreements, and harmonisation of national pipeline regulations across West and East Africa. Ideal for engineers and policy professionals navigating the cross-border legal and commercial landscape of African pipeline projects.",
    outcomes: [
      "Interpret ECOWAS and AU energy policy frameworks as applied to gas pipelines",
      "Draft and review bilateral transit agreement provisions",
      "Advise project teams on national regulatory compliance across multiple jurisdictions",
      "Engage regulators and host-government officials with structured policy positions",
    ],
    audience: [
      "Mid-career engineers (5–15 years) moving into commercial or regulatory roles",
      "Legal and commercial professionals in the energy sector",
      "Government officials in energy or infrastructure ministries",
      "Policy analysts and consultants advising on African energy infrastructure",
    ],
    instructor: {
      name: "Engr. Chukwuemeka Obi",
      title: "Director General, DPR Nigeria",
      bio: "Engr. Obi is the foremost authority on pipeline regulation in West Africa, having overseen the licensing of over 12 major transnational gas projects during his tenure at DPR. He holds an MSc in Energy Law from Aberdeen and has advised the AU Commission on pipeline regulatory harmonisation.",
      initials: "CO",
    },
    curriculum: [
      { week: "Week 1", title: "African Energy Policy Architecture", topics: ["AU Agenda 2063 and energy infrastructure", "ECOWAS energy protocols", "National energy masterplans: Nigeria, Ghana, Senegal", "Regulatory bodies and their mandates"] },
      { week: "Week 2", title: "Transnational Legal Frameworks", topics: ["Bilateral transit agreements", "Host government agreements", "Production sharing and processing agreements", "Dispute resolution mechanisms"] },
      { week: "Week 3", title: "Regulatory Compliance in Practice", topics: ["Environmental impact assessment requirements", "Local content obligations", "Community engagement and social licence", "Case study: WAGP regulatory journey"] },
      { week: "Week 4", title: "Policy Advocacy & Harmonisation", topics: ["Building a regulatory harmonisation brief", "Engaging ECOWAS and AU bodies", "Case study: AAGP Morocco–Nigeria", "Policy simulation and final assessment"] },
    ],
    related: ["apc-280", "apc-305"],
  },
  "apc-305": {
    code: "APC-305",
    slug: "apc-305",
    title: "Hydrogen Blending in Legacy Gas Infrastructure",
    category: "Renewable Integration",
    duration: "5 weeks",
    effort: "7–9 hrs/week",
    level: "Advanced",
    levelColor: "text-blue-400 border-blue-400/30 bg-blue-400/5",
    modules: 10,
    enrolled: 89,
    startDate: "Rolling intake",
    description:
      "Technical feasibility, material compatibility, and operational protocols for hydrogen blending in existing African gas transmission networks. A rigorous technical course for senior engineers leading the energy transition within pipeline organisations.",
    outcomes: [
      "Conduct a hydrogen blending feasibility study for a legacy gas pipeline",
      "Specify material upgrade requirements for hydrogen compatibility",
      "Design safe blending control and monitoring systems",
      "Develop an operational transition roadmap for a gas transmission operator",
    ],
    audience: [
      "Senior pipeline engineers with 8+ years of operations or design experience",
      "Technical directors and chief engineers at gas transmission companies",
      "Energy transition leads within NOCs and pipeline operators",
      "Researchers in gas engineering, materials science, or energy systems",
    ],
    instructor: {
      name: "Pieter-Bas Nederveen",
      title: "Senior Energy Advisor, APRN Africa",
      bio: "Pieter-Bas brings 18 years of international experience in hydrogen infrastructure and energy transition strategy, having led blending projects in the Netherlands, Germany, and most recently Nigeria. He is a registered Chartered Engineer and holds an MSc in Chemical Engineering from TU Delft.",
      initials: "PN",
      photo: "/images/pieter-bas-nederveen.png",
    },
    curriculum: [
      { week: "Week 1", title: "Hydrogen Properties & Energy Transition Context", topics: ["H₂ properties vs. natural gas", "Global and African H₂ strategies", "Blending economics and value chain", "African pipeline readiness landscape"] },
      { week: "Week 2", title: "Material Compatibility & Embrittlement", topics: ["Hydrogen embrittlement mechanisms", "Steel grade susceptibility mapping", "Gasket, seal, and valve compatibility", "Inspection protocols for H₂-exposed assets"] },
      { week: "Week 3", title: "Blending System Design", topics: ["Injection point selection and flow dynamics", "Control valve and metering systems", "Safety instrumented systems", "HAZOP for hydrogen blending operations"] },
      { week: "Week 4", title: "Operational Transition Planning", topics: ["Stakeholder mapping and regulatory pathway", "Operator training and certification requirements", "Monitoring, reporting and verification", "Case study: Gasunie H₂ blending pilot"] },
      { week: "Week 5", title: "Project & Final Assessment", topics: ["Feasibility study group project", "Peer review and critique", "Regulatory submission simulation", "Certification assessment"] },
    ],
    related: ["apc-101", "apc-210"],
  },
  "apc-150": {
    code: "APC-150",
    slug: "apc-150",
    title: "HSE Management in Pipeline Construction",
    category: "Safety & HSE",
    duration: "3 weeks",
    effort: "5–7 hrs/week",
    level: "Foundation",
    levelColor: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
    modules: 6,
    enrolled: 310,
    startDate: "Rolling intake",
    description:
      "Risk assessment frameworks, contractor safety management, and incident reporting standards aligned with international pipeline construction best practice. Designed for site engineers, HSE officers, and project managers on active pipeline construction projects.",
    outcomes: [
      "Conduct a construction-phase risk assessment using bow-tie methodology",
      "Develop a contractor safety management framework for pipeline worksites",
      "Implement an incident investigation process aligned with ISO 45001",
      "Produce a project HSE plan ready for client and regulatory review",
    ],
    audience: [
      "Construction site engineers and supervisors",
      "HSE officers on pipeline projects",
      "Project managers with HSE responsibilities",
      "Graduates entering pipeline construction from any engineering discipline",
    ],
    instructor: {
      name: "Engr. Kwame Asante",
      title: "VP Operations, Ghana National Gas Company",
      bio: "Engr. Asante has overseen construction safety on seven major pipeline projects across West Africa, including the West Africa Gas Pipeline expansion. He holds a PgDip in Health, Safety and Environmental Management from the University of Aberdeen.",
      initials: "KA",
    },
    curriculum: [
      { week: "Week 1", title: "Risk Assessment & Hazard Identification", topics: ["HAZID and HAZOP for construction", "Bow-tie risk methodology", "Critical task analysis", "Safe systems of work"] },
      { week: "Week 2", title: "Contractor Safety Management", topics: ["Pre-qualification and contractor selection", "Permit-to-work systems", "Site safety audits and inspections", "Toolbox talks and safety communications"] },
      { week: "Week 3", title: "Incident Management & HSE Planning", topics: ["Incident classification and investigation", "Root cause analysis techniques", "ISO 45001 reporting framework", "Developing the project HSE plan"] },
    ],
    related: ["apc-101", "apc-280"],
  },
  "apc-280": {
    code: "APC-280",
    slug: "apc-280",
    title: "Project Finance for Energy Infrastructure",
    category: "Project Management",
    duration: "6 weeks",
    effort: "6–8 hrs/week",
    level: "Intermediate",
    levelColor: "text-gold-500 border-gold-500/30 bg-gold-500/5",
    modules: 11,
    enrolled: 172,
    startDate: "Rolling intake",
    description:
      "Development finance institutions, bankability criteria, PPP structures, and risk allocation models for African pipeline and energy projects. Essential knowledge for engineers and project managers interfacing with lenders, equity investors, and government counterparties.",
    outcomes: [
      "Structure a bankable project finance model for an African pipeline project",
      "Identify and allocate project risks across sponsors, lenders, and host governments",
      "Navigate DFI procurement and environmental standards (IFC, AfDB, World Bank)",
      "Present investment-grade project documentation to a finance committee",
    ],
    audience: [
      "Engineers transitioning into project development or commercial roles",
      "Project managers on infrastructure projects seeking finance literacy",
      "Government officials involved in PPP procurement",
      "Analysts at DFIs, commercial banks, or private equity funds in energy",
    ],
    instructor: {
      name: "Dr. Amina Diallo",
      title: "Head of Energy, African Union Commission",
      bio: "Dr. Diallo has structured over $4 billion in energy project finance across Sub-Saharan Africa, previously serving as a senior infrastructure investment officer at the African Development Bank. She holds a PhD in Development Economics from Sciences Po Paris.",
      initials: "AD",
    },
    curriculum: [
      { week: "Week 1–2", title: "Energy Project Finance Architecture", topics: ["Project finance vs. corporate finance", "Capital structure and leverage", "DFI landscape: AfDB, IFC, ECOWAS Bank", "Environmental and social standards"] },
      { week: "Week 3", title: "Risk Identification & Allocation", topics: ["Construction, operating, and offtake risks", "Political risk and sovereign guarantees", "Insurance and credit enhancement", "Risk matrix for African pipeline projects"] },
      { week: "Week 4", title: "PPP Structures & Concessions", topics: ["BOT, BOOT, and concession models", "Tariff regulation and cost recovery", "Government support agreements", "Case study: Mozambique LNG infrastructure"] },
      { week: "Week 5", title: "Financial Modelling Essentials", topics: ["Project cash flow modelling", "DSCR, LLCR, and cover ratios", "Sensitivity and scenario analysis", "Model audit and lender due diligence"] },
      { week: "Week 6", title: "Deal Structuring & Final Assessment", topics: ["Term sheet negotiation principles", "Information memorandum preparation", "Lender presentation simulation", "Final project submission"] },
    ],
    related: ["apc-210", "apc-150"],
  },
  "apc-320": {
    code: "APC-320",
    slug: "apc-320",
    title: "Corrosion Science in Tropical Marine Environments",
    category: "Pipeline Integrity",
    duration: "4 weeks",
    effort: "8–10 hrs/week",
    level: "Advanced",
    levelColor: "text-blue-400 border-blue-400/30 bg-blue-400/5",
    modules: 9,
    enrolled: 67,
    startDate: "Rolling intake",
    description:
      "Electrochemical mechanisms, cathodic protection design, and coating selection for offshore and near-shore pipeline assets in sub-Saharan Africa. A highly technical course for senior integrity engineers and corrosion specialists working on African offshore and coastal infrastructure.",
    outcomes: [
      "Model corrosion rates in high-salinity, high-temperature marine environments",
      "Design impressed current cathodic protection systems for offshore pipelines",
      "Select and specify coatings for submarine and splash-zone pipeline sections",
      "Develop an integrated corrosion management strategy for a subsea asset",
    ],
    audience: [
      "Senior integrity engineers with offshore or coastal project experience",
      "Corrosion specialists and materials engineers",
      "Subsea engineers and pipeline designers",
      "Asset managers responsible for offshore pipeline portfolios",
    ],
    instructor: {
      name: "Prof. Ngozi Eze",
      title: "Chair, Pipeline Engineering — University of Lagos",
      bio: "Professor Eze has 22 years of research and industry experience in pipeline integrity and corrosion science across West and Central Africa. She holds a PhD in Materials Engineering from Imperial College London and has published over 40 peer-reviewed papers.",
      initials: "NE",
    },
    curriculum: [
      { week: "Week 1", title: "Marine Corrosion Electrochemistry", topics: ["Galvanic, crevice, and pitting corrosion", "Effect of salinity, temperature, and dissolved oxygen", "Microbiologically influenced corrosion (MIC)", "Corrosion monitoring techniques"] },
      { week: "Week 2", title: "Cathodic Protection Design", topics: ["ICCP system design and sizing", "Sacrificial anode systems", "Anode bed design for subsea applications", "Monitoring, testing, and troubleshooting"] },
      { week: "Week 3", title: "Coating Systems for Marine Environments", topics: ["Coating selection criteria", "Fusion bonded epoxy vs. polyurethane systems", "Field joint coating", "Coating inspection and holiday detection"] },
      { week: "Week 4", title: "Integrated Corrosion Management", topics: ["Corrosion management strategy development", "Life extension assessment", "Case study: Bonny offshore pipeline", "Final assessment and certification"] },
    ],
    related: ["apc-101", "apc-150"],
  },
};

interface Curriculum { week: string; title: string; topics: string[] }
interface Course {
  code: string; slug: string; title: string; category: string;
  duration: string; effort: string; level: string; levelColor: string;
  modules: number; enrolled: number; startDate: string;
  description: string; outcomes: string[]; audience: string[];
  instructor: { name: string; title: string; bio: string; initials: string; photo?: string };
  curriculum: Curriculum[];
  related: string[];
}

export function generateStaticParams() {
  return Object.keys(courses).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = courses[slug];
  if (!course) return {};
  return { title: `${course.title} | APRN Training` };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = courses[slug];
  if (!course) notFound();

  const relatedCourses = course.related.map((s) => courses[s]).filter(Boolean);

  return (
    <div className="flex flex-col gap-8 max-w-[1100px]">

      {/* ── Breadcrumb ───────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/dashboard/courses" className="hover:text-gold-500 transition-colors">Training Catalogue</Link>
        <i className="fa-solid fa-chevron-right text-[8px]" />
        <span className="text-slate-400">{course.code}</span>
      </div>

      {/* ── Course header ────────────────────────────────────────── */}
      <div className="bg-navy-800 border border-white/5 p-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="px-2 py-0.5 bg-navy-900 border border-white/5 text-[9px] font-bold tracking-widest text-gold-500 uppercase">
              {course.code}
            </span>
            <span className={`px-2 py-0.5 border text-[9px] font-bold tracking-widest uppercase ${course.levelColor}`}>
              {course.level}
            </span>
            <span className="px-2 py-0.5 bg-navy-900 border border-white/5 text-[9px] font-bold tracking-widest text-slate-400 uppercase">
              {course.category}
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-bold text-white mb-4 leading-snug"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            {course.title}
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">{course.description}</p>

          {/* Quick meta */}
          <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-white/5">
            {[
              { icon: "fa-clock", label: "Duration", value: course.duration },
              { icon: "fa-bolt", label: "Effort", value: course.effort },
              { icon: "fa-layer-group", label: "Modules", value: `${course.modules} modules` },
              { icon: "fa-users", label: "Enrolled", value: `${course.enrolled.toLocaleString()} engineers` },
              { icon: "fa-calendar", label: "Intake", value: course.startDate },
            ].map((m) => (
              <div key={m.label} className="flex items-center gap-2">
                <i className={`fa-solid ${m.icon} text-gold-500 text-[10px] w-3`} />
                <div>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest">{m.label}</p>
                  <p className="text-xs text-white font-medium">{m.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enrol card */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-navy-900 border border-white/5 p-6 flex flex-col gap-4">
            <div className="text-center pb-4 border-b border-white/5">
              <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Access Level Required</p>
              <p
                className="text-lg font-bold text-gold-500"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Professional
              </p>
              <p className="text-[10px] text-slate-400 mt-1">or Institutional membership</p>
            </div>
            <Link
              href="/dashboard/membership"
              className="w-full py-3 text-center text-xs font-bold tracking-widest uppercase text-navy-900 bg-gold-500 hover:bg-gold-400 transition-colors block"
            >
              Upgrade to Enrol
            </Link>
            <button
              disabled
              className="w-full py-3 text-center text-[10px] font-bold tracking-widest uppercase text-slate-600 border border-white/5 cursor-not-allowed"
            >
              Preview (Locked)
            </button>
            <p className="text-[10px] text-slate-500 text-center">
              Full access to all modules, assessments, and certification upon enrolment.
            </p>
          </div>
        </div>
      </div>

      {/* ── Two-column content ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main — curriculum + outcomes */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Learning outcomes */}
          <div className="bg-navy-800 border border-white/5 p-6">
            <h3
              className="text-base font-bold text-white mb-4 flex items-center gap-2"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              <i className="fa-solid fa-bullseye text-gold-500 text-sm" />
              Learning Outcomes
            </h3>
            <ul className="flex flex-col gap-3">
              {course.outcomes.map((o, i) => (
                <li key={i} className="flex items-start gap-3 text-xs text-slate-400 leading-relaxed">
                  <i className="fa-solid fa-check text-gold-500 text-[10px] mt-0.5 shrink-0" />
                  {o}
                </li>
              ))}
            </ul>
          </div>

          {/* Curriculum */}
          <div className="bg-navy-800 border border-white/5 p-6">
            <h3
              className="text-base font-bold text-white mb-5 flex items-center gap-2"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              <i className="fa-solid fa-list-check text-gold-500 text-sm" />
              Curriculum
            </h3>
            <div className="flex flex-col gap-4">
              {course.curriculum.map((section, i) => (
                <div key={i} className="border border-white/5 bg-navy-900/60">
                  <div className="px-5 py-3.5 flex items-center gap-3 border-b border-white/5">
                    <span className="text-[9px] font-bold tracking-widest text-gold-500 uppercase shrink-0">
                      {section.week}
                    </span>
                    <h4 className="text-sm font-semibold text-white">{section.title}</h4>
                  </div>
                  <ul className="px-5 py-3 flex flex-col gap-2">
                    {section.topics.map((topic, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-xs text-slate-400">
                        <i className="fa-solid fa-lock text-slate-600 text-[8px] mt-0.5 shrink-0" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Who should attend */}
          <div className="bg-navy-800 border border-white/5 p-6">
            <h3
              className="text-base font-bold text-white mb-4 flex items-center gap-2"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              <i className="fa-solid fa-user-check text-gold-500 text-sm" />
              Who Should Attend
            </h3>
            <ul className="flex flex-col gap-2.5">
              {course.audience.map((a, i) => (
                <li key={i} className="flex items-start gap-3 text-xs text-slate-400 leading-relaxed">
                  <i className="fa-solid fa-arrow-right text-gold-500 text-[10px] mt-0.5 shrink-0" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">

          {/* Instructor */}
          <div className="bg-navy-800 border border-white/5 p-6">
            <h3
              className="text-xs font-bold text-white uppercase tracking-widest mb-4 pb-3 border-b border-white/5"
            >
              Lead Instructor
            </h3>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-gold-500">{course.instructor.initials}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{course.instructor.name}</p>
                <p className="text-[10px] text-slate-500 leading-snug mt-0.5">{course.instructor.title}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{course.instructor.bio}</p>
          </div>

          {/* Related courses */}
          {relatedCourses.length > 0 && (
            <div className="bg-navy-800 border border-white/5 p-6">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 pb-3 border-b border-white/5">
                Related Courses
              </h3>
              <div className="flex flex-col gap-3">
                {relatedCourses.map((rc) => (
                  <Link
                    key={rc.slug}
                    href={`/dashboard/courses/${rc.slug}`}
                    className="group flex items-start gap-3 hover:bg-navy-900/50 -mx-2 px-2 py-2 transition-colors"
                  >
                    <span className="px-1.5 py-0.5 bg-navy-900 border border-white/5 text-[8px] font-bold tracking-widest text-gold-500 uppercase shrink-0 mt-0.5">
                      {rc.code}
                    </span>
                    <p className="text-xs text-slate-400 group-hover:text-white transition-colors leading-snug">
                      {rc.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Need help */}
          <div className="bg-navy-800 border border-white/5 p-6">
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-headset text-gold-500 text-sm mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white mb-1">Questions about this course?</p>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  Our training team can advise on prerequisites and scheduling.
                </p>
                <Link
                  href="/contact"
                  className="text-[11px] text-gold-500 hover:text-gold-400 transition-colors font-medium"
                >
                  Contact Training Team →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
