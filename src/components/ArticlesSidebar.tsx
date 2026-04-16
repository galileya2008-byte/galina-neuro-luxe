import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  created_at: string;
};

const ArticlesSidebar = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data } = await supabase
        .from("articles")
        .select("id, title, slug, excerpt, cover_image_url, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(5);
      if (data) setArticles(data);
    };
    fetchArticles();
  }, []);

  if (articles.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-lg font-semibold text-foreground">Статьи</h3>
      <div className="space-y-3">
        {articles.map((a) => (
          <Link key={a.id} to={`/articles/${a.slug}`} className="block">
            <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
              {a.cover_image_url && (
                <img
                  src={a.cover_image_url}
                  alt={a.title}
                  className="w-full h-20 object-cover rounded-lg mb-2"
                  loading="lazy"
                />
              )}
              <h4 className="font-heading text-sm font-semibold text-foreground leading-snug hover:text-primary transition-colors">
                {a.title}
              </h4>
              {a.excerpt && (
                <p className="text-muted-foreground font-body text-xs mt-1 leading-relaxed line-clamp-2">
                  {a.excerpt}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ArticlesSidebar;
