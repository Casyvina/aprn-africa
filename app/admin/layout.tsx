import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowed.includes(email.toLowerCase());
}

const adminNav = [
  { href: "/admin",          icon: "fa-chart-line",          label: "Overview"  },
  { href: "/admin/members",  icon: "fa-users",               label: "Members"   },
  { href: "/admin/generate", icon: "fa-wand-magic-sparkles", label: "Generate"  },
  { href: "/admin/payments", icon: "fa-credit-card",         label: "Payments"  },
  { href: "/admin/sitemap",  icon: "fa-sitemap",             label: "Site Map"  },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!isAdmin(user.email)) redirect("/dashboard");

  return (
    <div
      className="flex h-dvh bg-navy-900 overflow-hidden"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col bg-navy-900 border-r border-white/5 h-dvh">
        <div className="px-6 py-5 border-b border-white/5 shrink-0">
          <Link href="/">
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

        <nav className="flex-1 py-4 overflow-y-auto">
          <p className="px-5 mb-2 text-[9px] font-bold tracking-widest text-slate-600 uppercase">
            Management
          </p>
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mx-3 px-3 py-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-navy-800 flex items-center gap-3 transition-colors rounded-sm"
            >
              <i className={`fa-solid ${item.icon} w-4 text-center text-[11px] text-slate-500`} />
              {item.label}
            </Link>
          ))}

          <p className="px-5 mt-6 mb-2 text-[9px] font-bold tracking-widest text-slate-600 uppercase">
            Strategy &amp; Docs
          </p>
          {[
            { href: "/admin/strategy/communication", icon: "fa-satellite-dish",    label: "Comms Strategy" },
            { href: "/admin/strategy/stakeholders",  icon: "fa-circle-nodes",      label: "Stakeholder Map" },
            { href: "/admin/strategy/documents",     icon: "fa-folder-open",       label: "Document Library" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mx-3 px-3 py-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-navy-800 flex items-center gap-3 transition-colors rounded-sm"
            >
              <i className={`fa-solid ${item.icon} w-4 text-center text-[11px] text-slate-500`} />
              {item.label}
            </Link>
          ))}

          <p className="px-5 mt-6 mb-2 text-[9px] font-bold tracking-widest text-slate-600 uppercase">
            Content
          </p>
          <Link
            href="/studio"
            className="mx-3 px-3 py-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-navy-800 flex items-center gap-3 transition-colors rounded-sm"
          >
            <i className="fa-solid fa-pen-nib w-4 text-center text-[11px] text-slate-500" />
            Sanity Studio
          </Link>
        </nav>

        <div className="px-5 py-4 border-t border-white/5 shrink-0">
          <p className="text-[10px] text-slate-500 truncate mb-3">{user.email}</p>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
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
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="shrink-0 border-b border-white/5 bg-navy-900/95 backdrop-blur-md">
          <div className="px-6 md:px-8 h-14 flex items-center gap-4">
            <span className="text-[10px] font-bold tracking-widest uppercase text-gold-500 bg-gold-500/10 border border-gold-500/20 px-2.5 py-1">
              Admin
            </span>
            <span className="text-xs text-slate-500 hidden md:block">
              Signed in as <span className="text-slate-300">{user.email}</span>
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
