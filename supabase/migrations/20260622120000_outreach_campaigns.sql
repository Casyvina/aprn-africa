-- Outreach campaigns
create table if not exists outreach_campaigns (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  goal          text not null,
  campaign_type text not null default 'general' check (campaign_type in ('general','personalized')),
  status        text not null default 'draft' check (status in ('draft','ready','sending','sent')),
  subject       text,
  body_template text,
  created_by    text,
  created_at    timestamptz not null default now(),
  sent_at       timestamptz
);

alter table outreach_campaigns enable row level security;

create policy "Admin full access outreach_campaigns"
  on outreach_campaigns for all
  using (true)
  with check (true);

-- Outreach recipients (one row per contact per campaign)
create table if not exists outreach_recipients (
  id                 uuid primary key default gen_random_uuid(),
  campaign_id        uuid not null references outreach_campaigns(id) on delete cascade,
  recipient_type     text not null check (recipient_type in ('engineer','operator','contractor','regulator')),
  recipient_id       uuid not null,
  recipient_name     text not null,
  recipient_email    text,
  personalized_body  text,
  status             text not null default 'pending' check (status in ('pending','sent','opened','bounced','replied','no_email')),
  resend_message_id  text,
  sent_at            timestamptz,
  opened_at          timestamptz,
  notes              text
);

alter table outreach_recipients enable row level security;

create policy "Admin full access outreach_recipients"
  on outreach_recipients for all
  using (true)
  with check (true);

create index outreach_recipients_campaign_id_idx on outreach_recipients(campaign_id);
create index outreach_recipients_resend_id_idx  on outreach_recipients(resend_message_id);

-- AI research suggestions (pending admin review before adding to source tables)
create table if not exists ai_research_suggestions (
  id               uuid primary key default gen_random_uuid(),
  target_table     text not null check (target_table in ('pipeline_engineers','pipeline_operators','contractors_epc','regulators_associations')),
  suggested_data   jsonb not null,
  source_context   text,
  status           text not null default 'pending' check (status in ('pending','accepted','rejected')),
  reviewed_by      text,
  reviewed_at      timestamptz,
  created_at       timestamptz not null default now()
);

alter table ai_research_suggestions enable row level security;

create policy "Admin full access ai_research_suggestions"
  on ai_research_suggestions for all
  using (true)
  with check (true);
