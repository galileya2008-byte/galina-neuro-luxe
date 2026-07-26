-- Настройка админки для galina-neuro-luxe
-- Supabase Dashboard → SQL Editor → вставьте и выполните этот файл
--
-- ШАГ A. Политики доступа к ролям
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_roles'
      AND policyname = 'Users can view own roles'
  ) THEN
    CREATE POLICY "Users can view own roles"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_roles'
      AND policyname = 'Admins can manage roles'
  ) THEN
    CREATE POLICY "Admins can manage roles"
    ON public.user_roles
    FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'::app_role))
    WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

-- ШАГ B. Создайте пользователя в Authentication → Users → Add user
--        (email + пароль, включите Auto Confirm User)
--
-- ШАГ C. Назначьте роль admin — замените email ниже:

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email = 'admin@example.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- ШАГ D. Authentication → URL Configuration:
-- Site URL: https://galileya2008-byte.github.io/galina-neuro-luxe/
-- Redirect URLs:
--   https://galileya2008-byte.github.io/galina-neuro-luxe/admin-login
--   https://galina-neuro-luxe.lovable.app/admin-login
--   http://localhost:8080/admin-login
