-- Track when a user was last active on the platform (updated on each dashboard load)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_seen_at timestamptz;
