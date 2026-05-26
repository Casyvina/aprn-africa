import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata = {
  title: "APLS Morocco 2026 | Africa Pipeline Leaders Summit | APRN Africa",
  description:
    "The Africa Pipeline Leaders Summit — Marrakech, Morocco 2026. 600+ pipeline engineers, policymakers, and investors from across the continent.",
};

const speakers = [
  {
    name: "Lucy Okeke",
    title: "Founder & Executive Director, APRN Africa",
    country: "Nigeria",
    topic: "Anchoring Pipeline Technology in Africa: The Next Decade",
    initials: "LO",
    photo: "/images/lucy-okeke.jpg",
  },
  {
    name: "Pieter-Bas Nederveen",
    title: "Senior Energy Advisor, APRN Africa",
    country: "Netherlands",
    topic: "International Capital Flows and African Pipeline Bankability",
    initials: "PN",
    photo: "/images/pieter-bas-nederveen.png",
  },
  {
    name: "Engr. Chukwuemeka Obi",
    title: "Director General, DPR Nigeria",
    country: "Nigeria",
    topic: "Regulatory Harmonisation Across Transnational African Pipelines",
    initials: "CO",
  },
  {
    name: "Dr. Amina Diallo",
    title: "Head of Energy, African Union Commission",
    country: "Ethiopia",
    topic: "AU Agenda 2063 and the Continental Energy Infrastructure Mandate",
    initials: "AD",
  },
  {
    name: "Prof. Ngozi Eze",
    title: "Chair, Pipeline Engineering, University of Lagos",
    country: "Nigeria",
    topic: "Corrosion Science in Africa's Coastal and Offshore Environments",
    initials: "NE",
  },
  {
    name: "Joseph Agwuh",
    title: "Head of Technology & Innovation, APRN Africa",
    country: "Nigeria",
    topic: "Digital Infrastructure and AI-Powered Pipeline Intelligence",
    initials: "JA",
    photo: "/images/joseph-agwuh.png",
  },
];

const tracks = [
  {
    icon: "fa-shield-halved",
    title: "Pipeline Integrity",
    sessions: 8,
    description: "ILI data interpretation, corrosion management, fitness-for-service, and integrity management plans across African operating environments.",
  },
  {
    icon: "fa-scale-balanced",
    title: "Policy & Regulation",
    sessions: 6,
    description: "ECOWAS protocols, bilateral transit agreements, host government frameworks, and continental regulatory harmonisation.",
  },
  {
    icon: "fa-solar-panel",
    title: "Energy Transition",
    sessions: 5,
    description: "Hydrogen blending, renewable integration, decarbonisation pathways, and Africa's role in the global clean energy economy.",
  },
  {
    icon: "fa-landmark",
    title: "Project Finance",
    sessions: 5,
    description: "DFI engagement, PPP structures, bankability criteria, and de-risking frameworks for African pipeline investment.",
  },
  {
    icon: "fa-graduation-cap",
    title: "Training & Certification",
    sessions: 4,
    description: "APRN accredited programmes, EITEP partnerships, and workforce development strategies for pipeline professionals.",
  },
  {
    icon: "fa-network-wired",
    title: "Digital & Innovation",
    sessions: 4,
    description: "Real-time monitoring systems, AI-powered inspection tools, and the digital transformation of African pipeline operations.",
  },
];

const agenda = [
  {
    day: "Day 1",
    date: "October 2026",
    theme: "Setting the Agenda — Africa's Infrastructure Imperative",
    sessions: [
      { time: "09:00", title: "Opening Ceremony & Presidential Address", type: "Plenary" },
      { time: "10:30", title: "Continental State of Play: Pipeline Infrastructure 2026", type: "Keynote" },
      { time: "12:00", title: "Lunch & Networking", type: "Break" },
      { time: "14:00", title: "Track Sessions Begin: Integrity · Policy · Finance", type: "Parallel Tracks" },
      { time: "17:30", title: "Welcome Reception — Marrakech Medina", type: "Social" },
    ],
  },
  {
    day: "Day 2",
    date: "October 2026",
    theme: "Technical Excellence & Regulatory Frameworks",
    sessions: [
      { time: "09:00", title: "Energy Transition Keynote: Africa's Hydrogen Opportunity", type: "Keynote" },
      { time: "10:30", title: "Technical Track Sessions: Corrosion · ILI · HSE · Digital", type: "Parallel Tracks" },
      { time: "12:00", title: "Lunch & Sponsor Exhibition", type: "Break" },
      { time: "14:00", title: "Policy Roundtable: ECOWAS Regulatory Harmonisation", type: "Roundtable" },
      { time: "16:00", title: "Finance Forum: Bankability of African Pipeline Projects", type: "Forum" },
      { time: "19:30", title: "APRN Gala Dinner — Founding Member Celebration", type: "Social" },
    ],
  },
  {
    day: "Day 3",
    date: "October 2026",
    theme: "Workforce, Innovation & The Next Generation",
    sessions: [
      { time: "09:00", title: "Youth Engineer Showcase: Innovation Awards Ceremony", type: "Ceremony" },
      { time: "10:00", title: "Training & Certification: APRN Programme Launches", type: "Announcement" },
      { time: "11:30", title: "WIMEE Africa — Women in Energy Leadership Panel", type: "Panel" },
      { time: "13:00", title: "Closing Lunch & Final Networking", type: "Break" },
      { time: "14:30", title: "Summit Communiqué & Closing Declaration", type: "Plenary" },
      { time: "16:00", title: "End of Summit", type: "" },
    ],
  },
];

const stats = [
  { value: "600+", label: "Expected Delegates" },
  { value: "28",   label: "Countries Represented" },
  { value: "32",   label: "Technical Sessions" },
  { value: "3",    label: "Conference Days" },
];

export default function APLSMorocco2026Page() {
  return (
    <>
      <Navigation />

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-end bg-navy-900 overflow-hidden">
        <Image
          src="/images/hero-pipeline.jpg"
          alt="Africa Pipeline Leaders Summit Morocco 2026"
          fill
          sizes="100vw"
          className="object-cover opacity-25"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-navy-900 via-navy-900/60 to-transparent" />

        <div className="relative z-10 max-w-360 mx-auto px-6 md:px-12 pb-24 pt-48">
          {/* Event badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-gold-500/40 bg-gold-500/10 mb-6">
            <i className="fa-solid fa-star text-gold-500 text-xs" />
            <span className="text-xs font-bold tracking-widest text-gold-500 uppercase">Africa Pipeline Leaders Summit 2026</span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.05]"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            APLS Morocco<br />
            <span className="text-gold-500 italic">2026</span>
          </h1>

          <p className="text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed">
            Africa&apos;s most significant gathering of pipeline engineers, energy policymakers,
            and infrastructure investors. Three days in Marrakech that will shape the continent&apos;s
            pipeline future.
          </p>

          {/* Key details strip */}
          <div className="flex flex-wrap gap-6 mb-10">
            {[
              { icon: "fa-calendar", label: "Dates", value: "October 2026" },
              { icon: "fa-location-dot", label: "Venue", value: "Marrakech, Morocco" },
              { icon: "fa-users", label: "Expected", value: "600+ Delegates" },
              { icon: "fa-globe-africa", label: "Nations", value: "28 Countries" },
            ].map((d) => (
              <div key={d.label} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-navy-800/80 border border-gold-500/30 flex items-center justify-center shrink-0">
                  <i className={`fa-solid ${d.icon} text-gold-500 text-xs`} />
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest">{d.label}</p>
                  <p className="text-sm text-white font-semibold">{d.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4" id="register">
            <a
              href="mailto:info@aprn-africa.org?subject=APLS Morocco 2026 — Expression of Interest"
              className="px-8 py-4 bg-gold-500 text-navy-900 text-xs font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors"
            >
              Express Interest in Attending
            </a>
            <a
              href="mailto:info@aprn-africa.org?subject=APLS Morocco 2026 — Sponsorship Enquiry"
              className="px-8 py-4 border border-gold-500/40 text-gold-500 text-xs font-bold tracking-widest uppercase hover:bg-gold-500/10 transition-colors"
            >
              Sponsorship Enquiry
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-navy-800 border-y border-white/5">
        <div className="max-w-360 mx-auto px-6 md:px-12 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p
                className="text-4xl font-bold text-gold-500 mb-1"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                {s.value}
              </p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tracks */}
      <section className="bg-navy-900 py-24 px-6 md:px-12">
        <div className="max-w-360 mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold-500 uppercase tracking-widest text-xs font-bold mb-4 block">Programme</span>
            <h2
              className="text-4xl md:text-5xl font-bold text-white mb-5"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Conference <span className="italic text-gold-500">Tracks</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              32 technical sessions across six tracks — covering every dimension of African pipeline engineering and energy infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tracks.map((track) => (
              <div
                key={track.title}
                className="bg-navy-800 border border-white/5 p-7 hover:border-gold-500/30 transition-colors group"
              >
                <i className={`fa-solid ${track.icon} text-gold-500 text-2xl mb-5 block`} />
                <div className="flex items-center gap-3 mb-3">
                  <h3
                    className="text-lg font-bold text-white group-hover:text-gold-400 transition-colors"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    {track.title}
                  </h3>
                  <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase shrink-0">
                    {track.sessions} sessions
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{track.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agenda */}
      <section className="bg-navy-800 py-24 px-6 md:px-12">
        <div className="max-w-360 mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold-500 uppercase tracking-widest text-xs font-bold mb-4 block">Schedule</span>
            <h2
              className="text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Three Days, <span className="italic text-gold-500">One Vision</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {agenda.map((day) => (
              <div key={day.day} className="bg-navy-900 border border-white/5 overflow-hidden">
                <div className="bg-gold-500 px-6 py-4">
                  <p className="text-[9px] font-bold tracking-widest text-navy-900 uppercase">{day.date}</p>
                  <p className="text-base font-bold text-navy-900">{day.day}</p>
                  <p className="text-xs text-navy-900/70 mt-0.5">{day.theme}</p>
                </div>
                <div className="flex flex-col divide-y divide-white/5">
                  {day.sessions.map((session) => (
                    <div key={session.title} className="px-5 py-3.5 flex items-start gap-3">
                      <span className="text-[9px] font-bold text-slate-600 shrink-0 mt-0.5 w-10">{session.time}</span>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-300 leading-snug">{session.title}</p>
                        {session.type && (
                          <span className="text-[8px] font-bold tracking-widest text-gold-500/70 uppercase mt-0.5 block">{session.type}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Confirmed Speakers */}
      <section className="bg-navy-900 py-24 px-6 md:px-12">
        <div className="max-w-360 mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold-500 uppercase tracking-widest text-xs font-bold mb-4 block">Faculty</span>
            <h2
              className="text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Confirmed <span className="italic text-gold-500">Speakers</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {speakers.map((speaker) => (
              <div
                key={speaker.name}
                className="bg-navy-800 border border-white/5 p-6 flex flex-col gap-4 hover:border-gold-500/20 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 shrink-0">
                    {speaker.photo ? (
                      <Image
                        src={speaker.photo}
                        alt={speaker.name}
                        fill
                        sizes="56px"
                        className="object-cover object-top rounded-sm grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-navy-900 border border-gold-500/20 flex items-center justify-center">
                        <span
                          className="text-base font-bold text-gold-500"
                          style={{ fontFamily: "var(--font-playfair), serif" }}
                        >
                          {speaker.initials}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white group-hover:text-gold-400 transition-colors leading-snug">
                      {speaker.name}
                    </p>
                    <p className="text-[10px] text-slate-400 leading-snug mt-0.5">{speaker.title}</p>
                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1">{speaker.country}</p>
                  </div>
                </div>
                <div className="border-t border-white/5 pt-3">
                  <p className="text-[10px] font-bold text-gold-500/60 uppercase tracking-widest mb-1">Session Topic</p>
                  <p className="text-xs text-slate-400 leading-snug italic">&ldquo;{speaker.topic}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-slate-500 mt-10">
            Additional speakers to be announced. Full programme released August 2026.
          </p>
        </div>
      </section>

      {/* Registration / Membership CTA */}
      <section className="bg-navy-800 border-t border-white/5 py-24 px-6 md:px-12">
        <div className="max-w-360 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* Attend */}
            <div className="bg-navy-900 border border-white/5 border-t-2 border-t-gold-500 p-8">
              <h3
                className="text-2xl font-bold text-white mb-3"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Attend APLS Morocco
              </h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Delegate registration opens later in 2026. APRN members receive preferential
                rates and early access. Join the waitlist now to be notified first.
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="mailto:info@aprn-africa.org?subject=APLS Morocco 2026 — Delegate Registration Interest"
                  className="w-full py-3 text-center text-xs font-bold tracking-widest uppercase text-navy-900 bg-gold-500 hover:bg-gold-400 transition-colors block"
                >
                  Join the Waitlist
                </a>
                <Link
                  href="/dashboard/membership"
                  className="w-full py-3 text-center text-xs font-bold tracking-widest uppercase text-gold-500 border border-gold-500/30 hover:bg-gold-500/10 transition-colors block"
                >
                  Become a Member (Discounted Access)
                </Link>
              </div>
            </div>

            {/* Sponsor */}
            <div className="bg-navy-900 border border-white/5 p-8">
              <h3
                className="text-2xl font-bold text-white mb-3"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Sponsor the Summit
              </h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Reach 600+ of Africa&apos;s most senior pipeline professionals. Sponsorship packages
                include speaking slots, exhibition space, branding, and hosted dinners.
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="mailto:info@aprn-africa.org?subject=APLS Morocco 2026 — Sponsorship Enquiry"
                  className="w-full py-3 text-center text-xs font-bold tracking-widest uppercase text-gold-500 border border-gold-500/30 hover:bg-gold-500/10 transition-colors block"
                >
                  Request Sponsorship Pack
                </a>
                <Link
                  href="/contact"
                  className="w-full py-3 text-center text-xs font-bold tracking-widest uppercase text-slate-400 border border-white/10 hover:text-white hover:border-white/20 transition-colors block"
                >
                  General Enquiries
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
