
CREATE TABLE public.site_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  suffix TEXT DEFAULT '',
  icon TEXT DEFAULT 'Sparkles',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published stats"
  ON public.site_stats FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can view all stats"
  ON public.site_stats FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert stats"
  ON public.site_stats FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update stats"
  ON public.site_stats FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete stats"
  ON public.site_stats FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_site_stats_updated_at
  BEFORE UPDATE ON public.site_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_stats (label, value, suffix, icon, sort_order) VALUES
  ('Лет в нейрографике', '7', '+', 'Sparkles', 1),
  ('Учеников прошли курсы', '500', '+', 'Users', 2),
  ('Авторских работ', '1200', '+', 'Palette', 3),
  ('Стран участников', '15', '', 'Globe', 4);

INSERT INTO public.site_content (key, value) VALUES
  ('stats', '{"title":"В цифрах","subtitle":"Опыт, который говорит сам за себя","description":"Каждая цифра — это история трансформации, преодоления и нового вдохновения."}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
