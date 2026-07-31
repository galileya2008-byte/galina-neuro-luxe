import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
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

  return (
    <section id="life" className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background pointer-events-none" />

      <div className="relative container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="eyebrow mb-3">Анонсы и события</p>
          <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground">
            Моя жизнь с <span className="italic text-gradient">НейроГрафикой</span>
          </h2>
          <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </motion.div>

        {news.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-10 md:p-12 text-center max-w-2xl mx-auto"
          >
            <Calendar className="w-8 h-8 text-primary mx-auto mb-4" />
            <p className="font-heading text-xl text-foreground mb-2">Скоро здесь появятся новости</p>
            <p className="text-muted-foreground font-body text-sm leading-relaxed">
              Анонсы мастер-классов, встреч и событий из мира нейрографики — следите за обновлениями
              или запишитесь через форму на главной.
            </p>
          </motion.div>
        ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {news.map((item, index) => (
            <Link key={item.id} to={`/news/${item.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-3xl p-6 hover:-translate-y-1 hover:shadow-glow transition-all duration-500"
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
        )}
      </div>
    </section>
  );
};

export default NewsSection;
