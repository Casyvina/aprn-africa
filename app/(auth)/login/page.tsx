"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full px-4 py-3 text-white placeholder-slate-600 text-sm transition-all duration-300 focus:outline-none rounded-t-sm"
  + " bg-navy-800/40 border-0 border-b border-slate-500/30 focus:border-b-2 focus:border-gold-500";

const cardVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const rowVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
    <motion.div
      className="w-full max-w-md bg-navy-800 border border-white/5"
      style={{
        borderRadius: "24px",
        boxShadow: "0 24px 48px rgba(0,0,0,0.45)",
        padding: "clamp(2rem, 5vw, 2.5rem)",
      }}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div variants={cardVariants} initial="hidden" animate="show">

        {/* Mobile logo */}
        <motion.div variants={rowVariants} className="flex lg:hidden items-center justify-center mb-6 sm:mb-10">
          <Image
            src="/images/logo.png"
            alt="African Pipeline Resource Network"
            width={999}
            height={453}
            className="h-9 w-auto"
            priority
          />
        </motion.div>

        {/* Title */}
        <motion.div variants={rowVariants} className="text-center mb-6 sm:mb-10">
          <h2 className="text-2xl font-semibold text-white mb-2">
            Welcome back{email.includes("@") ? `, ${email.split("@")[0].split(/[._-]/)[0].replace(/^\w/, (c) => c.toUpperCase())}` : ""}
          </h2>
          <p className="text-slate-400 text-sm">Sign in to your APRN member account</p>
        </motion.div>

        {/* Alerts */}
        {searchParams.get("registered") && (
          <motion.div variants={rowVariants} className="mb-6 px-4 py-3 border border-gold-500/30 bg-gold-500/10 text-sm text-gold-400 rounded-sm">
            Account created. Check your email to confirm, then sign in.
          </motion.div>
        )}
        {searchParams.get("error") === "auth_failed" && (
          <motion.div variants={rowVariants} className="mb-6 px-4 py-3 border border-red-500/30 bg-red-500/10 text-sm text-red-400 rounded-sm">
            Authentication failed. Please try again.
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div variants={rowVariants} className="space-y-2">
            <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </motion.div>

          <motion.div variants={rowVariants} className="space-y-2">
            <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">
              Password
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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <i className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"} text-sm`} />
              </button>
            </div>
          </motion.div>

          <motion.div variants={rowVariants} className="flex items-center justify-between flex-wrap gap-y-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="w-4 h-4 rounded border border-slate-500 group-hover:border-gold-500 flex items-center justify-center transition-colors">
                <i className="fa-solid fa-check text-[10px] text-transparent group-hover:text-gold-500" />
              </div>
              <span className="text-sm text-slate-400">Remember session</span>
            </label>
            <Link href="/forgot-password" className="text-sm text-slate-400 hover:text-gold-500 transition-colors">
              Forgot password?
            </Link>
          </motion.div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 px-4 py-3 rounded-sm"
            >
              {error}
            </motion.p>
          )}

          <motion.div variants={rowVariants}>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { y: -2, boxShadow: "0 0 28px rgba(212,160,23,0.4)" } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              transition={{ duration: 0.15 }}
              className="w-full text-navy-900 font-semibold py-4 mt-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(to right, #D4A017, #E5B83B)", borderRadius: "12px" }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </motion.button>
          </motion.div>
        </form>

        {/* Divider */}
        <motion.div variants={rowVariants} className="flex items-center gap-4 my-8">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-xs text-slate-500 uppercase tracking-wider">Or continue with</span>
          <div className="h-px bg-white/10 flex-1" />
        </motion.div>

        {/* SSO buttons */}
        <motion.div variants={rowVariants} className="space-y-3">
          <motion.button
            onClick={handleGoogle}
            whileHover={{ y: -1, backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.2)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-navy-900 border border-white/10 transition-colors text-sm font-medium text-white cursor-pointer"
            style={{ borderRadius: "12px" }}
          >
            <i className="fa-brands fa-google text-[#EA4335]" />
            Continue with Google
          </motion.button>
        </motion.div>

        {/* Footer link */}
        <motion.p variants={rowVariants} className="mt-8 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-gold-500 hover:text-gold-400 transition-colors font-medium">
            Join APRN
          </Link>
        </motion.p>

      </motion.div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
