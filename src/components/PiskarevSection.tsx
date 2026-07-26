import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import piskarevPortrait from "@/assets/piskarev-portrait.webp";
import { useSiteContent } from "@/hooks/useSiteContent";

const LEGACY_LOW_QUALITY_IMAGE = "pavel-index2.webp";

const DEFAULT_PARAGRAPHS = [
  "Пискарёв Павел Михайлович — профессор, доктор психологических наук, создатель метода НейроГрафика, известного по всему миру. Автор теорий, книг и уникальных образовательных программ. Психолог, художник, архитектор, спикер.",
  "Основатель Института Психологии Творчества, действительный член Международной Академии Психологических Наук (МАПН), председатель совета директоров МАНГо. Обладатель более 40 авторских свидетельств в гуманитарных науках.",
  "Метод НейроГрафика был создан в 2014 году на стыке психологии, нейронауки и искусства. Это научно обоснованный метод, который позволяет через рисование специальных линий перестроить нейронные связи и найти решения для любых жизненных задач. Сегодня НейроГрафика практикуется в более чем 40 странах мира.",
];

const DEFAULTS = {
  eyebrow: "Об авторе метода",
  title: "Павел",
  title_accent: "Пискарёв",
  image_url: "",
  paragraphs: DEFAULT_PARAGRAPHS,
  link_label: "Официальный сайт автора метода",
  link_url: "https://neuro.piskarev.ru",
};

const CREDENTIALS = ["Ph.D.", "Профессор", "Автор НейроГрафики"];

const PiskarevSection = () => {
  const { value } = useSiteContent("author", DEFAULTS);

  const remoteUrl = value.image_url?.trim();
  const imgSrc =
    remoteUrl && !remoteUrl.includes(LEGACY_LOW_QUALITY_IMAGE)
      ? remoteUrl
      : piskarevPortrait;

  const paragraphs =
    value.paragraphs.length > 0 ? value.paragraphs : DEFAULT_PARAGRAPHS;

  return (
    <section id="author" className="py-24 px-6 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="font-body text-sm tracking-[0.2em] uppercase text-secondary mb-3">
            {value.eyebrow}
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground mb-4">
            {value.title}{" "}
            <span className="italic text-secondary">{value.title_accent}</span>
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CREDENTIALS.map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full border border-secondary/25 bg-secondary/10 px-3 py-1 text-xs md:text-sm font-body font-medium text-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-[minmax(260px,320px)_1fr] gap-10 md:gap-14 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mx-auto w-full max-w-sm md:max-w-none md:sticky md:top-28"
          >
            <div className="relative">
              <div className="absolute -inset-3 rounded-[1.75rem] bg-gradient-to-br from-secondary/20 via-primary/10 to-accent/20 blur-sm" />
              <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-card">
                <img
                  src={imgSrc}
                  alt={`${value.title} ${value.title_accent}`}
                  className="w-full aspect-[4/5] object-cover object-[center_12%]"
                  loading="lazy"
                  width={640}
                  height={800}
                />
              </div>
              <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-2xl bg-secondary/10 -z-10" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="bg-card rounded-2xl border border-border p-8 md:p-10 shadow-card"
          >
            <div className="space-y-5 font-body leading-relaxed">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={
                    index === 0
                      ? "text-lg md:text-xl text-foreground font-medium leading-relaxed whitespace-pre-line"
                      : "text-base md:text-lg text-foreground/85 whitespace-pre-line"
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {value.link_url && value.link_label && (
              <div className="mt-8 pt-8 border-t border-border">
                <a
                  href={value.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-secondary/10 px-5 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary/20"
                >
                  {value.link_label}
                  <ExternalLink size={18} className="text-secondary" />
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PiskarevSection;
