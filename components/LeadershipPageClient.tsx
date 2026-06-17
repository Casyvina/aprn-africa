"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { PersonCard } from "@/lib/queries/persons";

import { fadeUp, staggerContainer } from "@/lib/animations";

const pillars = [
  {
    icon: "fa-compass",
    title: "Engineering & Technical",
    body: "Establishing rigorous standards for material integrity, fluid dynamics, and structural longevity across Africa's diverse terrains and operating environments.",
  },
  {
    icon: "fa-scale-balanced",
    title: "Regulation & Policy",
    body: "Harmonising cross-border legislation and environmental compliance frameworks for transnational pipeline and energy transit projects.",
  },
  {
    icon: "fa-industry",
    title: "Industry Operations",
    body: "Optimising asset lifecycle management, maintenance protocols, and operational safety standards across the midstream sector.",
  },
  {
    icon: "fa-microscope",
    title: "Academia & Research",
    body: "Directing critical research into advanced materials, leak detection, corrosion mitigation, and flow optimisation for African conditions.",
  },
  {
    icon: "fa-users-gear",
    title: "Capacity Building",
    body: "Developing the continent's pipeline workforce through world-class certification programmes and knowledge transfer mechanisms.",
  },
  {
    icon: "fa-landmark",
    title: "Infrastructure Finance",
    body: "Guiding investment frameworks, de-risking project structures, and aligning development finance with infrastructure bankability requirements.",
  },
];

// Hard-coded fallback data merged with CMS data by slug
const LEADERSHIP_FALLBACK: Record<string, {
  quote: string;
  highlights: { value: string; label: string }[];
}> = {
  "pieter-bas-nederveen": {
    quote: "Africa's energy transition requires experienced international expertise combined with deep local knowledge — that is the combination APRN uniquely delivers.",
    highlights: [
      { value: "Senior", label: "Energy Advisor" },
      { value: "Advisory", label: "Committee Member" },
    ],
  },
  "lucy-okeke": {
    quote: "The next decade of African development relies entirely on the integrity of our physical infrastructure. We are not merely building pipelines — we are constructing the arteries of continental economic sovereignty.",
    highlights: [
      { value: "20+", label: "Years Industry Experience" },
      { value: "8", label: "Nations Advised" },
    ],
  },
  "kosie-stephanie-onuora": {
    quote: "Reimagining energy policy through law, governance, and inclusion — because the frameworks we build today determine whose future gets protected tomorrow.",
    highlights: [
      { value: "Energy Law", label: "Specialisation" },
      { value: "WEOG", label: "Lagos Secretary" },
    ],
  },
  "joseph-agwuh": {
    quote: "Applied engineering without applied knowledge transfer is a temporary solution. APRN exists to make Africa's infrastructure expertise permanent, indigenous, and self-sustaining.",
    highlights: [
      { value: "Civil Engineer", label: "BSc" },
      { value: "Digital Infrastructure", label: "Lead" },
    ],
  },
};

// Hardcoded fallback for team members not yet in Sanity
const TEAM_FALLBACK: Record<string, Partial<PersonCard>> = {
  "olatokunbo-ajelara": {
    name: "Olatokunbo Ajelara",
    title: "Content Manager",
    bio: "Olatokunbo is a chemical engineering student with a strong interest in energy systems, research and technology-driven solutions. Through her work, she contributes to discussions on Africa's energy transition, infrastructure development, and the future of the continent's pipeline sector.",
    linkedIn: "https://www.linkedin.com/in/olatokunbo-ajelara-86b1941b3",
    email: "tokunbokhadijat@gmail.com",
  },
};

interface Props {
  persons: PersonCard[];
  teamMembers?: PersonCard[];
  youthAmbassadorPhotoUrl?: string | null;
}

export default function LeadershipPageClient({ persons, teamMembers = [], youthAmbassadorPhotoUrl }: Props) {
  return (
    <main
      className="bg-navy-900 text-white"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* -- Hero ------------------------------------------------ */}
      <section className="pt-40 pb-32 px-6 lg:px-12 min-h-[90vh] flex flex-col justify-center relative overflow-hidden max-w-360 mx-auto">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gold-500/3 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          className="max-w-4xl mx-auto text-center relative z-10"
          initial="hidden" animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-navy-800/50 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
            <span className="text-xs font-medium tracking-widest text-gold-500 uppercase">Institutional Leadership</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-8 text-white"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Leadership &amp; <br />
            <span className="italic text-gold-500">Strategic</span> Advisory
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Guiding Africa&apos;s pipeline engineering and infrastructure future through collaboration,
            research, and technical leadership.
          </motion.p>
        </motion.div>

        {/* Mandate card */}
        <motion.div
          className="mt-24 max-w-5xl mx-auto w-full"
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
        >
          <div className="glass-panel p-8 rounded-sm border border-gold-500/20 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h3
                className="text-2xl mb-3 text-gold-500"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                The Infrastructure Mandate
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                A unified framework connecting engineering excellence with policy regulation to secure
                continental energy and water networks — led by practitioners who have built, governed,
                and taught across Africa.
              </p>
            </div>
            <div className="hidden md:block w-px h-24 bg-gold-500/20 shrink-0" />
            <div className="flex-1 grid grid-cols-3 gap-4 text-center">
              {[
                { value: "42+", label: "Institutional Partners" },
                { value: "14", label: "Nations Engaged" },
                { value: "50k km", label: "Infrastructure Mapped" },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    className="text-2xl font-bold text-gold-500"
                    style={{ fontFamily: "var(--font-oswald), sans-serif" }}
                  >
                    {s.value}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* -- Leadership Profiles --------------------------------- */}
      {persons.map((person, i) => {
        const fallback = LEADERSHIP_FALLBACK[person.slug ?? ""] ?? {};
        const quote = person.quote ?? fallback.quote ?? "";
        const highlights = (person.highlights && person.highlights.length > 0)
          ? person.highlights
          : (fallback.highlights ?? []);
        const photo = person.photoUrl ?? `/images/${person.slug}.png`;

        return (
          <motion.section
            key={person._id}
            className="py-32 px-6 lg:px-12 border-t border-white/10 relative"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <div className="max-w-360 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              {/* Portrait — alternate sides */}
              <div className={`lg:col-span-5 relative ${i % 2 === 1 ? "lg:order-last" : ""}`}>
                <div className="absolute inset-0 bg-gold-500/10 translate-x-4 translate-y-4 rounded-sm" />
                <div className="relative rounded-sm overflow-hidden border border-gold-500/30 group">
                  <div className="relative h-140 overflow-hidden bg-navy-800">
                    <Image
                      src={photo}
                      alt={person.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 600px"
                      className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-navy-900 via-navy-900/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3
                      className="text-2xl font-bold text-white mb-1"
                      style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                      {person.name}
                    </h3>
                    <p className="text-sm text-gold-500 tracking-wider uppercase">{person.title}</p>
                  </div>
                </div>
              </div>

              {/* Biography */}
              <div className="lg:col-span-7">
                <h2
                  className="text-4xl md:text-5xl font-bold mb-8 text-white"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  Strategic{" "}
                  <span className="italic text-gold-500">Vision</span>
                </h2>

                {quote && (
                  <blockquote className="border-l-2 border-gold-500/50 pl-6 mb-8">
                    <p className="text-lg text-slate-300 font-light leading-relaxed italic">
                      &ldquo;{quote}&rdquo;
                    </p>
                  </blockquote>
                )}

                <p className="text-slate-400 leading-relaxed mb-10 text-sm">{person.bio}</p>

                {highlights.length > 0 && (
                  <div className="grid grid-cols-2 gap-8 border-t border-gold-500/20 pt-8">
                    {highlights.map((s) => (
                      <div key={s.label}>
                        <span
                          className={`block font-bold text-gold-500 mb-2 ${s.value.length > 5 ? "text-lg leading-tight" : "text-3xl"}`}
                          style={{ fontFamily: "var(--font-playfair), serif" }}
                        >
                          {s.value}
                        </span>
                        <span className="text-xs uppercase tracking-widest text-slate-500">{s.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        );
      })}

      {/* -- Advisory Pillars ------------------------------------ */}
      <section className="py-32 px-6 lg:px-12 border-t border-white/10 bg-navy-800/30">
        <div className="max-w-360 mx-auto">
          <motion.div
            className="text-center mb-20"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp}
          >
            <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold mb-4 block">
              Governance Structure
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Advisory{" "}
              <span className="italic text-gold-500">Pillars</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Comprehensive governance structure designed to address every facet of continental
              infrastructure development and engineering excellence.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={staggerContainer}
          >
            {pillars.map((p) => (
              <motion.div
                key={p.title}
                variants={fadeUp}
                className="glass-panel rounded-sm p-8 border border-navy-700 hover:border-gold-500/30 transition-all group relative overflow-hidden cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-2xl group-hover:bg-gold-500/10 transition-all" />
                <i className={`fa-solid ${p.icon} text-gold-500 text-2xl mb-6 block`} />
                <h3
                  className="text-xl font-bold mb-3 text-white"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  {p.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* -- Youth Ambassador ------------------------------------ */}
      <section className="py-32 px-6 lg:px-12 border-t border-white/10 bg-navy-900">
        <div className="max-w-360 mx-auto">
          <motion.div
            className="text-center mb-20"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp}
          >
            <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold mb-4 block">
              Next Generation
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Youth <span className="italic text-gold-500">Ambassador</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Representing the emerging generation of African pipeline engineers on the global stage.
            </p>
          </motion.div>

          <motion.div
            className="glass-panel rounded-sm border border-gold-500/20 overflow-hidden max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Photo */}
              <div className="lg:col-span-4 relative">
                <div className="relative h-105 lg:h-full min-h-90 group">
                  <Image
                    src={youthAmbassadorPhotoUrl ?? "/images/allison-gabriel.jpeg"}
                    alt="Allison Gabriel"
                    fill
                    sizes="(max-width: 1024px) 100vw, 360px"
                    className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-transparent to-navy-900/60 lg:block hidden" />
                  <div className="absolute inset-0 bg-linear-to-t from-navy-900/80 via-transparent to-transparent lg:hidden" />
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-8 p-10 lg:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 mb-6">
                  <span className="w-8 h-px bg-gold-500" />
                  <span className="text-xs font-semibold text-gold-500 uppercase tracking-widest">APRN Youth Ambassador</span>
                </div>

                <h3
                  className="text-3xl font-bold text-white mb-1"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  Allison Gabriel
                </h3>
                <p className="text-sm text-gold-500 tracking-wider uppercase mb-6">
                  R&amp;D Graduate Engineer · BG Technical Ltd
                </p>

                <p className="text-sm text-slate-400 leading-relaxed mb-8">
                  Allison Gabriel is an R&amp;D Graduate Engineer at BG Technical Ltd under the NCDMB/RENAISSANCE/PETAN Graduate Training and Human Development Program (2025–2027). A Petroleum Engineering graduate of Rivers State University, he is developing a real-time pipeline monitoring system designed to improve surveillance, detect leakages early, and reduce losses across critical energy infrastructure — an innovation that has gained global recognition.
                </p>

                {/* Credentials */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: "fa-trophy", label: "2025 Emerging Young Pipeline Professional Award", sub: "Pipeline Technology Conference, Berlin" },
                    { icon: "fa-users", label: "Coordinator, Future Energy Leaders Network", sub: "FELNETWORK" },
                    { icon: "fa-circle-nodes", label: "Member, SPE Port Harcourt & PLAN", sub: "Young Professional" },
                  ].map((c) => (
                    <div key={c.label} className="border border-navy-700 rounded-sm p-4 hover:border-gold-500/30 transition-colors">
                      <i className={`fa-solid ${c.icon} text-gold-500 text-sm mb-2 block`} />
                      <p className="text-xs text-white font-medium leading-snug mb-1">{c.label}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{c.sub}</p>
                    </div>
                  ))}
                </div>

                <blockquote className="border-l-2 border-gold-500/40 pl-4">
                  <p className="text-sm text-slate-300 italic leading-relaxed">
                    &ldquo;An agile and forward-thinking innovator committed to advancing technologies that strengthen pipeline integrity, monitoring, and operational safety while contributing to sustainable energy development.&rdquo;
                  </p>
                </blockquote>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* -- Operations Team ------------------------------------ */}
      {(() => {
        // Merge Sanity data with hardcoded fallbacks; always show slugs in TEAM_FALLBACK
        const allSlugs = Object.keys(TEAM_FALLBACK);
        const displayTeam: Array<Partial<PersonCard> & { slug: string }> = allSlugs.map((slug) => {
          const fromSanity = teamMembers.find((m) => m.slug === slug);
          const fallback = TEAM_FALLBACK[slug] ?? {};
          return { slug, ...fallback, ...fromSanity };
        });
        if (displayTeam.length === 0) return null;
        return (
          <section className="py-32 px-6 lg:px-12 border-t border-white/10 bg-navy-800/20">
            <div className="max-w-360 mx-auto">
              <motion.div
                className="mb-16"
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp}
              >
                <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold mb-4 block">
                  Content &amp; Communications
                </span>
                <h2
                  className="text-4xl md:text-5xl font-bold text-white"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  Operations <span className="italic text-gold-500">Team</span>
                </h2>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={staggerContainer}
              >
                {displayTeam.map((member) => (
                  <motion.div
                    key={member.slug}
                    variants={fadeUp}
                    className="glass-panel border border-navy-700 hover:border-gold-500/30 transition-all group overflow-hidden"
                  >
                    {/* Top accent */}
                    <div className="h-1 bg-gold-500/40 group-hover:bg-gold-500 transition-colors" />

                    <div className="p-8">
                      {/* Avatar / Photo */}
                      <div className="w-16 h-16 bg-navy-800 border border-gold-500/20 flex items-center justify-center mb-6 overflow-hidden">
                        {member.photoUrl ? (
                          <Image
                            src={member.photoUrl}
                            alt={member.name ?? ""}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                          />
                        ) : (
                          <span
                            className="text-xl font-bold text-gold-500"
                            style={{ fontFamily: "var(--font-playfair), serif" }}
                          >
                            {member.name?.charAt(0) ?? "?"}
                          </span>
                        )}
                      </div>

                      {/* Name & Role */}
                      <h3
                        className="text-xl font-bold text-white mb-1 leading-snug"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                      >
                        {member.name}
                      </h3>
                      <p className="text-xs text-gold-500 tracking-wider uppercase mb-5">{member.title}</p>

                      {/* Bio */}
                      {member.bio && (
                        <p className="text-sm text-slate-400 leading-relaxed mb-6">{member.bio}</p>
                      )}

                      {/* Links */}
                      <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                        {member.linkedIn && (
                          <a
                            href={member.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-gold-500 transition-colors"
                          >
                            <i className="fa-brands fa-linkedin text-sm" />
                            LinkedIn
                          </a>
                        )}
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-gold-500 transition-colors"
                          >
                            <i className="fa-solid fa-envelope text-xs" />
                            Email
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        );
      })()}

      {/* -- CTA ------------------------------------------------- */}
      <section className="py-32 px-6 border-t border-white/10 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(ellipse at 50% 50%, rgba(212,160,23,0.06) 0%, transparent 70%)",
        }} />
        <motion.div
          className="max-w-4xl mx-auto text-center relative z-10"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp}
        >
          <p className="text-xs tracking-[0.3em] text-gold-500 mb-8 uppercase">Work With APRN</p>
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
              Get In Touch <i className="fa-solid fa-arrow-right" />
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
  );
}
