-- Page views tracking
CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  referrer text,
  user_agent text,
  session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_page_views_created_at ON public.page_views(created_at DESC);
CREATE INDEX idx_page_views_path ON public.page_views(path);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert page views"
  ON public.page_views FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can read page views"
  ON public.page_views FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add status to contact_messages (заявки)
DO $$ BEGIN
  CREATE TYPE public.message_status AS ENUM ('new', 'in_progress', 'closed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

ALTER TABLE public.contact_messages
  ADD COLUMN IF NOT EXISTS status public.message_status NOT NULL DEFAULT 'new';