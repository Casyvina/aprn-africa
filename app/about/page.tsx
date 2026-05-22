"use client";

import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const challenges = [
  {
    icon: "fa-user-gear",
    title: "Skills Gap",
    body: "Critical shortage of certified pipeline engineers, integrity specialists, and advanced welders locally.",
  },
  {
    icon: "fa-hourglass-half",
    title: "Aging Workforce",
    body: "Impending retirement of senior experts without sufficient knowledge transfer mechanisms in place.",
  },
  {
    icon: "fa-triangle-exclamation",
    title: "Infrastructure Losses",
    body: "High rates of product loss due to aging assets, vandalism, and inadequate monitoring technologies.",
  },
  {
    icon: "fa-network-wired",
    title: "Fragmented Coordination",
    body: "Lack of unified standards and poor collaboration between operators, regulators, and academia.",
  },
  {
    icon: "fa-bolt",
    title: "Rising Energy Demand",
    body: "Exponential population growth requiring massive expansion of reliable utility transit networks.",
  },
];

const pillars = [
  {
    num: "01",
    title: "Pipeline Research",
    body: "Advancing material science, flow dynamics, and localized engineering solutions for African terrains.",
  },
  {
    num: "02",
    title: "Training & Certification",
    body: "Standardizing competency frameworks and delivering world-class technical training programmes.",
  },
  {
    num: "03",
    title: "Policy Advisory",
    body: "Guiding regulatory frameworks to ensure safety, environmental compliance, and investment readiness.",
  },
  {
    num: "04",
    title: "Data Observatory",
    body: "Maintaining the continent's most comprehensive GIS repository of active and planned pipeline infrastructure.",
  },
];

const stats = [
  { value: "$180B", label: "Projected pipeline investment across Africa by 2030" },
  { value: "72%", label: "Senior pipeline roles currently filled by non-African talent" },
  { value: "15+", label: "Active cross-border pipeline corridors tracked" },
  { value: "50k", label: "Kilometres of pipeline infrastructure mapped" },
];

const leadership = [
  {
    name: "Pieter-Bas Nederveen",
    title: "Advisory Committee Member, Senior Energy Advisor",
    photo: "/images/pieter-bas-nederveen.png",
    bio: "Pieter-Bas Nederveen is a Senior Energy Advisor and member of APRN's Advisory Committee, bringing international expertise in energy sector development, infrastructure strategy, and institutional advisory to the network.",
  },
  {
    name: "Lucy Okeke",
    title: "Founder",
    photo: "/images/lucy-okeke.jpg",
    bio: "Lucy Okeke is the founding force behind APRN, bringing two decades of experience in oil and gas regulations, energy policy, sustainability, stakeholder engagement, and institutional development across West Africa. She leads APRN's strategic vision and continental partnerships.",
  },
  {
    name: "Joseph Agwuh",
    title: "Head, Technology and Innovation",
    photo: "/images/joseph-agwuh.png",
    bio: "Joseph Agwuh is a Civil Engineer and the digital architect behind APRN's operational infrastructure. He leads APRN's applied research programmes, technical documentation, digital platforms, and industry database development — bringing hands-on experience in digital strategy, web infrastructure, AI-powered research tools, and pipeline sector intelligence across Africa.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main
        className="pt-20 bg-navy-900 text-slate-100"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        {/* -- HERO ---------------------------------------------- */}
        <section className="relative min-h-[90vh] flex flex-col justify-between border-b border-white/10 px-6 pb-12 pt-24 max-w-360 mx-auto">
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <motion.div
            className="z-10 w-full"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1
              className="font-bold tracking-tighter mb-12 w-full wrap-break-word uppercase leading-[0.85]"
              style={{
                fontFamily: "var(--font-oswald), sans-serif",
                fontSize: "clamp(3rem, 8vw, 8rem)",
              }}
            >
              African Pipeline<br />Resource Network
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 z-10 w-full items-end">
            {/* Main image */}
            <div className="lg:col-span-8 h-125 relative overflow-hidden bg-navy-800">
              <Image
                src="/images/hero-pipeline.jpg"
                alt="Pipeline Infrastructure"
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover opacity-80 mix-blend-luminosity"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-navy-900 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-navy-900/80 backdrop-blur p-4 border border-white/10 max-w-xl">
                  <p className="text-sm leading-relaxed text-slate-200">
                    APRN exists to strengthen Africa&apos;s pipeline future through research,
                    engineering development, industry collaboration, and strategic capacity building.
                  </p>
                </div>
              </div>
            </div>

            {/* Side panel */}
            <div className="lg:col-span-4 h-125 flex flex-col justify-between border-l border-white/10 pl-6">
              <div>
                <h2
                  className="text-xl mb-4 text-gold-500 uppercase"
                  style={{ fontFamily: "var(--font-oswald), sans-serif" }}
                >
                  Building Africa&apos;s Pipeline Intelligence Infrastructure
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  A pan-African initiative coordinating the technical, policy, and human capital
                  requirements for the continent&apos;s growing energy and utility networks.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <a
                  href="#leadership"
                  className="inline-flex items-center justify-between border border-white/20 px-6 py-4 hover:bg-white hover:text-navy-900 transition-all group"
                >
                  <span className="text-sm font-medium tracking-widest uppercase">Meet the Team</span>
                  <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform" />
                </a>
                <Link
                  href="/research"
                  className="inline-flex items-center justify-between border border-white/20 px-6 py-4 hover:bg-white hover:text-navy-900 transition-all group"
                >
                  <span className="text-sm font-medium tracking-widest uppercase">Explore Research</span>
                  <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Ticker */}
          <div className="w-full border-t border-b border-white/10 mt-12 py-3 overflow-hidden flex whitespace-nowrap bg-navy-800/50">
            <div className="animate-ticker text-xs tracking-[0.2em] text-slate-500 flex gap-8">
              <span>NIGERIA–MOROCCO GAS PIPELINE</span><span>•</span>
              <span>OB3 PIPELINE</span><span>•</span>
              <span>AKK GAS PIPELINE</span><span>•</span>
              <span>EAST AFRICAN CRUDE OIL PIPELINE</span><span>•</span>
              <span>TRANS-SAHARAN GAS PIPELINE</span><span>•</span>
              <span>NIGERIA–MOROCCO GAS PIPELINE</span><span>•</span>
              <span>OB3 PIPELINE</span><span>•</span>
              <span>AKK GAS PIPELINE</span><span>•</span>
              <span>EAST AFRICAN CRUDE OIL PIPELINE</span><span>•</span>
              <span>TRANS-SAHARAN GAS PIPELINE</span>
            </div>
          </div>
        </section>

        {/* -- THE CHALLENGE ------------------------------------- */}
        <section className="py-24 border-b border-white/10 px-6 max-w-360 mx-auto">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp}
          >
            <h2
              className="text-4xl md:text-5xl font-bold uppercase"
              style={{ fontFamily: "var(--font-oswald), sans-serif" }}
            >
              The Continental Challenge
            </h2>
            <p className="text-slate-500 max-w-md text-sm text-right">
              Addressing the critical gaps in Africa&apos;s energy transit ecosystem to ensure
              sustainable development.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border-t border-l border-white/10"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}
          >
            {challenges.map((c) => (
              <motion.div
                key={c.title}
                variants={fadeUp}
                className="border-r border-b border-white/10 p-8 flex flex-col justify-between hover:bg-navy-800 transition-colors group cursor-pointer"
              >
                <div className="text-gold-500 text-4xl mb-6">
                  <i className={`fa-solid ${c.icon}`} />
                </div>
                <div>
                  <h3
                    className="text-2xl mb-4 group-hover:text-gold-500 transition-colors uppercase"
                    style={{ fontFamily: "var(--font-oswald), sans-serif" }}
                  >
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{c.body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* -- WHAT APRN BUILDS ---------------------------------- */}
        <section className="py-24 border-b border-white/10 px-6 max-w-360 mx-auto bg-navy-800/30">
          <motion.div
            className="text-center mb-20"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp}
          >
            <p className="text-xs tracking-[0.3em] text-gold-500 mb-4 uppercase">Our Ecosystem</p>
            <h3
              className="text-5xl md:text-6xl font-bold uppercase"
              style={{ fontFamily: "var(--font-oswald), sans-serif" }}
            >
              What APRN Builds
            </h3>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}
          >
            {pillars.map((p) => (
              <motion.div
                key={p.num}
                variants={fadeUp}
                className="bg-navy-900 border border-white/10 p-8 hover:border-gold-500/50 transition-colors cursor-pointer"
              >
                <div className="text-2xl mb-6 text-white/40">{p.num}</div>
                <h4
                  className="text-xl mb-4 uppercase"
                  style={{ fontFamily: "var(--font-oswald), sans-serif" }}
                >
                  {p.title}
                </h4>
                <p className="text-xs text-slate-500">{p.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* -- NUMBERS ------------------------------------------- */}
        <section className="py-24 border-b border-white/10 px-6 max-w-360 mx-auto">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 border-l border-t border-white/10"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}
          >
            {stats.map((s) => (
              <motion.div key={s.label} variants={fadeUp} className="border-r border-b border-white/10 p-10">
                <div
                  className="text-5xl md:text-6xl font-bold text-gold-500 mb-3"
                  style={{ fontFamily: "var(--font-oswald), sans-serif" }}
                >
                  {s.value}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed uppercase tracking-wider">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* -- LEADERSHIP ---------------------------------------- */}
        <section id="leadership" className="py-24 border-b border-white/10 px-6 max-w-360 mx-auto">
          <motion.div
            className="mb-16"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp}
          >
            <p className="text-xs tracking-[0.3em] text-gold-500 mb-4 uppercase">The People</p>
            <h2
              className="text-4xl md:text-5xl font-bold uppercase"
              style={{ fontFamily: "var(--font-oswald), sans-serif" }}
            >
              Leadership
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-0 border-l border-t border-white/10"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}
          >
            {leadership.map((person) => (
              <motion.div
                key={person.name}
                variants={fadeUp}
                className="border-r border-b border-white/10 group overflow-hidden"
              >
                {/* Photo / Avatar */}
                <div className="relative h-120 overflow-hidden bg-navy-800 flex items-center justify-center">
                  {person.photo ? (
                    <Image
                      src={person.photo}
                      alt={person.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="w-32 h-32 rounded-full flex items-center justify-center border border-gold-500/30"
                      style={{ background: "rgba(212,160,23,0.08)" }}
                    >
                      <span
                        className="text-5xl font-bold text-gold-500/60 leading-none"
                        style={{ fontFamily: "var(--font-oswald), sans-serif" }}
                      >
                        {person.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-navy-900 via-navy-900/20 to-transparent" />
                </div>
                {/* Info */}
                <div className="p-8 border-t border-white/10">
                  <h3
                    className="text-3xl font-bold uppercase mb-1"
                    style={{ fontFamily: "var(--font-oswald), sans-serif" }}
                  >
                    {person.name}
                  </h3>
                  <p className="text-gold-500 text-sm tracking-widest uppercase mb-4">{person.title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-lg">{person.bio}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* -- MISSION STATEMENT --------------------------------- */}
        <section className="py-32 px-6 max-w-360 mx-auto text-center relative">
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 50% 50%, rgba(212,160,23,0.15) 0%, transparent 70%)",
            }}
          />
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp}
          >
          <p className="text-xs tracking-[0.3em] text-gold-500 mb-8 uppercase">Our Purpose</p>
          <blockquote
            className="text-3xl md:text-5xl font-bold uppercase leading-tight max-w-4xl mx-auto mb-12"
            style={{ fontFamily: "var(--font-oswald), sans-serif" }}
          >
            &ldquo;Africa&apos;s infrastructure future requires{" "}
            <span className="text-gold-500">African engineering capacity</span>&rdquo;
          </blockquote>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="mailto:info@aprn-africa.org"
              className="inline-flex items-center justify-center gap-3 border border-gold-500 px-8 py-4 text-sm font-medium tracking-widest uppercase text-gold-500 hover:bg-gold-500 hover:text-navy-900 transition-all"
            >
              Get In Touch <i className="fa-solid fa-arrow-right" />
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-3 border border-white/20 px-8 py-4 text-sm font-medium tracking-widest uppercase hover:bg-white hover:text-navy-900 transition-all"
            >
              Back to Home <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
