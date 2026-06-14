import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MembershipTierCards from "@/components/MembershipTierCards";

export const metadata = {
  title: "Membership | APRN — African Pipeline Resource Network",
  description:
    "Join Africa's first dedicated pipeline research, training, and advocacy network. Student, professional, corporate, and founding membership available.",
};

const plans = [
  { name: "Student", naira: "₦10,000", usd: "~$6", tagline: "Engineering & petroleum students", note: "Valid student ID required", color: "text-emerald-400" },
  { name: "Graduate", naira: "₦25,000", usd: "~$15", tagline: "Engineers 0–5 yrs post-graduation", note: "NSC/NYSC certificate required", color: "text-blue-400" },
  { name: "Professional", naira: "₦50,000", usd: "~$30", tagline: "Practising pipeline engineers", note: "COREN registration preferred", color: "text-gold-500", featured: true },
  { name: "Associate", naira: "₦35,000", usd: "~$20", tagline: "Regulators, consultants & lawyers", note: "Non-engineers in the sector", color: "text-purple-400" },
  { name: "Corporate", naira: "₦500,000", usd: "~$300", tagline: "Companies & organisations", note: "Up to 5 staff passes", color: "text-copper-500" },
  { name: "International", naira: "$50 USD", usd: "$50", tagline: "Africa diaspora & global allies", note: "PayPal / LemonSqueezy", color: "text-slate-300" },
];

const benefits = [
  { icon: "fa-newspaper", title: "Monthly Intelligence Digest", desc: "The Africa Pipeline Report — the continent's leading pipeline industry publication, delivered monthly." },
  { icon: "fa-chalkboard-user", title: "Bi-monthly Webinars", desc: "Access to expert-led sessions on pipeline integrity, policy, renewable integration, and project finance." },
  { icon: "fa-database", title: "Industry Database", desc: "Full access to APRN's research archive — 400+ technical papers, policy briefs, and industry reports." },
  { icon: "fa-network-wired", title: "Engineer Network", desc: "Connect with pipeline professionals across Nigeria, West Africa, and the continent's diaspora." },
  { icon: "fa-graduation-cap", title: "Training Discounts", desc: "10–30% off EITEP-certified pipeline training programmes and APRN workshops." },
  { icon: "fa-plane", title: "APLS Summit Access", desc: "Discounted (and for founding members, free) tickets to the Africa Pipeline Leadership Summit in Morocco." },
];

export default function MembershipPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-navy-900 text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>

        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="relative pt-36 pb-24 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(212,160,23,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,0.6) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
          <div className="max-w-360 mx-auto px-6 md:px-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-500/8 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
              <span className="text-[11px] font-bold text-gold-500 uppercase tracking-widest">
                Founding Window Open · 2026
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] mb-6 max-w-4xl"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Join Africa&apos;s Pipeline<br />
              <span className="text-gold-500">Resource Network</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mb-10 leading-relaxed border-l-2 border-gold-500/50 pl-6">
              APRN is Africa&apos;s first dedicated pipeline research, training, and advocacy network.
              As a founding member, you are not just joining an organisation — you are helping to
              build the institution that will shape Africa&apos;s pipeline engineering landscape for decades.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#plans"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(212,160,23,0.25)]"
              >
                View Membership Plans
                <i className="fa-solid fa-arrow-down text-xs" />
              </a>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/10 hover:border-gold-500/30 text-slate-300 hover:text-white font-medium transition-all"
              >
                Already a member? Sign in
              </Link>
            </div>
          </div>
        </section>

        {/* ── Why join ──────────────────────────────────────────── */}
        <section className="py-20 border-t border-white/5">
          <div className="max-w-360 mx-auto px-6 md:px-12">
            <div className="mb-12">
              <p className="text-[11px] font-bold tracking-widest text-gold-500 uppercase mb-3">Member Benefits</p>
              <h2
                className="text-3xl md:text-4xl font-bold text-white"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                What you get as an APRN member
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {benefits.map((b) => (
                <div key={b.title} className="bg-navy-800 border border-white/5 p-6 hover:border-gold-500/20 transition-colors group">
                  <div className="w-10 h-10 bg-navy-900 border border-white/5 flex items-center justify-center mb-4 group-hover:border-gold-500/20 transition-colors">
                    <i className={`fa-solid ${b.icon} text-gold-500 text-sm`} />
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-2">{b.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Plans ─────────────────────────────────────────────── */}
        <section id="plans" className="py-20 border-t border-white/5 scroll-mt-20">
          <div className="max-w-360 mx-auto px-6 md:px-12">
            <div className="mb-12">
              <p className="text-[11px] font-bold tracking-widest text-gold-500 uppercase mb-3">Annual Membership</p>
              <h2
                className="text-3xl md:text-4xl font-bold text-white mb-3"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Membership Categories & Annual Fees
              </h2>
              <p className="text-slate-400 text-sm">
                Nigeria (Naira): Paystack · Bank Transfer · Opay &nbsp;&nbsp;|&nbsp;&nbsp; International (USD): LemonSqueezy · PayPal
              </p>
            </div>

            <MembershipTierCards plans={plans} />
          </div>
        </section>

        {/* ── Founding membership ──────────────────────────────── */}
        <section className="py-20 border-t border-gold-500/10 bg-navy-800/30">
          <div className="max-w-360 mx-auto px-6 md:px-12">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-3">
                <i className="fa-solid fa-star text-gold-500" />
                <p className="text-[11px] font-bold tracking-widest text-gold-500 uppercase">Founding Membership · 2026 Window Only</p>
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Be a Founding Member
              </h2>
              <p className="text-slate-400 max-w-2xl text-sm leading-relaxed">
                A once-in-a-generation opportunity. Founding members pay a one-time fee in exchange for
                permanent recognition, lifetime 50% renewal discounts, and premium access that standard
                membership will never offer. This window closes when founding slots fill.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { name: "Founding Student", naira: "₦25,000", usd: "~$15", perks: "Name in inaugural report · 50% off renewals for life" },
                { name: "Founding Individual", naira: "₦100,000", usd: "~$60", perks: "Name on APRN website · Free APLS summit ticket · 50% off renewals" },
                { name: "Founding Professional", naira: "₦200,000", usd: "~$120", perks: "Featured in APRN publications · Free APLS + training webinars · 50% off renewals", featured: true },
                { name: "Founding Corporate", naira: "₦2,000,000", usd: "~$1,200", perks: "Logo on website & summit banners · 10 staff passes · Board advisory invitation" },
                { name: "Founding Patron", naira: "₦5,000,000", usd: "~$3,000", perks: "Named sponsor of APRN program · Permanent recognition · Full board access" },
              ].map((fp) => (
                <div
                  key={fp.name}
                  className={`relative bg-navy-800 flex flex-col p-6 border transition-all hover:border-gold-500/30 ${
                    fp.featured
                      ? "border-t-2 border-t-gold-500 border border-gold-500/40 shadow-[0_0_25px_rgba(212,160,23,0.08)]"
                      : "border border-white/5"
                  }`}
                >
                  {fp.featured && (
                    <div className="absolute -top-3 left-6">
                      <span className="px-3 py-1 bg-gold-500 text-navy-900 text-[9px] font-bold tracking-widest uppercase">
                        Most Chosen
                      </span>
                    </div>
                  )}
                  <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-3">{fp.name}</p>
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span
                      className="text-2xl font-bold text-white"
                      style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                      {fp.naira}
                    </span>
                    <span className="text-xs text-slate-500">one-time</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-4">{fp.usd} USD equivalent</p>
                  <div className="bg-navy-900/60 border border-gold-500/10 p-3 mb-5 flex-1">
                    <p className="text-[9px] font-bold tracking-widest text-gold-500 uppercase mb-1.5">Perks</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{fp.perks}</p>
                  </div>
                  <a
                    href="mailto:info@aprn-africa.org?subject=Founding Membership Enquiry"
                    className={`w-full py-3 text-center text-[10px] font-bold tracking-widest uppercase transition-colors ${
                      fp.featured
                        ? "bg-gold-500 text-navy-900 hover:bg-gold-400"
                        : "border border-gold-500/30 text-gold-500 hover:bg-gold-500/10"
                    }`}
                  >
                    Enquire Now
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA strip ─────────────────────────────────────────── */}
        <section className="py-16 border-t border-white/5">
          <div className="max-w-360 mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3
                className="text-2xl font-bold text-white mb-2"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Ready to join the network?
              </h3>
              <p className="text-sm text-slate-400">
                Contact us at{" "}
                <a href="mailto:info@aprn-africa.org" className="text-gold-500 hover:text-gold-400 transition-colors">
                  info@aprn-africa.org
                </a>{" "}
                for membership queries, bank transfer details, or group registrations.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                href="/register"
                className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-navy-900 text-xs font-bold tracking-widest uppercase transition-colors shadow-[0_0_16px_rgba(212,160,23,0.2)]"
              >
                Create Account
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 border border-white/10 hover:border-gold-500/30 text-slate-300 hover:text-white text-xs font-bold tracking-widest uppercase transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
