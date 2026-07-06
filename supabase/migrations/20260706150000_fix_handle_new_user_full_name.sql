-- Fix handle_new_user: copy full_name from auth metadata on signup.
-- Previously the trigger only inserted the user id, leaving full_name NULL
-- even though the registration form always collects it.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Backfill existing profiles that have no name but the auth user does.
UPDATE public.profiles p
SET full_name = u.raw_user_meta_data->>'full_name'
FROM auth.users u
WHERE p.id = u.id
  AND (p.full_name IS NULL OR p.full_name = '')
  AND (u.raw_user_meta_data->>'full_name') IS NOT NULL
  AND (u.raw_user_meta_data->>'full_name') <> '';
