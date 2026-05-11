import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-navy-900 relative border-t border-navy-800">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6 text-white">
              The Institutional Foundation for{" "}
              <span className="text-gold-500">African Energy</span>.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              The African Pipeline Resource Network (APRN) is the premier continental think-tank and
              training ecosystem dedicated to the engineering, policy, and operational excellence of
              Africa&apos;s midstream infrastructure.
            </p>
            <div className="grid grid-cols-2 gap-8 border-t border-navy-700 pt-8">
              <div>
                <div className="text-4xl font-display font-bold text-white mb-2">
                  15<span className="text-gold-500">+</span>
                </div>
                <div className="text-sm text-slate-400 uppercase tracking-wider">Partner Nations</div>
              </div>
              <div>
                <div className="text-4xl font-display font-bold text-white mb-2">
                  50<span className="text-gold-500">k</span>
                </div>
                <div className="text-sm text-slate-400 uppercase tracking-wider">Km of Pipeline Tracked</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square md:aspect-[4/3] rounded-sm overflow-hidden border border-navy-700 relative group">
              <div className="absolute inset-0 bg-navy-800/50 mix-blend-multiply z-10 transition-opacity group-hover:opacity-0" />
              <Image
                fill
                className="object-cover"
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/cf955a14c7-336ebe3931fd269ceae1.png"
                alt="African engineers reviewing pipeline blueprints in a modern high-tech facility"
              />
              <div className="absolute bottom-6 left-6 z-20 glass-panel px-4 py-3 border-l-4 border-gold-500">
                <span className="block text-xs text-gold-500 uppercase tracking-widest mb-1">Facility</span>
                <span className="text-sm font-semibold text-white">Abuja Training Hub</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
