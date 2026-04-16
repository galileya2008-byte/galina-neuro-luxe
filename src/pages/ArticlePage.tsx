import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";

type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      setArticle(data);
      setLoading(false);
    };
    fetchArticle();
  }, [slug]);

  useEffect(() => {
    if (!article) return;

    document.title = `${article.title} — Галина Оноприенко`;

    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    if (article.excerpt) {
      setMeta("description", article.excerpt);
      setMeta("og:description", article.excerpt, "property");
    }
    setMeta("og:title", article.title, "property");
    setMeta("og:type", "article", "property");
    setMeta("og:url", window.location.href, "property");
    if (article.cover_image_url) {
      setMeta("og:image", article.cover_image_url, "property");
    }
    setMeta("article:published_time", article.created_at, "property");
    setMeta("article:modified_time", article.updated_at, "property");

    // JSON-LD
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.excerpt || "",
      image: article.cover_image_url || "",
      datePublished: article.created_at,
      dateModified: article.updated_at,
      author: {
        "@type": "Person",
        name: "Галина Оноприенко",
      },
      publisher: {
        "@type": "Organization",
        name: "Галина Оноприенко — Нейрографика",
      },
    };

    let scriptEl = document.querySelector('script[data-article-ld]');
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.setAttribute("type", "application/ld+json");
      scriptEl.setAttribute("data-article-ld", "true");
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(jsonLd);

    return () => {
      document.title = "Галина Оноприенко — Нейрографика";
      scriptEl?.remove();
    };
  }, [article]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Загрузка…</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="font-heading text-3xl text-foreground">Статья не найдена</h1>
        <Link to="/" className="text-primary hover:underline flex items-center gap-1">
          <ArrowLeft size={16} /> На главную
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="container mx-auto max-w-3xl px-6 py-6">
        <Link to="/#articles" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
          <ArrowLeft size={14} /> Все статьи
        </Link>
      </nav>

      <article className="container mx-auto max-w-3xl px-6 pb-20">
        <header className="mb-8">
          <time className="text-sm text-muted-foreground font-body" dateTime={article.created_at}>
            {new Date(article.created_at).toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" })}
          </time>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mt-3 leading-tight">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="text-lg text-muted-foreground mt-4 font-body leading-relaxed">{article.excerpt}</p>
          )}
        </header>

        {article.cover_image_url && (
          <img
            src={article.cover_image_url}
            alt={article.title}
            className="w-full rounded-2xl mb-10 object-cover max-h-[500px]"
            loading="lazy"
          />
        )}

        <div
          className="prose prose-lg max-w-none font-body
            prose-headings:font-heading prose-headings:text-foreground
            prose-p:text-foreground/85 prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:mx-auto
            prose-blockquote:border-primary/50 prose-blockquote:text-muted-foreground
            prose-strong:text-foreground prose-li:text-foreground/85"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>

      <footer className="border-t border-border py-8 text-center">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          ← На главную
        </Link>
      </footer>
    </div>
  );
};

export default ArticlePage;
