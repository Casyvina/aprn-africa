-- APRN Africa — profiles table setup
-- Migration: 20260526000000_setup_profiles

-- ─── Create table ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.profiles (
  id              UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       TEXT,
  job_title       TEXT,
  discipline      TEXT,
  organisation    TEXT,
  country         TEXT,
  linkedin_url    TEXT,
  bio             TEXT,
  avatar_url      TEXT,
  membership_tier TEXT        NOT NULL DEFAULT 'free'
    CHECK (membership_tier IN ('free','student','graduate','professional','associate','corporate')),
  topics          TEXT[]      NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Add missing columns (safe on existing table) ──────────────────

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS job_title      TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS discipline     TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS organisation   TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS linkedin_url   TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio            TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url     TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS topics         TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- ─── Fix membership_tier constraint ────────────────────────────────

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_membership_tier_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_membership_tier_check
    CHECK (membership_tier IN ('free','student','graduate','professional','associate','corporate'));

-- ─── RLS — drop old policies first (some reference the old role column) ──

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile"   ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles: read own"           ON public.profiles;
DROP POLICY IF EXISTS "profiles: update own"         ON public.profiles;

-- ─── Drop stale columns ─────────────────────────────────────────────

ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS specialisation;

-- ─── New RLS policies ───────────────────────────────────────────────

CREATE POLICY "profiles: read own"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles: update own"
  ON public.profiles FOR UPDATE TO authenticated
  USING  (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ─── Auto-create profile on signup ─────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Auto-update updated_at ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── Backfill existing users ────────────────────────────────────────

INSERT INTO public.profiles (id)
SELECT id FROM auth.users
ON CONFLICT (id) DO NOTHING;
