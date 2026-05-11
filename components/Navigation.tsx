"use client";

import { useState } from "react";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#pillars", label: "Pillars" },
  { href: "#map", label: "Infrastructure Map" },
  { href: "#research", label: "Research" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <nav id="header" className="fixed w-full z-50 glass-panel border-b border-navy-700/50">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-gold-500 to-copper-500 flex items-center justify-center">
            <i className="fa-solid fa-network-wired text-navy-900 text-xl"></i>
          </div>
          <span className="font-display font-bold text-xl tracking-wider text-white">APRN</span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300 tracking-wide">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-gold-500 transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs + mobile hamburger */}
        <div className="flex items-center gap-4">
          <button className="hidden md:block px-5 py-2.5 text-sm font-semibold text-white border border-gold-500/30 hover:border-gold-500 hover:bg-gold-500/10 transition-all rounded-sm">
            Member Portal
          </button>
          <button className="hidden md:block px-5 py-2.5 text-sm font-semibold text-navy-900 bg-gold-500 hover:bg-gold-400 transition-colors rounded-sm shadow-[0_0_15px_rgba(212,160,23,0.3)]">
            Join Network
          </button>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-sm hover:bg-navy-700 transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-0.5 bg-white transition-all duration-300 ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-white transition-all duration-300 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-white transition-all duration-300 ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${open ? "max-h-96 border-t border-navy-700/50" : "max-h-0"}`}
      >
        <div className="px-6 py-4 flex flex-col gap-1 bg-navy-900/95 backdrop-blur-md">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-3 text-sm font-medium text-slate-300 hover:text-gold-500 transition-colors border-b border-navy-800 last:border-0"
            >
              {l.label}
            </a>
          ))}
          <div className="pt-4 flex flex-col gap-3">
            <button className="w-full px-5 py-3 text-sm font-semibold text-white border border-gold-500/30 hover:border-gold-500 hover:bg-gold-500/10 transition-all rounded-sm">
              Member Portal
            </button>
            <button className="w-full px-5 py-3 text-sm font-semibold text-navy-900 bg-gold-500 hover:bg-gold-400 transition-colors rounded-sm">
              Join Network
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
