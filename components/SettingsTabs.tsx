"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth";
import { passwordSchema } from "@/lib/validation";

type Tab = "profile" | "security" | "notifications" | "billing";

interface Props {
  user: { id: string; email: string };
  profile: {
    full_name:    string | null;
    job_title:    string | null;
    discipline:   string | null;
    organisation: string | null;
    country:      string | null;
    linkedin_url: string | null;
    bio:          string | null;
    membership_tier: string | null;
  } | null;
}

export default function SettingsTabs({ user, profile }: Props) {
  const [tab, setTab] = useState<Tab>("profile");
  const updateProfile = useAuthStore((s) => s.updateProfile);

  // Profile form
  const [fullName,      setFullName]      = useState(profile?.full_name    ?? "");
  const [jobTitle,      setJobTitle]      = useState(profile?.job_title    ?? "");
  const [organisation,  setOrganisation]  = useState(profile?.organisation ?? "");
  const [country,       setCountry]       = useState(profile?.country      ?? "");
  const [linkedIn,      setLinkedIn]      = useState(profile?.linkedin_url ?? "");
  const [bio,           setBio]           = useState(profile?.bio          ?? "");
  const [saving,  setSaving]  = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Security form
  const [newPw,    setNewPw]    = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg,    setPwMsg]    = useState("");
  const [pwErrors, setPwErrors] = useState<string[]>([]);

  // Notification toggles
  const [notifs, setNotifs] = useState({
    newsletter: true,
    research: true,
    events: false,
    network: false,
  });

  const supabase = createClient();

  const tier = profile?.membership_tier ?? "free";
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);

  const initials = (profile?.full_name ?? user.email)
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  async function handleSaveProfile() {
    setSaving(true);
    setSaveMsg("");
    const payload = {
      full_name:    fullName.trim() || null,
      job_title:    jobTitle.trim() || null,
      organisation: organisation.trim() || null,
      country:      country || null,
      linkedin_url: linkedIn.trim() || null,
      bio:          bio.trim() || null,
    };
    const { error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      setSaveMsg("Error saving changes. Try again.");
    } else {
      setSaveMsg("Changes saved successfully.");
      // Keep Zustand in sync so dashboard header updates without reload
      updateProfile(payload);
    }
    setTimeout(() => setSaveMsg(""), 3000);
  }

  async function handleChangePassword() {
    // Zod validation
    const result = passwordSchema.safeParse({ newPassword: newPw, confirmPassword: confirmPw });
    if (!result.success) {
      const msgs = result.error.issues.map((i) => i.message);
      setPwErrors(msgs);
      return;
    }
    setPwErrors([]);
    setPwSaving(true);
    setPwMsg("");
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setPwSaving(false);
    if (error) {
      setPwMsg(error.message);
    } else {
      setPwMsg("Password updated successfully.");
      setNewPw("");
      setConfirmPw("");
    }
    setTimeout(() => setPwMsg(""), 4000);
  }

  const inputClass =
    "w-full bg-navy-900/40 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/60 transition-colors";

  const tabs: { key: Tab; label: string }[] = [
    { key: "profile", label: "Profile" },
    { key: "security", label: "Security" },
    { key: "notifications", label: "Notifications" },
    { key: "billing", label: "Billing" },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-240">

      {/* Header + tabs */}
      <div className="border-b border-white/10 pb-0">
        <div className="mb-6">
          <h2
            className="text-3xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Account Settings
          </h2>
          <div className="h-0.5 w-20 bg-gold-500 mt-2" />
        </div>
        <div className="flex gap-0">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
                tab === t.key
                  ? "text-gold-500 border-gold-500"
                  : "text-slate-400 border-transparent hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Profile ─────────────────────────────────────────────── */}
      {tab === "profile" && (
        <div className="bg-navy-800 border border-white/5 p-8">
          <h3
            className="text-lg font-semibold text-white mb-6"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Profile Information
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Avatar */}
            <div className="flex flex-col items-center gap-5">
              <div className="w-48 h-48 bg-navy-900 border border-gold-500/30 flex items-center justify-center">
                <span
                  className="text-6xl font-bold text-gold-500"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  {initials}
                </span>
              </div>
              <button className="px-6 py-2 border border-gold-500 text-gold-500 hover:bg-gold-500/10 transition-colors text-sm font-medium w-48">
                Upload Photo
              </button>
              <p className="text-xs text-slate-500 text-center max-w-44">
                JPG, PNG or SVG. Max 2 MB.
              </p>
            </div>

            {/* Form */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Pipeline Engineer"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Organisation
                  </label>
                  <input
                    type="text"
                    value={organisation}
                    onChange={(e) => setOrganisation(e.target.value)}
                    placeholder="Your company or institution"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="" className="bg-navy-900">Select country…</option>
                    <option value="NG" className="bg-navy-900">Nigeria</option>
                    <option value="GH" className="bg-navy-900">Ghana</option>
                    <option value="ZA" className="bg-navy-900">South Africa</option>
                    <option value="KE" className="bg-navy-900">Kenya</option>
                    <option value="EG" className="bg-navy-900">Egypt</option>
                    <option value="ET" className="bg-navy-900">Ethiopia</option>
                    <option value="TZ" className="bg-navy-900">Tanzania</option>
                    <option value="UG" className="bg-navy-900">Uganda</option>
                    <option value="CM" className="bg-navy-900">Cameroon</option>
                    <option value="CI" className="bg-navy-900">Côte d&apos;Ivoire</option>
                    <option value="SN" className="bg-navy-900">Senegal</option>
                    <option value="AO" className="bg-navy-900">Angola</option>
                    <option value="GB" className="bg-navy-900">United Kingdom</option>
                    <option value="US" className="bg-navy-900">United States</option>
                    <option value="other" className="bg-navy-900">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={linkedIn}
                  onChange={(e) => setLinkedIn(e.target.value)}
                  placeholder="https://linkedin.com/in/…"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Brief overview of your role and expertise…"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                {saveMsg && (
                  <span
                    className={`text-xs ${saveMsg.startsWith("Error") ? "text-red-400" : "text-emerald-400"}`}
                  >
                    {saveMsg}
                  </span>
                )}
                <div className="ml-auto">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-8 py-3 bg-gold-500 text-navy-900 text-sm font-bold hover:bg-gold-400 transition-colors disabled:opacity-50"
                  >
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Security ─────────────────────────────────────────────── */}
      {tab === "security" && (
        <div className="flex flex-col gap-6">
          <div className="bg-navy-800 border border-white/5 p-8">
            <h3
              className="text-lg font-semibold text-white mb-6"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Change Password
            </h3>
            <div className="max-w-md flex flex-col gap-5">
              <div className="bg-navy-900/40 border border-white/5 px-4 py-3 flex items-center gap-3">
                <i className="fa-solid fa-envelope text-slate-500 text-xs w-4" />
                <span className="text-sm text-slate-400">{user.email}</span>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPw}
                  onChange={(e) => { setNewPw(e.target.value); setPwErrors([]); }}
                  placeholder="Min. 8 characters"
                  className={inputClass}
                />
                <p className="text-[10px] text-slate-600">
                  Must be 8+ characters with an uppercase letter, number, and special character.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Zod validation errors */}
              {pwErrors.length > 0 && (
                <ul className="flex flex-col gap-1">
                  {pwErrors.map((msg) => (
                    <li key={msg} className="flex items-center gap-2 text-xs text-red-400">
                      <i className="fa-solid fa-circle-exclamation text-[10px]" />
                      {msg}
                    </li>
                  ))}
                </ul>
              )}

              {pwMsg && (
                <span className={`text-xs ${pwMsg.includes("successfully") ? "text-emerald-400" : "text-red-400"}`}>
                  {pwMsg}
                </span>
              )}

              <button
                onClick={handleChangePassword}
                disabled={pwSaving || !newPw || !confirmPw}
                className="self-start px-8 py-3 bg-gold-500 text-navy-900 text-sm font-bold hover:bg-gold-400 transition-colors disabled:opacity-50"
              >
                {pwSaving ? "Updating…" : "Update Password"}
              </button>
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-red-500/5 border border-red-500/30 p-8">
            <h3 className="text-base font-semibold text-red-400 mb-2">Danger Zone</h3>
            <p className="text-sm text-slate-400 mb-5 max-w-md">
              Permanently delete your account and all associated data. This cannot be undone.
            </p>
            <button className="px-6 py-2 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition-colors text-sm font-medium">
              Delete Account
            </button>
          </div>
        </div>
      )}

      {/* ── Notifications ────────────────────────────────────────── */}
      {tab === "notifications" && (
        <div className="bg-navy-800 border border-white/5 p-8">
          <h3
            className="text-lg font-semibold text-white mb-6"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Notification Preferences
          </h3>
          <div className="flex flex-col divide-y divide-white/5">
            {[
              {
                key: "newsletter" as const,
                label: "Newsletter Digest",
                desc: "Weekly intelligence briefing delivered to your inbox",
              },
              {
                key: "research" as const,
                label: "New Research Published",
                desc: "Be notified when new research papers are available",
              },
              {
                key: "events" as const,
                label: "Event Announcements",
                desc: "Conferences, webinars, and APRN-hosted events",
              },
              {
                key: "network" as const,
                label: "Network Activity",
                desc: "Connection requests and messages from the engineer network",
              },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-5">
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <button
                  onClick={() =>
                    setNotifs((n) => ({ ...n, [item.key]: !n[item.key] }))
                  }
                  aria-pressed={notifs[item.key]}
                  className={`relative w-11 h-6 transition-colors shrink-0 ${
                    notifs[item.key] ? "bg-gold-500" : "bg-navy-900 border border-white/20"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white transition-all ${
                      notifs[item.key] ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-white/5">
            <button className="px-8 py-3 bg-gold-500 text-navy-900 text-sm font-bold hover:bg-gold-400 transition-colors">
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* ── Billing ──────────────────────────────────────────────── */}
      {tab === "billing" && (
        <div className="bg-navy-800 border border-white/5 p-8 flex flex-col gap-6">
          <h3
            className="text-lg font-semibold text-white"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Billing &amp; Membership
          </h3>
          <p className="text-sm text-slate-400 max-w-md">
            Manage your subscription, upgrade your plan, and view payment history.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-navy-900 border border-gold-500/30">
              <i className="fa-solid fa-shield-halved text-gold-500 text-sm" />
              <span className="text-xs font-bold tracking-widest text-gold-500 uppercase">
                {tierLabel} Plan
              </span>
            </div>
            {tier === "free" && (
              <span className="text-xs text-slate-500">Upgrade to unlock full platform access</span>
            )}
          </div>
          <Link
            href="/dashboard/membership"
            className="self-start px-8 py-3 bg-gold-500 text-navy-900 text-sm font-bold hover:bg-gold-400 transition-colors"
          >
            Manage Membership →
          </Link>
        </div>
      )}
    </div>
  );
}
