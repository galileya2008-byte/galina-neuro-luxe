-- Обновить подпись и ссылку в блоке «Об авторе метода»
UPDATE public.site_content
SET value = jsonb_set(
  jsonb_set(
    value,
    '{link_url}',
    '"https://neuro.piskarev.ru/"'::jsonb
  ),
  '{link_label}',
  '"Узнать больше об авторе и методе"'::jsonb
),
updated_at = now()
WHERE key = 'author';
