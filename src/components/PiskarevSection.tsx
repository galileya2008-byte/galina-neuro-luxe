import { motion } from "framer-motion";
import { useSiteContent } from "@/hooks/useSiteContent";

const DEFAULTS = {
  eyebrow: "Об авторе метода",
  title: "Павел",
  title_accent: "Пискарёв",
  image_url: "https://neurographica.metamodern.ru/local/templates/.default/kartiny/pavel-index2.webp",
  paragraphs: [] as string[],
  link_label: "Институт Психологии Творчества",
  link_url: "https://neuro.piskarev.ru",
};

const PiskarevSection = () => {
  const { value } = useSiteContent("author", DEFAULTS);

  return (
    <section id="author" className="py-24 px-6 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-body text-sm tracking-[0.2em] uppercase text-secondary mb-3">
            {value.eyebrow}
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground">
            {value.title} <span className="italic text-secondary">{value.title_accent}</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-card rounded-2xl p-8 md:p-12 shadow-card border border-border"
        >
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {value.image_url && (
              <div className="w-full md:w-1/3 flex-shrink-0">
                <img
                  src={value.image_url}
                  alt={`${value.title} ${value.title_accent}`}
                  className="w-full rounded-xl object-cover aspect-[3/4]"
                  loading="lazy"
                />
              </div>
            )}
            <div className="space-y-5 text-muted-foreground font-body text-sm leading-relaxed">
              {value.paragraphs.map((p, i) => (
                <p key={i} className="whitespace-pre-line">{p}</p>
              ))}
            </div>
          </div>

          {value.link_url && value.link_label && (
            <div className="mt-8 pt-6 border-t border-border">
              <a
                href={value.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors font-body text-sm font-medium"
              >
                {value.link_label} →
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default PiskarevSection;
