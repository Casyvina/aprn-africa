"use client";

import { useState, useEffect } from "react";
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
      className="mx-3 px-3 py-3 text-xs font-medium text-slate-400 hover:text-white hover:bg-navy-800 flex items-center gap-3 transition-colors"
    >
      <i className={`fa-solid ${item.icon} w-4 text-center text-[11px] text-slate-500`} />
      {item.label}
    </Link>
  );

  return (
    <>
      {/* Hamburger button — only visible on mobile (hidden md+) */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        aria-label="Open navigation"
      >
        <i className="fa-solid fa-bars text-base" />
      </button>

      {/* Overlay + Drawer — only mounted when open */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={close}
            style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.65)" }}
          />

          {/* Drawer */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              zIndex: 9999,
              width: "16rem",
              display: "flex",
              flexDirection: "column",
              background: "#071B2A",
              borderRight: "1px solid rgba(255,255,255,0.05)",
              overflowY: "auto",
            }}
          >
            {/* Header */}
            <div className="px-5 py-5 border-b border-white/5 shrink-0 flex items-center justify-between">
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
                className="text-slate-500 hover:text-white transition-colors p-1"
                aria-label="Close navigation"
              >
                <i className="fa-solid fa-xmark text-base" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4">
              <p className="px-5 mb-2 text-[9px] font-bold tracking-widest text-slate-600 uppercase">
                Management
              </p>
              {adminNav.map(navItem)}

              <p className="px-5 mt-6 mb-2 text-[9px] font-bold tracking-widest text-slate-600 uppercase">
                Strategy &amp; Docs
              </p>
              {strategyNav.map(navItem)}
              {isPersonnelUser && (
                <Link
                  href="/admin/personnel"
                  onClick={close}
                  className="mx-3 px-3 py-3 text-xs font-medium text-slate-400 hover:text-white hover:bg-navy-800 flex items-center gap-3 transition-colors"
                >
                  <i className="fa-solid fa-lock w-4 text-center text-[11px] text-slate-500" />
                  Personnel
                </Link>
              )}

              <p className="px-5 mt-6 mb-2 text-[9px] font-bold tracking-widest text-slate-600 uppercase">
                Content
              </p>
              {contentNav.map(navItem)}
            </nav>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-white/5 shrink-0">
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
        </>
      )}
    </>
  );
}
