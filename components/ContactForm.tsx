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

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get("name") as string;
    const org = data.get("org") as string;
    const email = data.get("email") as string;
    const country = data.get("country") as string;
    const type = data.get("type") as string;
    const message = data.get("message") as string;

    const subject = encodeURIComponent(`[APRN Inquiry] ${type} — ${org}`);
    const body = encodeURIComponent(
      `Name: ${name}\nOrganisation: ${org}\nEmail: ${email}\nCountry: ${country}\nInquiry Type: ${type}\n\n${message}`
    );
    window.location.href = `mailto:info@aprn-africa.org?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="glass-panel p-10 rounded-sm border border-navy-700 text-center py-16">
        <i className="fa-solid fa-circle-check text-gold-500 text-4xl mb-4 block" />
        <p className="text-white font-semibold mb-2">Inquiry Submitted</p>
        <p className="text-slate-400 text-sm">Your email client has been opened. We look forward to connecting.</p>
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
        <button
          type="submit"
          className="w-full bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold py-4 rounded-sm transition-colors flex justify-center items-center gap-2"
        >
          Submit Inquiry <i className="fa-solid fa-arrow-right" />
        </button>
      </form>
    </div>
  );
}
