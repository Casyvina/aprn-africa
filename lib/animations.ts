import { type Variants } from "framer-motion"
import { useEffect, useState } from "react"

// Institutional cubic-bezier — smooth authority, not spring, not bounce
// Typed as a 4-tuple so Framer Motion v12 accepts it as BezierDefinition
export const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1]

// ── Fade variants ──────────────────────────────────────────────────────────

export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.5,  ease } },
}

export const fadeDown: Variants = {
  hidden:  { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0,   transition: { duration: 0.5,  ease } },
}

export const fadeLeft: Variants = {
  hidden:  { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0,   transition: { duration: 0.55, ease } },
}

export const fadeRight: Variants = {
  hidden:  { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.55, ease } },
}

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease } },
}

// ── Scale variants ─────────────────────────────────────────────────────────

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1,    transition: { duration: 0.45, ease } },
}

export const cardReveal: Variants = {
  hidden:  { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1,    transition: { duration: 0.4,  ease } },
}

// ── Stagger containers ─────────────────────────────────────────────────────

export const staggerContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

export const staggerContainerFast: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.055 } },
}

// ── Reduced-motion hook ────────────────────────────────────────────────────

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])
  return reduced
}

// ── Count-up hook ─────────────────────────────────────────────────────────

/**
 * Animates a number from 0 to `target` over `duration` ms once `trigger` is true.
 * Returns the current display value as a string.
 * Respects reduced motion — returns final value immediately when active.
 */
export function useCountUp(
  target: number,
  duration: number,
  trigger: boolean,
  decimals = 0,
): number {
  const [value, setValue] = useState(0)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!trigger) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (reducedMotion) { setValue(target); return }

    const start = performance.now()
    let raf: number

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(parseFloat((eased * target).toFixed(decimals)))
      if (progress < 1) raf = requestAnimationFrame(step)
      else setValue(target)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [trigger, target, duration, decimals, reducedMotion])

  return value
}

// ── No-op variants (used when reduced motion is active) ───────────────────

export const noopVariants: Variants = {
  hidden:  { opacity: 1, x: 0, y: 0, scale: 1 },
  visible: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0 } },
}
