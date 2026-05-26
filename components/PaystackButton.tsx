"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string;
        email: string;
        amount: number;
        ref: string;
        currency: string;
        label?: string;
        metadata?: Record<string, unknown>;
        onSuccess: (transaction: { reference: string }) => void;
        onCancel: () => void;
      }) => { openIframe: () => void };
    };
  }
}

interface Props {
  planKey: string;
  planName: string;
  amountKobo: number;
  email: string;
  featured?: boolean;
}

type Status = "idle" | "loading-script" | "ready" | "paying" | "verifying" | "success" | "error";

export default function PaystackButton({ planKey, planName, amountKobo, email, featured }: Props) {
  const [status, setStatus] = useState<Status>(() =>
    typeof window !== "undefined" && window.PaystackPop ? "ready" : "loading-script"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  // Load Paystack inline JS once
  useEffect(() => {
    if (window.PaystackPop) return; // already ready — state set by lazy initializer
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => setStatus("ready");
    script.onerror = () => setStatus("error");
    document.body.appendChild(script);
    return () => { /* leave script in DOM for reuse */ };
  }, []);

  const handlePay = useCallback(() => {
    if (!window.PaystackPop) return;
    const ref = `aprn-${planKey}-${Date.now()}`;
    setStatus("paying");
    setErrorMsg("");

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      email,
      amount: amountKobo,
      ref,
      currency: "NGN",
      label: `APRN ${planName} Membership`,
      metadata: { plan: planKey, platform: "aprn-africa" },

      onSuccess: async (transaction) => {
        setStatus("verifying");
        try {
          const res = await fetch("/api/paystack/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference: transaction.reference, tier: planKey }),
          });

          if (!res.ok) {
            const { error } = await res.json();
            throw new Error(error ?? "Verification failed");
          }

          setStatus("success");
          // Brief delay so user sees the success state, then reload page with flag
          setTimeout(() => router.push("/dashboard/membership?upgraded=true"), 1200);
        } catch (err) {
          setStatus("error");
          setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
        }
      },

      onCancel: () => setStatus("ready"),
    });

    handler.openIframe();
  }, [planKey, planName, amountKobo, email, router]);

  const base = featured
    ? "bg-gold-500 text-navy-900 hover:bg-gold-400"
    : "border border-gold-500/30 text-gold-500 hover:bg-gold-500/10";

  if (status === "success") {
    return (
      <div className="w-full py-2.5 flex items-center justify-center gap-2 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-[10px] font-bold tracking-widest uppercase">
        <i className="fa-solid fa-check" />
        Payment confirmed
      </div>
    );
  }

  if (status === "error" && errorMsg) {
    return (
      <div className="flex flex-col gap-2">
        <div className="w-full py-2 flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] tracking-wide">
          <i className="fa-solid fa-triangle-exclamation text-[8px]" />
          {errorMsg}
        </div>
        <button
          onClick={() => { setStatus("ready"); setErrorMsg(""); }}
          className={`w-full py-2.5 text-[10px] font-bold tracking-widest uppercase transition-colors ${base}`}
        >
          Try Again
        </button>
      </div>
    );
  }

  const isLoading = status === "loading-script" || status === "paying" || status === "verifying";
  const labelMap: Record<string, string> = {
    "loading-script": "Loading...",
    paying: "Opening Paystack...",
    verifying: "Confirming payment...",
  };

  return (
    <button
      onClick={handlePay}
      disabled={isLoading}
      className={`w-full py-2.5 text-[10px] font-bold tracking-widest uppercase transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${base}`}
    >
      {isLoading ? (
        <>
          <i className="fa-solid fa-spinner fa-spin text-[9px]" />
          {labelMap[status] ?? "Processing..."}
        </>
      ) : (
        <>
          <i className="fa-solid fa-lock-open text-[9px]" />
          Join — Pay with Paystack
        </>
      )}
    </button>
  );
}
