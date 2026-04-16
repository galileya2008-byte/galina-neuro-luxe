import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

const ArticlesSection = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data } = await supabase
        .from("articles")
        .select("id, title, slug, excerpt, cover_image_url, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(6);
      if (data) setArticles(data);
    };
    fetchArticles();
  }, []);

  if (articles.length === 0) return null;

  return (
    <section id="articles" className="py-24 px-6 bg-muted/50">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm tracking-[0.2em] uppercase text-primary mb-3">
            Блог
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground">
            Полезные <span className="italic text-primary">статьи</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <Link to={`/articles/${article.slug}`}>
                <article className="bg-card rounded-2xl overflow-hidden shadow-card border border-border hover:border-primary/30 transition-colors cursor-pointer group h-full flex flex-col">
                  {article.cover_image_url && (
                    <img
                      src={article.cover_image_url}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="p-8 flex-1 flex flex-col">
                    <p className="text-xs text-muted-foreground font-body mb-3">
                      {new Date(article.created_at).toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-muted-foreground font-body text-sm leading-relaxed flex-1">
                        {article.excerpt}
                      </p>
                    )}
                    <span className="text-primary text-sm mt-4 font-medium group-hover:underline">
                      Читать →
                    </span>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;
