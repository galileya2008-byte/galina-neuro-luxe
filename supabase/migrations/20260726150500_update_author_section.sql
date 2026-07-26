-- Обновить фото и ссылку в блоке «Об авторе метода»
UPDATE public.site_content
SET value = jsonb_set(
  jsonb_set(
    jsonb_set(value, '{image_url}', '""'::jsonb),
    '{link_url}',
    '"https://neuro.piskarev.ru"'::jsonb
  ),
  '{link_label}',
  '"Официальный сайт автора метода"'::jsonb
),
updated_at = now()
WHERE key = 'author';
