"use client"

import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { useReducedMotion } from "@/lib/animations"

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const reduced = useReducedMotion()

  // Admin uses its own AdminContentTransition — skip here so the sidebar doesn't flicker
  if (reduced || pathname.startsWith("/admin")) return <>{children}</>

  return (
    // initial={false}: no fade-in animation on first page load — only triggers on navigation
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.12, ease: "easeOut" as const }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
