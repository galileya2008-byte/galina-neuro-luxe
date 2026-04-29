-- 1. Site content (key-value JSON)
CREATE TABLE public.site_content (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read site_content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Admins can insert site_content" ON public.site_content FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update site_content" ON public.site_content FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete site_content" ON public.site_content FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER trg_site_content_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Courses
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT NOT NULL DEFAULT 'Sparkles',
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT '',
  price_note TEXT,
  popular BOOLEAN NOT NULL DEFAULT false,
  payment_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Admins manage courses" ON public.courses FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER trg_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Why reasons
CREATE TABLE public.why_reasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT NOT NULL DEFAULT 'Sparkles',
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.why_reasons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read why_reasons" ON public.why_reasons FOR SELECT USING (true);
CREATE POLICY "Admins manage why_reasons" ON public.why_reasons FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER trg_why_reasons_updated_at BEFORE UPDATE ON public.why_reasons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Lotus messages
CREATE TABLE public.lotus_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lotus_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read lotus_messages" ON public.lotus_messages FOR SELECT USING (true);
CREATE POLICY "Admins manage lotus_messages" ON public.lotus_messages FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 5. Social links
CREATE TABLE public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'ExternalLink',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read social_links" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Admins manage social_links" ON public.social_links FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 6. Seed initial content
INSERT INTO public.site_content (key, value) VALUES
('hero', '{"eyebrow":"Инструктор нейрографики","name_line_1":"Галина","name_line_2":"Оноприенко","subtitle":"Трансформация через творчество. Нейрографика — метод, который меняет жизнь через рисование линий.","cta_label":"Узнать больше","cta_href":"#courses"}'::jsonb),
('about', '{"eyebrow":"Обо мне","title":"Путь к","title_accent":"гармонии","image_url":"","paragraphs":["Я — Галина Оноприенко, дипломированный Инструктор Нейрографики. Помогаю людям трансформировать свою жизнь через уникальный метод рисования, соединяющий творчество и нейронауку.","Нейрографика — это научно обоснованный метод, который позволяет через рисование специальных линий перестроить нейронные связи и найти решения для любых жизненных задач.","Каждая сессия — это путешествие внутрь себя, где вы обретаете ясность, спокойствие и новые возможности. И я сама свой кейс!"]}'::jsonb),
('method', '{"eyebrow":"О методе","title":"Что такое","title_accent":"НейроГрафика","description":"НейроГрафика — это художественный метод трансформации реальности через рисование. Соединяя нейронауку, психологию и искусство, она помогает менять мышление, снимать ограничения и находить решения для любых жизненных задач.","interactive_hint":"А пока — попробуйте интерактив: выберите лепесток НейроЛотоса и получите послание на сегодня"}'::jsonb),
('author', '{"eyebrow":"Об авторе метода","title":"Павел","title_accent":"Пискарёв","image_url":"https://neurographica.metamodern.ru/local/templates/.default/kartiny/pavel-index2.webp","paragraphs":["Пискарёв Павел Михайлович — профессор, доктор психологических наук, создатель метода НейроГрафика, известного по всему миру. Автор теорий, книг и уникальных образовательных программ. Психолог, художник, архитектор, спикер.","Павел Пискарёв — основатель Института Психологии Творчества, действительный член Международной Академии Психологических Наук (МАПН), председатель совета директоров МАНГо. Обладатель более 40 авторских свидетельств в гуманитарных науках.","Метод НейроГрафика был создан в 2014 году на стыке психологии, нейронауки и искусства. Это научно обоснованный метод, который позволяет через рисование специальных линий перестроить нейронные связи и найти решения для любых жизненных задач. Сегодня НейроГрафика практикуется в более чем 40 странах мира.","Путь Павла Пискарёва к созданию метода прошёл через глубокое изучение восточных практик, медитации, боевых искусств, архитектуры и психологии. Более 25 лет ежедневной медитативной практики, обучение у ведущих мастеров и собственный уникальный жизненный опыт стали фундаментом для создания НейроГрафики."],"link_label":"Институт Психологии Творчества","link_url":"https://neurograff.com/"}'::jsonb),
('why', '{"eyebrow":"Почему именно это","title":"Почему","title_accent":"НейроГрафика","subtitle":"Это не просто рисование — это инструмент трансформации, который работает на уровне нейробиологии и психологии одновременно."}'::jsonb),
('courses_section', '{"eyebrow":"Обучение и работа","title":"Курсы и","title_accent":"Мастер-классы","beginner_title":"Для новичков — Знакомство","beginner_description":"2 алгоритма и работа с нейролинией — идеальный старт для тех, кто хочет попробовать нейрографику","beginner_price":"2 500 ₽","beginner_payment_url":"https://getcourse.ru","beginner_cta":"Записаться","others_title":"Другие","others_title_accent":"продукты"}'::jsonb),
('lotus', '{"eyebrow":"Интерактив","title":"Нейро","title_accent":"Лотос","subtitle":"Выберите лепесток лотоса и получите своё послание на сегодня","cta_text":"Хочешь получить изменения","cta_text_accent":"прямо сейчас?","cta_description":"Поработай с этой моделью НейроЛотоса Посланий — видеоурок с пошаговым алгоритмом","cta_button_label":"Получить урок — 970 ₽","cta_payment_url":"https://getcourse.ru"}'::jsonb),
('contacts', '{"eyebrow":"Обратная связь","title":"Задать","title_accent":"вопрос","footer_tagline":"Дипломированный инструктор НейроГрафики. Помогаю трансформировать жизнь через творчество и осознанное рисование."}'::jsonb);

-- 7. Seed courses
INSERT INTO public.courses (icon, title, description, price, price_note, popular, payment_url, sort_order) VALUES
('Sparkles', 'Индивидуальная работа', 'Онлайн занятие 1,5 часа — персональная сессия нейрографики по вашему запросу', '6 000 ₽', 'за сессию', false, 'https://getcourse.ru', 1),
('Package', 'Пакет из 3 сессий', 'Глубокая проработка запроса через серию последовательных сессий', '14 000 ₽', 'экономия 4 000 ₽', true, 'https://getcourse.ru', 2),
('Star', 'Пакет из 5 сессий', 'Комплексная трансформация — максимальный результат и глубокие изменения', '22 000 ₽', 'экономия 8 000 ₽', false, 'https://getcourse.ru', 3);

-- 8. Seed why_reasons
INSERT INTO public.why_reasons (icon, title, description, sort_order) VALUES
('Brain', 'Перестраивает нейронные связи', 'Через рисование специальных линий формируются новые паттерны мышления и поведения.', 1),
('Heart', 'Снимает стресс и тревогу', 'Медитативный процесс рисования возвращает в ресурсное состояние и внутренний покой.', 2),
('Compass', 'Помогает найти решения', 'Любой запрос — финансы, отношения, здоровье, цели — можно проработать через алгоритмы.', 3),
('Sparkles', 'Раскрывает творческий потенциал', 'Не нужно уметь рисовать. Нейрографика доступна каждому и пробуждает внутреннего творца.', 4),
('Smile', 'Меняет отношение к себе и миру', 'Появляется принятие, благодарность и радость от простых вещей.', 5),
('TrendingUp', 'Даёт быстрые результаты', 'Изменения чувствуются уже после первой сессии — в настроении, мыслях, теле.', 6);

-- 9. Seed lotus messages
INSERT INTO public.lotus_messages (message, sort_order) VALUES
('Доверься потоку жизни — он несёт тебя туда, где ты нужна больше всего.', 1),
('Сегодня прекрасный день, чтобы отпустить контроль и позволить чуду случиться.', 2),
('Твоя внутренняя красота проявляется через каждый штрих, который ты создаёшь.', 3),
('Перемены уже начались — просто позволь себе их заметить.', 4),
('Ты заслуживаешь всего, о чём мечтаешь. Начни с маленького шага прямо сейчас.', 5),
('Твоя уникальность — это дар миру. Не прячь её.', 6),
('Отпусти старые убеждения — они уже не служат тебе. Новое пространство ждёт.', 7),
('Каждая линия, которую ты проводишь, — это разговор с собой. Слушай внимательно.', 8),
('Вселенная поддерживает тебя. Расслабься и позволь ресурсу прийти.', 9),
('Сегодня идеальный день, чтобы начать рисовать свою новую реальность.', 10),
('Ты сильнее, чем думаешь, и мудрее, чем предполагаешь.', 11),
('Гармония внутри тебя — ключ к гармонии вокруг.', 12);

-- 10. Seed social links
INSERT INTO public.social_links (label, url, icon, sort_order) VALUES
('Telegram-канал', 'https://t.me/neiro_galina', 'Send', 1),
('ВКонтакте', 'https://vk.com/neyrogalina', 'ExternalLink', 2);