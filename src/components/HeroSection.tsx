import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import { useSiteContent } from "@/hooks/useSiteContent";
import NeuroLines from "@/components/NeuroLines";
import { ArrowRight, Sparkles } from "lucide-react";

const DEFAULTS = {
  eyebrow: "Инструктор нейрографики",
  name_line_1: "Галина",
  name_line_2: "Оноприенко",
  subtitle: "Трансформация через творчество. Нейрографика — метод, который меняет жизнь через рисование линий.",
  cta_label: "Узнать больше",
  cta_href: "#courses",
  cta_secondary_label: "Смотреть работы",
  cta_secondary_href: "#gallery",
  portrait_url: "",
  portrait_caption_top: "Автор и инструктор",
  portrait_caption_bottom: "Галина Оноприенко",
};

const HeroSection = () => {
  const { value } = useSiteContent("hero", DEFAULTS);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      {/* Aurora background */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="aurora" />
      <NeuroLines variant="circles" opacity={0.12} className="hidden md:block" />

      {/* Soft hero image */}
      <img
        src={heroBg}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-[0.08] mix-blend-multiply"
        width={1920}
        height={1080}
      />

      <div className="relative z-10 container mx-auto max-w-6xl px-6 grid md:grid-cols-12 gap-8 items-center">
        {/* Left: copy */}
        <div className="md:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="eyebrow !text-[10px]">{value.eyebrow}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="font-heading text-[clamp(2.75rem,7vw,5.75rem)] font-light leading-[1.02] tracking-tight text-foreground"
          >
            {value.name_line_1}
            <br />
            <span className="italic font-medium text-gradient">{value.name_line_2}</span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="origin-left mt-6 h-px w-24 bg-gradient-to-r from-primary via-secondary to-accent"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="font-body text-base md:text-lg text-muted-foreground mt-6 max-w-xl whitespace-pre-line leading-relaxed"
          >
            {value.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <a
              href={value.cta_href}
              className="group inline-flex items-center gap-2 gradient-primary text-primary-foreground font-display font-medium px-7 py-3.5 rounded-full shadow-glow hover:shadow-elegant transition-all duration-500"
            >
              {value.cta_label}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            {value.cta_secondary_label && (
              <a
                href={value.cta_secondary_href}
                className="inline-flex items-center gap-2 glass text-foreground font-display font-medium px-7 py-3.5 rounded-full hover:bg-card transition-colors"
              >
                {value.cta_secondary_label}
              </a>
            )}
          </motion.div>
        </div>

        {/* Right: editorial visual card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="md:col-span-5 relative"
        >
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden glass shadow-elegant animate-float-slow">
            <img
              src={heroBg}
              alt="Нейрографика — пример работы"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
            <NeuroLines variant="constellation" opacity={0.35} />
          </div>

          {/* Floating chip */}
          <div className="hidden md:block absolute -bottom-6 -left-6 glass rounded-2xl px-5 py-3 shadow-card">
            <p className="font-display text-xs text-muted-foreground tracking-widest uppercase">Метод</p>
            <p className="font-heading text-xl italic text-primary">НейроГрафика</p>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground/70 font-body"
      >
        scroll ↓
      </motion.div>
    </section>
  );
};

export default HeroSection;
