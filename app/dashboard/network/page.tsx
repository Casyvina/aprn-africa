import Link from "next/link";

export const metadata = { title: "Engineer Network | APRN" };

const disciplines = ["All", "Pipeline Integrity", "Project Engineering", "Policy & Regulation", "Renewable Energy", "HSE", "Research"];

const members = [
  {
    initials: "AO",
    name: "Adaeze Okonkwo",
    title: "Senior Pipeline Engineer",
    org: "NNPC Ltd",
    country: "Nigeria",
    discipline: "Pipeline Integrity",
    connections: 34,
    online: true,
  },
  {
    initials: "KM",
    name: "Kwabena Mensah",
    title: "Energy Policy Analyst",
    org: "Ghana National Gas Company",
    country: "Ghana",
    discipline: "Policy & Regulation",
    connections: 21,
    online: false,
  },
  {
    initials: "FD",
    name: "Fatima Diallo",
    title: "Project Manager — Upstream",
    org: "Société Nationale de Pétrole",
    country: "Senegal",
    discipline: "Project Engineering",
    connections: 47,
    online: true,
  },
  {
    initials: "TO",
    name: "Taiwo Ogunbiyi",
    title: "HSE Lead",
    org: "Seplat Energy",
    country: "Nigeria",
    discipline: "HSE",
    connections: 18,
    online: false,
  },
  {
    initials: "ME",
    name: "Miriam Essien",
    title: "Research Fellow — Corrosion Science",
    org: "University of Lagos",
    country: "Nigeria",
    discipline: "Research",
    connections: 56,
    online: true,
  },
  {
    initials: "BN",
    name: "Bongani Nkosi",
    title: "Renewable Integration Engineer",
    org: "Eskom Holdings",
    country: "South Africa",
    discipline: "Renewable Energy",
    connections: 29,
    online: false,
  },
  {
    initials: "EK",
    name: "Emmanuel Kofi",
    title: "Pipeline Design Engineer",
    org: "Tullow Oil Ghana",
    country: "Ghana",
    discipline: "Pipeline Integrity",
    connections: 38,
    online: true,
  },
  {
    initials: "RA",
    name: "Rukayat Adeyemi",
    title: "Regulatory Affairs Specialist",
    org: "Nigerian Midstream & Downstream Authority",
    country: "Nigeria",
    discipline: "Policy & Regulation",
    connections: 12,
    online: false,
  },
];

export default function NetworkPage() {
  return (
    <div className="flex flex-col gap-8 max-w-[1100px]">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h2
            className="text-3xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Engineer Network
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Connect with pipeline engineers, researchers, and policymakers across Africa.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs pointer-events-none" />
            <input
              type="text"
              placeholder="Search members…"
              className="bg-navy-800 border border-white/10 pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/40 transition-colors w-52"
            />
          </div>
        </div>
      </div>

      {/* ── Stats strip ─────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Engineers", value: "1,400+", icon: "fa-users" },
          { label: "Countries", value: "28", icon: "fa-globe-africa" },
          { label: "Organisations", value: "190+", icon: "fa-building" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-navy-800 border border-white/5 p-5 flex items-center gap-4"
          >
            <div className="w-9 h-9 bg-navy-900 border border-white/5 flex items-center justify-center shrink-0">
              <i className={`fa-solid ${s.icon} text-gold-500 text-xs`} />
            </div>
            <div>
              <p
                className="text-2xl font-bold text-white leading-none"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                {s.value}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Membership gate notice ───────────────────────────────── */}
      <div className="bg-gold-500/5 border border-gold-500/20 p-5 flex items-start gap-4">
        <i className="fa-solid fa-lock text-gold-500 text-sm mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-white mb-1">Network access requires Professional membership</p>
          <p className="text-xs text-slate-400">
            Upgrade to connect directly, message engineers, and view full profiles.{" "}
            <Link href="/dashboard/membership" className="text-gold-500 hover:text-gold-400 transition-colors">
              View plans →
            </Link>
          </p>
        </div>
      </div>

      {/* ── Discipline filter ────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {disciplines.map((d, i) => (
          <button
            key={d}
            className={`px-4 py-2 text-xs font-semibold transition-colors ${
              i === 0
                ? "bg-gold-500 text-navy-900"
                : "bg-navy-800 border border-white/10 text-slate-400 hover:text-white hover:border-gold-500/30"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* ── Member grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {members.map((member) => (
          <div
            key={member.name}
            className="bg-navy-800 border border-white/5 p-5 flex flex-col gap-4 hover:border-gold-500/20 transition-colors group"
          >
            {/* Avatar */}
            <div className="relative self-start">
              <div className="w-12 h-12 bg-navy-900 border border-gold-500/20 flex items-center justify-center">
                <span
                  className="text-sm font-bold text-gold-500"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  {member.initials}
                </span>
              </div>
              {member.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-navy-800 rounded-full" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white group-hover:text-gold-400 transition-colors leading-snug mb-0.5">
                {member.name}
              </p>
              <p className="text-xs text-slate-400 leading-snug mb-2">{member.title}</p>
              <p className="text-[10px] text-slate-500 truncate">{member.org}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 bg-navy-900 border border-white/5 text-[9px] font-bold tracking-widest text-gold-500 uppercase">
                {member.country}
              </span>
              <span className="px-2 py-0.5 bg-navy-900 border border-white/5 text-[9px] text-slate-400 uppercase tracking-wider">
                {member.connections} connections
              </span>
            </div>

            {/* Connect CTA */}
            <Link
              href="/dashboard/membership"
              className="w-full py-2 text-center text-[10px] font-bold tracking-widest uppercase text-slate-400 border border-white/10 hover:text-gold-500 hover:border-gold-500/30 transition-colors"
            >
              <i className="fa-solid fa-lock text-[9px] mr-1.5" />
              Connect
            </Link>
          </div>
        ))}
      </div>

      {/* Load more */}
      <div className="text-center py-4 border-t border-white/5">
        <button className="text-xs text-slate-500 hover:text-gold-500 transition-colors font-medium">
          Load more members →
        </button>
      </div>
    </div>
  );
}
