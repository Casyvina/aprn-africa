"use client";

import { useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export default function NewsletterSignupForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail]         = useState("");
  const [org, setOrg]             = useState("");
  const [state, setState]         = useState<FormState>("idle");
  const [errorMsg, setErrorMsg]   = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, email, org }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? "Subscription failed. Please try again.");
      }

      setState("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="text-center py-10">
        <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto mb-6">
          <i className="fa-solid fa-check text-gold-500 text-xl" />
        </div>
        <h3
          className="text-2xl font-bold text-white mb-3"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          You&apos;re In
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
          Welcome to the APRN Intelligence Briefing. Your first issue will arrive
          in your inbox shortly. Check your spam folder if you don&apos;t see it.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">
            First Name
          </label>
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            className="w-full bg-navy-800 border border-navy-700 focus:border-gold-500/50 text-white placeholder-slate-600 text-sm px-4 py-3 rounded-sm outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@organisation.com"
            className="w-full bg-navy-800 border border-navy-700 focus:border-gold-500/50 text-white placeholder-slate-600 text-sm px-4 py-3 rounded-sm outline-none transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">
          Organisation <span className="text-slate-600 normal-case">(optional)</span>
        </label>
        <input
          type="text"
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          placeholder="Your company or institution"
          className="w-full bg-navy-800 border border-navy-700 focus:border-gold-500/50 text-white placeholder-slate-600 text-sm px-4 py-3 rounded-sm outline-none transition-colors"
        />
      </div>

      {state === "error" && (
        <p className="text-xs text-red-400 border border-red-400/20 bg-red-400/5 px-4 py-3 rounded-sm">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-60 disabled:cursor-not-allowed text-navy-900 font-bold text-sm py-4 rounded-sm transition-colors uppercase tracking-wider flex items-center justify-center gap-3"
      >
        {state === "loading" ? (
          <>
            <i className="fa-solid fa-circle-notch animate-spin" />
            Subscribing...
          </>
        ) : (
          <>
            Subscribe to Intelligence Briefing
            <i className="fa-solid fa-arrow-right text-xs" />
          </>
        )}
      </button>

      <p className="text-[11px] text-slate-600 text-center leading-relaxed">
        Published every Wednesday. No spam. Unsubscribe at any time.
      </p>
    </form>
  );
}
