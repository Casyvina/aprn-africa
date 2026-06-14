"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useReducedMotion } from "@/lib/animations"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now())
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  }
}

function pad(n: number) {
  return String(n).padStart(2, "0")
}

interface DigitProps {
  value: string
  reduced: boolean
}

function FlipDigit({ value, reduced }: DigitProps) {
  return (
    <div className="relative overflow-hidden h-12 w-10 flex items-center justify-center">
      <AnimatePresence mode="popLayout" initial={false}>
        {reduced ? (
          <span key={value} className="text-3xl font-bold text-gold-500 font-mono tabular-nums">
            {value}
          </span>
        ) : (
          <motion.span
            key={value}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0,     opacity: 1 }}
            exit={{   y: "-100%", opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
            className="absolute text-3xl font-bold text-gold-500 font-mono tabular-nums"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            {value}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

interface CountdownSegmentProps {
  value: number
  label: string
  reduced: boolean
}

function CountdownSegment({ value, label, reduced }: CountdownSegmentProps) {
  const str = pad(value)
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="bg-navy-800 border border-gold-500/20 px-4 py-3 flex items-center gap-0.5 shadow-[inset_0_1px_0_rgba(212,160,23,0.08)]">
        <FlipDigit value={str[0]} reduced={reduced} />
        <FlipDigit value={str[1]} reduced={reduced} />
      </div>
      <span className="text-[9px] font-bold tracking-widest uppercase text-slate-500">{label}</span>
    </div>
  )
}

interface CountdownTimerProps {
  /** Target date — defaults to APLS Morocco 2026 opening day */
  targetDate?: Date
  className?: string
}

export default function CountdownTimer({
  targetDate = new Date("2026-10-06T09:00:00"),
  className,
}: CountdownTimerProps) {
  const reduced   = useReducedMotion()
  const [time, setTime]     = useState<TimeLeft | null>(null)
  const [ended, setEnded]   = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const tick = () => {
      const t = getTimeLeft(targetDate)
      setTime(t)
      if (t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0) {
        setEnded(true)
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }
    tick()
    intervalRef.current = setInterval(tick, 1_000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [targetDate])

  if (ended) {
    return (
      <div className={className}>
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
          Event has concluded
        </p>
      </div>
    )
  }

  if (!time) return null

  return (
    <div className={className}>
      <p className="text-[9px] font-bold tracking-widest text-gold-500 uppercase mb-4">
        Countdown to APLS Morocco 2026
      </p>
      <div className="flex items-start gap-3">
        <CountdownSegment value={time.days}    label="Days"    reduced={reduced} />
        <span className="text-2xl text-gold-500/40 font-light mt-3">:</span>
        <CountdownSegment value={time.hours}   label="Hours"   reduced={reduced} />
        <span className="text-2xl text-gold-500/40 font-light mt-3">:</span>
        <CountdownSegment value={time.minutes} label="Minutes" reduced={reduced} />
        <span className="text-2xl text-gold-500/40 font-light mt-3">:</span>
        <CountdownSegment value={time.seconds} label="Seconds" reduced={reduced} />
      </div>
    </div>
  )
}
