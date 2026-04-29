import { Send, ExternalLink, Mail, Instagram } from "lucide-react";

const navLinks = [
  { label: "Обо мне", href: "#about" },
  { label: "О методе", href: "#method" },
  { label: "Почему Нейрографика", href: "#why" },
  { label: "Курсы и Мастер-классы", href: "#courses" },
  { label: "Галерея работ", href: "#gallery" },
  { label: "Моя жизнь с НейроГрафикой", href: "#life" },
];

const Footer = () => {
  return (
    <footer className="py-16 px-6 border-t border-border bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-heading text-2xl font-semibold text-primary mb-4">
              Галина Оноприенко
            </h3>
            <p className="text-muted-foreground font-body text-sm leading-relaxed">
              Дипломированный инструктор НейроГрафики. Помогаю трансформировать жизнь через
              творчество и осознанное рисование.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold text-foreground mb-4">
              Навигация
            </h4>
            <div className="flex flex-col gap-2">
              {navLinks.map((item) => (
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
            <h4 className="font-heading text-lg font-semibold text-foreground mb-4">
              Соцсети
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://t.me/neiro_galina"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground font-body text-sm hover:text-primary transition-colors"
              >
                <Send size={16} />
                Telegram-канал
              </a>
              <a
                href="https://vk.com/neyrogalina"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground font-body text-sm hover:text-primary transition-colors"
              >
                <ExternalLink size={16} />
                ВКонтакте
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground font-body text-sm hover:text-primary transition-colors"
              >
                <Instagram size={16} />
                Instagram
              </a>
              <a
                href="mailto:hello@example.com"
                className="inline-flex items-center gap-2 text-muted-foreground font-body text-sm hover:text-primary transition-colors"
              >
                <Mail size={16} />
                Написать на email
              </a>
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
