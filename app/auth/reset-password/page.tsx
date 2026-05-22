"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  // Supabase sends the user to this page with a session fragment in the URL.
  // We listen for PASSWORD_RECOVERY to confirm the link is valid before showing the form.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2500);
    }
  }

  return (
    <div
      className="min-h-screen bg-navy-900 flex flex-col"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* Subtle grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,160,23,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Logo */}
      <div className="relative z-10 px-8 py-6">
        <Link href="/">
          <Image src="/images/logo.png" alt="APRN" width={999} height={453} className="h-8 w-auto" priority />
        </Link>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-6 pb-16 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-navy-800 border border-white/5 border-t-2 border-t-gold-500 p-10">

            {success ? (
              /* ── Success state ── */
              <div className="flex flex-col items-center text-center gap-5 py-4">
                <div className="w-14 h-14 bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center">
                  <i className="fa-solid fa-check text-emerald-400 text-xl" />
                </div>
                <div>
                  <h2
                    className="text-2xl font-bold text-white mb-2"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    Password Updated
                  </h2>
                  <p className="text-sm text-slate-400">
                    Your password has been reset. Redirecting you to the dashboard…
                  </p>
                </div>
                <div className="w-full h-0.5 bg-navy-900 overflow-hidden">
                  <div className="h-full bg-gold-500 animate-[progress_2.5s_linear_forwards]" style={{ width: "0%" }} />
                </div>
              </div>
            ) : !ready ? (
              /* ── Waiting for recovery session ── */
              <div className="flex flex-col items-center text-center gap-5 py-4">
                <div className="w-14 h-14 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
                  <i className="fa-solid fa-key text-gold-500 text-xl" />
                </div>
                <div>
                  <h2
                    className="text-2xl font-bold text-white mb-2"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    Verifying Link
                  </h2>
                  <p className="text-sm text-slate-400">
                    Confirming your reset link. If this takes too long, request a new one.
                  </p>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-xs text-gold-500 hover:text-gold-400 transition-colors"
                >
                  Request a new link →
                </Link>
              </div>
            ) : (
              /* ── Reset form ── */
              <>
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
                      <i className="fa-solid fa-lock text-gold-500 text-sm" />
                    </div>
                    <span className="text-[10px] font-bold tracking-widest text-gold-500 uppercase">
                      Secure Reset
                    </span>
                  </div>
                  <h2
                    className="text-3xl font-bold text-white mb-2"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    Set New Password
                  </h2>
                  <p className="text-sm text-slate-400">
                    Choose a strong password for your APRN account.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      required
                      className="bg-navy-900/40 border border-white/10 px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/60 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Repeat your password"
                      required
                      className="bg-navy-900/40 border border-white/10 px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/60 transition-colors"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                      <i className="fa-solid fa-triangle-exclamation shrink-0" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gold-500 text-navy-900 text-xs font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors disabled:opacity-50 mt-2"
                  >
                    {loading ? "Updating…" : "Update Password"}
                  </button>
                </form>
              </>
            )}
          </div>

          <p className="text-center text-xs text-slate-600 mt-6">
            Remember your password?{" "}
            <Link href="/login" className="text-gold-500 hover:text-gold-400 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
