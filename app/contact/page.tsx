"use client";

import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const channels = [
  {
    icon: "fa-handshake",
    title: "Strategic Partnerships",
    desc: "Government relations, institutional alignment, and large-scale joint ventures.",
  },
  {
    icon: "fa-microscope",
    title: "Research & Intelligence",
    desc: "Data access, academic collaboration, and technical publication inquiries.",
  },
  {
    icon: "fa-graduation-cap",
    title: "Training Programs",
    desc: "Engineering certification, capacity building, and institutional workshops.",
  },
  {
    icon: "fa-globe",
    title: "International Collaboration",
    desc: "Cross-border infrastructure initiatives and foreign direct investment queries.",
  },
];

const protocols = [
  {
    title: "Technical Excellence",
    desc: "All submissions are reviewed by domain experts. We ensure that technical inquiries are routed directly to our engineering intelligence divisions.",
    active: true,
  },
  {
    title: "Confidentiality Assured",
    desc: "Strategic communications are handled with institutional-grade security protocols. NDA frameworks are available upon initial verification.",
    active: false,
  },
  {
    title: "Response Timeline",
    desc: "Standard inquiries receive acknowledgement within 24 hours. Complex technical or partnership proposals are evaluated within 3–5 business days.",
    active: false,
  },
];

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <main className="bg-navy-900 text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>

        {/* -- Hero ----------------------------------------------- */}
        <section className="relative pt-32 pb-24 px-6 lg:px-12 min-h-[60vh] flex items-center border-b border-navy-800 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-pipeline.jpg"
              alt="Pipeline infrastructure"
              fill
              sizes="100vw"
              className="object-cover opacity-30 mix-blend-luminosity"
              priority
            />
            <div className="absolute inset-0 bg-navy-900/80" />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(212,160,23,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,0.05) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          <motion.div
            className="relative z-10 max-w-5xl mx-auto w-full"
            initial="hidden" animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-gold-500/30 rounded-full bg-gold-500/10">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
              <span className="text-xs font-semibold text-gold-500 uppercase tracking-widest">Institutional Access</span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight"
              style={{ fontFamily: "var(--font-oswald), sans-serif" }}
            >
              Connect With <span className="text-gold-500">APRN</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-xl text-slate-400 max-w-2xl leading-relaxed">
              A strategic engineering platform and globally credible collaboration network for Africa&apos;s infrastructure future.
            </motion.p>
          </motion.div>
        </section>

        {/* -- Contact Overview & Channels ------------------------- */}
        <section className="py-24 px-6 lg:px-12 bg-navy-900">
          <div className="max-w-360 mx-auto grid lg:grid-cols-12 gap-8 lg:gap-16">

            <div className="lg:col-span-4">
              <h2
                className="text-3xl font-bold mb-6 text-white"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Strategic Inquiries
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed text-sm">
                We facilitate high-level partnerships, research initiatives, and technical collaborations across the continent.
                Select the appropriate channel to ensure your inquiry reaches the relevant directorate.
              </p>
              <div className="space-y-6 border-t border-navy-800 pt-8">
                <div>
                  <h4 className="text-xs font-semibold text-gold-500 mb-1 uppercase tracking-wider">
                    Global Headquarters
                  </h4>
                  <p className="text-white text-sm">Lagos, Nigeria</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gold-500 mb-1 uppercase tracking-wider">
                    Email
                  </h4>
                  <a
                    href="mailto:info@aprn-africa.org"
                    className="text-white text-sm hover:text-gold-500 transition-colors"
                  >
                    info@aprn-africa.org
                  </a>
                </div>
              </div>
            </div>

            <motion.div
              className="lg:col-span-8 grid md:grid-cols-2 gap-6"
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}
            >
              {channels.map((c) => (
                <motion.div
                  key={c.title}
                  variants={fadeUp}
                  className="glass-panel p-8 rounded-sm border border-navy-700 hover:border-gold-500/50 transition-colors group cursor-pointer"
                >
                  <i className={`fa-solid ${c.icon} text-gold-500 text-2xl mb-6 block`} />
                  <h3 className="text-lg font-semibold mb-3 group-hover:text-gold-500 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{c.desc}</p>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </section>

        {/* -- Form + Engagement Protocol -------------------------- */}
        <section className="py-24 px-6 lg:px-12 bg-navy-800 relative">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(212,160,23,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,0.04) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="max-w-360 mx-auto relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">

            <ContactForm />

            <motion.div
              className="lg:pl-12 pt-8 lg:pt-0"
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
            >
              <motion.h3
                variants={fadeUp}
                className="text-3xl font-bold mb-10 text-white"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Engagement <span className="italic text-gold-500">Protocol</span>
              </motion.h3>
              <div className="space-y-8">
                {protocols.map((p, i) => (
                  <motion.div
                    key={p.title}
                    variants={fadeUp}
                    className={`border-l-2 pl-6 transition-colors hover:border-gold-500 ${
                      i === 0 ? "border-gold-500" : "border-navy-700"
                    }`}
                  >
                    <h4 className="text-lg font-semibold mb-2">{p.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </section>

        {/* -- CTA ------------------------------------------------ */}
        <section className="py-32 px-6 border-t border-white/10 bg-navy-900 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(ellipse at 50% 50%, rgba(212,160,23,0.06) 0%, transparent 70%)",
            }}
          />
          <motion.div
            className="max-w-4xl mx-auto text-center relative z-10"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp}
          >
            <p className="text-xs tracking-[0.3em] text-gold-500 mb-8 uppercase">Join the Network</p>
            <blockquote
              className="text-3xl md:text-5xl font-bold leading-tight max-w-4xl mx-auto mb-12 text-white"
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
                Email Us Directly <i className="fa-solid fa-arrow-right" />
              </a>
              <a
                href="/partnerships"
                className="inline-flex items-center justify-center gap-3 border border-white/20 px-8 py-4 text-sm font-medium tracking-widest uppercase hover:bg-white hover:text-navy-900 transition-all"
              >
                Partner With APRN <i className="fa-solid fa-arrow-right" />
              </a>
            </div>
          </motion.div>
        </section>

      </main>
      <Footer />
    </>
  );
}
