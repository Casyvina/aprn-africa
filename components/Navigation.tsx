export default function Navigation() {
  return (
    <nav id="header" className="fixed w-full z-50 glass-panel border-b border-navy-700/50">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-gold-500 to-copper-500 flex items-center justify-center">
            <i className="fa-solid fa-network-wired text-navy-900 text-xl"></i>
          </div>
          <span className="font-display font-bold text-xl tracking-wider text-white">APRN</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300 tracking-wide">
          <a href="#about" className="hover:text-gold-500 transition-colors">About</a>
          <a href="#pillars" className="hover:text-gold-500 transition-colors">Pillars</a>
          <a href="#map" className="hover:text-gold-500 transition-colors">Infrastructure Map</a>
          <a href="#research" className="hover:text-gold-500 transition-colors">Research</a>
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden md:block px-5 py-2.5 text-sm font-semibold text-white border border-gold-500/30 hover:border-gold-500 hover:bg-gold-500/10 transition-all rounded-sm">
            Member Portal
          </button>
          <button className="px-5 py-2.5 text-sm font-semibold text-navy-900 bg-gold-500 hover:bg-gold-400 transition-colors rounded-sm shadow-[0_0_15px_rgba(212,160,23,0.3)]">
            Join Network
          </button>
        </div>
      </div>
    </nav>
  );
}
