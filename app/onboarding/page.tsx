"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth";
import { onboardingSchema } from "@/lib/validation";

const DISCIPLINES = [
  "Pipeline Integrity",
  "Pipeline Design & Engineering",
  "Project Engineering",
  "Policy & Regulation",
  "HSE",
  "Research & Academia",
  "Renewable Energy Integration",
  "Operations & Maintenance",
  "Subsea Engineering",
  "Other",
];

const TOPICS = [
  "Pipeline Integrity & Corrosion",
  "Project Management",
  "Policy & Regulation",
  "Hydrogen & Energy Transition",
  "Deepwater & Subsea",
  "HSE & Process Safety",
  "Research & Innovation",
  "Training & Capacity Building",
  "Industry News & Events",
  "Funding & Grants",
];

type Step = 1 | 2 | 3;

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [step, setStep] = useState<Step>(1);
  const [fullName, setFullName]       = useState("");
  const [discipline, setDiscipline]   = useState("");
  const [org, setOrg]                 = useState("");
  const [country, setCountry]         = useState("");
  const [topics, setTopics]           = useState<string[]>([]);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");

  function toggleTopic(t: string) {
    setTopics((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  }

  async function handleSave() {
    // Zod validation
    const result = onboardingSchema.safeParse({ fullName, discipline, org, country, topics });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Please check your inputs.");
      return;
    }

    setSaving(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const payload = {
      id:           user.id,
      full_name:    fullName.trim(),
      discipline:   discipline || null,
      organisation: org.trim() || null,
      country:      country.trim() || null,
      topics,
      updated_at:   new Date().toISOString(),
    };

    // Upsert — creates the row if the trigger hasn't fired yet
    const { error: dbError } = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "id" });

    if (dbError) {
      setError("Could not save your profile. Please try again.");
      setSaving(false);
      return;
    }

    // Sync Zustand store so dashboard shows updated name immediately
    updateProfile({
      full_name:    fullName.trim(),
      discipline:   discipline || null,
      organisation: org.trim() || null,
      country:      country.trim() || null,
      topics,
    });

    setStep(3);
    setSaving(false);
  }

  return (
    <div className="min-h-dvh bg-navy-900 flex flex-col" style={{ fontFamily: "var(--font-inter), sans-serif" }}>

      {/* Top bar */}
      <header className="px-6 md:px-10 h-16 border-b border-white/5 flex items-center justify-between shrink-0">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="APRN"
            width={999}
            height={453}
            className="h-6 w-auto"
            priority
          />
        </Link>
        <Link
          href="/dashboard"
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          Skip for now →
        </Link>
      </header>

      {/* Progress bar */}
      <div className="h-0.5 bg-navy-800 w-full shrink-0">
        <div
          className="h-full bg-gold-500 transition-all duration-500"
          style={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">

          {/* ── Step 1: Welcome ──────────────────────────────── */}
          {step === 1 && (
            <div className="flex flex-col gap-8">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-500/10 border border-gold-500/20 text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-6">
                  <i className="fa-solid fa-check-circle text-[9px]" />
                  Account activated
                </div>
                <h1
                  className="text-3xl md:text-4xl font-bold text-white mb-3"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  Welcome to APRN
                </h1>
                <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
                  Africa&apos;s professional network for pipeline and energy engineers. Let&apos;s take 60 seconds to set up your account.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: "fa-flask",         title: "Research Intelligence",  desc: "Access 400+ peer-reviewed papers and policy briefs from across Africa." },
                  { icon: "fa-users",          title: "Engineer Network",       desc: "Connect with 1,400+ engineers across 28 African countries." },
                  { icon: "fa-graduation-cap", title: "Training & Courses",     desc: "APConnect™ courses built around Africa's pipeline challenges." },
                  { icon: "fa-calendar",       title: "Events & Conferences",   desc: "Stay ahead of the APRN calendar and regional summits." },
                ].map((item) => (
                  <div key={item.title} className="bg-navy-800 border border-white/5 p-4 flex items-start gap-4">
                    <div className="w-8 h-8 bg-navy-900 border border-white/5 flex items-center justify-center shrink-0 mt-0.5">
                      <i className={`fa-solid ${item.icon} text-gold-500 text-[10px]`} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white mb-0.5">{item.title}</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 bg-gold-500 text-navy-900 text-xs font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors"
              >
                Continue — Set up my profile
                <i className="fa-solid fa-arrow-right ml-2 text-[10px]" />
              </button>
            </div>
          )}

          {/* ── Step 2: Profile ──────────────────────────────── */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-2">Step 2 of 3</p>
                <h2
                  className="text-2xl font-bold text-white mb-1"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  Complete your profile
                </h2>
                <p className="text-sm text-slate-400">
                  This helps us personalise your research feed and network matches.
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs text-red-400">
                  <i className="fa-solid fa-triangle-exclamation text-[10px]" />
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-4">
                {/* Full name */}
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Adaeze Okonkwo"
                    className="w-full bg-navy-800 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/40 transition-colors"
                  />
                </div>

                {/* Discipline */}
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">
                    Primary Discipline
                  </label>
                  <select
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value)}
                    className="w-full bg-navy-800 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500/40 transition-colors appearance-none"
                  >
                    <option value="" className="bg-navy-800">Select discipline…</option>
                    {DISCIPLINES.map((d) => (
                      <option key={d} value={d} className="bg-navy-800">{d}</option>
                    ))}
                  </select>
                </div>

                {/* Organisation */}
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">
                    Organisation
                  </label>
                  <input
                    type="text"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    placeholder="e.g. NNPC Ltd, University of Lagos"
                    className="w-full bg-navy-800 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/40 transition-colors"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Nigeria, Ghana, South Africa"
                    className="w-full bg-navy-800 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/40 transition-colors"
                  />
                </div>

                {/* Topics of interest */}
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">
                    Topics of Interest
                    <span className="text-slate-600 ml-1 normal-case tracking-normal font-normal text-[10px]">
                      — personalises your research feed
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TOPICS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleTopic(t)}
                        className={`px-3 py-1.5 text-[10px] font-semibold transition-colors border ${
                          topics.includes(t)
                            ? "bg-gold-500/10 border-gold-500/40 text-gold-500"
                            : "bg-navy-800 border-white/10 text-slate-400 hover:border-gold-500/30 hover:text-white"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-3 border border-white/10 text-xs text-slate-400 hover:text-white hover:border-white/20 transition-colors"
                >
                  <i className="fa-solid fa-arrow-left mr-2 text-[10px]" />
                  Back
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 bg-gold-500 text-navy-900 text-xs font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin text-[10px]" />
                      Saving…
                    </>
                  ) : (
                    <>
                      Save &amp; Continue
                      <i className="fa-solid fa-arrow-right text-[10px]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: All set ──────────────────────────────── */}
          {step === 3 && (
            <div className="flex flex-col gap-8 text-center">
              <div>
                <div className="w-16 h-16 bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center mx-auto mb-6">
                  <i className="fa-solid fa-check text-emerald-400 text-xl" />
                </div>
                <h2
                  className="text-3xl font-bold text-white mb-3"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  You&apos;re all set, {fullName.split(" ")[0] || "Engineer"}
                </h2>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">
                  Your APRN profile is live. Here are some great places to start.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left">
                {[
                  { href: "/dashboard/research",   icon: "fa-flask",         title: "My Research",    desc: "Explore papers in your topics" },
                  { href: "/dashboard/network",    icon: "fa-users",         title: "Network",        desc: "Find engineers in your field" },
                  { href: "/dashboard/courses",    icon: "fa-graduation-cap",title: "Courses",        desc: "Start an APConnect™ module" },
                  { href: "/dashboard/membership", icon: "fa-id-card",       title: "Membership",     desc: "See your benefits and plan" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="bg-navy-800 border border-white/5 p-4 hover:border-gold-500/20 transition-colors group"
                  >
                    <div className="w-8 h-8 bg-navy-900 border border-white/5 flex items-center justify-center mb-3">
                      <i className={`fa-solid ${item.icon} text-gold-500 text-[10px]`} />
                    </div>
                    <p className="text-xs font-bold text-white group-hover:text-gold-400 transition-colors mb-0.5">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-slate-500">{item.desc}</p>
                  </Link>
                ))}
              </div>

              <Link
                href="/dashboard"
                className="w-full py-3.5 bg-gold-500 text-navy-900 text-xs font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors"
              >
                Go to Dashboard
                <i className="fa-solid fa-arrow-right ml-2 text-[10px]" />
              </Link>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
