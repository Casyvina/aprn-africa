import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: "fa-house", label: "Overview" },
  { href: "/dashboard/research", icon: "fa-book-open", label: "Research" },
  { href: "/dashboard/courses", icon: "fa-graduation-cap", label: "Courses" },
  { href: "/dashboard/profile", icon: "fa-circle-user", label: "Profile" },
  { href: "/dashboard/membership", icon: "fa-id-card", label: "Membership" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, membership_tier, role")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-navy-900 flex" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-navy-800 border-r border-white/5">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="APRN" className="h-8 w-auto" />
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-sm transition-all group"
            >
              <i className={`fa-solid ${item.icon} text-xs w-4 text-slate-500 group-hover:text-gold-500 transition-colors`} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User card */}
        <div className="px-4 py-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-user text-gold-500 text-xs" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">
                {profile?.full_name ?? user.email}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider capitalize">
                {profile?.membership_tier ?? "free"}
              </p>
            </div>
          </div>
          <form action="/auth/signout" method="post">
            <button
              formAction="/api/auth/signout"
              className="w-full text-left text-xs text-slate-500 hover:text-red-400 transition-colors px-1 py-1"
            >
              <i className="fa-solid fa-arrow-right-from-bracket mr-2" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Top bar — mobile */}
        <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-white/5 bg-navy-800">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="APRN" className="h-7 w-auto" />
          </Link>
          <span className="text-xs text-slate-400">{profile?.full_name ?? user.email}</span>
        </div>

        <div className="px-6 py-10 lg:px-10 lg:py-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
