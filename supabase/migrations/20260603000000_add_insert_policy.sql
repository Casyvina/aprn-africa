-- Fix: upsert requires INSERT permission even for ON CONFLICT DO UPDATE
-- Without this policy every onboarding save is blocked by RLS.

CREATE POLICY "profiles: insert own"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);
