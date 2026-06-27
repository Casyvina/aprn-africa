"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const mainNav = [
  { href: "/dashboard",               icon: "fa-chart-line",     label: "Overview" },
  { href: "/dashboard/intelligence",  icon: "fa-newspaper",      label: "Intelligence" },
  { href: "/dashboard/research",      icon: "fa-flask",          label: "My Research" },
  { href: "/dashboard/courses",    icon: "fa-graduation-cap", label: "Training & Courses" },
  { href: "/dashboard/network",    icon: "fa-network-wired",  label: "Engineer Network" },
  { href: "/dashboard/membership", icon: "fa-id-card",        label: "Membership" },
  { href: "/dashboard/saved",      icon: "fa-bookmark",       label: "Saved Articles" },
];

const accountNav = [
  { href: "/dashboard/settings", icon: "fa-gear", label: "Settings" },
];

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.22, ease: "easeOut" as const } },
};

interface Props {
  initials: string;
  tier: string;
  displayName: string;
}

export default function DashboardMobileNav({ initials, tier, displayName }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change (state-during-render — avoids cascading useEffect)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden w-11 h-11 flex items-center justify-center rounded-sm text-slate-400 hover:text-white hover:bg-navy-800 transition-colors shrink-0"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="dashboard-mobile-drawer"
      >
        <i className="fa-solid fa-bars text-sm" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-navy-900/75 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Slide-in drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34, mass: 0.85 }}
              id="dashboard-mobile-drawer"
              className="fixed top-0 left-0 h-dvh w-80 bg-navy-900 z-50 flex flex-col md:hidden overflow-hidden"
            >
              {/* Gold top accent line */}
              <div className="h-px bg-linear-to-r from-gold-500 via-gold-400/60 to-transparent shrink-0" />

              {/* Header: logo + close */}
              <div className="px-5 h-16 border-b border-white/5 flex items-center justify-between shrink-0">
                <Link href="/" onClick={() => setOpen(false)}>
                  <Image
                    src="/images/logo.png"
                    alt="APRN"
                    width={999}
                    height={453}
                    className="h-6 w-auto"
                    priority
                  />
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="w-11 h-11 flex items-center justify-center rounded-sm text-slate-500 hover:text-white hover:bg-navy-800 transition-colors"
                  aria-label="Close menu"
                >
                  <i className="fa-solid fa-xmark text-sm" />
                </button>
              </div>

              {/* Nav items */}
              <nav className="flex-1 overflow-y-auto px-3 py-5 flex flex-col gap-0.5">

                <p className="px-3 mb-2 text-[9px] font-bold tracking-[0.18em] text-slate-600 uppercase">
                  Dashboard
                </p>

                <motion.ul
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.055, delayChildren: 0.08 } } }}
                  className="flex flex-col gap-0.5"
                >
                  {mainNav.map((item) => {
                    const isActive =
                      item.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname.startsWith(item.href);
                    return (
                      <motion.li key={item.href} variants={itemVariants}>
                        <Link
                          href={item.href}
                          className={`group flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all ${
                            isActive
                              ? "bg-gold-500/10 text-gold-500 border border-gold-500/20"
                              : "text-slate-400 border border-transparent hover:text-white hover:bg-navy-800"
                          }`}
                        >
                          <span
                            className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 transition-colors ${
                              isActive
                                ? "bg-gold-500/20 text-gold-500"
                                : "bg-navy-800 text-slate-500 group-hover:bg-navy-700 group-hover:text-slate-300"
                            }`}
                          >
                            <i className={`fa-solid ${item.icon} text-xs`} />
                          </span>
                          <span className="flex-1">{item.label}</span>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
                          )}
                        </Link>
                      </motion.li>
                    );
                  })}
                </motion.ul>

                {/* Account section */}
                <p className="px-3 mt-5 mb-2 text-[9px] font-bold tracking-[0.18em] text-slate-600 uppercase">
                  Account
                </p>

                <motion.ul
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.055, delayChildren: 0.46 } } }}
                  className="flex flex-col gap-0.5"
                >
                  {accountNav.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <motion.li key={item.href} variants={itemVariants}>
                        <Link
                          href={item.href}
                          className={`group flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all ${
                            isActive
                              ? "bg-gold-500/10 text-gold-500 border border-gold-500/20"
                              : "text-slate-400 border border-transparent hover:text-white hover:bg-navy-800"
                          }`}
                        >
                          <span
                            className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 transition-colors ${
                              isActive
                                ? "bg-gold-500/20 text-gold-500"
                                : "bg-navy-800 text-slate-500 group-hover:bg-navy-700 group-hover:text-slate-300"
                            }`}
                          >
                            <i className={`fa-solid ${item.icon} text-xs`} />
                          </span>
                          <span className="flex-1">{item.label}</span>
                        </Link>
                      </motion.li>
                    );
                  })}
                </motion.ul>

              </nav>

              {/* Footer */}
              <div className="shrink-0 border-t border-white/5">

                {/* Upgrade CTA — shown only for free tier */}
                {tier === "free" && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.25 }}
                    className="mx-3 mt-3"
                  >
                    <Link
                      href="/dashboard/membership"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-sm bg-gold-500/8 border border-gold-500/20 hover:bg-gold-500/12 transition-colors group"
                    >
                      <span className="w-8 h-8 rounded-sm bg-gold-500/20 flex items-center justify-center shrink-0">
                        <i className="fa-solid fa-bolt text-gold-500 text-xs" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gold-500 leading-tight">Upgrade Your Plan</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Unlock full intelligence access</p>
                      </div>
                      <i className="fa-solid fa-chevron-right text-gold-500/40 text-[10px] group-hover:text-gold-500/70 transition-colors" />
                    </Link>
                  </motion.div>
                )}

                {/* User info + sign out */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.48, duration: 0.25 }}
                  className="px-4 py-4 flex items-center gap-3"
                >
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center">
                      <span className="text-xs font-bold text-gold-500">{initials}</span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-navy-900 rounded-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white truncate leading-tight">
                      {displayName.split(" ").slice(0, 2).join(" ")}
                    </p>
                    <p className="text-[10px] text-slate-500 capitalize mt-0.5">{tier} member</p>
                  </div>
                  <form action="/api/auth/signout" method="post">
                    <button
                      formAction="/api/auth/signout"
                      className="w-11 h-11 flex items-center justify-center rounded-sm text-slate-500 hover:text-red-400 hover:bg-navy-800 transition-colors"
                      title="Sign out"
                    >
                      <i className="fa-solid fa-arrow-right-from-bracket text-xs" />
                    </button>
                  </form>
                </motion.div>

              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
