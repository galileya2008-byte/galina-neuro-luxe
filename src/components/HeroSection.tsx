import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import { useSiteContent } from "@/hooks/useSiteContent";

const DEFAULTS = {
  eyebrow: "Инструктор нейрографики",
  name_line_1: "Галина",
  name_line_2: "Оноприенко",
  subtitle: "Трансформация через творчество. Нейрографика — метод, который меняет жизнь через рисование линий.",
  cta_label: "Узнать больше",
  cta_href: "#courses",
};

const HeroSection = () => {
  const { value } = useSiteContent("hero", DEFAULTS);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src={heroBg}
        alt="Нейрографика"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 gradient-hero" />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-4"
        >
          {value.eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-heading text-5xl md:text-7xl font-light text-foreground mb-6 leading-tight"
        >
          {value.name_line_1} <br />
          <span className="font-semibold italic text-primary">{value.name_line_2}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-body text-lg text-muted-foreground mb-10 max-w-xl mx-auto whitespace-pre-line"
        >
          {value.subtitle}
        </motion.p>

        <motion.a
          href={value.cta_href}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="inline-block gradient-primary text-primary-foreground font-body font-medium px-8 py-3 rounded-full shadow-soft hover:opacity-90 transition-opacity"
        >
          {value.cta_label}
        </motion.a>
      </div>
    </section>
  );
};

export default HeroSection;
