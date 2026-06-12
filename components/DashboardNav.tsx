"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard",               icon: "fa-chart-line",     label: "Overview" },
  { href: "/dashboard/intelligence",  icon: "fa-newspaper",      label: "Intelligence" },
  { href: "/dashboard/research",      icon: "fa-flask",          label: "My Research" },
  { href: "/dashboard/courses",    icon: "fa-graduation-cap", label: "Training & Courses" },
  { href: "/dashboard/network",    icon: "fa-network-wired",  label: "Engineer Network" },
  { href: "/dashboard/membership", icon: "fa-id-card",        label: "Membership" },
  { href: "/dashboard/saved",      icon: "fa-bookmark",       label: "Saved Articles" },
  { href: "/dashboard/settings",   icon: "fa-gear",           label: "Settings", gap: true },
];

export default function DashboardNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col py-4 flex-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-8 py-3.5 text-sm font-medium border-l-2 flex items-center gap-3 transition-colors${item.gap ? " mt-8" : ""} ${
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
  );
}
