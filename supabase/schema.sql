-- ============================================================
-- APRN Africa — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── Profiles ─────────────────────────────────────────────────
-- Auto-created for every new user via trigger below.
create table public.profiles (
  id               uuid references auth.users on delete cascade primary key,
  full_name        text,
  avatar_url       text,
  country          text,
  specialisation   text,
  membership_tier  text check (membership_tier in ('free', 'professional', 'institutional')) not null default 'free',
  role             text check (role in ('member', 'admin', 'student', 'institution')) not null default 'member',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Row Level Security
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Admins can view all profiles
create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ── Auto-create profile on signup ────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Updated_at trigger ───────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();
