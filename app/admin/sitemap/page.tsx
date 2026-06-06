import Link from "next/link";

export const metadata = { title: "Site Map | APRN Admin" };

// ─── Data ────────────────────────────────────────────────────────────────────

const STATUS = {
  live:       { label: "Live",       color: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" },
  incomplete: { label: "Incomplete", color: "bg-amber-400/10  text-amber-400  border-amber-400/20"  },
  planned:    { label: "Planned",    color: "bg-slate-700/50  text-slate-400  border-slate-600/30"  },
} as const;

type StatusKey = keyof typeof STATUS;

const DATA_SOURCES = {
  sanity:    { label: "Sanity",    color: "text-[#f36458]", icon: "fa-database"     },
  supabase:  { label: "Supabase",  color: "text-emerald-400", icon: "fa-layer-group" },
  paystack:  { label: "Paystack",  color: "text-blue-400",  icon: "fa-credit-card"  },
  claude:    { label: "Claude AI", color: "text-violet-400", icon: "fa-wand-magic-sparkles" },
  fal:       { label: "Fal.ai",    color: "text-pink-400",  icon: "fa-image"        },
  static:    { label: "Static",    color: "text-slate-500",  icon: "fa-file-code"   },
} as const;

type DataKey = keyof typeof DATA_SOURCES;

interface Route {
  path: string;
  label: string;
  status: StatusKey;
  data: DataKey[];
  notes?: string;
}

interface Section {
  title: string;
  icon: string;
  color: string;
  desc: string;
  routes: Route[];
}

const SECTIONS: Section[] = [
  {
    title: "Public Marketing Site",
    icon: "fa-globe",
    color: "text-gold-500",
    desc: "Visible to everyone — no login required",
    routes: [
      { path: "/",             label: "Homepage",              status: "live",       data: ["sanity", "static"] },
      { path: "/about",        label: "About APRN",            status: "live",       data: ["sanity", "static"] },
      { path: "/leadership",   label: "Leadership",            status: "live",       data: ["sanity"] },
      { path: "/research",     label: "Research Hub",          status: "live",       data: ["sanity"] },
      { path: "/research/[slug]", label: "Research Detail",   status: "live",       data: ["sanity"] },
      { path: "/insights",     label: "Insights / Editorial",  status: "live",       data: ["sanity"] },
      { path: "/insights/[slug]", label: "Insight Article",   status: "live",       data: ["sanity"] },
      { path: "/events",       label: "Events Listing",        status: "live",       data: ["sanity", "static"] },
      { path: "/events/[slug]",label: "Event Detail",          status: "incomplete", data: ["sanity", "static"],  notes: "Static stubs only — needs speakers, agenda, register CTA" },
      { path: "/membership",   label: "Membership Plans",      status: "live",       data: ["static", "paystack"] },
      { path: "/training",     label: "Training",              status: "incomplete", data: ["sanity", "static"],  notes: "Basic page — needs APConnect tracks, certification tiers" },
      { path: "/programs",     label: "Programs & Initiatives",status: "planned",    data: ["sanity", "static"],  notes: "Template exists: programs-initiative.html" },
      { path: "/certification",label: "Professional Certification", status: "planned", data: ["sanity", "static"], notes: "Template exists: professional-certification.html" },
      { path: "/partnerships", label: "Partnerships",          status: "live",       data: ["static"] },
      { path: "/contact",      label: "Contact",               status: "live",       data: ["static"] },
      { path: "/newsletter",   label: "Newsletter",            status: "live",       data: ["sanity"] },
      { path: "/privacy",      label: "Privacy Policy",        status: "live",       data: ["static"] },
      { path: "/terms",        label: "Terms of Use",          status: "live",       data: ["static"] },
    ],
  },
  {
    title: "Member Dashboard",
    icon: "fa-gauge-high",
    color: "text-blue-400",
    desc: "Requires login — Supabase auth gates all routes",
    routes: [
      { path: "/dashboard",            label: "Dashboard Home",           status: "live",       data: ["supabase", "sanity"] },
      { path: "/dashboard/research",   label: "Research Feed",            status: "live",       data: ["sanity", "supabase"] },
      { path: "/dashboard/research/[slug]", label: "Research Article",   status: "live",       data: ["sanity"] },
      { path: "/dashboard/intelligence",    label: "Intelligence Briefing", status: "planned",  data: ["sanity", "supabase"],  notes: "Template: dashboard-intelligence-breifing.html" },
      { path: "/dashboard/network",         label: "Member Network",      status: "live",       data: ["supabase"] },
      { path: "/dashboard/network/[id]",    label: "Member Profile",      status: "live",       data: ["supabase", "static"] },
      { path: "/dashboard/courses",         label: "Courses (APConnect)", status: "live",       data: ["sanity", "supabase"] },
      { path: "/dashboard/membership",      label: "My Membership",       status: "live",       data: ["supabase", "paystack"] },
      { path: "/dashboard/saved",           label: "Saved Items",         status: "live",       data: ["supabase"] },
      { path: "/dashboard/settings",        label: "Account Settings",    status: "incomplete", data: ["supabase"],            notes: "Profile + password done — Notifications tab missing" },
      { path: "/onboarding",                label: "Onboarding Wizard",   status: "live",       data: ["supabase"] },
    ],
  },
  {
    title: "Admin Panel",
    icon: "fa-shield-halved",
    color: "text-violet-400",
    desc: "Restricted to ADMIN_EMAILS env var — Joseph, Lucy, Tokun",
    routes: [
      { path: "/admin",             label: "Overview",           status: "live",       data: ["supabase"] },
      { path: "/admin/members",     label: "Members Table",      status: "live",       data: ["supabase"],            notes: "Search, filter, pagination, tier change drawer" },
      { path: "/admin/generate",    label: "AI Content Generator", status: "live",     data: ["claude", "sanity"],    notes: "Claude writes draft → Sanity; Tokun reviews + publishes" },
      { path: "/admin/payments",    label: "Payments",           status: "incomplete", data: ["paystack"],            notes: "Stub — needs Paystack live keys + transaction history API" },
      { path: "/admin/sitemap",     label: "Site Map (this page)", status: "live",     data: ["static"] },
      { path: "/studio",            label: "Sanity Studio",      status: "live",       data: ["sanity"],              notes: "CMS — Tokun manages content here" },
    ],
  },
  {
    title: "Auth",
    icon: "fa-lock",
    color: "text-emerald-400",
    desc: "Supabase Auth — email/password + magic link",
    routes: [
      { path: "/login",              label: "Login",             status: "live", data: ["supabase"] },
      { path: "/register",           label: "Register",          status: "live", data: ["supabase"] },
      { path: "/forgot-password",    label: "Forgot Password",   status: "live", data: ["supabase"] },
      { path: "/auth/callback",      label: "Auth Callback",     status: "live", data: ["supabase"], notes: "Smart redirect: new users → /onboarding, returning → /dashboard" },
      { path: "/auth/reset-password",label: "Reset Password",    status: "live", data: ["supabase"] },
    ],
  },
];

const TEAM = [
  {
    name: "Lucy Okeke",
    role: "Founder & Executive Director",
    email: "info@aprn-africa.org",
    access: ["Public site", "Member dashboard", "Admin panel", "Vercel", "Supabase"],
    color: "border-gold-500/30",
  },
  {
    name: "Joseph Agwuh",
    role: "Director, Applied Engineering",
    email: "josephagwuh@gmail.com",
    access: ["Public site", "Member dashboard", "Admin panel"],
    color: "border-blue-400/30",
  },
  {
    name: "Tokunbo Khadijat",
    role: "Content Manager",
    email: "tokunbokhadijat@gmail.com",
    access: ["Public site", "Member dashboard", "Admin panel", "Sanity Studio"],
    color: "border-violet-400/30",
  },
  {
    name: "Members (registered)",
    role: "Network Member",
    email: "—",
    access: ["Public site", "Member dashboard"],
    color: "border-white/10",
  },
  {
    name: "Public / Visitor",
    role: "Anonymous",
    email: "—",
    access: ["Public site only"],
    color: "border-white/5",
  },
];

const DATA_FLOW = [
  {
    service: "Sanity CMS",
    icon: "fa-database",
    color: "#f36458",
    border: "border-[#f36458]/30",
    in: "Tokun / AI generator creates content drafts",
    out: "Articles, research, events, courses, leadership bios served to public + dashboard",
    env: "NEXT_PUBLIC_SANITY_PROJECT_ID, SANITY_WRITE_TOKEN",
  },
  {
    service: "Supabase",
    icon: "fa-layer-group",
    color: "#34d399",
    border: "border-emerald-400/30",
    in: "Users register, login, update profiles, make payments",
    out: "Auth session, member profiles, membership tier, admin member list",
    env: "NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY",
  },
  {
    service: "Paystack",
    icon: "fa-credit-card",
    color: "#60a5fa",
    border: "border-blue-400/30",
    in: "Member submits payment for tier upgrade",
    out: "Webhook confirms payment → tier updated in Supabase",
    env: "NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY, PAYSTACK_SECRET_KEY",
  },
  {
    service: "Claude API (Anthropic)",
    icon: "fa-wand-magic-sparkles",
    color: "#a78bfa",
    border: "border-violet-400/30",
    in: "Admin enters topic + angle + key points",
    out: "Full article draft (Portable Text) created in Sanity as unpublished draft",
    env: "ANTHROPIC_API_KEY",
  },
  {
    service: "Fal.ai / Flux Pro",
    icon: "fa-image",
    color: "#f472b6",
    border: "border-pink-400/30",
    in: "Admin prompts for hero image (planned — v2 generator)",
    out: "Generated image uploaded to Sanity media library, attached to draft",
    env: "FAL_KEY (not yet set)",
  },
];

// ─── Components ──────────────────────────────────────────────────────────────

function StatusBadge({ s }: { s: StatusKey }) {
  const { label, color } = STATUS[s];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase border ${color}`}>
      {label}
    </span>
  );
}

function DataBadge({ d }: { d: DataKey }) {
  const { label, color, icon } = DATA_SOURCES[d];
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-semibold ${color}`}>
      <i className={`fa-solid ${icon} text-[8px]`} />
      {label}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SitemapPage() {
  return (
    <div className="flex flex-col gap-10 max-w-275" style={{ fontFamily: "var(--font-inter), sans-serif" }}>

      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
          Site Map & Architecture
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Every page, who can access it, what data powers it, and who owns each role.
        </p>
      </div>

      {/* Route sections */}
      {SECTIONS.map((section) => (
        <div key={section.title}>
          <div className="flex items-center gap-3 mb-4">
            <i className={`fa-solid ${section.icon} ${section.color} text-sm`} />
            <div>
              <h2 className="text-xs font-bold tracking-widest uppercase text-white">{section.title}</h2>
              <p className="text-[10px] text-slate-500 mt-0.5">{section.desc}</p>
            </div>
          </div>

          <div className="border border-white/5 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[200px_1fr_120px_1fr] bg-navy-800/60 border-b border-white/5 px-4 py-2">
              <p className="text-[9px] font-bold tracking-widest uppercase text-slate-600">Route</p>
              <p className="text-[9px] font-bold tracking-widest uppercase text-slate-600">Page</p>
              <p className="text-[9px] font-bold tracking-widest uppercase text-slate-600">Status</p>
              <p className="text-[9px] font-bold tracking-widest uppercase text-slate-600">Data Sources</p>
            </div>

            {section.routes.map((route, i) => (
              <div
                key={route.path}
                className={`grid grid-cols-[200px_1fr_120px_1fr] px-4 py-3 gap-2 items-start ${
                  i < section.routes.length - 1 ? "border-b border-white/5" : ""
                } hover:bg-navy-800/30 transition-colors`}
              >
                <code className="text-[10px] text-gold-500/80 font-mono">{route.path}</code>
                <div>
                  <p className="text-xs font-semibold text-white">{route.label}</p>
                  {route.notes && (
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{route.notes}</p>
                  )}
                </div>
                <StatusBadge s={route.status} />
                <div className="flex flex-wrap gap-2">
                  {route.data.map((d) => <DataBadge key={d} d={d} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Data flow */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <i className="fa-solid fa-arrow-right-arrow-left text-gold-500 text-sm" />
          <div>
            <h2 className="text-xs font-bold tracking-widest uppercase text-white">Data Flow</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">How each external service connects to the platform</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {DATA_FLOW.map((svc) => (
            <div key={svc.service} className={`bg-navy-800 border border-white/5 ${svc.border} border-l-2 p-5`}>
              <div className="flex items-center gap-2 mb-3">
                <i className={`fa-solid ${svc.icon} text-xs`} style={{ color: svc.color }} />
                <p className="text-xs font-bold text-white">{svc.service}</p>
              </div>
              <div className="flex flex-col gap-2 mb-3">
                <div className="flex gap-2">
                  <span className="text-[9px] font-bold tracking-widest uppercase text-slate-600 shrink-0 mt-0.5 w-6">IN</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{svc.in}</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-[9px] font-bold tracking-widest uppercase text-slate-600 shrink-0 mt-0.5 w-6">OUT</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{svc.out}</p>
                </div>
              </div>
              <div className="border-t border-white/5 pt-2">
                <p className="text-[9px] text-slate-600 font-mono">{svc.env}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team roles */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <i className="fa-solid fa-users text-gold-500 text-sm" />
          <div>
            <h2 className="text-xs font-bold tracking-widest uppercase text-white">Team & Access Levels</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">Who can access what</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEAM.map((member) => (
            <div key={member.name} className={`bg-navy-800 border border-white/5 ${member.color} border-l-2 p-5`}>
              <p className="text-xs font-bold text-white mb-0.5">{member.name}</p>
              <p className="text-[10px] text-gold-500/80 font-semibold mb-0.5">{member.role}</p>
              <p className="text-[10px] text-slate-500 mb-3 font-mono">{member.email}</p>
              <div className="flex flex-col gap-1">
                {member.access.map((a) => (
                  <div key={a} className="flex items-center gap-1.5">
                    <i className="fa-solid fa-check text-emerald-400 text-[8px]" />
                    <span className="text-[10px] text-slate-400">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-navy-800 border border-white/5 p-5">
        <p className="text-[9px] font-bold tracking-widest uppercase text-slate-500 mb-3">Legend</p>
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col gap-1.5">
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Status</p>
            {(Object.entries(STATUS) as [StatusKey, typeof STATUS[StatusKey]][]).map(([key, val]) => (
              <div key={key} className="flex items-center gap-2">
                <span className={`inline-flex px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase border ${val.color}`}>{val.label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Data Sources</p>
            {(Object.entries(DATA_SOURCES) as [DataKey, typeof DATA_SOURCES[DataKey]][]).map(([key, val]) => (
              <div key={key} className="flex items-center gap-1.5">
                <i className={`fa-solid ${val.icon} text-[8px] ${val.color}`} />
                <span className={`text-[10px] font-semibold ${val.color}`}>{val.label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Quick Links</p>
            {[
              { href: "/admin",          label: "Admin Overview" },
              { href: "/admin/members",  label: "Manage Members" },
              { href: "/admin/generate", label: "Generate Content" },
              { href: "/studio",         label: "Sanity Studio" },
              { href: "/dashboard",      label: "Member Dashboard" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="text-[10px] text-slate-500 hover:text-gold-500 transition-colors">
                {link.href} <span className="text-slate-700">— {link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
