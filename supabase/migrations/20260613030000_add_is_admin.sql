-- Add is_admin boolean to profiles
-- This is the correct admin gate: a dedicated column rather than checking ADMIN_EMAILS inside the DB.
-- Admin API routes already use the service role key (bypasses RLS), so no route behaviour changes.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- Seed the five admin accounts that exist at migration time.
-- Uses auth.users so the update is safe even if a profile row doesn't exist yet.
UPDATE public.profiles
SET is_admin = TRUE
WHERE id IN (
  SELECT id FROM auth.users
  WHERE email IN (
    'info@aprn-africa.org',
    'josephagwuh@gmail.com',
    'tokunbokhadijat@gmail.com',
    'gabriellallison69@gmail.com',
    'olaghri@gmail.com'
  )
);

-- Index for admin lookups (admin user-list page filters by this)
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin
  ON public.profiles (is_admin)
  WHERE is_admin = TRUE;
