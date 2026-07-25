UPDATE public.site_content
SET value = replace(value::text, 'Галины Оноприенко', 'Любови Савенковой')::jsonb
WHERE value::text ILIKE '%Галины Оноприенко%';

UPDATE public.site_content
SET value = replace(value::text, 'Галина Оноприенко', 'Любовь Савенкова')::jsonb
WHERE value::text ILIKE '%Галина Оноприенко%';

UPDATE public.site_content
SET value = replace(value::text, 'Галина', 'Любовь')::jsonb
WHERE value::text ILIKE '%Галина%';

UPDATE public.site_content
SET value = replace(value::text, 'Оноприенко', 'Савенкова')::jsonb
WHERE value::text ILIKE '%Оноприенко%';