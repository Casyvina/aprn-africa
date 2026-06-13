-- Fix the RLS hole on all strategy_* tables.
-- Previously: RLS enabled but zero policies = deny everything (silent fail).
-- Now: admins (is_admin = TRUE) have full access; no member/anon access.
-- Admin API routes use the service role key which bypasses RLS entirely,
-- so these policies are a safety net, not the primary access mechanism.

-- Helper: inline admin check used in every policy
-- Reads is_admin from the caller's own profile row.
-- SECURITY DEFINER not needed here — we're just reading the caller's own row.

-- ── strategy_channels ──────────────────────────────────────────────────
DROP POLICY IF EXISTS "strategy_channels: admin all" ON public.strategy_channels;
CREATE POLICY "strategy_channels: admin all"
  ON public.strategy_channels
  FOR ALL
  TO authenticated
  USING  ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()))
  WITH CHECK ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()));

-- ── strategy_stakeholders_meta ─────────────────────────────────────────
DROP POLICY IF EXISTS "strategy_stakeholders_meta: admin all" ON public.strategy_stakeholders_meta;
CREATE POLICY "strategy_stakeholders_meta: admin all"
  ON public.strategy_stakeholders_meta
  FOR ALL
  TO authenticated
  USING  ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()))
  WITH CHECK ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()));

-- ── strategy_calendar_items ────────────────────────────────────────────
DROP POLICY IF EXISTS "strategy_calendar_items: admin all" ON public.strategy_calendar_items;
CREATE POLICY "strategy_calendar_items: admin all"
  ON public.strategy_calendar_items
  FOR ALL
  TO authenticated
  USING  ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()))
  WITH CHECK ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()));

-- ── strategy_documents_meta ────────────────────────────────────────────
DROP POLICY IF EXISTS "strategy_documents_meta: admin all" ON public.strategy_documents_meta;
CREATE POLICY "strategy_documents_meta: admin all"
  ON public.strategy_documents_meta
  FOR ALL
  TO authenticated
  USING  ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()))
  WITH CHECK ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()));

-- ── strategy_approval_flow ─────────────────────────────────────────────
DROP POLICY IF EXISTS "strategy_approval_flow: admin all" ON public.strategy_approval_flow;
CREATE POLICY "strategy_approval_flow: admin all"
  ON public.strategy_approval_flow
  FOR ALL
  TO authenticated
  USING  ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()))
  WITH CHECK ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()));
