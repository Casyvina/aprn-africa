"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { LeadershipPerson } from "@/lib/queries/homepage";
import { fadeUp, fadeRight, staggerContainer } from "@/lib/animations";

const DEFAULT_LEADERSHIP: (LeadershipPerson & { photo: string })[] = [
  { name: "Pieter-Bas Nederveen", title: "Advisory Committee Member, Senior Energy Advisor", photo: "/images/pieter-bas-nederveen.png" },
  { name: "Lucy Okeke",           title: "Founder",                                          photo: "/images/lucy-okeke.jpg" },
  { name: "Joseph Agwuh",         title: "Head, Technology and Innovation",                   photo: "/images/joseph-agwuh.png" },
];

interface AboutProps {
  heading?: string
  description?: string
  partnerName?: string
  stat1Value?: string
  stat1Label?: string
  stat2Value?: string
  stat2Label?: string
  leadership?: LeadershipPerson[]
  imageUrl?: string
}

export default function AboutSection({
  heading,
  description,
  partnerName,
  stat1Value,
  stat1Label,
  stat2Value,
  stat2Label,
  leadership,
  imageUrl,
}: AboutProps) {
  const sectionHeading  = heading      ?? "The Institutional Foundation for African Energy";
  const sectionDesc     = description  ?? "The African Pipeline Resource Network (APRN) is the premier continental think-tank and capacity building network dedicated to the engineering, policy, and operational excellence of Africa\u2019s midstream infrastructure.";
  const partner         = partnerName  ?? "EITEP";
  const s1Value         = stat1Value   ?? "15";
  const s1Label         = stat1Label   ?? "Partner Nations";
  const s2Value         = stat2Value   ?? "50";
  const s2Label         = stat2Label   ?? "Km of Pipeline Tracked";
  const sectionImage    = imageUrl     ?? null;

  // Merge CMS leadership with local photo fallbacks
  const leadershipData = leadership && leadership.length > 0
    ? leadership.map((p) => ({ ...p, photo: p.photoUrl ?? DEFAULT_LEADERSHIP.find((d) => d.name === p.name)?.photo ?? "/images/female-engineer.jpg" }))
    : DEFAULT_LEADERSHIP.map((p) => ({ name: p.name, title: p.title, photoUrl: undefined, photo: p.photo }));

  return (
    <section id="about" className="py-24 bg-navy-900 relative border-t border-navy-800">
      <div className="max-w-360 mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — staggered fade from left */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-5xl font-bold mb-6 text-white">
              {sectionHeading.includes("African Energy") ? (
                <>
                  {sectionHeading.split("African Energy")[0]}
                  <span className="text-gold-500">African Energy</span>
                </>
              ) : (
                sectionHeading
              )}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 text-lg leading-relaxed mb-6">
              {sectionDesc}
            </motion.p>

            {/* Strategic partner badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-gold-500/30 bg-gold-500/5 mb-8">
              <i className="fa-solid fa-handshake text-gold-500 text-xs" />
              <span className="text-xs text-slate-300 tracking-wide">
                Strategic Partner: <span className="text-gold-500 font-semibold">{partner}</span>
              </span>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-8 border-t border-navy-700 pt-8 mb-10">
              <div>
                <div className="text-4xl font-display font-bold text-white mb-2">
                  {s1Value}<span className="text-gold-500">+</span>
                </div>
                <div className="text-sm text-slate-400 uppercase tracking-wider">{s1Label}</div>
              </div>
              <div>
                <div className="text-4xl font-display font-bold text-white mb-2">
                  {s2Value}<span className="text-gold-500">k</span>
                </div>
                <div className="text-sm text-slate-400 uppercase tracking-wider">{s2Label}</div>
              </div>
            </motion.div>

            {/* Leadership */}
            <motion.div variants={fadeUp}>
              <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-4 block">
                Leadership
              </span>
              <div className="flex flex-col sm:flex-row gap-4">
                {leadershipData.map((person) => (
                  <div
                    key={person.name}
                    className="flex items-center gap-3 glass-panel px-4 py-3 rounded-sm border-l-2 border-gold-500/50"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gold-500/30">
                      <Image
                        src={person.photo}
                        alt={person.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white leading-tight">{person.name}</p>
                      <p className="text-xs text-slate-400 leading-tight">{person.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right — image slides from right */}
          <motion.div
            className="relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeRight}
          >
            <div className="aspect-square md:aspect-4/3 rounded-sm overflow-hidden border border-navy-700 relative group">
              <div className="absolute inset-0 bg-navy-800/50 mix-blend-multiply z-10 transition-opacity group-hover:opacity-0" />
              <Image
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top"
                src={sectionImage ?? "/images/female-engineer.png"}
                alt="African engineers in hard hats and safety vests inspecting pipeline infrastructure"
              />
              <div className="absolute bottom-6 left-6 z-20 glass-panel px-4 py-3 border-l-4 border-gold-500">
                <span className="block text-xs text-gold-500 uppercase tracking-widest mb-1">Facility</span>
                <span className="text-sm font-semibold text-white">Capacity building Programs</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
