import { motion } from "framer-motion";

const placeholderArticles = [
  {
    title: "Что такое нейрографика?",
    excerpt: "Нейрографика — это метод трансформации реальности через рисование. Узнайте, как простые линии могут изменить вашу жизнь.",
    date: "15 апреля 2026",
  },
  {
    title: "5 причин попробовать нейрографику",
    excerpt: "Снятие стресса, поиск решений, творческое самовыражение — это лишь начало списка преимуществ этого метода.",
    date: "10 апреля 2026",
  },
  {
    title: "Как проходит сессия нейрографики",
    excerpt: "Подробный рассказ о том, что вас ждёт на индивидуальной сессии: от постановки запроса до финального результата.",
    date: "5 апреля 2026",
  },
];

const ArticlesSection = () => {
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
          {placeholderArticles.map((article, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-card rounded-2xl p-8 shadow-card border border-border hover:border-primary/30 transition-colors cursor-pointer group"
            >
              <p className="text-xs text-muted-foreground font-body mb-3">
                {article.date}
              </p>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">
                {article.excerpt}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;
