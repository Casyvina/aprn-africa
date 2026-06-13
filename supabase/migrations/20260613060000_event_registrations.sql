-- Event registrations table.
-- Event content (title, dates, speakers, agenda) lives in Sanity as the 'event' document type.
-- This table stores the transactional layer: who registered, payment status, attendance.
-- Links to a Sanity event via sanity_event_id (the Sanity document _id).

CREATE TABLE IF NOT EXISTS public.event_registrations (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Sanity event document _id — e.g. 'abc123def456'
  sanity_event_id  TEXT          NOT NULL,
  user_id          UUID          REFERENCES auth.users(id) ON DELETE SET NULL,
  email            TEXT          NOT NULL,
  full_name        TEXT          NOT NULL,
  organisation     TEXT,
  status           TEXT          NOT NULL DEFAULT 'registered'
                   CHECK (status IN ('registered', 'attended', 'cancelled', 'no_show')),
  -- Paystack reference if the event is paid
  ticket_ref       TEXT          UNIQUE,
  amount_paid      NUMERIC(12,2) NOT NULL DEFAULT 0,
  registered_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  -- One registration per email per event
  UNIQUE (sanity_event_id, email)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_event_registrations_event
  ON public.event_registrations (sanity_event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user
  ON public.event_registrations (user_id);

-- RLS
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Authenticated users see their own registrations
CREATE POLICY "event_registrations: read own"
  ON public.event_registrations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Authenticated users can register themselves
CREATE POLICY "event_registrations: insert own"
  ON public.event_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can cancel their own registration
CREATE POLICY "event_registrations: update own"
  ON public.event_registrations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins see and manage all registrations
CREATE POLICY "event_registrations: admin all"
  ON public.event_registrations
  FOR ALL
  TO authenticated
  USING  ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()))
  WITH CHECK ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()));
