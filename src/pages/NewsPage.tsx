import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar } from "lucide-react";
import ArticlesSidebar from "@/components/ArticlesSidebar";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string;
  created_at: string;
};

const NewsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      if (!slug) return;
      const { data } = await supabase
        .from("news")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      setItem(data);
      setLoading(false);
    };
    fetchItem();
  }, [slug]);

  useEffect(() => {
    if (!item) return;
    document.title = `${item.title} — Любовь Савенкова`;
    return () => {
      document.title = "Любовь Савенкова — Нейрографика";
    };
  }, [item]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Загрузка…</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="font-heading text-3xl text-foreground">Новость не найдена</h1>
        <Link to="/" className="text-primary hover:underline flex items-center gap-1">
          <ArrowLeft size={16} /> На главную
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="container mx-auto max-w-6xl px-6 py-6">
        <Link to="/#news" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
          <ArrowLeft size={14} /> Все новости
        </Link>
      </nav>

      <div className="container mx-auto max-w-6xl px-6 pb-20 flex flex-col lg:flex-row gap-10">
        <article className="flex-1 max-w-3xl">
          <header className="mb-8">
            <div className="flex items-center gap-2 text-primary mb-3">
              <Calendar size={16} />
              <time className="text-sm font-body font-medium" dateTime={item.published_at}>
                {new Date(item.published_at).toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" })}
              </time>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight">
              {item.title}
            </h1>
            {item.excerpt && (
              <p className="text-lg text-muted-foreground mt-4 font-body leading-relaxed">{item.excerpt}</p>
            )}
          </header>

          {item.cover_image_url && (
            <img
              src={item.cover_image_url}
              alt={item.title}
              className="w-full rounded-2xl mb-10 object-cover max-h-[500px]"
              loading="lazy"
            />
          )}

          <div
            className="prose prose-lg max-w-none font-body
              prose-headings:font-heading prose-headings:text-foreground
              prose-p:text-foreground/85 prose-p:leading-relaxed
              [&_a]:!text-blue-500 [&_a]:!underline [&_a:hover]:!text-blue-600
              prose-img:rounded-xl prose-img:mx-auto
              prose-strong:text-foreground prose-li:text-foreground/85"
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        </article>

        <aside className="lg:w-72 shrink-0">
          <ArticlesSidebar />
        </aside>
      </div>

      <footer className="border-t border-border py-8 text-center">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          ← На главную
        </Link>
      </footer>
    </div>
  );
};

export default NewsPage;
