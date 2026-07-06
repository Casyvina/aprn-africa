"use client"

import { useAuthStore } from "@/store/auth"

interface Props {
  initials: string
  className?: string
  showStatus?: boolean
  statusClassName?: string
}

export default function DashboardAvatar({
  initials,
  className = "w-9 h-9",
  showStatus = false,
  statusClassName = "absolute bottom-0 right-0 w-2 h-2 md:w-2.5 md:h-2.5 bg-emerald-400 border-2 border-navy-900 rounded-full",
}: Props) {
  const avatarUrl = useAuthStore((s) => s.profile?.avatar_url)

  return (
    <div className="relative shrink-0">
      <div className={`${className} rounded-full overflow-hidden bg-gold-500/20 border border-gold-500/30 flex items-center justify-center`}>
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs font-bold text-gold-500">{initials}</span>
        )}
      </div>
      {showStatus && <div className={statusClassName} />}
    </div>
  )
}
