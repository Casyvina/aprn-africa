export default function HeroSection() {
  return (
    <section id="hero" className="relative pt-32 pb-20 min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          style={{
            backgroundImage: "url('/images/hero-pipeline.jpg')",
          }}
          className="w-full h-full bg-cover bg-center opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/90 via-navy-900/80 to-navy-900" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212, 160, 23, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 160, 23, 0.05) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
            <span className="text-xs font-semibold text-gold-500 uppercase tracking-widest">
              Institutional Infrastructure
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.1] mb-8 text-white">
            Building Africa&apos;s <br />
            <span className="text-gradient">Pipeline Knowledge</span> <br />
            &amp; Training Infrastructure
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed font-light border-l-2 border-gold-500/50 pl-6">
            Research, engineering development, policy collaboration, and internationally aligned pipeline
            training to secure the continent&apos;s energy future.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold tracking-wide transition-all rounded-sm shadow-[0_0_20px_rgba(212,160,23,0.2)] flex items-center justify-center gap-3">
              Explore APRN <i className="fa-solid fa-arrow-right" />
            </button>
            <button className="px-8 py-4 glass-panel hover:bg-navy-800 text-white font-semibold tracking-wide transition-all rounded-sm flex items-center justify-center gap-3 group">
              Strategic Partnerships{" "}
              <i className="fa-solid fa-handshake text-gold-500 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 hidden lg:block">
          <div className="glass-panel p-6 rounded-sm relative">
            <div className="absolute -top-3 -right-3 w-20 h-20 bg-gold-500/10 blur-xl rounded-full" />
            <div className="flex justify-between items-center mb-6 border-b border-navy-700 pb-4">
              <span className="text-sm text-slate-400 uppercase tracking-widest font-semibold">
                Network Metrics
              </span>
              <i className="fa-solid fa-chart-line text-gold-500" />
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">Active Projects</span>
                  <span className="text-gold-500 font-mono">42</span>
                </div>
                <div className="w-full bg-navy-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-gold-500 to-copper-500 h-full"
                    style={{ width: "75%" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">Engineering Trainees</span>
                  <span className="text-gold-500 font-mono">1,250+</span>
                </div>
                <div className="w-full bg-navy-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-gold-500 to-copper-500 h-full"
                    style={{ width: "60%" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">Policy Frameworks</span>
                  <span className="text-gold-500 font-mono">18</span>
                </div>
                <div className="w-full bg-navy-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-gold-500 to-copper-500 h-full"
                    style={{ width: "45%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
