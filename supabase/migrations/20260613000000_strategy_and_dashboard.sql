-- ============================================================
-- APRN Africa — Migration 001: Strategy Portal + Dashboard
-- Run in: Supabase Dashboard → SQL Editor → New Query → Run
-- Safe to re-run — all statements are idempotent
-- ============================================================

-- ── 1. Strategy: Communication Channels ─────────────────────────────────────

create table if not exists public.strategy_channels (
  id              text primary key,
  name            text not null,
  freq            text,
  content         text,
  audience        text,
  owner           text,
  notes           text,
  whatsapp_groups jsonb default '[]'::jsonb,
  sort_order      int  default 0,
  updated_at      timestamptz default now(),
  updated_by      text
);

alter table public.strategy_channels enable row level security;


-- ── 2. Strategy: Stakeholder Metadata ───────────────────────────────────────

create table if not exists public.strategy_stakeholders_meta (
  stakeholder_id    text primary key,
  last_contact_date date,
  notes             text,
  updated_at        timestamptz default now(),
  updated_by        text
);

alter table public.strategy_stakeholders_meta enable row level security;


-- ── 3. Strategy: Communication Calendar Items ────────────────────────────────

create table if not exists public.strategy_calendar_items (
  id          uuid default gen_random_uuid() primary key,
  week_number int  not null,
  week_label  text not null,
  item        text not null,
  owner       text,
  sort_order  int  default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.strategy_calendar_items enable row level security;

insert into public.strategy_calendar_items (week_number, week_label, item, owner, sort_order) values
  (1, 'Week 1', 'Newsletter issue',                    'Tokunbo', 0),
  (1, 'Week 1', 'LinkedIn post (research)',             'Tokunbo', 1),
  (1, 'Week 1', 'Member digest email',                  'Tokunbo', 2),
  (2, 'Week 2', 'LinkedIn post (training)',             'Allison', 0),
  (2, 'Week 2', 'WhatsApp team sync',                   'Joseph',  1),
  (2, 'Week 2', 'Partner update emails',                'Lucy',    2),
  (3, 'Week 3', 'Newsletter issue',                    'Tokunbo', 0),
  (3, 'Week 3', 'LinkedIn post (event/announcement)',  'Allison', 1),
  (3, 'Week 3', 'Website blog post',                   'Tokunbo', 2),
  (4, 'Week 4', 'Monthly webinar',                     'Lucy',    0),
  (4, 'Week 4', 'Partner reports (as needed)',         'Lucy',    1),
  (4, 'Week 4', 'Board update (Kosie)',                 'Lucy',    2)
on conflict do nothing;


-- ── 4. Strategy: Document Metadata ──────────────────────────────────────────

create table if not exists public.strategy_documents_meta (
  doc_id       text primary key,
  filename     text not null,
  display_name text,
  version      text,
  doc_date     text,
  description  text,
  notes        text,
  updated_at   timestamptz default now(),
  updated_by   text
);

alter table public.strategy_documents_meta enable row level security;


-- ── 5. Strategy: Approval Flow ───────────────────────────────────────────────

create table if not exists public.strategy_approval_flow (
  step        text primary key,
  title       text not null,
  who         text not null,
  description text,
  updated_at  timestamptz default now()
);

alter table public.strategy_approval_flow enable row level security;

insert into public.strategy_approval_flow (step, title, who, description) values
  ('01', 'Create',  'Tokunbo / Allison', 'Draft content aligned with APRN brand and messaging guidelines'),
  ('02', 'Review',  'Tokunbo + Joseph',  'Content quality and brand check (Tokunbo); technical accuracy check (Joseph)'),
  ('03', 'Approve', 'Lucy Okeke',        'Final sign-off on all public-facing and partner communications'),
  ('04', 'Publish', 'Tokunbo Khadijat',  'Schedule and publish via appropriate channel (website, newsletter, social)')
on conflict do nothing;


-- ── 6. Dashboard: Saved Items ────────────────────────────────────────────────

create table if not exists public.saved_items (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  item_type  text not null,
  item_id    text not null,
  item_title text,
  item_slug  text,
  saved_at   timestamptz default now(),
  unique(user_id, item_type, item_id)
);

alter table public.saved_items enable row level security;

do $$ begin
  create policy "Users manage their own saved items"
    on public.saved_items for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;


-- ── 7. Dashboard: Notification Preferences ──────────────────────────────────

create table if not exists public.notification_preferences (
  user_id           uuid references auth.users(id) on delete cascade primary key,
  newsletter_weekly boolean default true,
  research_alerts   boolean default true,
  event_reminders   boolean default true,
  member_activity   boolean default false,
  platform_updates  boolean default true,
  updated_at        timestamptz default now()
);

alter table public.notification_preferences enable row level security;

do $$ begin
  create policy "Users manage their own notification preferences"
    on public.notification_preferences for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;


-- ── 8. Helper: auto-update updated_at ────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Attach trigger to every table that has updated_at (skips if already exists)
do $$ declare
  t text;
begin
  foreach t in array array[
    'strategy_channels',
    'strategy_stakeholders_meta',
    'strategy_calendar_items',
    'strategy_documents_meta',
    'strategy_approval_flow',
    'notification_preferences'
  ]
  loop
    begin
      execute format(
        'create trigger set_updated_at before update on public.%I
         for each row execute function public.set_updated_at()',
        t
      );
    exception when duplicate_object then
      null; -- trigger already exists, skip
    end;
  end loop;
end $$;
