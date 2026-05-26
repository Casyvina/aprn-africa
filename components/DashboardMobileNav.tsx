"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/dashboard",            icon: "fa-chart-line",     label: "Overview" },
  { href: "/dashboard/research",   icon: "fa-flask",          label: "My Research" },
  { href: "/dashboard/courses",    icon: "fa-graduation-cap", label: "Training & Courses" },
  { href: "/dashboard/network",    icon: "fa-network-wired",  label: "Engineer Network" },
  { href: "/dashboard/membership", icon: "fa-id-card",        label: "Membership" },
  { href: "/dashboard/saved",      icon: "fa-bookmark",       label: "Saved Articles" },
  { href: "/dashboard/settings",   icon: "fa-gear",           label: "Settings", gap: true },
];

interface Props {
  initials: string;
  tier: string;
  displayName: string;
}

export default function DashboardMobileNav({ initials, tier, displayName }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Hamburger button — shown in header on mobile */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white transition-colors shrink-0"
        aria-label="Open navigation menu"
      >
        <i className="fa-solid fa-bars text-base" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-navy-900/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-in drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-navy-900 border-r border-white/5 z-50 flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between shrink-0">
          <Link href="/" onClick={() => setOpen(false)}>
            <Image
              src="/images/logo.png"
              alt="APRN"
              width={999}
              height={453}
              className="h-7 w-auto"
              priority
            />
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            aria-label="Close navigation menu"
          >
            <i className="fa-solid fa-xmark text-base" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col py-4 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-6 py-3.5 text-sm font-medium border-l-2 flex items-center gap-3 transition-colors${item.gap ? " mt-8" : ""} ${
                  isActive
                    ? "text-gold-500 border-gold-500 bg-navy-800/50"
                    : "text-slate-400 border-transparent hover:text-white hover:bg-navy-800"
                }`}
              >
                <i className={`fa-solid ${item.icon} w-4 text-center text-xs`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="px-6 py-5 border-t border-white/5 shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-gold-500">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {displayName.split(" ").slice(0, 2).join(" ")}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider capitalize">
                {tier} member
              </p>
            </div>
          </div>
          <form action="/api/auth/signout" method="post">
            <button
              formAction="/api/auth/signout"
              className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center gap-2"
            >
              <i className="fa-solid fa-arrow-right-from-bracket w-4 text-center" />
              Sign out
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
