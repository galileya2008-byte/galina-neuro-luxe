import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent } from "@/hooks/useSiteContent";
import { getIcon } from "@/lib/icons";

const NAV_LINKS = [
  { label: "Обо мне", href: "#about" },
  { label: "О методе", href: "#method" },
  { label: "Почему Нейрографика", href: "#why" },
  { label: "Курсы и Мастер-классы", href: "#courses" },
  { label: "Галерея работ", href: "#gallery" },
  { label: "Моя жизнь с НейроГрафикой", href: "#life" },
];

type SocialLink = {
  id: string;
  label: string;
  url: string;
  icon: string;
};

const DEFAULTS = {
  footer_tagline:
    "Дипломированный инструктор НейроГрафики. Помогаю трансформировать жизнь через творчество и осознанное рисование.",
};

const Footer = () => {
  const { value } = useSiteContent("contacts", DEFAULTS);
  const [socials, setSocials] = useState<SocialLink[]>([]);

  useEffect(() => {
    supabase
      .from("social_links")
      .select("id, label, url, icon")
      .order("sort_order", { ascending: true })
      .then(({ data }) => data && setSocials(data));
  }, []);

  return (
    <footer className="py-16 px-6 border-t border-border bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-heading text-2xl font-semibold text-primary mb-4">
              Галина Оноприенко
            </h3>
            <p className="text-muted-foreground font-body text-sm leading-relaxed whitespace-pre-line">
              {value.footer_tagline}
            </p>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold text-foreground mb-4">Навигация</h4>
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground font-body text-sm hover:text-primary transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold text-foreground mb-4">Соцсети</h4>
            <div className="flex flex-col gap-3">
              {socials.map((s) => {
                const Icon = getIcon(s.icon);
                const isExternal = /^https?:\/\//.test(s.url);
                return (
                  <a
                    key={s.id}
                    href={s.url}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-2 text-muted-foreground font-body text-sm hover:text-primary transition-colors"
                  >
                    <Icon size={16} />
                    {s.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center flex flex-col items-center gap-2">
          <p className="text-muted-foreground font-body text-xs">
            © {new Date().getFullYear()} Галина Оноприенко. Все права защищены.
          </p>
          <a
            href="/admin-login"
            className="text-muted-foreground/50 font-body text-[10px] hover:text-muted-foreground transition-colors"
          >
            Вход для админа
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
