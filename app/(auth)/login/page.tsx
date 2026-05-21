"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full px-4 py-3 text-white placeholder-slate-600 text-sm transition-all duration-300 focus:outline-none rounded-t-sm"
  + " bg-navy-800/40 border-0 border-b border-slate-500/30 focus:border-b-2 focus:border-gold-500";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push(redirect);
    router.refresh();
  }

  async function handleGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
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
        <h2 className="text-2xl font-semibold text-white mb-2">Institutional Login</h2>
        <p className="text-slate-400 text-sm">Authenticate to access intelligence systems</p>
      </div>

      {searchParams.get("registered") && (
        <div className="mb-6 px-4 py-3 border border-gold-500/30 bg-gold-500/10 text-sm text-gold-400 rounded-sm">
          Account created. Check your email to confirm, then sign in.
        </div>
      )}

      {searchParams.get("error") === "auth_failed" && (
        <div className="mb-6 px-4 py-3 border border-red-500/30 bg-red-500/10 text-sm text-red-400 rounded-sm">
          Authentication failed. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">
            Corporate Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="executive@aprn.network"
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">
            Security Credential
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
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

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="w-4 h-4 rounded border border-slate-500 group-hover:border-gold-500 flex items-center justify-center transition-colors">
              <i className="fa-solid fa-check text-[10px] text-transparent group-hover:text-gold-500" />
            </div>
            <span className="text-sm text-slate-400">Remember session</span>
          </label>
          <Link href="/forgot-password" className="text-sm text-slate-400 hover:text-gold-500 transition-colors">
            Forgot credentials?
          </Link>
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
          {loading ? "Authenticating…" : "Secure Login"}
        </button>
      </form>

      <div className="flex items-center gap-4 my-8">
        <div className="h-px bg-white/10 flex-1" />
        <span className="text-xs text-slate-500 uppercase tracking-wider">Or authenticate via</span>
        <div className="h-px bg-white/10 flex-1" />
      </div>

      <div className="space-y-3">
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-navy-900 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-sm font-medium text-white"
          style={{ borderRadius: "12px" }}
        >
          <i className="fa-brands fa-google text-[#EA4335]" />
          Google Workspace
        </button>
        <button
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-navy-900 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-sm font-medium text-white"
          style={{ borderRadius: "12px" }}
        >
          <i className="fa-brands fa-microsoft text-[#00A4EF]" />
          Microsoft Azure AD
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-slate-500">
        No account?{" "}
        <Link href="/register" className="text-gold-500 hover:text-gold-400 transition-colors font-medium">
          Request access
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
