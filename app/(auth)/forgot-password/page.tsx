"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full px-4 py-3 text-white placeholder-slate-600 text-sm transition-all duration-300 focus:outline-none rounded-t-sm"
  + " bg-navy-800/40 border-0 border-b border-slate-500/30 focus:border-b-2 focus:border-gold-500";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/reset-password`,
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div
        className="w-full max-w-[440px] bg-navy-800 p-10 border border-white/5 text-center shadow-2xl"
      >
        <div className="w-12 h-12 rounded-full border border-gold-500/40 bg-gold-500/10 flex items-center justify-center mx-auto mb-6">
          <i className="fa-solid fa-envelope-circle-check text-gold-500 text-xl" />
        </div>
        <h2 className="text-2xl font-semibold text-white mb-3">Check your inbox</h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          A reset link was sent to{" "}
          <span className="text-white font-medium">{email}</span>.
          <br />The link expires in 1 hour.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-gold-500 hover:text-gold-400 transition-colors"
        >
          <i className="fa-solid fa-arrow-left text-xs" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-[440px] bg-navy-800 p-10 border border-white/5 shadow-2xl"
    >
      {/* Mobile logo */}
      <div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
        <div className="w-8 h-8 rounded bg-gold-500 flex items-center justify-center">
          <i className="fa-solid fa-network-wired text-navy-900 text-sm" />
        </div>
        <span className="text-xl font-bold tracking-wider text-white">APRN</span>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-2xl font-semibold text-white mb-2">Reset Credentials</h2>
        <p className="text-slate-400 text-sm">Enter your email to receive a secure reset link</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">Corporate Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@organisation.com"
            className={inputClass}
          />
        </div>

        {error && (
          <p className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 px-4 py-3 rounded-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold py-4 transition-colors hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Sending…" : "Send Reset Link"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Remembered it?{" "}
        <Link href="/login" className="text-gold-500 hover:text-gold-400 transition-colors font-medium">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
