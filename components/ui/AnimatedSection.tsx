"use client"

import { motion, type Variants } from "framer-motion"
import { useReducedMotion, fadeUp, fadeDown, fadeLeft, fadeRight, fadeIn, scaleIn, cardReveal, noopVariants } from "@/lib/animations"

const variantMap: Record<string, Variants> = {
  fadeUp,
  fadeDown,
  fadeLeft,
  fadeRight,
  fadeIn,
  scaleIn,
  cardReveal,
}

interface AnimatedSectionProps {
  variant?: keyof typeof variantMap
  delay?: number
  className?: string
  once?: boolean
  amount?: number
  as?: "div" | "section" | "article" | "li"
  children: React.ReactNode
}

export default function AnimatedSection({
  variant = "fadeUp",
  delay = 0,
  className,
  once = true,
  amount = 0.15,
  as = "div",
  children,
}: AnimatedSectionProps) {
  const reduced = useReducedMotion()

  const chosen = reduced ? noopVariants : (variantMap[variant] ?? fadeUp)

  // Inject delay into the visible transition
  const variants: Variants = delay > 0 && !reduced
    ? {
        hidden:  chosen.hidden,
        visible: {
          ...(chosen.visible as object),
          transition: {
            ...((chosen.visible as { transition?: object }).transition ?? {}),
            delay,
          },
        },
      }
    : chosen

  const MotionEl = motion[as] as typeof motion.div

  return (
    <MotionEl
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
    >
      {children}
    </MotionEl>
  )
}
