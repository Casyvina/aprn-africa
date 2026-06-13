"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const adminNav = [
  { href: "/admin",          icon: "fa-chart-line",          label: "Overview"  },
  { href: "/admin/members",  icon: "fa-users",               label: "Members"   },
  { href: "/admin/generate", icon: "fa-wand-magic-sparkles", label: "Generate"  },
  { href: "/admin/payments", icon: "fa-credit-card",         label: "Payments"  },
  { href: "/admin/sitemap",  icon: "fa-sitemap",             label: "Site Map"  },
];

const strategyNav = [
  { href: "/admin/strategy/communication", icon: "fa-satellite-dish", label: "Comms Strategy"  },
  { href: "/admin/strategy/stakeholders",  icon: "fa-circle-nodes",   label: "Stakeholder Map" },
  { href: "/admin/strategy/documents",     icon: "fa-folder-open",    label: "Document Library" },
];

const contentNav = [
  { href: "/admin/content-studio", icon: "fa-image",   label: "Content Studio" },
  { href: "/studio",               icon: "fa-pen-nib", label: "Sanity Studio"  },
];

export default function AdminMobileNav({
  userEmail,
  isPersonnelUser,
}: {
  userEmail: string;
  isPersonnelUser: boolean;
}) {
  const [open, setOpen] = useState(false);

  const navItem = (item: { href: string; icon: string; label: string }) => (
    <Link
      key={item.href}
      href={item.href}
      onClick={() => setOpen(false)}
      className="mx-3 px-3 py-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-navy-800 flex items-center gap-3 transition-colors"
    >
      <i className={`fa-solid ${item.icon} w-4 text-center text-[11px] text-slate-500`} />
      {item.label}
    </Link>
  );

  return (
    <>
      {/* Hamburger — visible in header on mobile only */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        aria-label="Open admin menu"
      >
        <i className="fa-solid fa-bars text-sm" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`md:hidden fixed top-0 left-0 bottom-0 z-50 w-64 bg-navy-900 border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="px-5 py-5 border-b border-white/5 shrink-0 flex items-center justify-between">
          <div>
            <Link href="/" onClick={() => setOpen(false)}>
              <Image src="/images/logo.png" alt="APRN" width={999} height={453} className="h-6 w-auto" />
            </Link>
            <p className="text-[9px] font-bold tracking-widest uppercase text-gold-500 mt-2">Admin Panel</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-slate-500 hover:text-white transition-colors p-1"
            aria-label="Close menu"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <p className="px-5 mb-2 text-[9px] font-bold tracking-widest text-slate-600 uppercase">Management</p>
          {adminNav.map(navItem)}

          <p className="px-5 mt-6 mb-2 text-[9px] font-bold tracking-widest text-slate-600 uppercase">Strategy &amp; Docs</p>
          {strategyNav.map(navItem)}
          {isPersonnelUser && (
            <Link
              href="/admin/personnel"
              onClick={() => setOpen(false)}
              className="mx-3 px-3 py-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-navy-800 flex items-center gap-3 transition-colors"
            >
              <i className="fa-solid fa-lock w-4 text-center text-[11px] text-slate-500" />
              Personnel
            </Link>
          )}

          <p className="px-5 mt-6 mb-2 text-[9px] font-bold tracking-widest text-slate-600 uppercase">Content</p>
          {contentNav.map(navItem)}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/5 shrink-0">
          <p className="text-[10px] text-slate-500 truncate mb-3">{userEmail}</p>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="text-[10px] text-slate-500 hover:text-gold-500 transition-colors flex items-center gap-1.5"
            >
              <i className="fa-solid fa-arrow-left text-[9px]" />
              Dashboard
            </Link>
            <form action="/api/auth/signout" method="post" className="ml-auto">
              <button
                formAction="/api/auth/signout"
                className="text-[10px] text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1.5"
              >
                <i className="fa-solid fa-arrow-right-from-bracket text-[9px]" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
