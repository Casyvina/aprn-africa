"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

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
        <div className="absolute inset-0 bg-linear-to-t from-navy-900 via-navy-900/80 to-transparent" />
      </div>

      <motion.div
        className="max-w-4xl mx-auto px-6 relative z-10 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.14 } } }}
      >
        <motion.i
          variants={{
            hidden: { opacity: 0, scale: 0.5 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
          }}
          className="fa-solid fa-globe text-4xl text-gold-500 mb-6 block"
        />
        <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
          Africa&apos;s infrastructure future requires{" "}
          <span className="text-gradient">African engineering capacity</span>
        </motion.h2>
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-8 py-4 bg-gold-500 hover:bg-gold-400 active:scale-95 text-navy-900 font-bold tracking-wide transition-all rounded-sm shadow-[0_0_20px_rgba(212,160,23,0.2)] cursor-pointer">
            Partner With Us
          </button>
          <button className="px-8 py-4 glass-panel hover:bg-navy-800 active:scale-95 text-white font-semibold tracking-wide transition-all rounded-sm border border-gold-500/30 cursor-pointer">
            Access Research Portal
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
