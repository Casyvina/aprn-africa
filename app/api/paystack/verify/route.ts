import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

  const admin = createAdminClient();

  // 4 — Idempotency: reject if this reference was already processed
  const { data: existing } = await admin
    .from("payments")
    .select("id")
    .eq("paystack_ref", reference)
    .maybeSingle();

  if (existing) {
    // Already processed — idempotent success
    return NextResponse.json({ success: true, tier });
  }

  // 5 — Write payment record (admin client — RLS blocks server client writes)
  const { error: paymentError } = await admin.from("payments").insert({
    user_id: user.id,
    paystack_ref: reference,
    paystack_txn_id: String(data.id ?? ""),
    amount_ngn: Math.round(data.amount / 100),
    currency: data.currency ?? "NGN",
    status: "success",
    payment_type: "membership",
    related_id: tier,
    paid_at: data.paid_at ?? new Date().toISOString(),
    metadata: { email: data.customer?.email ?? null, channel: data.channel ?? null },
  });

  if (paymentError) {
    console.error("Payment insert error:", paymentError);
    return NextResponse.json({ error: "Failed to record payment" }, { status: 500 });
  }

  // 6 — Upgrade membership tier
  const { error: dbError } = await admin
    .from("profiles")
    .update({ membership_tier: tier, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (dbError) {
    console.error("Profile update error:", dbError);
    return NextResponse.json({ error: "Failed to update membership" }, { status: 500 });
  }

  return NextResponse.json({ success: true, tier });
}
