"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

function AccentHeading({ text, accent }: { text: string; accent?: string }) {
  if (!accent || !text.includes(accent)) return <>{text}</>
  const [before, ...rest] = text.split(accent)
  return (
    <>
      {before}
      <span className="text-gradient">{accent}</span>
      {rest.join(accent)}
    </>
  )
}

interface CTAProps {
  headline?: string
  headlineAccent?: string
  primaryButtonLabel?: string
  secondaryButtonLabel?: string
  backgroundImageUrl?: string
}

export default function CTASection({
  headline,
  headlineAccent,
  primaryButtonLabel,
  secondaryButtonLabel,
  backgroundImageUrl,
}: CTAProps) {
  const heading = headline             ?? "Africa\u2019s infrastructure future requires African engineering capacity";
  const accent  = headlineAccent       ?? "African engineering capacity";
  const btn1    = primaryButtonLabel   ?? "Partner With Us";
  const btn2    = secondaryButtonLabel ?? "Access Research Portal";

  return (
    <section className="py-24 relative overflow-hidden bg-navy-900">
      <div className="absolute inset-0">
        <div
          style={{
            backgroundImage: `url('${backgroundImageUrl ?? '/images/pipeline-aerial.png'}')`,
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
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
      >
        <motion.i
          variants={{
            hidden:  { opacity: 0, scale: 0.5 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
          }}
          className="fa-solid fa-globe text-4xl text-gold-500 mb-6 block"
        />
        <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
          <AccentHeading text={heading} accent={accent} />
        </motion.h2>
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-8 py-4 bg-gold-500 hover:bg-gold-400 active:scale-95 text-navy-900 font-bold tracking-wide transition-all rounded-sm shadow-[0_0_20px_rgba(212,160,23,0.2)] cursor-pointer">
            {btn1}
          </button>
          <button className="px-8 py-4 glass-panel hover:bg-navy-800 active:scale-95 text-white font-semibold tracking-wide transition-all rounded-sm border border-gold-500/30 cursor-pointer">
            {btn2}
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
