import { createAdminClient } from "@/lib/supabase/admin";
import AdminPaymentsClient from "@/components/admin/AdminPaymentsClient";

export const metadata = { title: "Payments | APRN Admin" };

export interface PaymentRow {
  id: string;
  user_id: string;
  amount_ngn: number;
  currency: string;
  status: string;
  payment_type: string;
  paystack_ref: string;
  paystack_txn_id: string | null;
  paid_at: string | null;
  created_at: string;
  full_name: string | null;
  membership_tier: string | null;
}

export default async function AdminPaymentsPage() {
  const admin = createAdminClient();

  const { data: raw } = await admin
    .from("payments")
    .select("id, user_id, amount_ngn, currency, status, payment_type, paystack_ref, paystack_txn_id, paid_at, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  const payments = raw ?? [];
  const userIds = [...new Set(payments.map((p) => p.user_id))];

  const { data: profiles } =
    userIds.length > 0
      ? await admin
          .from("profiles")
          .select("id, full_name, membership_tier")
          .in("id", userIds)
      : { data: [] };

  const profileMap = Object.fromEntries(
    (profiles ?? []).map((p) => [p.id, p])
  );

  const enriched: PaymentRow[] = payments.map((p) => ({
    ...p,
    full_name: profileMap[p.user_id]?.full_name ?? null,
    membership_tier: profileMap[p.user_id]?.membership_tier ?? null,
  }));

  return <AdminPaymentsClient payments={enriched} />;
}
