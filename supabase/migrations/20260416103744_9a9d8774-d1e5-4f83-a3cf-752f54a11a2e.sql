-- Create news table
CREATE TABLE public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT,
  cover_image_url TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add published_at to articles
ALTER TABLE public.articles ADD COLUMN published_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Update existing published articles to have published_at = created_at
UPDATE public.articles SET published_at = created_at WHERE published = true;

-- Enable RLS on news
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Public can view published news where published_at <= now
CREATE POLICY "Anyone can read published news"
ON public.news
FOR SELECT
TO public
USING (published = true AND published_at <= now());

-- Admins can do anything with news
CREATE POLICY "Admins can manage news"
ON public.news
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Update articles RLS: replace the public read policy to also check published_at
DROP POLICY IF EXISTS "Anyone can read published articles" ON public.articles;
CREATE POLICY "Anyone can read published articles"
ON public.articles
FOR SELECT
TO public
USING (published = true AND (published_at IS NULL OR published_at <= now()));

-- Trigger for news updated_at
CREATE TRIGGER update_news_updated_at
BEFORE UPDATE ON public.news
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
