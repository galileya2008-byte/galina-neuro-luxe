import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { supabase } from "@/integrations/supabase/client";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  content: string;
  published_at: string;
};

const NewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase
        .from("news")
        .select("id, title, slug, excerpt, content, published_at")
        .eq("published", true)
        .lte("published_at", new Date().toISOString())
        .order("published_at", { ascending: false })
        .limit(4);
      if (data) setNews(data);
    };
    fetchNews();
  }, []);

  if (news.length === 0) return null;

  return (
    <section id="news" className="py-24 px-6 bg-background">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm tracking-[0.2em] uppercase text-primary mb-3">
            Анонсы
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground">
            Ближайшие <span className="italic text-primary">мастер-классы</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {news.map((item, index) => (
            <Link key={item.id} to={`/news/${item.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-2 text-primary mb-3">
                  <Calendar size={16} />
                  <time className="text-sm font-body font-medium">
                    {new Date(item.published_at).toLocaleDateString("ru", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                {item.excerpt && (
                  <p className="text-muted-foreground font-body text-sm leading-relaxed mb-3">
                    {item.excerpt}
                  </p>
                )}
                <span className="text-primary text-sm font-medium hover:underline">
                  Читать подробнее →
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
