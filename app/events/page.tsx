import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { sanityFetch } from "@/lib/sanity/fetch";
import { EVENTS_QUERY, type EventCard } from "@/lib/queries/events";

export const metadata = {
  title: "Events | APRN Africa",
  description: "Conferences, workshops, and technical forums advancing pipeline engineering across Africa.",
};

const EVENT_TYPE_COLOR: Record<string, string> = {
  summit:     "text-gold-500 border-gold-500/30",
  conference: "text-gold-500 border-gold-500/30",
  workshop:   "text-emerald-400 border-emerald-400/30",
  webinar:    "text-sky-400 border-sky-400/30",
  forum:      "text-blue-400 border-blue-400/30",
  community:  "text-purple-400 border-purple-400/30",
};

const STATUS_COLOR: Record<string, string> = {
  published:   "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  coming_soon: "text-gold-500 bg-gold-500/10 border-gold-500/20",
};

const STATUS_LABEL: Record<string, string> = {
  published:   "Registration Open",
  coming_soon: "Registration Opening Soon",
};

function formatEventDate(startDate: string, endDate?: string, timezone?: string): string {
  const start = new Date(startDate)
  const opts: Intl.DateTimeFormatOptions = { month: "long", year: "numeric", day: "numeric" }
  if (!endDate) return start.toLocaleDateString("en-GB", opts)
  const end = new Date(endDate)
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()}–${end.getDate()} ${start.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`
  }
  return `${start.toLocaleDateString("en-GB", opts)} – ${end.toLocaleDateString("en-GB", opts)}`
}

export default async function EventsPage() {
  let events: EventCard[] = []
  try {
    const fetched = await sanityFetch<EventCard[]>(EVENTS_QUERY, {}, ["event"])
    if (fetched?.length) events = fetched
  } catch { /* show empty state if Sanity unavailable */ }

  const featured = events.find((e) => e.featured)
  const rest = events.filter((e) => !e.featured)

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
          </div>

          {/* Empty state */}
          {events.length === 0 && (
            <div className="py-20 text-center">
              <i className="fa-solid fa-calendar-xmark text-4xl text-slate-600 mb-4 block" />
              <p className="text-slate-400 text-lg font-semibold mb-2">No upcoming events scheduled</p>
              <p className="text-slate-500 text-sm">Check back soon — new events are added regularly.</p>
            </div>
          )}

          {/* Featured event */}
          {featured && (
            <div className="bg-navy-800 border border-white/5 border-t-2 border-t-gold-500 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-5">
                {/* Image */}
                <div className="lg:col-span-2 relative h-56 lg:h-auto min-h-48 overflow-hidden bg-navy-900">
                  {featured.coverImage?.asset?.url ? (
                    <>
                      <Image
                        src={featured.coverImage.asset.url}
                        alt={featured.coverImage.alt ?? featured.title}
                        fill
                        className="object-cover opacity-40"
                      />
                      <div className="absolute inset-0 bg-linear-to-r from-transparent to-navy-800" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <i className="fa-solid fa-calendar-days text-5xl text-navy-700" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 border text-[9px] font-bold tracking-widest uppercase ${EVENT_TYPE_COLOR[featured.eventType] ?? "text-gold-500 border-gold-500/30"}`}>
                      {featured.eventType}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-3 p-8 flex flex-col gap-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 border text-[9px] font-bold tracking-widest uppercase mb-3 ${STATUS_COLOR[featured.status] ?? STATUS_COLOR.coming_soon}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                        {STATUS_LABEL[featured.status] ?? featured.status}
                      </span>
                      <h3
                        className="text-2xl font-bold text-white mb-1"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                      >
                        {featured.title}
                      </h3>
                      {featured.subtitle && <p className="text-sm text-slate-400">{featured.subtitle}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-navy-900 border border-white/5 flex items-center justify-center shrink-0">
                        <i className="fa-solid fa-calendar text-gold-500 text-xs" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Dates</p>
                        <p className="text-white text-xs font-medium">{formatEventDate(featured.startDate, featured.endDate)}</p>
                      </div>
                    </div>
                    {featured.location && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-navy-900 border border-white/5 flex items-center justify-center shrink-0">
                          <i className="fa-solid fa-location-dot text-gold-500 text-xs" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Venue</p>
                          <p className="text-white text-xs font-medium">{featured.location}</p>
                        </div>
                      </div>
                    )}
                    {featured.expectedAttendees && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-navy-900 border border-white/5 flex items-center justify-center shrink-0">
                          <i className="fa-solid fa-users text-gold-500 text-xs" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Expected</p>
                          <p className="text-white text-xs font-medium">{featured.expectedAttendees.toLocaleString()}+ attendees</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {featured.tags && featured.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {featured.tags.map((tag) => (
                        <span
                          key={tag.title}
                          className="px-2 py-0.5 bg-navy-900 border border-white/5 text-[9px] font-bold tracking-widest text-slate-400 uppercase"
                        >
                          {tag.title}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2 border-t border-white/5">
                    <Link
                      href={`/events/${featured.slug}`}
                      className="px-6 py-3 bg-gold-500 text-navy-900 text-xs font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors"
                    >
                      View Event
                    </Link>
                    {featured.registrationUrl ? (
                      <a
                        href={featured.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 border border-gold-500/30 text-gold-500 text-xs font-bold tracking-widest uppercase hover:bg-gold-500/10 transition-colors"
                      >
                        Register
                      </a>
                    ) : (
                      <Link
                        href={`/events/${featured.slug}#register`}
                        className="px-6 py-3 border border-gold-500/30 text-gold-500 text-xs font-bold tracking-widest uppercase hover:bg-gold-500/10 transition-colors"
                      >
                        Express Interest
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Remaining events */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
              {rest.map((ev) => (
                <div
                  key={ev._id}
                  className="bg-navy-800 border border-white/5 p-6 flex flex-col gap-4 hover:border-gold-500/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className={`px-2 py-0.5 border text-[9px] font-bold tracking-widest uppercase ${EVENT_TYPE_COLOR[ev.eventType] ?? "text-gold-500 border-gold-500/30"}`}>
                      {ev.eventType}
                    </span>
                    <span className={`px-2 py-0.5 border text-[9px] font-bold tracking-widest uppercase ${STATUS_COLOR[ev.status] ?? "text-slate-400 bg-navy-900 border-white/10"}`}>
                      {STATUS_LABEL[ev.status] ?? ev.status}
                    </span>
                  </div>

                  <div>
                    <h3
                      className="text-lg font-bold text-white mb-1"
                      style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                      {ev.title}
                    </h3>
                    {ev.subtitle && <p className="text-xs text-slate-400">{ev.subtitle}</p>}
                  </div>

                  <div className="flex flex-col gap-2 text-xs text-slate-400">
                    <span className="flex items-center gap-2">
                      <i className="fa-solid fa-calendar text-gold-500 text-[10px] w-4" />
                      {formatEventDate(ev.startDate, ev.endDate)}
                    </span>
                    {ev.location && (
                      <span className="flex items-center gap-2">
                        <i className="fa-solid fa-location-dot text-gold-500 text-[10px] w-4" />
                        {ev.location}
                      </span>
                    )}
                  </div>

                  {ev.status === "published" ? (
                    <Link
                      href={ev.registrationUrl ?? `/events/${ev.slug}#register`}
                      className="w-full py-2.5 text-center text-[10px] font-bold tracking-widest uppercase text-gold-500 border border-gold-500/30 hover:bg-gold-500/10 transition-colors"
                    >
                      Register Now
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2.5 text-center text-[10px] font-bold tracking-widest uppercase text-slate-500 border border-white/5 cursor-not-allowed"
                    >
                      Registration Opening Soon
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
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
