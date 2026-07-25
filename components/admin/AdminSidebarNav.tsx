"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const managementNav = [
  { href: "/admin",               icon: "fa-chart-line",          label: "Overview"      },
  { href: "/admin/members",       icon: "fa-users",               label: "Members"       },
  { href: "/admin/database",      icon: "fa-database",            label: "Database"      },
  { href: "/admin/outreach",      icon: "fa-paper-plane",         label: "Outreach"      },
  { href: "/admin/newsletter",    icon: "fa-envelope-open-text",  label: "Newsletter"    },
  { href: "/admin/generate",      icon: "fa-wand-magic-sparkles", label: "Generate"      },
  { href: "/admin/payments",      icon: "fa-credit-card",         label: "Payments"      },
  { href: "/admin/weekly-report", icon: "fa-newspaper",           label: "Weekly Report" },
  { href: "/admin/sitemap",       icon: "fa-sitemap",             label: "Site Map"      },
  { href: "/admin/guide",         icon: "fa-book-open",           label: "Admin Guide"   },
]

const strategyNav = [
  { href: "/admin/strategy/communication", icon: "fa-satellite-dish", label: "Comms Strategy"   },
  { href: "/admin/strategy/stakeholders",  icon: "fa-circle-nodes",   label: "Stakeholder Map"  },
  { href: "/admin/strategy/documents",     icon: "fa-folder-open",    label: "Document Library" },
]

const contentNav = [
  { href: "/admin/content-studio", icon: "fa-image",            label: "Content Studio", external: false },
  { href: "/admin/import",         icon: "fa-file-import",      label: "Import Article", external: false },
  { href: "/studio",               icon: "fa-pen-nib",          label: "Sanity Studio",  external: true  },
]

function NavItem({ href, icon, label, external }: { href: string; icon: string; label: string; external?: boolean }) {
  const pathname = usePathname()
  const isActive = !external && (href === "/admin"
    ? pathname === "/admin"
    : pathname === href || pathname.startsWith(href + "/"))

  const cls = `mx-3 px-3 py-2.5 text-xs font-medium flex items-center gap-3 transition-colors border-l-2 ${
    isActive
      ? "text-white bg-navy-800 border-gold-500"
      : "text-slate-400 hover:text-white hover:bg-navy-800 border-transparent"
  }`

  const iconEl = (
    <i className={`fa-solid ${icon} w-4 text-center text-[11px] transition-colors ${isActive ? "text-gold-500" : "text-slate-500"}`} />
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {iconEl}
        {label}
        <i className="fa-solid fa-arrow-up-right-from-square text-[8px] text-slate-600 ml-auto" />
      </a>
    )
  }

  return (
    <Link href={href} className={cls}>
      {iconEl}
      {label}
    </Link>
  )
}

export default function AdminSidebarNav({ isPersonnelUser }: { isPersonnelUser: boolean }) {
  return (
    <nav className="flex-1 py-4 overflow-y-auto">
      <p className="px-5 mb-2 text-[9px] font-bold tracking-widest text-slate-600 uppercase">
        Management
      </p>
      {managementNav.map((item) => (
        <NavItem key={item.href} {...item} />
      ))}

      <p className="px-5 mt-6 mb-2 text-[9px] font-bold tracking-widest text-slate-600 uppercase">
        Strategy &amp; Docs
      </p>
      {strategyNav.map((item) => (
        <NavItem key={item.href} {...item} />
      ))}
      {isPersonnelUser && (
        <NavItem href="/admin/personnel" icon="fa-lock" label="Personnel" />
      )}

      <p className="px-5 mt-6 mb-2 text-[9px] font-bold tracking-widest text-slate-600 uppercase">
        Content
      </p>
      {contentNav.map((item) => (
        <NavItem key={item.href} {...item} />
      ))}
    </nav>
  )
}
