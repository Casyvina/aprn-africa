import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const speakers = [
  {
    name: "Engr. Chukwuemeka Obi",
    title: "Director General, DPR Nigeria",
    country: "Nigeria",
    topic: "Regulatory Frameworks for Transnational Pipeline Infrastructure",
    initials: "CO",
  },
  {
    name: "Dr. Amina Diallo",
    title: "Head of Energy, African Union Commission",
    country: "Ethiopia",
    topic: "Continental Energy Policy and the African Green Deal",
    initials: "AD",
  },
  {
    name: "Pieter-Bas Nederveen",
    title: "Senior Energy Advisor, APRN",
    country: "Netherlands",
    topic: "International Capital Flows and African Pipeline Bankability",
    initials: "PN",
    photo: "/images/pieter-bas-nederveen.png",
  },
  {
    name: "Prof. Ngozi Eze",
    title: "Chair, Pipeline Engineering, University of Lagos",
    country: "Nigeria",
    topic: "Advanced Corrosion Science in Tropical Marine Environments",
    initials: "NE",
  },
  {
    name: "Lucy Okeke",
    title: "Founder, APRN Africa",
    country: "Nigeria",
    topic: "Anchoring Pipeline Technology in Africa: A 10-Year Mandate",
    initials: "LO",
    photo: "/images/lucy-okeke.jpg",
  },
  {
    name: "Engr. Kwame Asante",
    title: "VP Operations, Ghana National Gas Company",
    country: "Ghana",
    topic: "West Africa Gas Pipeline — Operational Lessons and Future Expansion",
    initials: "KA",
  },
];

const agenda = [
  {
    day: "Day 1",
    date: "October 15",
    label: "Pre-Conference",
    sessions: [
      { time: "09:00", title: "Pipeline Integrity Masterclass", type: "Workshop" },
      { time: "11:00", title: "Regulatory Harmonisation Roundtable", type: "Workshop" },
      { time: "14:00", title: "Early Career Engineer Forum", type: "Forum" },
      { time: "18:00", title: "Welcome Cocktail Reception", type: "Networking" },
    ],
  },
  {
    day: "Day 2",
    date: "October 16",
    label: "Main Plenary",
    sessions: [
      { time: "08:30", title: "Opening Ceremony & Ministerial Address", type: "Plenary" },
      { time: "10:00", title: "Keynote: Anchoring Pipeline Technology in Africa", type: "Keynote" },
      { time: "11:30", title: "Technical Tracks — Materials & Integrity", type: "Technical" },
      { time: "14:00", title: "Panel: Cross-Border Energy Transit Frameworks", type: "Panel" },
      { time: "16:00", title: "Poster Sessions & Exhibition Floor", type: "Exhibition" },
    ],
  },
  {
    day: "Day 3",
    date: "October 17",
    label: "Industry Day",
    sessions: [
      { time: "09:00", title: "Keynote: International Capital & African Infrastructure", type: "Keynote" },
      { time: "10:30", title: "Technical Tracks — Digital & AI in Pipelines", type: "Technical" },
      { time: "13:00", title: "Investment Forum — DFI & Private Capital", type: "Forum" },
      { time: "15:30", title: "APRN Research Awards Ceremony", type: "Awards" },
      { time: "19:30", title: "Gala Dinner", type: "Networking" },
    ],
  },
  {
    day: "Day 4",
    date: "October 18",
    label: "Field & Close",
    sessions: [
      { time: "08:00", title: "Site Visit — Trans-Saharan Gas Pipeline Node", type: "Site Visit" },
      { time: "14:00", title: "Closing Plenary & Communiqué", type: "Plenary" },
      { time: "16:00", title: "Post-Conference Networking", type: "Networking" },
    ],
  },
];

const sponsorTiers = [
  {
    tier: "Platinum",
    price: "$50,000",
    benefits: [
      "Premium exhibition space (24m²)",
      "4 complimentary delegate passes",
      "Keynote speaking slot (20 min)",
      "Full-page programme advert",
      "Logo on all event materials",
      "VIP Gala dinner table (10 seats)",
    ],
  },
  {
    tier: "Gold",
    price: "$25,000",
    featured: true,
    benefits: [
      "Exhibition space (12m²)",
      "2 complimentary delegate passes",
      "Panel participation opportunity",
      "Half-page programme advert",
      "Logo on event materials",
      "Gala dinner seats (4)",
    ],
  },
  {
    tier: "Silver",
    price: "$10,000",
    benefits: [
      "Exhibition space (6m²)",
      "1 complimentary delegate pass",
      "Quarter-page programme advert",
      "Logo on event materials",
      "Gala dinner seats (2)",
    ],
  },
];

const sessionTypeColor: Record<string, string> = {
  Plenary:    "text-gold-500 bg-gold-500/10 border-gold-500/30",
  Keynote:    "text-gold-400 bg-gold-500/10 border-gold-500/30",
  Workshop:   "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  Technical:  "text-blue-400 bg-blue-400/10 border-blue-400/30",
  Panel:      "text-purple-400 bg-purple-400/10 border-purple-400/30",
  Forum:      "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
  Exhibition: "text-slate-300 bg-white/5 border-white/10",
  Awards:     "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  Networking: "text-slate-400 bg-white/5 border-white/10",
  "Site Visit": "text-orange-400 bg-orange-400/10 border-orange-400/30",
};

export const metadata = {
  title: "African Pipeline Conference (APC) 2025 | APRN",
  description:
    "The premier gathering of pipeline engineers, institutional leaders, and policymakers shaping Africa's energy infrastructure. October 15–18, 2025, Abuja, Nigeria.",
};

export default function APC2025Page() {
  return (
    <>
      <Navigation />
      <main
        className="bg-navy-900 text-white"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >

        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="relative w-full overflow-hidden border-b border-white/5 min-h-[90vh] flex items-center">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-pipeline.jpg"
              alt="Pipeline infrastructure"
              fill
              className="object-cover opacity-25 mix-blend-luminosity"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-b from-navy-900/80 via-navy-900/90 to-navy-900" />
            <div
              className="absolute inset-0 opacity-40"
              style={{ backgroundImage: "radial-gradient(rgba(107,114,128,0.1) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
            />
          </div>

          <div className="max-w-360 mx-auto px-6 lg:px-12 relative z-10 py-40 flex flex-col items-center text-center w-full">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-gold-500/30 rounded-full bg-navy-800/50 backdrop-blur-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
              <span className="text-xs font-bold tracking-widest text-gold-500 uppercase">
                October 15–18, 2025 &nbsp;•&nbsp; Abuja, Nigeria
              </span>
            </div>

            <h1
              className="text-5xl md:text-7xl font-bold text-white max-w-5xl leading-tight mb-6"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              African Pipeline Conference
              <br />
              <span
                className="italic"
                style={{ background: "linear-gradient(90deg, #D4A017, #E6B83A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                APC 2025
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mb-12 font-light leading-relaxed">
              Securing Africa&apos;s Infrastructure Future through Engineering Excellence. The premier gathering of
              institutional leaders, engineers, and policymakers shaping the continent&apos;s energy and resource networks.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="#register"
                className="px-8 py-4 bg-gold-500 text-navy-900 text-sm font-bold tracking-widest uppercase hover:bg-gold-400 transition-all w-full sm:w-auto text-center"
                style={{ boxShadow: "0 0 20px rgba(212,160,23,0.4)" }}
              >
                Register for APC 2025
              </a>
              <a
                href="#agenda"
                className="px-8 py-4 border border-white/30 text-white text-sm font-bold tracking-widest uppercase hover:border-gold-500 hover:text-gold-500 transition-all w-full sm:w-auto text-center bg-navy-800/30 backdrop-blur-sm"
              >
                View Full Agenda
              </a>
            </div>

            {/* Quick stats */}
            <div className="mt-20 grid grid-cols-3 gap-8 border-t border-white/10 pt-10 w-full max-w-2xl">
              {[
                { value: "2,500+", label: "Global Delegates" },
                { value: "45+",    label: "Nations" },
                { value: "120+",   label: "Technical Sessions" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div
                    className="text-3xl font-bold text-gold-500 mb-1"
                    style={{ fontFamily: "var(--font-oswald), sans-serif" }}
                  >
                    {s.value}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Conference Details ────────────────────────────────── */}
        <section id="details" className="py-24 px-6 lg:px-12 border-b border-white/5 bg-navy-900">
          <div className="max-w-360 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
              {[
                {
                  icon: "fa-calendar",
                  title: "Dates & Schedule",
                  lines: [
                    { label: "Oct 15", value: "Pre-Conference Workshops" },
                    { label: "Oct 16–17", value: "Main Plenary & Tracks" },
                    { label: "Oct 18", value: "Site Visits & Gala" },
                  ],
                },
                {
                  icon: "fa-location-dot",
                  title: "Venue",
                  lines: [
                    { label: "", value: "International Conference Centre" },
                    { label: "", value: "Herbert Macaulay Way, CBD" },
                    { label: "", value: "Abuja, FCT, Nigeria" },
                  ],
                },
                {
                  icon: "fa-users",
                  title: "Expected Attendance",
                  lines: [
                    { label: "2,500+", value: "Global Delegates" },
                    { label: "45+",    value: "Participating Nations" },
                    { label: "120+",   value: "Technical Sessions" },
                  ],
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="glass-panel p-8 border-l-4 border-l-gold-500 flex flex-col gap-4"
                >
                  <div className="w-12 h-12 bg-navy-800 border border-white/10 flex items-center justify-center mb-2">
                    <i className={`fa-solid ${card.icon} text-gold-500 text-xl`} />
                  </div>
                  <h3
                    className="text-xl font-bold text-white"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    {card.title}
                  </h3>
                  <div className="space-y-2">
                    {card.lines.map((l, i) => (
                      <p key={i} className="text-sm text-slate-400">
                        {l.label && <strong className="text-white">{l.label}: </strong>}
                        {l.value}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Partners strip */}
            <div className="flex flex-col items-center border-t border-white/5 pt-16">
              <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-10">
                In Strategic Partnership With
              </p>
              <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 hover:opacity-100 transition-all">
                {["ECOWAS", "NCDMB", "NNPC Ltd", "EITI", "SPE Nigeria", "AU Commission"].map((p) => (
                  <div
                    key={p}
                    className="text-base font-semibold text-slate-300 tracking-wider uppercase"
                    style={{ fontFamily: "var(--font-oswald), sans-serif" }}
                  >
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Keynote Speakers ──────────────────────────────────── */}
        <section id="speakers" className="py-24 px-6 lg:px-12 border-b border-white/5 bg-navy-800/20">
          <div className="max-w-360 mx-auto">
            <div className="text-center mb-16">
              <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold mb-4 block">
                Confirmed Speakers
              </span>
              <h2
                className="text-4xl md:text-5xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Keynote <span className="italic text-gold-500">Speakers</span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
                Institutional leaders and technical authorities from across Africa and the international energy community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {speakers.map((s) => (
                <div
                  key={s.name}
                  className="glass-panel p-6 hover:border-gold-500/30 transition-all group flex flex-col gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-sm overflow-hidden bg-navy-800 border border-white/10 shrink-0">
                      {s.photo ? (
                        <Image
                          src={s.photo}
                          alt={s.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gold-500/10">
                          <span className="text-lg font-bold text-gold-500">{s.initials}</span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p
                        className="font-bold text-white text-base group-hover:text-gold-400 transition-colors"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                      >
                        {s.name}
                      </p>
                      <p className="text-xs text-slate-400 leading-snug mt-0.5">{s.title}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <i className="fa-solid fa-location-dot text-gold-500/70 text-[9px]" />
                        <span className="text-[10px] text-slate-500">{s.country}</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-white/5 pt-4">
                    <p className="text-xs text-slate-400 leading-relaxed italic">
                      &ldquo;{s.topic}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Agenda ────────────────────────────────────────────── */}
        <section id="agenda" className="py-24 px-6 lg:px-12 border-b border-white/5 bg-navy-900">
          <div className="max-w-360 mx-auto">
            <div className="text-center mb-16">
              <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold mb-4 block">
                Programme
              </span>
              <h2
                className="text-4xl md:text-5xl font-bold text-white"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Conference <span className="italic text-gold-500">Agenda</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agenda.map((day) => (
                <div key={day.day} className="glass-panel p-6 flex flex-col gap-5">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <p
                        className="text-xl font-bold text-white"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                      >
                        {day.day}
                      </p>
                      <p className="text-xs text-gold-500 uppercase tracking-widest">{day.date} — {day.label}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    {day.sessions.map((session, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <span className="text-[10px] text-slate-500 font-mono shrink-0 mt-0.5 w-10">
                          {session.time}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium leading-snug">{session.title}</p>
                        </div>
                        <span
                          className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 border shrink-0 ${sessionTypeColor[session.type] ?? "text-slate-400 bg-white/5 border-white/10"}`}
                        >
                          {session.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Sponsorship ───────────────────────────────────────── */}
        <section id="sponsors" className="py-24 px-6 lg:px-12 border-b border-white/5 bg-navy-800/20">
          <div className="max-w-360 mx-auto">
            <div className="text-center mb-16">
              <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold mb-4 block">
                Sponsorship
              </span>
              <h2
                className="text-4xl md:text-5xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Partner with <span className="italic text-gold-500">APC 2025</span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
                Position your organisation at the forefront of Africa&apos;s pipeline and energy infrastructure sector.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
              {sponsorTiers.map((tier) => (
                <div
                  key={tier.tier}
                  className={`flex flex-col gap-6 p-8 border transition-all ${
                    tier.featured
                      ? "bg-navy-800 border-gold-500/50 relative"
                      : "glass-panel hover:border-gold-500/30"
                  }`}
                >
                  {tier.featured && (
                    <div className="absolute -top-px left-0 right-0 h-0.5 bg-gold-500" />
                  )}
                  {tier.featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-bold tracking-widest uppercase text-navy-900 bg-gold-500 px-3 py-0.5">
                      Most Popular
                    </span>
                  )}
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">{tier.tier} Sponsor</p>
                    <p
                      className="text-3xl font-bold text-white"
                      style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                      {tier.price}
                    </p>
                  </div>
                  <ul className="flex flex-col gap-2 flex-1">
                    {tier.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-slate-400">
                        <i className="fa-solid fa-check text-gold-500 text-xs mt-0.5 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="mailto:info@aprn-africa.org?subject=APC 2025 Sponsorship Inquiry"
                    className={`w-full text-center py-3 text-xs font-bold tracking-widest uppercase transition-all ${
                      tier.featured
                        ? "bg-gold-500 text-navy-900 hover:bg-gold-400"
                        : "border border-gold-500/40 text-gold-500 hover:bg-gold-500 hover:text-navy-900"
                    }`}
                  >
                    Enquire Now
                  </a>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-slate-500">
              Custom sponsorship packages available.{" "}
              <a href="mailto:info@aprn-africa.org" className="text-gold-500 hover:text-gold-400 transition-colors">
                Contact us
              </a>{" "}
              to discuss bespoke arrangements.
            </p>
          </div>
        </section>

        {/* ── Registration CTA ──────────────────────────────────── */}
        <section id="register" className="py-32 px-6 lg:px-12 relative overflow-hidden bg-navy-900">
          <div className="absolute inset-0 pointer-events-none">
            <Image
              src="/images/pipeline-aerial.png"
              alt=""
              fill
              className="object-cover opacity-10 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-linear-to-t from-navy-900 via-navy-900/90 to-navy-900" />
          </div>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <span className="text-gold-500 uppercase tracking-widest text-xs font-semibold mb-6 block">
              Secure Your Place
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Join 2,500 leaders shaping{" "}
              <span className="italic text-gold-500">Africa&apos;s infrastructure future</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-xl mx-auto">
              Early bird registration closes 31 August 2025. Delegates, academics, students, and industry
              observers are all welcome.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
              {[
                { label: "Delegate", price: "$850", note: "Full access" },
                { label: "Academic", price: "$350", note: "Institution ID required" },
                { label: "Student",  price: "$150", note: "Valid student ID required" },
              ].map((t) => (
                <div key={t.label} className="glass-panel p-5 text-center">
                  <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">{t.label}</p>
                  <p
                    className="text-2xl font-bold text-white mb-1"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    {t.price}
                  </p>
                  <p className="text-[10px] text-slate-500">{t.note}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:info@aprn-africa.org?subject=APC 2025 Registration"
                className="px-8 py-4 bg-gold-500 text-navy-900 text-sm font-bold tracking-widest uppercase hover:bg-gold-400 transition-all w-full sm:w-auto text-center"
                style={{ boxShadow: "0 0 24px rgba(212,160,23,0.4)" }}
              >
                Register Now <i className="fa-solid fa-arrow-right ml-2" />
              </a>
              <a
                href="mailto:info@aprn-africa.org?subject=APC 2025 Enquiry"
                className="px-8 py-4 border border-white/20 text-white text-sm font-bold tracking-widest uppercase hover:border-gold-500/50 hover:text-gold-500 transition-all w-full sm:w-auto text-center"
              >
                General Enquiry
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
