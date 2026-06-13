-- Payments table for Paystack transactions.
-- Covers both membership upgrades and event ticket purchases.
-- Inserts happen ONLY via the service role in the Paystack webhook handler.
-- Members can read their own payment history; admins see all.

CREATE TABLE IF NOT EXISTS public.payments (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  paystack_ref    TEXT          NOT NULL UNIQUE,
  paystack_txn_id TEXT,
  amount_ngn      NUMERIC(12,2) NOT NULL,
  currency        TEXT          NOT NULL DEFAULT 'NGN',
  status          TEXT          NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  payment_type    TEXT          NOT NULL
                  CHECK (payment_type IN ('membership', 'event', 'donation')),
  -- For membership: the tier name (e.g. 'professional')
  -- For event: the Sanity event _id
  related_id      TEXT,
  metadata        JSONB         NOT NULL DEFAULT '{}',
  paid_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payments_user_id
  ON public.payments (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_paystack_ref
  ON public.payments (paystack_ref);
CREATE INDEX IF NOT EXISTS idx_payments_status
  ON public.payments (status);

-- RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Members see their own payments only
CREATE POLICY "payments: read own"
  ON public.payments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Inserts only via service role (webhook handler uses admin client — bypasses RLS)
-- No INSERT policy for authenticated users intentionally.

-- Admins see and manage all payments
CREATE POLICY "payments: admin all"
  ON public.payments
  FOR ALL
  TO authenticated
  USING  ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()))
  WITH CHECK ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()));
