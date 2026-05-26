import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Events | APRN Africa",
  description: "Conferences, workshops, and technical forums advancing pipeline engineering across Africa.",
};

const events = [
  {
    slug: "apls-morocco-2026",
    title: "Africa Pipeline Leaders Summit — Morocco 2026",
    subtitle: "The continent's premier gathering for pipeline engineers, policymakers, and investors",
    dates: "October 2026",
    location: "Marrakech, Morocco",
    type: "Summit",
    typeColor: "text-gold-500 border-gold-500/30",
    status: "Registration Opening Soon",
    statusColor: "text-gold-500 bg-gold-500/10 border-gold-500/20",
    attendees: "600+",
    image: "/images/hero-pipeline.jpg",
    tags: ["Pipeline Integrity", "Policy", "Renewable Energy", "Finance", "Training"],
    featured: true,
  },
  {
    slug: null,
    title: "West Africa Pipeline Integrity Workshop",
    subtitle: "Hands-on masterclass for integrity engineers",
    dates: "Q3 2026",
    location: "Accra, Ghana",
    type: "Workshop",
    typeColor: "text-emerald-400 border-emerald-400/30",
    status: "Coming Soon",
    statusColor: "text-slate-400 bg-navy-900 border-white/10",
    attendees: "80",
    image: null,
    tags: ["Pipeline Integrity", "Corrosion", "In-Line Inspection"],
    featured: false,
  },
  {
    slug: null,
    title: "APRN Annual Policy Dialogue",
    subtitle: "Regulators, ministers, and industry leaders at one table",
    dates: "Q4 2026",
    location: "Nairobi, Kenya",
    type: "Policy Forum",
    typeColor: "text-blue-400 border-blue-400/30",
    status: "Coming Soon",
    statusColor: "text-slate-400 bg-navy-900 border-white/10",
    attendees: "120",
    image: null,
    tags: ["Regulation", "Policy", "Cross-Border Infrastructure"],
    featured: false,
  },
];

export default function EventsPage() {
  return (
    <>
      <Navigation />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-20 bg-navy-900 overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "linear-gradient(rgba(212,160,23,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,0.15) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>
        <div className="relative max-w-360 mx-auto px-6 md:px-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-gold-500/30 bg-gold-500/5 mb-6">
            <i className="fa-solid fa-calendar-days text-gold-500 text-xs" />
            <span className="text-xs font-bold tracking-widest text-gold-500 uppercase">Events & Conferences</span>
          </div>
          <h1
            className="text-5xl md:text-6xl font-bold text-white mb-5 leading-tight"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Where Africa&apos;s Pipeline<br />
            <span className="text-gold-500">Leaders Convene</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl leading-relaxed border-l-2 border-gold-500/50 pl-5">
            Technical conferences, policy dialogues, and hands-on workshops bringing together
            engineers, regulators, and investors from across the continent.
          </p>
        </div>
      </section>

      {/* ── Events list ──────────────────────────────────────────── */}
      <section className="bg-navy-900 py-16">
        <div className="max-w-360 mx-auto px-6 md:px-12 flex flex-col gap-6">

          {/* Section header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-5">
            <h2
              className="text-xl font-bold text-white"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Upcoming Events
            </h2>
            <div className="flex gap-2">
              {["All", "Conference", "Workshop", "Forum"].map((f, i) => (
                <button
                  key={f}
                  className={`px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-colors ${
                    i === 0
                      ? "bg-gold-500 text-navy-900"
                      : "border border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Featured event */}
          {events.filter((e) => e.featured).map((event) => (
            <div
              key={event.title}
              className="bg-navy-800 border border-white/5 border-t-2 border-t-gold-500 overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-5">
                {/* Image */}
                <div className="lg:col-span-2 relative h-56 lg:h-auto min-h-48 overflow-hidden">
                  <Image
                    src={event.image!}
                    alt={event.title}
                    fill
                    className="object-cover opacity-40"
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-transparent to-navy-800" />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 border text-[9px] font-bold tracking-widest uppercase ${event.typeColor}`}>
                      {event.type}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-3 p-8 flex flex-col gap-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 border text-[9px] font-bold tracking-widest uppercase mb-3 ${event.statusColor}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                        {event.status}
                      </span>
                      <h3
                        className="text-2xl font-bold text-white mb-1"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                      >
                        {event.title}
                      </h3>
                      <p className="text-sm text-slate-400">{event.subtitle}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-navy-900 border border-white/5 flex items-center justify-center shrink-0">
                        <i className="fa-solid fa-calendar text-gold-500 text-xs" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Dates</p>
                        <p className="text-white text-xs font-medium">{event.dates}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-navy-900 border border-white/5 flex items-center justify-center shrink-0">
                        <i className="fa-solid fa-location-dot text-gold-500 text-xs" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Venue</p>
                        <p className="text-white text-xs font-medium">{event.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-navy-900 border border-white/5 flex items-center justify-center shrink-0">
                        <i className="fa-solid fa-users text-gold-500 text-xs" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Expected</p>
                        <p className="text-white text-xs font-medium">{event.attendees} attendees</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-navy-900 border border-white/5 text-[9px] font-bold tracking-widest text-slate-400 uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-2 border-t border-white/5">
                    <Link
                      href={`/events/${event.slug}`}
                      className="px-6 py-3 bg-gold-500 text-navy-900 text-xs font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors"
                    >
                      View Summit
                    </Link>
                    <Link
                      href={`/events/${event.slug}#register`}
                      className="px-6 py-3 border border-gold-500/30 text-gold-500 text-xs font-bold tracking-widest uppercase hover:bg-gold-500/10 transition-colors"
                    >
                      Express Interest
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Upcoming smaller events */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
            {events.filter((e) => !e.featured).map((event) => (
              <div
                key={event.title}
                className="bg-navy-800 border border-white/5 p-6 flex flex-col gap-4 hover:border-gold-500/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`px-2 py-0.5 border text-[9px] font-bold tracking-widest uppercase ${event.typeColor}`}>
                    {event.type}
                  </span>
                  <span className={`px-2 py-0.5 border text-[9px] font-bold tracking-widest uppercase ${event.statusColor}`}>
                    {event.status}
                  </span>
                </div>

                <div>
                  <h3
                    className="text-lg font-bold text-white mb-1"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    {event.title}
                  </h3>
                  <p className="text-xs text-slate-400">{event.subtitle}</p>
                </div>

                <div className="flex flex-col gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-2">
                    <i className="fa-solid fa-calendar text-gold-500 text-[10px] w-4" />
                    {event.dates}
                  </span>
                  <span className="flex items-center gap-2">
                    <i className="fa-solid fa-location-dot text-gold-500 text-[10px] w-4" />
                    {event.location}
                  </span>
                </div>

                <button
                  disabled
                  className="w-full py-2.5 text-center text-[10px] font-bold tracking-widest uppercase text-slate-500 border border-white/5 cursor-not-allowed"
                >
                  Registration Opening Soon
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA strip ────────────────────────────────────────────── */}
      <section className="bg-navy-800 border-t border-white/5 py-16">
        <div className="max-w-360 mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3
              className="text-2xl font-bold text-white mb-2"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Interested in hosting or sponsoring?
            </h3>
            <p className="text-sm text-slate-400">
              Partner with APRN to reach Africa&apos;s most senior pipeline engineering community.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 px-8 py-4 bg-gold-500 text-navy-900 text-xs font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors"
          >
            Get In Touch
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
