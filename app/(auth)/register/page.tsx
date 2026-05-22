"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
          <h2 className="text-2xl font-semibold text-white mb-2">Request Access</h2>
          <p className="text-slate-400 text-sm">Create your APRN professional account</p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div variants={rowVariants} className="space-y-2">
            <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className={inputClass}
            />
          </motion.div>

          <motion.div variants={rowVariants} className="space-y-2">
            <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">Corporate Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@organisation.com"
              className={inputClass}
            />
          </motion.div>

          <motion.div variants={rowVariants} className="space-y-2">
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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <i className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"} text-sm`} />
              </button>
            </div>
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
              {loading ? "Creating account…" : "Create Account"}
            </motion.button>
          </motion.div>

          <motion.p variants={rowVariants} className="text-xs text-slate-600 text-center leading-relaxed pt-1">
            By registering you agree to APRN&apos;s terms of membership and data governance policy.
          </motion.p>
        </form>

        {/* Footer link */}
        <motion.p variants={rowVariants} className="mt-8 text-center text-sm text-slate-500">
          Already have access?{" "}
          <Link href="/login" className="text-gold-500 hover:text-gold-400 transition-colors font-medium">
            Sign in
          </Link>
        </motion.p>

      </motion.div>
    </motion.div>
  );
}
