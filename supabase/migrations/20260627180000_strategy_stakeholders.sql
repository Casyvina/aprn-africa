-- Custom stakeholders created via the admin Strategy Portal.
-- Static stakeholders live in the UI; this table only holds user-added ones.

CREATE TABLE IF NOT EXISTS strategy_stakeholders (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name            text NOT NULL,
  org             text,
  type            text NOT NULL DEFAULT 'Partners',
  influence       text NOT NULL DEFAULT 'Med',
  interest        text NOT NULL DEFAULT 'Med',
  relationship    text NOT NULL DEFAULT 'Prospect',
  engagement_strategy text,
  last_contact    text,
  ix              numeric NOT NULL DEFAULT 5,
  iy              numeric NOT NULL DEFAULT 5,
  created_by      text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

ALTER TABLE strategy_stakeholders ENABLE ROW LEVEL SECURITY;

-- Only the service role (admin client) may read/write
CREATE POLICY "Admin service role only" ON strategy_stakeholders
  FOR ALL USING (false) WITH CHECK (false);
