import { Send, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contacts" className="py-16 px-6 border-t border-border">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-heading text-2xl font-semibold text-primary mb-4">
              Галина Оноприенко
            </h3>
            <p className="text-muted-foreground font-body text-sm leading-relaxed">
              Инструктор нейрографики. Помогаю трансформировать жизнь через творчество и осознанное рисование.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold text-foreground mb-4">
              Навигация
            </h4>
            <div className="flex flex-col gap-2">
              {["Обо мне", "Услуги", "Галерея", "Статьи"].map((item) => (
                <a
                  key={item}
                  href={`#${item === "Обо мне" ? "about" : item === "Услуги" ? "services" : item === "Галерея" ? "gallery" : "articles"}`}
                  className="text-muted-foreground font-body text-sm hover:text-primary transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold text-foreground mb-4">
              Связаться со мной
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
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground font-body text-xs">
            © {new Date().getFullYear()} Галина Оноприенко. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
