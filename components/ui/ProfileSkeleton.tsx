"use client"

export function ProfileSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header row */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-navy-700 shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-4 bg-navy-700 rounded-sm w-40" />
          <div className="h-3 bg-navy-800 rounded-sm w-28" />
        </div>
        <div className="hidden md:block h-8 w-32 bg-navy-700 rounded-sm" />
      </div>
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-navy-800 border border-white/5 p-4">
            <div className="h-6 bg-navy-700 rounded-sm w-16 mb-2" />
            <div className="h-3 bg-navy-800 rounded-sm w-24" />
          </div>
        ))}
      </div>
      {/* Content cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-navy-800 border border-white/5 p-5">
            <div className="h-4 bg-navy-700 rounded-sm w-3/4 mb-3" />
            <div className="h-3 bg-navy-800 rounded-sm w-full mb-2" />
            <div className="h-3 bg-navy-800 rounded-sm w-5/6" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function InlineSkeleton({ className }: { className?: string }) {
  return (
    <div className={`h-4 bg-navy-700 rounded-sm animate-pulse ${className ?? "w-24"}`} />
  )
}
