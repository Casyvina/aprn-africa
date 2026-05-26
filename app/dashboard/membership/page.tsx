import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "Membership | APRN" };

const regularPlans = [
  {
    key: "student",
    name: "Student Member",
    naira: "₦10,000",
    usd: "~$6",
    tagline: "Engineering & petroleum students",
    note: "Valid student ID required",
    color: "text-emerald-400",
    featured: false,
    features: ["Monthly APRN newsletter", "Bi-monthly webinars", "WIMEE Africa programme", "Digital Africa Pipeline Report"],
    paystack: true,
  },
  {
    key: "graduate",
    name: "Graduate Member",
    naira: "₦25,000",
    usd: "~$15",
    tagline: "Engineers 0–5 years post-graduation",
    note: "NSC/NYSC certificate required",
    color: "text-blue-400",
    featured: false,
    features: ["Monthly APRN newsletter", "Bi-monthly webinars", "Industry database access", "Africa Pipeline Report", "10% EITEP training discount"],
    paystack: true,
  },
  {
    key: "professional",
    name: "Professional Member",
    naira: "₦50,000",
    usd: "~$30",
    tagline: "Practising pipeline engineers",
    note: "COREN registration preferred",
    color: "text-gold-500",
    featured: true,
    badge: "Most Popular",
    features: ["Monthly APRN newsletter", "Bi-monthly webinars", "Industry database access", "Africa Pipeline Report", "APLS summit (discounted)", "10% EITEP training discount"],
    paystack: true,
  },
  {
    key: "associate",
    name: "Associate Member",
    naira: "₦35,000",
    usd: "~$20",
    tagline: "Regulators, consultants & lawyers",
    note: "Non-engineers in the sector",
    color: "text-purple-400",
    featured: false,
    features: ["Monthly APRN newsletter", "Bi-monthly webinars", "Industry database access", "Africa Pipeline Report", "20% EITEP training discount"],
    paystack: true,
  },
  {
    key: "corporate",
    name: "Corporate Member",
    naira: "₦500,000",
    usd: "~$300",
    tagline: "Companies & organisations",
    note: "Up to 5 staff passes per annum",
    color: "text-copper-500",
    featured: false,
    features: ["5 staff passes", "Logo on APRN website", "APLS summit (discounted)", "20% EITEP discount", "Industry database (all staff)", "Africa Pipeline Report (printed)"],
    paystack: true,
  },
  {
    key: "international",
    name: "International Member",
    naira: "$50 USD",
    usd: "$50",
    tagline: "Africa diaspora & global allies",
    note: "LemonSqueezy · PayPal",
    color: "text-slate-300",
    featured: false,
    features: ["Monthly APRN newsletter", "Bi-monthly webinars", "Industry database access", "Africa Pipeline Report", "10% EITEP training discount"],
    paystack: false,
  },
];

const foundingPlans = [
  {
    key: "founding-student",
    name: "Founding Student",
    naira: "₦25,000",
    usd: "~$15",
    featured: false,
    perks: "Name in inaugural report · 50% off renewals for life",
  },
  {
    key: "founding-individual",
    name: "Founding Individual",
    naira: "₦100,000",
    usd: "~$60",
    featured: false,
    perks: "Name on APRN website · Free APLS summit ticket · 50% off renewals",
  },
  {
    key: "founding-professional",
    name: "Founding Professional",
    naira: "₦200,000",
    usd: "~$120",
    featured: true,
    perks: "Featured in APRN publications · Free APLS + training webinars · 50% off renewals",
  },
  {
    key: "founding-corporate",
    name: "Founding Corporate",
    naira: "₦2,000,000",
    usd: "~$1,200",
    featured: false,
    perks: "Logo on website & summit banners · 10 staff passes · Board advisory invitation",
  },
  {
    key: "founding-patron",
    name: "Founding Patron",
    naira: "₦5,000,000",
    usd: "~$3,000",
    featured: false,
    perks: "Named sponsor of APRN program · Permanent recognition · Full board access",
  },
];

const comparison = [
  { benefit: "APRN Membership Card",     student: "✓", individual: "✓ Gold", corporate: "✓ Gold", founding: "✓ Gold Edition" },
  { benefit: "Monthly Newsletter",       student: "✓", individual: "✓",      corporate: "✓",      founding: "✓" },
  { benefit: "Bi-monthly Webinars",      student: "✓", individual: "✓",      corporate: "✓ + Speaker slot", founding: "✓ + Speaker slot" },
  { benefit: "Industry Database",        student: "—", individual: "✓",      corporate: "✓ Full", founding: "✓ Full" },
  { benefit: "Africa Pipeline Report",   student: "Digital", individual: "✓", corporate: "✓ Printed", founding: "✓ Printed" },
  { benefit: "APLS Morocco Summit",      student: "—", individual: "Discounted", corporate: "✓ Free", founding: "✓ Free" },
  { benefit: "EITEP Training Discount",  student: "—", individual: "10%",    corporate: "20%",    founding: "30% off" },
  { benefit: "Name on APRN Website",     student: "—", individual: "—",      corporate: "Logo",   founding: "✓ Permanent" },
  { benefit: "Renewal Discount",         student: "—", individual: "—",      corporate: "—",      founding: "50% for life" },
  { benefit: "Board Advisory Access",    student: "—", individual: "—",      corporate: "—",      founding: "✓ Invitation" },
  { benefit: "Featured in Publications", student: "—", individual: "—",      corporate: "—",      founding: "✓" },
];

export default async function MembershipPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("membership_tier")
    .eq("id", user.id)
    .single();

  const currentTier = profile?.membership_tier ?? "free";

  return (
    <div className="flex flex-col gap-10 max-w-[1100px]">

      {/* ── Status banner ─────────────────────────────────────────── */}
      <div className="bg-navy-800 border border-white/5 border-l-4 border-l-gold-500 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-shield-halved text-gold-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-1">Current Status</p>
            <p className="text-white font-semibold capitalize">{currentTier} Account</p>
          </div>
        </div>
        {currentTier === "free" ? (
          <p className="text-sm text-slate-400 max-w-sm">
            Join as a member to unlock research, training, the engineer network, and full platform access.
          </p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">Membership Active</span>
          </div>
        )}
      </div>

      {/* ── Founding window urgency ───────────────────────────────── */}
      <div className="relative bg-navy-800 border border-gold-500/30 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-gold-500/5 to-transparent pointer-events-none" />
        <div className="relative p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-10 h-10 bg-gold-500/15 border border-gold-500/30 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-star text-gold-500" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-1">
              Founding Member Window — 2026 Only
            </p>
            <p className="text-sm text-white font-semibold mb-1">
              Be part of building Africa&apos;s pipeline future from the ground up.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Founding membership closes when slots fill. Founding members receive permanent recognition,
              lifetime 50% renewal discount, and premium access no standard member will ever receive.
            </p>
          </div>
          <a
            href="#founding"
            className="shrink-0 px-5 py-2.5 bg-gold-500 text-navy-900 text-xs font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors whitespace-nowrap"
          >
            View Founding Plans
          </a>
        </div>
      </div>

      {/* ── Annual membership plans ───────────────────────────────── */}
      <section className="flex flex-col gap-6">
        <div className="border-b border-white/5 pb-4">
          <h3
            className="text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Annual Membership
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Renews annually. Nigeria — Paystack · Bank Transfer · Opay. &nbsp; International — LemonSqueezy · PayPal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {regularPlans.map((plan) => (
            <div
              key={plan.key}
              className={`relative bg-navy-800 flex flex-col p-6 border transition-all hover:border-gold-500/20 ${
                plan.featured
                  ? "border-t-2 border-t-gold-500 border border-gold-500/30 shadow-[0_0_25px_rgba(212,160,23,0.06)]"
                  : "border border-white/5"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-6">
                  <span className="px-3 py-1 bg-gold-500 text-navy-900 text-[9px] font-bold tracking-widest uppercase">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-5">
                <p className={`text-[10px] font-bold tracking-widest uppercase mb-2 ${plan.color}`}>
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    {plan.naira}
                  </span>
                  <span className="text-xs text-slate-500">/year</span>
                </div>
                <p className="text-xs text-slate-400">{plan.tagline}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 italic">{plan.note}</p>
              </div>

              <ul className="flex flex-col gap-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-slate-400">
                    <i className="fa-solid fa-check text-gold-500 text-[10px] mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {plan.paystack ? (
                <button
                  disabled
                  className="w-full py-2.5 text-[10px] font-bold tracking-widest uppercase bg-navy-900 border border-white/10 text-slate-500 cursor-not-allowed"
                >
                  Pay via Paystack — Coming Soon
                </button>
              ) : (
                <a
                  href="mailto:info@aprn-africa.org?subject=International Membership Enquiry"
                  className="w-full py-2.5 text-center text-[10px] font-bold tracking-widest uppercase text-gold-500 border border-gold-500/30 hover:bg-gold-500/10 transition-colors"
                >
                  Enquire — International
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Founding membership ───────────────────────────────────── */}
      <section id="founding" className="flex flex-col gap-6 scroll-mt-8">
        <div className="border-b border-gold-500/20 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <i className="fa-solid fa-star text-gold-500 text-sm" />
            <h3
              className="text-xl font-bold text-white"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Founding Membership
            </h3>
            <span className="px-2 py-0.5 bg-gold-500/10 border border-gold-500/30 text-[9px] font-bold tracking-widest text-gold-500 uppercase">
              2026 Only
            </span>
          </div>
          <p className="text-sm text-slate-400">
            One-time joining fee. Founding members pay more now in exchange for permanent recognition and
            lifetime benefits that standard membership will never offer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {foundingPlans.map((plan) => (
            <div
              key={plan.key}
              className={`relative bg-navy-800 flex flex-col p-6 border transition-all hover:border-gold-500/30 ${
                plan.featured
                  ? "border-t-2 border-t-gold-500 border border-gold-500/40 shadow-[0_0_25px_rgba(212,160,23,0.08)]"
                  : "border border-white/5"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-6">
                  <span className="px-3 py-1 bg-gold-500 text-navy-900 text-[9px] font-bold tracking-widest uppercase">
                    Most Chosen
                  </span>
                </div>
              )}

              <div className="mb-4">
                <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-2">
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    {plan.naira}
                  </span>
                  <span className="text-xs text-slate-500">one-time</span>
                </div>
                <p className="text-[10px] text-slate-500">{plan.usd} USD equivalent</p>
              </div>

              <div className="flex-1 mb-5">
                <div className="bg-navy-900/60 border border-gold-500/10 p-3">
                  <p className="text-[9px] font-bold tracking-widest text-gold-500 uppercase mb-1.5">
                    Founding Perks
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">{plan.perks}</p>
                </div>
              </div>

              <a
                href="mailto:info@aprn-africa.org?subject=Founding Membership Enquiry"
                className={`w-full py-2.5 text-center text-[10px] font-bold tracking-widest uppercase transition-colors ${
                  plan.featured
                    ? "bg-gold-500 text-navy-900 hover:bg-gold-400"
                    : "border border-gold-500/30 text-gold-500 hover:bg-gold-500/10"
                }`}
              >
                Enquire Now
              </a>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-slate-500 text-center">
          Founding window open throughout 2026 · Closes when founding slots fill ·{" "}
          <a href="mailto:info@aprn-africa.org" className="text-gold-500 hover:text-gold-400 transition-colors">
            info@aprn-africa.org
          </a>
        </p>
      </section>

      {/* ── Benefits comparison ───────────────────────────────────── */}
      <section className="flex flex-col gap-5">
        <div className="border-b border-white/5 pb-4">
          <h3
            className="text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Member Benefits Comparison
          </h3>
        </div>

        <div className="bg-navy-800 border border-white/5 overflow-x-auto">
          <table className="w-full min-w-[580px]">
            <thead>
              <tr className="bg-navy-900 border-b border-white/10">
                <th className="p-4 text-left text-[10px] font-bold tracking-widest text-slate-400 uppercase w-2/5">
                  Benefit
                </th>
                {["Student / Graduate", "Individual / Professional", "Corporate", "Founding"].map((h) => (
                  <th key={h} className="p-4 text-center text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, i) => (
                <tr
                  key={row.benefit}
                  className={`border-b border-white/5 last:border-0 ${i % 2 === 0 ? "" : "bg-navy-900/20"}`}
                >
                  <td className="p-4 text-xs text-slate-300">{row.benefit}</td>
                  {[row.student, row.individual, row.corporate, row.founding].map((val, j) => (
                    <td key={j} className="p-4 text-center">
                      {val === "—" ? (
                        <span className="text-slate-600 text-base leading-none">—</span>
                      ) : val === "✓" ? (
                        <i className="fa-solid fa-check text-gold-500 text-xs" />
                      ) : (
                        <span className="text-[10px] text-slate-400 leading-tight block">{val}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Footer CTA ────────────────────────────────────────────── */}
      <div className="bg-navy-800 border border-white/5 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div>
          <p className="text-white font-semibold mb-1">Questions about membership?</p>
          <p className="text-sm text-slate-400">
            For bank transfers, group registrations, or custom institutional arrangements contact us directly.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Nigeria: Paystack · Bank Transfer · Opay &nbsp;|&nbsp; International: LemonSqueezy · PayPal
          </p>
        </div>
        <Link
          href="/contact"
          className="shrink-0 px-6 py-3 border border-gold-500/40 text-gold-500 text-xs font-bold tracking-widest uppercase hover:bg-gold-500/10 transition-colors"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
