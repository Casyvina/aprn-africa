export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full overflow-hidden flex bg-navy-900" style={{ fontFamily: "var(--font-inter), sans-serif" }}>

      {/* ── Left Panel ─────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative h-full bg-navy-900 overflow-hidden flex-col justify-between p-12">
        {/* Background image + overlays */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-pipeline.jpg"
            alt=""
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-linear-to-t from-navy-900 via-navy-900/80 to-navy-900/40" />
          {/* Pipeline / Africa path overlay */}
          <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
            <svg viewBox="0 0 800 800" className="w-3/4 h-3/4" fill="none" stroke="#D4A017" strokeWidth="1">
              <path d="M400,200 Q500,250 550,350 T500,550 Q400,600 300,550 T250,350 Q300,250 400,200" />
              <circle cx="400" cy="400" r="150" strokeDasharray="4 4" />
              <line x1="250" y1="350" x2="550" y2="450" />
              <line x1="300" y1="550" x2="500" y2="250" />
            </svg>
          </div>
        </div>

        {/* Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded bg-gold-500 flex items-center justify-center">
              <i className="fa-solid fa-network-wired text-navy-900 text-sm" />
            </div>
            <span className="text-xl font-bold tracking-wider text-white">APRN</span>
          </div>

          <h1 className="text-5xl font-light leading-tight mb-6 mt-24 text-white">
            Secure Access to<br />
            <span
              className="font-bold"
              style={{
                background: "linear-gradient(to right, #F5F7FA, #6B7280)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Infrastructure Intelligence
            </span>
            <br />Systems.
          </h1>

          <p className="text-slate-400 text-lg max-w-md border-l-2 border-gold-500 pl-4 py-1">
            Enterprise-grade monitoring and resource allocation for the African Pipeline Resource Network.
          </p>
        </div>

        {/* Footer stats */}
        <div className="relative z-10 flex gap-8 border-t border-white/10 pt-6">
          {[
            { value: "99.9%", label: "Network Uptime" },
            { value: "12.4k", label: "Active Nodes" },
            { value: "Secured", label: "End-to-End Encryption" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel ────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center bg-navy-900 p-8 relative">
        {children}

        {/* Network status footer */}
        <div className="absolute bottom-6 w-full px-12 justify-between items-center text-[11px] text-slate-500 font-mono uppercase tracking-widest hidden md:flex">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" style={{ boxShadow: "0 0 5px rgba(16,185,129,0.5)" }} />
            <span>Research Network Operational</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" style={{ boxShadow: "0 0 5px rgba(16,185,129,0.5)" }} />
            <span>Secure Infrastructure Access Enabled</span>
          </div>
        </div>
      </div>

    </div>
  );
}
