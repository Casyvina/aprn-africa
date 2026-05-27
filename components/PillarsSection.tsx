"use client";

import { motion } from "framer-motion";
import type { Pillar } from "@/lib/queries/homepage";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

const DEFAULT_PILLARS: Pillar[] = [
  {
    icon: "fa-microscope",
    title: "Pipeline Research",
    description: "Advanced studies on material science, flow dynamics, and corrosion prevention tailored to African environments.",
  },
  {
    icon: "fa-hard-hat",
    title: "Engineering Training",
    description: "Internationally aligned certification programs building local capacity in design, construction, and maintenance.",
  },
  {
    icon: "fa-database",
    title: "African Pipeline Database",
    description: "The continent's most comprehensive GIS mapping and technical repository of existing and planned infrastructure.",
  },
  {
    icon: "fa-scale-balanced",
    title: "Policy & Regulation",
    description: "Advising governments and regulatory bodies on harmonized cross-border pipeline frameworks and tariffs.",
  },
  {
    icon: "fa-earth-africa",
    title: "Continental Collaboration",
    description: "Facilitating joint ventures and knowledge transfer between African NOCs and international operators.",
  },
];

interface PillarsSectionProps {
  sectionTag?: string
  sectionHeading?: string
  pillars?: Pillar[]
}

export default function PillarsSection({
  sectionTag,
  sectionHeading,
  pillars,
}: PillarsSectionProps) {
  const tag      = sectionTag     ?? "Strategic Focus";
  const heading  = sectionHeading ?? "Our Core Pillars";
  const items    = pillars && pillars.length > 0 ? pillars : DEFAULT_PILLARS;

  return (
    <section id="pillars" className="py-24 bg-navy-800 relative">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(212, 160, 23, 0.05) 0%, transparent 70%)",
        }}
      />
      <div className="max-w-360 mx-auto px-6 md:px-12 relative z-10">
        {/* Heading fades up */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold mb-3 block">
            {tag}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">{heading}</h2>
        </motion.div>

        {/* Cards stagger in from bottom */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {items.map((pillar) => (
            <motion.div
              key={pillar.title}
              variants={fadeUp}
              className="glass-panel p-8 rounded-sm hover:border-gold-500/50 transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <i
                className={`fa-solid ${pillar.icon} text-3xl text-gold-500 mb-6 group-hover:scale-110 transition-transform block`}
              />
              <h3 className="text-xl font-bold text-white mb-3 font-display">{pillar.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{pillar.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
