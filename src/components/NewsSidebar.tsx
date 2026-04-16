import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type NewsItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  published_at: string;
};

const NewsSidebar = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase
        .from("news")
        .select("id, title, slug, excerpt, published_at")
        .eq("published", true)
        .lte("published_at", new Date().toISOString())
        .order("published_at", { ascending: false })
        .limit(5);
      if (data) setNews(data);
    };
    fetchNews();
  }, []);

  if (news.length === 0) return null;

  return (
    <aside className="space-y-4">
      <h3 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
        <Calendar size={18} className="text-primary" />
        Новости
      </h3>
      <div className="space-y-3">
        {news.map((item) => (
          <Link key={item.id} to={`/news/${item.slug}`} className="block">
            <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
              <time className="text-xs text-primary font-body font-medium">
                {new Date(item.published_at).toLocaleDateString("ru", {
                  day: "numeric",
                  month: "long",
                })}
              </time>
              <h4 className="font-heading text-sm font-semibold text-foreground mt-1 leading-snug">
                {item.title}
              </h4>
              {item.excerpt && (
                <p className="text-muted-foreground font-body text-xs mt-1 leading-relaxed line-clamp-2">
                  {item.excerpt}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default NewsSidebar;
