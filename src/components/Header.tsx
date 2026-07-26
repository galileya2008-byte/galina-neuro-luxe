import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Обо мне", href: "#about" },
  { label: "О методе", href: "#method" },
  { label: "Об авторе метода", href: "#author" },
  { label: "Почему Нейрографика", href: "#why" },
  { label: "Курсы", href: "#courses" },
  { label: "Галерея", href: "#gallery" },
  { label: "Жизнь с НГ", href: "#life" },
  { label: "Контакты", href: "#contacts" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${
        scrolled
          ? "glass shadow-soft border-b border-border/60 py-0"
          : "bg-transparent border-b border-transparent py-1"
      }`}
    >
      <div className="container mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
        <a href="#" className="group shrink-0">
          <span className="block font-heading text-xl lg:text-2xl font-semibold text-foreground leading-none">
            Любовь <span className="italic text-primary">Савенкова</span>
          </span>
          <span className="mt-1 block font-body text-[10px] tracking-[0.28em] uppercase text-muted-foreground group-hover:text-accent transition-colors">
            Инструктор нейрографики
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="nav-link">
              {item.label}
            </a>
          ))}
          <a href="#contacts" className="btn-luxe btn-luxe-primary text-xs px-5 py-2.5 ml-2">
            Записаться
          </a>
        </nav>

        <button
          className="lg:hidden text-foreground p-2 -mr-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Меню"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <nav className="lg:hidden glass border-t border-border/60 px-6 py-5 flex flex-col gap-1 max-h-[80vh] overflow-y-auto">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-body text-sm font-medium text-muted-foreground hover:text-foreground py-2.5 border-b border-border/40 last:border-0 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contacts"
            className="btn-luxe btn-luxe-primary text-sm mt-4 justify-center"
            onClick={() => setIsOpen(false)}
          >
            Записаться
          </a>
        </nav>
      )}
    </header>
  );
};

export default Header;
