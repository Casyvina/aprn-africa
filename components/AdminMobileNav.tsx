"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);

  // Only render portal after hydration
  useEffect(() => { setMounted(true); }, []);

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  const navItem = (item: { href: string; icon: string; label: string }) => (
    <Link
      key={item.href}
      href={item.href}
      onClick={close}
      className="flex items-center gap-3 mx-3 px-3 py-3 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
    >
      <i className={`fa-solid ${item.icon} text-[11px] text-slate-500 w-4 text-center`} />
      {item.label}
    </Link>
  );

  const drawer = open && mounted && createPortal(
    <>
      {/* Backdrop — portal child, rendered on document.body */}
      <div
        onClick={close}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99998,
          background: "rgba(0,0,0,0.7)",
        }}
      />

      {/* Drawer panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "17rem",
          zIndex: 99999,
          display: "flex",
          flexDirection: "column",
          background: "#0D2436",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          overflowY: "auto",
        }}
      >
        {/* Drawer header */}
        <div
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          className="px-5 py-5 shrink-0 flex items-center justify-between"
        >
          <div>
            <Link href="/" onClick={close}>
              <Image
                src="/images/logo.png"
                alt="APRN"
                width={999}
                height={453}
                className="h-6 w-auto"
                priority
              />
            </Link>
            <p className="text-[9px] font-bold tracking-widest uppercase text-gold-500 mt-2">
              Admin Panel
            </p>
          </div>
          <button
            onClick={close}
            aria-label="Close navigation"
            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <p className="px-5 mb-1 text-[9px] font-bold tracking-widest text-slate-600 uppercase">
            Management
          </p>
          {adminNav.map(navItem)}

          <p className="px-5 mt-5 mb-1 text-[9px] font-bold tracking-widest text-slate-600 uppercase">
            Strategy &amp; Docs
          </p>
          {strategyNav.map(navItem)}
          {isPersonnelUser && (
            <Link
              href="/admin/personnel"
              onClick={close}
              className="flex items-center gap-3 mx-3 px-3 py-3 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <i className="fa-solid fa-lock text-[11px] text-slate-500 w-4 text-center" />
              Personnel
            </Link>
          )}

          <p className="px-5 mt-5 mb-1 text-[9px] font-bold tracking-widest text-slate-600 uppercase">
            Content
          </p>
          {contentNav.map(navItem)}
        </nav>

        {/* Footer */}
        <div
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          className="px-5 py-4 shrink-0"
        >
          <p className="text-[10px] text-slate-500 truncate mb-3">{userEmail}</p>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              onClick={close}
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
    </>,
    document.body
  );

  return (
    <>
      {/* Hamburger — hidden on desktop, shown on mobile */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        className="md:hidden w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white transition-colors shrink-0"
      >
        <i className="fa-solid fa-bars text-base" />
      </button>

      {drawer}
    </>
  );
}
