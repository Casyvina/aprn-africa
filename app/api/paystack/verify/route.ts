import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Amount in kobo per membership tier
const TIER_AMOUNTS: Record<string, number> = {
  student:      1_000_000,   // ₦10,000
  graduate:     2_500_000,   // ₦25,000
  professional: 5_000_000,   // ₦50,000
  associate:    3_500_000,   // ₦35,000
  corporate:   50_000_000,   // ₦500,000
};

export async function POST(req: NextRequest) {
  const { reference, tier } = await req.json();

  if (!reference || !tier) {
    return NextResponse.json({ error: "Missing reference or tier" }, { status: 400 });
  }

  // 1 — Verify transaction with Paystack
  const paystackRes = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
  );

  if (!paystackRes.ok) {
    return NextResponse.json({ error: "Paystack API error" }, { status: 502 });
  }

  const { data } = await paystackRes.json();

  if (data?.status !== "success") {
    return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
  }

  // 2 — Amount check (skip in test mode if amount is 0 for free test runs)
  const expectedKobo = TIER_AMOUNTS[tier];
  if (expectedKobo && data.amount !== expectedKobo) {
    console.warn(`Amount mismatch — expected ${expectedKobo}, got ${data.amount}`);
    // Warn but don't hard-fail in test mode
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }
  }

  // 3 — Get the authenticated user from session cookie
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // 4 — Update membership tier in profiles
  const { error: dbError } = await supabase
    .from("profiles")
    .update({ membership_tier: tier, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (dbError) {
    console.error("Supabase update error:", dbError);
    return NextResponse.json({ error: "Failed to update membership" }, { status: 500 });
  }

  return NextResponse.json({ success: true, tier });
}
