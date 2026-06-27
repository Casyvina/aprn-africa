CREATE TABLE IF NOT EXISTS strategy_approval_steps (
  id         text PRIMARY KEY,          -- '01' | '02' | '03' | '04'
  title      text NOT NULL,
  who_handles text NOT NULL,
  description text NOT NULL,
  sort_order  integer NOT NULL DEFAULT 0,
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE strategy_approval_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin service role only" ON strategy_approval_steps
  FOR ALL USING (false) WITH CHECK (false);

INSERT INTO strategy_approval_steps (id, title, who_handles, description, sort_order) VALUES
  ('01', 'Create',  'Tokunbo / Allison', 'Draft content aligned with APRN brand and messaging guidelines', 1),
  ('02', 'Review',  'Tokunbo + Joseph',  'Content quality and brand check (Tokunbo); technical accuracy check (Joseph)', 2),
  ('03', 'Approve', 'Lucy Okeke',        'Final sign-off on all public-facing and partner communications', 3),
  ('04', 'Publish', 'Tokunbo Khadijat',  'Schedule and publish via appropriate channel (website, newsletter, social)', 4)
ON CONFLICT (id) DO NOTHING;
