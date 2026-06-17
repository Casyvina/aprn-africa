import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { sanityFetch } from "@/lib/sanity/fetch";
import { EVENTS_QUERY, EVENT_DETAIL_QUERY, type EventCard, type EventDetail } from "@/lib/queries/events";

export async function generateStaticParams() {
  const events = await sanityFetch<EventCard[]>(EVENTS_QUERY, {}, ["event"]);
  return (events ?? []).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await sanityFetch<EventDetail | null>(EVENT_DETAIL_QUERY, { slug }, ["event"]);
  if (!event) return { title: "Event Not Found | APRN Africa" };
  return {
    title: `${event.title} | APRN Africa`,
    description: event.description ?? event.subtitle,
  };
}

function formatDateRange(start: string, end?: string) {
  const s = new Date(start);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  if (!end) return s.toLocaleDateString("en-GB", opts);
  const e = new Date(end);
  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
    return `${s.getDate()}–${e.getDate()} ${s.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`;
  }
  return `${s.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${e.toLocaleDateString("en-GB", opts)}`;
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  published:    { label: "Registration Open",  color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" },
  coming_soon:  { label: "Coming Soon",         color: "text-gold-500 border-gold-500/30 bg-gold-500/10" },
  completed:    { label: "Completed",           color: "text-slate-400 border-white/10 bg-white/5" },
  cancelled:    { label: "Cancelled",           color: "text-red-400 border-red-400/30 bg-red-400/10" },
};

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await sanityFetch<EventDetail | null>(EVENT_DETAIL_QUERY, { slug }, ["event"]);
  if (!event) notFound();

  const dateRange = formatDateRange(event.startDate, event.endDate);
  const status = STATUS_LABEL[event.status] ?? STATUS_LABEL.coming_soon;
  const hasSpeakers = event.speakers?.length > 0;
  const hasAgenda = event.agendaItems?.length > 0;
  const hasSponsors = event.sponsors?.length > 0;

  return (
    <>
      <Navigation />
      <main className="bg-navy-900 text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="relative min-h-[80vh] flex items-end overflow-hidden">
          {event.coverImage?.asset?.url ? (
            <Image
              src={event.coverImage.asset.url}
              alt={event.coverImage.alt ?? event.title}
              fill
              className="object-cover object-center"
              priority
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at 30% 60%, rgba(212,160,23,0.12) 0%, transparent 60%), linear-gradient(160deg, #071B2A 0%, #0D2436 100%)" }}
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-navy-900 via-navy-900/60 to-transparent" />

          <div className="relative z-10 w-full max-w-360 mx-auto px-6 lg:px-12 pb-20 pt-40">
            {/* Tags */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 border ${status.color}`}>
                {status.label}
              </span>
              {event.eventType && (
                <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 border border-white/10 text-slate-400">
                  {event.eventType.replace(/_/g, " ")}
                </span>
              )}
            </div>

            <h1
              className="text-5xl md:text-7xl font-bold leading-tight mb-6 max-w-4xl"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {event.title}
            </h1>
            {event.subtitle && (
              <p className="text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">{event.subtitle}</p>
            )}

            <div className="flex items-center gap-6 flex-wrap mb-10">
              <div className="flex items-center gap-2 text-slate-300">
                <i className="fa-solid fa-calendar text-gold-500 text-sm" />
                <span className="text-sm font-medium">{dateRange}</span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2 text-slate-300">
                  <i className="fa-solid fa-location-dot text-gold-500 text-sm" />
                  <span className="text-sm font-medium">{event.location}</span>
                </div>
              )}
              {event.expectedAttendees && (
                <div className="flex items-center gap-2 text-slate-300">
                  <i className="fa-solid fa-users text-gold-500 text-sm" />
                  <span className="text-sm font-medium">{event.expectedAttendees.toLocaleString()}+ expected</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              {event.registrationUrl ? (
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold uppercase tracking-widest text-sm transition-colors"
                >
                  {event.isFree ? "Register — Free" : event.priceUSD ? `Register — $${event.priceUSD.toLocaleString()}` : "Register Now"}
                </a>
              ) : (
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold uppercase tracking-widest text-sm transition-colors"
                >
                  Enquire About Registration
                </Link>
              )}
              <Link
                href="/events"
                className="px-8 py-4 border border-gold-500/30 text-gold-500 hover:bg-gold-500/10 font-bold uppercase tracking-widest text-sm transition-colors"
              >
                ← All Events
              </Link>
            </div>
          </div>
        </section>

        {/* ── Event Details Strip ────────────────────────────────────── */}
        <section className="border-t border-b border-white/5 bg-navy-800/50">
          <div className="max-w-360 mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-3">Dates &amp; Schedule</p>
              <p className="text-white font-semibold mb-1">{dateRange}</p>
              {event.timezone && <p className="text-sm text-slate-400">{event.timezone}</p>}
            </div>
            {event.location && (
              <div>
                <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-3">Venue</p>
                <p className="text-white font-semibold mb-1">{event.location}</p>
                {event.venueUrl && (
                  <a href={event.venueUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-gold-500 hover:text-gold-400 transition-colors">
                    View on map →
                  </a>
                )}
              </div>
            )}
            <div>
              <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-3">Expected Attendance</p>
              {event.expectedAttendees ? (
                <p className="text-white font-semibold">{event.expectedAttendees.toLocaleString()}+ participants</p>
              ) : (
                <p className="text-slate-400 text-sm">Details to follow</p>
              )}
              {event.countries?.length > 0 && (
                <p className="text-sm text-slate-400 mt-1">{event.countries.map((c) => c.name).join(", ")}</p>
              )}
            </div>
          </div>
        </section>

        {/* ── About / Description ───────────────────────────────────── */}
        {event.description && (
          <section className="max-w-360 mx-auto px-6 lg:px-12 py-20">
            <div className="max-w-3xl">
              <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-6">About This Event</p>
              <p
                className="text-xl text-slate-300 leading-relaxed"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                {event.description}
              </p>
            </div>
          </section>
        )}

        {/* ── Keynote Speakers ──────────────────────────────────────── */}
        {hasSpeakers && (
          <section className="border-t border-white/5 py-24 px-6 lg:px-12">
            <div className="max-w-360 mx-auto">
              <div className="mb-16">
                <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-3">Keynote Speakers</p>
                <h2
                  className="text-4xl md:text-5xl font-bold text-white"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  Featured <span className="italic text-gold-500">Speakers</span>
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {event.speakers.map((speaker) => (
                  <div key={speaker._id} className="group">
                    <div className="relative aspect-[3/4] bg-navy-800 overflow-hidden mb-4">
                      {speaker.photoUrl ? (
                        <Image
                          src={speaker.photoUrl}
                          alt={speaker.name}
                          fill
                          className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span
                            className="text-4xl font-bold text-gold-500/30"
                            style={{ fontFamily: "var(--font-playfair), serif" }}
                          >
                            {speaker.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-navy-900/80 to-transparent" />
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-gold-400 transition-colors">{speaker.name}</h3>
                    {speaker.title && <p className="text-xs text-gold-500 mt-0.5">{speaker.title}</p>}
                    {speaker.organisation && <p className="text-xs text-slate-500 mt-0.5">{speaker.organisation}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Agenda ────────────────────────────────────────────────── */}
        {hasAgenda && (
          <section className="border-t border-white/5 py-24 px-6 lg:px-12 bg-navy-800/20">
            <div className="max-w-360 mx-auto">
              <div className="mb-16">
                <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-3">Programme</p>
                <h2
                  className="text-4xl md:text-5xl font-bold text-white"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  Agenda <span className="italic text-gold-500">Highlights</span>
                </h2>
              </div>
              <div className="flex flex-col gap-0 border-l-2 border-gold-500/20 ml-4">
                {event.agendaItems.map((item, i) => (
                  <div key={i} className="relative pl-8 pb-10 group">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 border-2 border-gold-500/40 bg-navy-900 group-hover:border-gold-500 transition-colors" />
                    {item.time && (
                      <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-1">{item.time}</p>
                    )}
                    <h3 className="text-base font-semibold text-white mb-1">{item.title}</h3>
                    {item.description && <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>}
                    {item.speaker && (
                      <p className="text-xs text-slate-500 mt-2">
                        <i className="fa-solid fa-user text-[9px] mr-1" />
                        {item.speaker.name}{item.speaker.title ? ` · ${item.speaker.title}` : ""}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Partners / Sponsors ───────────────────────────────────── */}
        {hasSponsors && (
          <section className="border-t border-white/5 py-20 px-6 lg:px-12">
            <div className="max-w-360 mx-auto">
              <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-8 text-center">Supporting Partners</p>
              <div className="flex items-center justify-center gap-10 flex-wrap">
                {event.sponsors.map((s) => (
                  <div key={s._id} className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
                    {s.logoUrl ? (
                      <Image src={s.logoUrl} alt={s.name} width={120} height={40} className="h-8 w-auto object-contain" />
                    ) : (
                      <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">{s.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Registration CTA ──────────────────────────────────────── */}
        <section className="border-t border-white/5 py-32 px-6 lg:px-12 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(212,160,23,0.06) 0%, transparent 70%)" }}
          />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-6">Secure Your Place</p>
            <h2
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {event.status === "completed" ? "View Event Archive" : "Register for"}{" "}
              <span className="italic text-gold-500">{event.title}</span>
            </h2>
            {event.description && (
              <p className="text-slate-400 mb-10 text-lg leading-relaxed max-w-xl mx-auto">
                {event.description.slice(0, 160)}{event.description.length > 160 ? "…" : ""}
              </p>
            )}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {event.registrationUrl ? (
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-10 py-4 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold uppercase tracking-widest text-sm transition-colors"
                >
                  {event.status === "completed" ? "View Materials" : "Register Now"}
                </a>
              ) : (
                <Link
                  href="/contact"
                  className="px-10 py-4 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold uppercase tracking-widest text-sm transition-colors"
                >
                  Sponsorship Enquiry
                </Link>
              )}
              <Link
                href="/contact"
                className="px-10 py-4 border border-gold-500/30 text-gold-500 hover:bg-gold-500/10 font-bold uppercase tracking-widest text-sm transition-colors"
              >
                Contact Secretariat
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
