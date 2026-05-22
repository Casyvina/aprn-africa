"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/leadership", label: "Leadership" },
  { href: "/training", label: "Training" },
  { href: "/partnerships", label: "Partnerships" },
  { href: "/research", label: "Research" },
  { href: "/insights", label: "Insights" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      id="header"
      className="fixed w-full z-50"
      style={{
        background: scrolled ? "rgba(7, 27, 42, 0.97)" : "rgba(7, 27, 42, 0.55)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: scrolled
          ? "1px solid rgba(21, 50, 74, 0.9)"
          : "1px solid rgba(21, 50, 74, 0.4)",
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.35)" : "none",
        transition: "background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease",
      }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" as const }}
    >
      <div className="max-w-360 mx-auto px-6 md:px-12 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/images/logo.png"
            alt="African Pipeline Resource Network"
            width={999}
            height={453}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop links — with sliding active indicator + hover underline */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium tracking-wide">
          {navLinks.map((l) => {
            const isActive = pathname === l.href;
            return (
              <a
                key={l.href}
                href={l.href}
                className={`group relative py-1.5 transition-colors duration-200 hover:text-gold-500 cursor-pointer ${
                  isActive ? "text-gold-500" : "text-slate-300"
                }`}
              >
                {l.label}
                {/* Hover underline — only on inactive links */}
                {!isActive && (
                  <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 rounded-full bg-gold-500/40 transition-[width] duration-200 group-hover:w-full" />
                )}
                {/* Active underline via layoutId */}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-gold-500"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* Desktop CTAs + mobile hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Member Portal */}
          <Link
            href="/login"
            className="hidden md:inline-flex px-4 py-2 text-sm font-medium text-slate-300 border border-navy-700/70 hover:border-gold-500/40 hover:text-gold-500 transition-all rounded-sm"
          >
            Member Portal
          </Link>

          {/* Join Network CTA */}
          <a
            href="/contact"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-navy-900 bg-gold-500 hover:bg-gold-400 rounded-sm transition-all duration-200 shadow-[0_0_16px_rgba(212,160,23,0.3)] hover:shadow-[0_0_24px_rgba(212,160,23,0.5)] hover:gap-3"
          >
            Join Network
            <i className="fa-solid fa-arrow-right text-xs" />
          </a>

          {/* Animated hamburger — mobile only */}
          <button
            className="md:hidden relative w-10 h-10 flex flex-col justify-center items-center gap-1.5 rounded-sm hover:bg-navy-700/50 transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <motion.span
              animate={open ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="block w-5 h-0.5 bg-white rounded-full origin-center"
            />
            <motion.span
              animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="block w-5 h-0.5 bg-white rounded-full origin-center"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="block w-5 h-0.5 bg-white rounded-full origin-center"
            />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden overflow-hidden"
            style={{ borderTop: "1px solid rgba(21, 50, 74, 0.6)" }}
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.div
              className="px-6 pt-3 pb-6 flex flex-col bg-navy-900/98 backdrop-blur-xl"
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.055, delayChildren: 0.04 } },
                closed: {},
              }}
            >
              {/* Nav links */}
              {navLinks.map((l) => {
                const isActive = pathname === l.href;
                return (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    variants={{
                      open: { opacity: 1, x: 0, transition: { duration: 0.22, ease: "easeOut" as const } },
                      closed: { opacity: 0, x: -14 },
                    }}
                    className={`flex items-center justify-between py-3.5 border-b border-navy-800/60 last:border-0 group ${
                      isActive ? "text-gold-500" : "text-slate-300"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {/* Active indicator bar */}
                      <motion.span
                        className="w-0.75 h-4 bg-gold-500 rounded-full"
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={isActive ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                      <span className="text-sm font-medium group-hover:text-gold-500 transition-colors">
                        {l.label}
                      </span>
                    </span>
                    <i
                      className={`fa-solid fa-arrow-right text-xs transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-gold-500 ${
                        isActive ? "text-gold-500" : "text-navy-700"
                      }`}
                    />
                  </motion.a>
                );
              })}

              {/* CTAs */}
              <motion.div
                className="pt-5 flex flex-col gap-3"
                variants={{
                  open: { opacity: 1, y: 0, transition: { duration: 0.28, delay: 0.38, ease: "easeOut" as const } },
                  closed: { opacity: 0, y: 8 },
                }}
              >
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="w-full px-5 py-3 text-sm font-medium text-slate-300 border border-navy-700 hover:border-gold-500/40 hover:text-gold-500 transition-all rounded-sm text-center"
                >
                  Member Portal
                </Link>
                <a
                  href="/contact"
                  className="flex items-center justify-center gap-2 w-full px-5 py-3.5 text-sm font-semibold text-navy-900 bg-gold-500 hover:bg-gold-400 transition-colors rounded-sm shadow-[0_0_16px_rgba(212,160,23,0.3)]"
                >
                  Join Network
                  <i className="fa-solid fa-arrow-right text-xs" />
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
