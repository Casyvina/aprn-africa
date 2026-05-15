"use client";

import { useState } from "react";

const countries = [
  "Nigeria", "South Africa", "Kenya", "Egypt", "Ghana", "Tanzania",
  "Ethiopia", "Angola", "Mozambique", "Cameroon", "Senegal", "Other",
];

const inquiryTypes = [
  "Strategic Partnership",
  "Research Data Access",
  "Training Program",
  "International Collaboration",
  "Media Inquiry",
  "General Information",
];

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [state, setState]     = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    const data = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:    data.get("name"),
          org:     data.get("org"),
          email:   data.get("email"),
          country: data.get("country"),
          type:    data.get("type"),
          message: data.get("message"),
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message ?? "Failed to send. Please try again.");
      }

      setState("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="glass-panel p-10 rounded-sm border border-navy-700 text-center py-16">
        <i className="fa-solid fa-circle-check text-gold-500 text-4xl mb-4 block" />
        <p className="text-white font-semibold mb-2">Inquiry Received</p>
        <p className="text-slate-400 text-sm">Your message has been sent to the APRN team. We will be in touch within 2 business days.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-10 rounded-sm border border-navy-700">
      <h3 className="text-2xl font-bold mb-8">Secure Inquiry Portal</h3>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
            <input
              name="name"
              type="text"
              required
              className="w-full bg-navy-900 border border-navy-700 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors"
              placeholder="Dr. Jane Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Organization</label>
            <input
              name="org"
              type="text"
              required
              className="w-full bg-navy-900 border border-navy-700 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors"
              placeholder="Institution Name"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Official Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-navy-900 border border-navy-700 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors"
              placeholder="name@institution.org"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Country of Operation</label>
            <select
              name="country"
              className="w-full bg-navy-900 border border-navy-700 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors appearance-none"
            >
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Inquiry Type</label>
          <select
            name="type"
            className="w-full bg-navy-900 border border-navy-700 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors appearance-none"
          >
            {inquiryTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Message</label>
          <textarea
            name="message"
            rows={4}
            required
            className="w-full bg-navy-900 border border-navy-700 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors"
            placeholder="Detail your objective..."
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
          className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-60 disabled:cursor-not-allowed text-navy-900 font-bold py-4 rounded-sm transition-colors flex justify-center items-center gap-2"
        >
          {state === "loading" ? (
            <><i className="fa-solid fa-circle-notch animate-spin" /> Sending...</>
          ) : (
            <>Submit Inquiry <i className="fa-solid fa-arrow-right" /></>
          )}
        </button>
      </form>
    </div>
  );
}
