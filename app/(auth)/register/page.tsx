"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full px-4 py-3 text-white placeholder-slate-600 text-sm transition-all duration-300 focus:outline-none rounded-t-sm"
  + " bg-navy-800/40 border-0 border-b border-slate-500/30 focus:border-b-2 focus:border-gold-500";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/login?registered=1");
  }

  return (
    <div
      className="w-full max-w-[440px] bg-navy-800 p-10 border border-white/5"
      style={{ borderRadius: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
    >
      {/* Mobile logo */}
      <div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
        <div className="w-8 h-8 rounded bg-gold-500 flex items-center justify-center">
          <i className="fa-solid fa-network-wired text-navy-900 text-sm" />
        </div>
        <span className="text-xl font-bold tracking-wider text-white">APRN</span>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-2xl font-semibold text-white mb-2">Request Access</h2>
        <p className="text-slate-400 text-sm">Create your APRN professional account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">Full Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            className={inputClass}
          />
        </div>

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

        <div className="space-y-2">
          <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className={inputClass + " pr-12"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              <i className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"} text-sm`} />
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 px-4 py-3 rounded-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full text-navy-900 font-semibold py-4 mt-8 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          style={{ background: "linear-gradient(to right, #D4A017, #E5B83B)", borderRadius: "12px" }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 20px rgba(212,160,23,0.3)")}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
        >
          {loading ? "Creating account…" : "Create Account"}
        </button>

        <p className="text-xs text-slate-600 text-center leading-relaxed pt-2">
          By registering you agree to APRN&apos;s terms of membership and data governance policy.
        </p>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Already have access?{" "}
        <Link href="/login" className="text-gold-500 hover:text-gold-400 transition-colors font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
