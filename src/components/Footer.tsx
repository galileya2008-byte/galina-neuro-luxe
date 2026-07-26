import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    <footer className="relative mt-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/95 to-secondary pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_30%_20%,hsl(38_60%_70%),transparent_50%)] pointer-events-none" />

      <div className="relative container mx-auto max-w-6xl px-6 pt-20 pb-10">
        <div className="divider-ornament mb-12">
          <span className="font-heading text-2xl italic text-gold">✦</span>
        </div>

        <div className="grid md:grid-cols-3 gap-12 md:gap-16">
          <div>
            <h3 className="font-heading text-3xl font-light text-primary-foreground mb-2">
              Любовь <span className="italic text-gold">Савенкова</span>
            </h3>
            <p className="font-body text-sm text-primary-foreground/65 leading-relaxed whitespace-pre-line max-w-sm">
              {value.footer_tagline}
            </p>
          </div>

          <div>
            <h4 className="font-body text-[11px] tracking-[0.28em] uppercase text-gold mb-5 font-semibold">
              Навигация
            </h4>
            <div className="flex flex-col gap-2.5">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-body text-[11px] tracking-[0.28em] uppercase text-gold mb-5 font-semibold">
              Соцсети
            </h4>
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
                    className="inline-flex items-center gap-2.5 font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors group"
                  >
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-primary-foreground/15 group-hover:border-accent/50 group-hover:bg-accent/10 transition-colors">
                      <Icon size={14} />
                    </span>
                    {s.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link
              to="/offer"
              className="font-body text-xs text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors"
            >
              Публичная оферта
            </Link>
            <span className="text-primary-foreground/20 hidden sm:inline">·</span>
            <Link
              to="/offer#cookies"
              className="font-body text-xs text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors"
            >
              Cookie
            </Link>
            <span className="text-primary-foreground/20 hidden sm:inline">·</span>
            <Link
              to="/admin-login"
              className="font-body text-xs text-primary-foreground/30 hover:text-primary-foreground/60 transition-colors"
            >
              Вход для админа
            </Link>
          </div>
          <p className="font-body text-xs text-primary-foreground/45">
            © {new Date().getFullYear()} Любовь Савенкова. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
