import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Обо мне", href: "#about" },
  { label: "О методе", href: "#method" },
  { label: "Об авторе метода", href: "#author" },
  { label: "Почему Нейрографика", href: "#why" },
  { label: "Курсы и Мастер-классы", href: "#courses" },
  { label: "Галерея работ", href: "#gallery" },
  { label: "Моя жизнь с НейроГрафикой", href: "#life" },
  { label: "Контакты", href: "#contacts" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <a href="#" className="font-heading text-xl lg:text-2xl font-semibold text-primary shrink-0">
          Галина Оноприенко
        </a>

        <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-body text-xs xl:text-sm font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          className="lg:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Меню"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <nav className="lg:hidden bg-background border-b border-border px-6 py-4 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
