"use client";

import { useEffect, useRef, useState } from "react";

const SESSION_KEY = "aprn_newsletter_prompted";
const MIN_READ_MS = 20_000; // must have been on page ≥ 20s before popup fires

type Stage = "idle" | "visible" | "loading" | "done" | "dismissed";

export default function NewsletterReadPrompt() {
  const sentinelRef  = useRef<HTMLDivElement>(null);
  const [stage, setStage]           = useState<Stage>("idle");
  const [email, setEmail]           = useState("");
  const [firstName, setFirstName]   = useState("");
  const [error, setError]           = useState<string | null>(null);

  const [reachedEnd, setReachedEnd]       = useState(false);
  const [minTimePassed, setMinTimePassed] = useState(false);

  // Minimum time guard — prevents instant fire on short/fast-scrolled articles
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const t = setTimeout(() => setMinTimePassed(true), MIN_READ_MS);
    return () => clearTimeout(t);
  }, []);

  // Scroll sentinel — marks when reader reaches end of article
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReachedEnd(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Fire only when BOTH conditions are met
  useEffect(() => {
    if (!reachedEnd || !minTimePassed) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    if (stage !== "idle") return;
    const t = setTimeout(() => setStage("visible"), 600);
    return () => clearTimeout(t);
  }, [reachedEnd, minTimePassed, stage]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setError(null);
    setStage("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), firstName: firstName.trim() }),
      });
      if (!res.ok) {
        const data = await res.json() as { message?: string };
        throw new Error(data.message ?? "Something went wrong");
      }
      sessionStorage.setItem(SESSION_KEY, "1");
      setStage("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStage("visible");
    }
  }

  function dismiss() {
    sessionStorage.setItem(SESSION_KEY, "1");
    setStage("dismissed");
  }

  return (
    <>
      {/* Scroll sentinel — sits at the end of the article body */}
      <div ref={sentinelRef} aria-hidden="true" />

      {/* Popup — only rendered when triggered */}
      {(stage === "visible" || stage === "loading" || stage === "done") && (
        <div
          style={{
            position: "fixed",
            bottom: "1.5rem",
            right: "1.5rem",
            zIndex: 9000,
            width: "min(22rem, calc(100vw - 2rem))",
          }}
        >
          <div
            style={{
              background: "#071B2A",
              borderTop: "3px solid #D4A017",
              boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
            }}
          >
            {stage === "done" ? (
              /* ── Success state ── */
              <div className="px-6 py-7 flex items-start gap-4">
                <div
                  className="w-9 h-9 flex items-center justify-center shrink-0"
                  style={{ background: "rgba(212,160,23,0.12)", border: "1px solid rgba(212,160,23,0.3)" }}
                >
                  <i className="fa-solid fa-check text-gold-500 text-sm" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-snug mb-1">
                    You&apos;re on the list
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    We&apos;ll send you APRN intelligence briefings and new research as it publishes.
                  </p>
                </div>
                <button
                  onClick={dismiss}
                  className="ml-auto text-slate-600 hover:text-white transition-colors shrink-0"
                  aria-label="Close"
                >
                  <i className="fa-solid fa-xmark text-sm" />
                </button>
              </div>
            ) : (
              /* ── Prompt state ── */
              <div className="px-6 py-6">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p
                      className="text-[9px] font-bold tracking-widest uppercase mb-1"
                      style={{ color: "#D4A017" }}
                    >
                      APRN Intelligence
                    </p>
                    <h3
                      className="text-base font-bold text-white leading-snug"
                      style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                      Stay ahead of Africa&apos;s pipeline sector
                    </h3>
                  </div>
                  <button
                    onClick={dismiss}
                    className="text-slate-600 hover:text-slate-400 transition-colors shrink-0 mt-0.5"
                    aria-label="Dismiss"
                  >
                    <i className="fa-solid fa-xmark" />
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-5">
                  New research, policy briefs, and market intelligence — delivered to your inbox.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                  <input
                    type="text"
                    placeholder="First name (optional)"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/50 transition-colors"
                    style={{ background: "#0D2436", border: "1px solid rgba(255,255,255,0.08)" }}
                  />
                  <input
                    type="email"
                    required
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/50 transition-colors"
                    style={{ background: "#0D2436", border: "1px solid rgba(255,255,255,0.08)" }}
                  />

                  {error && (
                    <p className="text-xs text-red-400 flex items-center gap-1.5">
                      <i className="fa-solid fa-circle-exclamation text-[10px]" /> {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={stage === "loading" || !email.trim()}
                    className="w-full py-3 text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    style={{ background: "#D4A017", color: "#071B2A" }}
                  >
                    {stage === "loading" ? (
                      <><i className="fa-solid fa-spinner animate-spin text-[10px]" /> Subscribing…</>
                    ) : (
                      <>Subscribe to Briefings</>
                    )}
                  </button>
                </form>

                <p className="text-[10px] text-slate-600 text-center mt-3">
                  No spam. Unsubscribe at any time.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
