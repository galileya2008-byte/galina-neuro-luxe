UPDATE public.site_content
SET value = value
  || jsonb_build_object(
       'cta_text', 'Хочешь получать такие послания',
       'cta_text_accent', 'каждый день?',
       'cta_description', 'Закажи свой собственный НейроЛотос — колоду посланий, которая будет с тобой в любой момент.',
       'cta_button_label', 'Купить НейроЛотос — 1599 ₽',
       'cta_payment_url', 'https://neirogalina.ru/lotosposlanie'
     ),
    updated_at = now()
WHERE key = 'lotus';

INSERT INTO public.site_content (key, value)
SELECT 'lotus', jsonb_build_object(
  'eyebrow', 'Интерактив',
  'title', 'Нейро',
  'title_accent', 'Лотос',
  'subtitle', 'Выберите лепесток лотоса и получите своё послание на сегодня',
  'cta_text', 'Хочешь получать такие послания',
  'cta_text_accent', 'каждый день?',
  'cta_description', 'Закажи свой собственный НейроЛотос — колоду посланий, которая будет с тобой в любой момент.',
  'cta_button_label', 'Купить НейроЛотос — 1599 ₽',
  'cta_payment_url', 'https://neirogalina.ru/lotosposlanie'
)
WHERE NOT EXISTS (SELECT 1 FROM public.site_content WHERE key = 'lotus');