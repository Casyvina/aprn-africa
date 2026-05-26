import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardNav from "@/components/DashboardNav";
import DashboardMobileNav from "@/components/DashboardMobileNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, membership_tier")
    .eq("id", user.id)
    .single();

  const displayName = profile?.full_name ?? user.email ?? "Member";
  const tier = profile?.membership_tier ?? "free";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const firstName = displayName.split(" ")[0];

  return (
    <div
      className="flex h-screen bg-navy-900 overflow-hidden"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside className="hidden md:flex w-[260px] shrink-0 flex-col bg-navy-900 border-r border-white/5 h-screen overflow-y-auto">
        {/* Logo */}
        <div className="px-8 py-6 border-b border-white/5 shrink-0">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="APRN"
              width={999}
              height={453}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Nav items (client — needs usePathname for active state) */}
        <DashboardNav />

        {/* User + sign out */}
        <div className="px-8 py-6 border-t border-white/5 shrink-0">
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
      </aside>

      {/* ── Main area ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top header */}
        <header className="shrink-0 border-b border-white/5 bg-navy-900/95 backdrop-blur-md z-40">
          <div className="px-6 md:px-8 h-20 flex items-center justify-between gap-6">

            {/* Mobile: hamburger drawer trigger */}
            <DashboardMobileNav initials={initials} tier={tier} displayName={displayName} />

            {/* Search */}
            <div className="flex-1 max-w-xl hidden md:block">
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search intelligence, reports, members..."
                  className="w-full bg-navy-800 border border-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/40 transition-colors"
                />
              </div>
            </div>

            {/* Right: bell + user */}
            <div className="flex items-center gap-5 shrink-0 ml-auto">
              <button className="relative text-slate-400 hover:text-gold-500 transition-colors">
                <i className="fa-solid fa-bell text-base" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold-500 rounded-full" />
              </button>

              <div className="flex items-center gap-3 pl-5 border-l border-white/5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center">
                    <span className="text-xs font-bold text-gold-500">{initials}</span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-navy-900 rounded-full" />
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-white">{firstName}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest capitalize">{tier}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
