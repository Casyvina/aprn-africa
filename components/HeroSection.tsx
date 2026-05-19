"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const DEFAULT_METRICS = [
  { label: "Active Projects", value: "42", width: "75%" },
  { label: "Engineering Trainees", value: "1,250+", width: "60%" },
  { label: "Policy Frameworks", value: "18", width: "45%" },
];

interface HeroMetric { label: string; value: string; width: string }

export default function HeroSection({ stats }: { stats?: HeroMetric[] }) {
  const metrics = stats ?? DEFAULT_METRICS;
  return (
    <section id="hero" className="relative pt-32 pb-20 min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          style={{
            backgroundImage: "url('/images/hero-pipeline.jpg')",
          }}
          className="w-full h-full bg-cover bg-center opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-linear-to-b from-navy-900/90 via-navy-900/80 to-navy-900" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212, 160, 23, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 160, 23, 0.05) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-360 mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left column — staggered entrance */}
        <motion.div
          className="lg:col-span-8"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.13 } } }}
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
            <span className="text-xs font-semibold text-gold-500 uppercase tracking-widest">
              Institutional Infrastructure
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-display text-5xl md:text-7xl font-bold leading-[1.1] mb-8 text-white"
          >
            Anchoring Pipeline <br />
            <span className="text-gradient">Technology</span> <br />
            in Africa
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed font-light border-l-2 border-gold-500/50 pl-6"
          >
            Research, engineering development, policy collaboration, and internationally aligned pipeline
            training to secure the continent&apos;s energy future.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-gold-500 hover:bg-gold-400 active:scale-95 text-navy-900 font-bold tracking-wide transition-all rounded-sm shadow-[0_0_20px_rgba(212,160,23,0.2)] flex items-center justify-center gap-3 cursor-pointer">
              Explore APRN <i className="fa-solid fa-arrow-right" />
            </button>
            <button className="px-8 py-4 glass-panel hover:bg-navy-800 active:scale-95 text-white font-semibold tracking-wide transition-all rounded-sm flex items-center justify-center gap-3 group cursor-pointer">
              Strategic Partnerships{" "}
              <i className="fa-solid fa-handshake text-gold-500 group-hover:scale-110 transition-transform" />
            </button>
          </motion.div>
        </motion.div>

        {/* Right column — metrics panel slides in */}
        <motion.div
          className="lg:col-span-4 hidden lg:block"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: "easeOut" as const }}
        >
          <div className="glass-panel p-6 rounded-sm relative">
            <div className="absolute -top-3 -right-3 w-20 h-20 bg-gold-500/10 blur-xl rounded-full" />
            <div className="flex justify-between items-center mb-6 border-b border-navy-700 pb-4">
              <span className="text-sm text-slate-400 uppercase tracking-widest font-semibold">
                Network Metrics
              </span>
              <i className="fa-solid fa-chart-line text-gold-500" />
            </div>

            <div className="space-y-6">
              {metrics.map((m, i) => (
                <div key={m.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">{m.label}</span>
                    <span className="text-gold-500 font-mono">{m.value}</span>
                  </div>
                  <div className="w-full bg-navy-900 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      className="bg-linear-to-r from-gold-500 to-copper-500 h-full"
                      initial={{ width: 0 }}
                      animate={{ width: m.width }}
                      transition={{ duration: 1, delay: 0.8 + i * 0.15, ease: "easeOut" as const }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
