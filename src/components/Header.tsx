import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Обо мне", href: "#about" },
  { label: "Услуги", href: "#services" },
  { label: "Галерея", href: "#gallery" },
  { label: "Статьи", href: "#articles" },
  { label: "Контакты", href: "#contacts" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="font-heading text-2xl font-semibold text-primary">
          Галина Оноприенко
        </a>
        
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <nav className="md:hidden bg-background border-b border-border px-6 py-4 flex flex-col gap-4">
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
