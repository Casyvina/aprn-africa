create table weekly_reports (
  id uuid primary key default gen_random_uuid(),
  week_of date not null,
  subject text not null,
  content text not null,
  raw_data jsonb,
  sent_at timestamptz,
  sent_by text,
  created_at timestamptz default now()
);

alter table weekly_reports enable row level security;
-- service role bypasses RLS; no direct client access needed
