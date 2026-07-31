import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "Страница не найдена — Любовь Савенкова";
    return () => {
      document.title = "Любовь Савенкова — Инструктор Нейрографики";
    };
  }, []);

  useEffect(() => {
    console.error("404:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="page-shell min-h-screen flex items-center justify-center px-6 py-24">
      <div className="text-center max-w-md">
        <p className="eyebrow mb-4">404</p>
        <h1 className="font-heading text-4xl md:text-5xl font-light text-foreground mb-4">
          Страница <span className="italic text-gradient">не найдена</span>
        </h1>
        <p className="text-muted-foreground font-body mb-8 leading-relaxed">
          Возможно, ссылка устарела или страница была перемещена. Вернитесь на главную — там
          курсы, галерея и форма записи.
        </p>
        <Link to="/" className="btn-luxe inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
