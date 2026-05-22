import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "Membership | APRN" };

const plans = [
  {
    key: "free",
    name: "Free",
    price: "$0",
    period: "",
    tagline: "Get started with APRN",
    featured: false,
    features: [
      { label: "Public research summaries", included: true },
      { label: "Newsletter subscription", included: true },
      { label: "Event announcements", included: true },
      { label: "Full research archive", included: false },
      { label: "Training catalogue access", included: false },
      { label: "Engineer network", included: false },
      { label: "Priority support", included: false },
    ],
  },
  {
    key: "professional",
    name: "Professional",
    price: "$299",
    period: "/year",
    tagline: "For engineers & researchers",
    featured: true,
    badge: "Most Popular",
    features: [
      { label: "Public research summaries", included: true },
      { label: "Newsletter subscription", included: true },
      { label: "Event announcements", included: true },
      { label: "Full research archive", included: true },
      { label: "Training catalogue access", included: true },
      { label: "Engineer network", included: true },
      { label: "Priority support", included: false },
    ],
  },
  {
    key: "institutional",
    name: "Institutional",
    price: "$1,499",
    period: "/year",
    tagline: "For organisations & universities",
    featured: false,
    features: [
      { label: "Public research summaries", included: true },
      { label: "Newsletter subscription", included: true },
      { label: "Event announcements", included: true },
      { label: "Full research archive", included: true },
      { label: "Training catalogue access", included: true },
      { label: "Engineer network", included: true },
      { label: "Priority support", included: true },
    ],
  },
];

const comparison = [
  { feature: "Public Research Summaries", free: true, professional: true, institutional: true },
  { feature: "Full Research Archive (400+ papers)", free: false, professional: true, institutional: true },
  { feature: "Training Catalogue & Enrolment", free: false, professional: true, institutional: true },
  { feature: "Engineer Network Directory", free: false, professional: true, institutional: true },
  { feature: "Newsletter & Digest Archive", free: true, professional: true, institutional: true },
  { feature: "Priority Support", free: false, professional: false, institutional: true },
  { feature: "Institutional Seats (up to 20)", free: false, professional: false, institutional: true },
  { feature: "API Access", free: false, professional: false, institutional: true },
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
  const tierLabel = currentTier.charAt(0).toUpperCase() + currentTier.slice(1);

  return (
    <div className="flex flex-col gap-10 max-w-[1100px]">

      {/* ── Current plan banner ─────────────────────────────────── */}
      <div className="bg-navy-800 border border-white/5 border-l-4 border-l-gold-500 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-shield-halved text-gold-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-1">Current Plan</p>
            <p className="text-white font-semibold">{tierLabel} Member</p>
          </div>
        </div>
        {currentTier === "free" && (
          <p className="text-sm text-slate-400">
            Upgrade to unlock the full research archive, training catalogue, and engineer network.
          </p>
        )}
        {currentTier !== "free" && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">Active</span>
          </div>
        )}
      </div>

      {/* ── Plan cards ──────────────────────────────────────────── */}
      <section className="flex flex-col gap-5">
        <div className="border-b border-white/5 pb-4">
          <h3
            className="text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Choose Your Plan
          </h3>
          <p className="text-sm text-slate-400 mt-1">Annual billing. Cancel any time.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => {
            const isCurrent = currentTier === plan.key;
            return (
              <div
                key={plan.key}
                className={`relative bg-navy-800 flex flex-col p-7 transition-all ${
                  plan.featured
                    ? "border border-gold-500/50 border-t-2 border-t-gold-500 shadow-[0_0_30px_rgba(212,160,23,0.08)]"
                    : "border border-white/5"
                }`}
              >
                {/* Most popular badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-gold-500 text-navy-900 text-[9px] font-bold tracking-widest uppercase">
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-6">
                  <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-3">
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span
                      className="text-4xl font-bold text-white"
                      style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-slate-400">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{plan.tagline}</p>
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f.label} className="flex items-center gap-3 text-sm">
                      {f.included ? (
                        <i className="fa-solid fa-check text-gold-500 text-xs w-4 shrink-0" />
                      ) : (
                        <i className="fa-solid fa-xmark text-slate-600 text-xs w-4 shrink-0" />
                      )}
                      <span className={f.included ? "text-slate-300" : "text-slate-500"}>
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {isCurrent ? (
                  <div className="w-full py-3 text-center text-xs font-bold tracking-widest uppercase text-slate-500 border border-white/10">
                    Current Plan
                  </div>
                ) : plan.featured ? (
                  <button className="w-full py-3 text-xs font-bold tracking-widest uppercase text-navy-900 bg-gold-500 hover:bg-gold-400 transition-colors">
                    Upgrade to Professional
                  </button>
                ) : plan.key === "institutional" ? (
                  <Link
                    href="/contact"
                    className="w-full py-3 text-center text-xs font-bold tracking-widest uppercase text-gold-500 border border-gold-500/40 hover:bg-gold-500/10 transition-colors"
                  >
                    Contact Us
                  </Link>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Feature comparison table ─────────────────────────────── */}
      <section className="flex flex-col gap-5">
        <div className="border-b border-white/5 pb-4">
          <h3
            className="text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Full Feature Comparison
          </h3>
        </div>

        <div className="bg-navy-800 border border-white/5 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-4 bg-navy-900 border-b border-white/10">
            <div className="p-4 col-span-1" />
            {["Free", "Professional", "Institutional"].map((h) => (
              <div key={h} className="p-4 text-center">
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">{h}</span>
              </div>
            ))}
          </div>

          {comparison.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-4 border-b border-white/5 last:border-0 ${
                i % 2 === 0 ? "bg-transparent" : "bg-navy-900/30"
              }`}
            >
              <div className="p-4 text-sm text-slate-300 col-span-1">{row.feature}</div>
              {([row.free, row.professional, row.institutional] as boolean[]).map((val, j) => (
                <div key={j} className="p-4 flex items-center justify-center">
                  {val ? (
                    <i className="fa-solid fa-check text-gold-500 text-xs" />
                  ) : (
                    <span className="text-slate-600 text-lg leading-none">—</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── Enterprise enquiry ───────────────────────────────────── */}
      <div className="bg-navy-800 border border-white/5 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div>
          <p className="text-white font-semibold mb-1">Need a custom plan?</p>
          <p className="text-sm text-slate-400">
            Multi-seat licensing, API access, and bespoke training programmes for large organisations.
          </p>
        </div>
        <Link
          href="/contact"
          className="shrink-0 px-6 py-3 border border-gold-500/40 text-gold-500 text-xs font-bold tracking-widest uppercase hover:bg-gold-500/10 transition-colors"
        >
          Enquire Now
        </Link>
      </div>
    </div>
  );
}
