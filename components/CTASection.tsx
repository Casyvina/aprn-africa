export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden bg-navy-900">
      <div className="absolute inset-0">
        <div
          style={{
            backgroundImage: "url('/images/pipeline-aerial.png')",
          }}
          className="w-full h-full bg-cover bg-center opacity-15 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/80 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <i className="fa-solid fa-globe text-4xl text-gold-500 mb-6 block" />
        <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
          Africa&apos;s infrastructure future requires{" "}
          <span className="text-gradient">African engineering capacity.</span>
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-8 py-4 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold tracking-wide transition-all rounded-sm shadow-[0_0_20px_rgba(212,160,23,0.2)]">
            Partner With Us
          </button>
          <button className="px-8 py-4 glass-panel hover:bg-navy-800 text-white font-semibold tracking-wide transition-all rounded-sm border border-gold-500/30">
            Access Research Portal
          </button>
        </div>
      </div>
    </section>
  );
}
