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

const TYPE_COLOR: Record<string, string> = {
  summit:     "text-gold-500 border-gold-500/40 bg-gold-500/10",
  conference: "text-gold-500 border-gold-500/40 bg-gold-500/10",
  workshop:   "text-emerald-400 border-emerald-400/40 bg-emerald-400/10",
  webinar:    "text-sky-400 border-sky-400/40 bg-sky-400/10",
  forum:      "text-blue-400 border-blue-400/40 bg-blue-400/10",
  community:  "text-purple-400 border-purple-400/40 bg-purple-400/10",
};

function formatDate(startDate: string, endDate?: string): string {
  const start = new Date(startDate);
  const opts: Intl.DateTimeFormatOptions = { month: "long", year: "numeric", day: "numeric" };
  if (!endDate) return start.toLocaleDateString("en-GB", opts);
  const end = new Date(endDate);
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()}–${end.getDate()} ${start.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`;
  }
  return `${start.toLocaleDateString("en-GB", opts)} – ${end.toLocaleDateString("en-GB", opts)}`;
}

function EventCard({ ev }: { ev: EventCard }) {
  const isOpen = ev.status === "published";
  const typeColor = TYPE_COLOR[ev.eventType] ?? "text-gold-500 border-gold-500/40 bg-gold-500/10";
  const expressInterestHref = `mailto:info@aprn-africa.org?subject=Interest in ${encodeURIComponent(ev.title)}`;

  return (
    <div className="bg-navy-800 border border-white/5 overflow-hidden flex flex-col hover:border-gold-500/30 transition-all duration-300 group">

      {/* Cover image */}
      <div className="relative aspect-video overflow-hidden bg-navy-900 shrink-0">
        {ev.coverImage?.asset?.url ? (
          <>
            <Image
              src={ev.coverImage.asset.url}
              alt={ev.coverImage.alt ?? ev.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-navy-900/80 via-navy-900/20 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-navy-900">
            <i className="fa-solid fa-calendar-days text-5xl text-navy-700" />
          </div>
        )}

        {/* Badges on image */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 border text-[9px] font-bold tracking-widest uppercase backdrop-blur-sm ${typeColor}`}>
            {ev.eventType}
          </span>
        </div>

        {isOpen && (
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 text-[9px] font-bold tracking-widest text-emerald-400 uppercase backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Open
            </span>
          </div>
        )}

        {/* Date bar at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
          <div className="flex items-center gap-2 text-white text-xs font-medium">
            <i className="fa-solid fa-calendar text-gold-500 text-[10px]" />
            {formatDate(ev.startDate, ev.endDate)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-4 flex-1">
        {/* Title */}
        <div>
          <h3
            className="text-lg font-bold text-white leading-snug mb-1 group-hover:text-gold-400 transition-colors"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            {ev.title}
          </h3>
          {ev.subtitle && (
            <p className="text-xs text-slate-400 leading-relaxed">{ev.subtitle}</p>
          )}
        </div>

        {/* Description */}
        {ev.description && (
          <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
            {ev.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex flex-col gap-1.5 text-xs text-slate-500">
          {ev.location && (
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-location-dot text-gold-500/70 text-[10px] w-3.5 text-center" />
              {ev.location}
            </span>
          )}
          {ev.expectedAttendees && (
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-users text-gold-500/70 text-[10px] w-3.5 text-center" />
              {ev.expectedAttendees.toLocaleString()}+ expected attendees
            </span>
          )}
          {ev.isFree ? (
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-ticket text-gold-500/70 text-[10px] w-3.5 text-center" />
              Free to attend
            </span>
          ) : ev.priceUSD ? (
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-ticket text-gold-500/70 text-[10px] w-3.5 text-center" />
              From ${ev.priceUSD.toLocaleString()}
            </span>
          ) : null}
        </div>

        {/* Tags */}
        {ev.tags && ev.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {ev.tags.slice(0, 4).map((t) => (
              <span
                key={t.title}
                className="px-2 py-0.5 bg-navy-900 border border-white/5 text-[9px] font-bold tracking-widest text-slate-500 uppercase"
              >
                {t.title}
              </span>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div className="mt-auto pt-4 border-t border-white/5 flex gap-2.5">
          <Link
            href={`/events/${ev.slug}`}
            className="flex-1 py-2.5 text-center text-[10px] font-bold tracking-widest uppercase transition-colors bg-gold-500 hover:bg-gold-400 text-navy-900"
          >
            View Event
          </Link>
          {isOpen && ev.registrationUrl ? (
            <a
              href={ev.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 text-center text-[10px] font-bold tracking-widest uppercase border border-gold-500/40 text-gold-500 hover:bg-gold-500/10 transition-colors"
            >
              Register Now
            </a>
          ) : (
            <a
              href={expressInterestHref}
              className="flex-1 py-2.5 text-center text-[10px] font-bold tracking-widest uppercase border border-gold-500/40 text-gold-500 hover:bg-gold-500/10 transition-colors"
            >
              Express Interest
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function EventsPage() {
  let events: EventCard[] = [];
  try {
    const fetched = await sanityFetch<EventCard[]>(EVENTS_QUERY, {}, ["events", "event"]);
    if (fetched?.length) events = fetched;
  } catch { /* show empty state if Sanity unavailable */ }

  // Open registration first, then coming soon — each group by date
  const open = events.filter((e) => e.status === "published");
  const soon = events.filter((e) => e.status !== "published");

  return (
    <>
      <Navigation />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-24 bg-navy-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,160,23,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,0.15) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
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

          {open.length > 0 && (
            <div className="mt-8 flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-sm text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {open.length} event{open.length !== 1 ? "s" : ""} open for registration
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="bg-navy-900 pb-20">
        <div className="max-w-360 mx-auto px-6 md:px-12 flex flex-col gap-14">

          {/* ── Open Registration ─────────────────────────────── */}
          {open.length > 0 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <h2
                    className="text-xl font-bold text-white"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    Open Registration
                  </h2>
                </div>
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                  {open.length} event{open.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {open.map((ev) => <EventCard key={ev._id} ev={ev} />)}
              </div>
            </div>
          )}

          {/* ── Coming Soon ───────────────────────────────────── */}
          {soon.length > 0 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2.5">
                  <i className="fa-regular fa-clock text-gold-500 text-sm" />
                  <h2
                    className="text-xl font-bold text-white"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    Coming Soon
                  </h2>
                </div>
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-[10px] font-bold tracking-widest text-gold-500 uppercase">
                  {soon.length} upcoming
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {soon.map((ev) => <EventCard key={ev._id} ev={ev} />)}
              </div>
            </div>
          )}

          {/* Empty state */}
          {events.length === 0 && (
            <div className="py-24 text-center">
              <i className="fa-solid fa-calendar-xmark text-4xl text-slate-700 mb-4 block" />
              <p className="text-slate-400 text-lg font-semibold mb-2">No upcoming events scheduled</p>
              <p className="text-slate-500 text-sm">Check back soon — new events are added regularly.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA strip ─────────────────────────────────────────── */}
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
