import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import galinaPortrait from "@/assets/galina-portrait.png";
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
  portrait_url: galinaPortrait,
  portrait_caption_top: "Бережно к твоей цели",
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

        {/* Right: premium portrait slot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="md:col-span-5 relative"
        >
          {/* Soft glow halo behind */}
          <div className="absolute -inset-6 rounded-[2.5rem] gradient-aurora opacity-25 blur-3xl pointer-events-none" />

          {/* Outer thin frame */}
          <div className="relative rounded-[2rem] p-[1px] bg-gradient-to-br from-primary/40 via-secondary/30 to-accent/40 shadow-elegant animate-float-slow">
            <div className="relative aspect-[4/5] rounded-[1.95rem] overflow-hidden glass">
              {(value.portrait_url || galinaPortrait) ? (
                <img
                  src={value.portrait_url || galinaPortrait}
                  alt={value.portrait_caption_bottom || "Портрет"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-muted/40 via-background to-muted/30">
                  <NeuroLines variant="circles" opacity={0.3} />
                  <div className="relative z-10 w-20 h-20 rounded-full glass flex items-center justify-center mb-5 shadow-soft">
                    <Sparkles className="w-7 h-7 text-primary" />
                  </div>
                  <p className="relative z-10 eyebrow !text-[10px] mb-2">Место для фото</p>
                  <p className="relative z-10 font-heading italic text-lg text-foreground/80 max-w-[14rem] leading-snug">
                    Здесь будет ваш портрет — добавьте URL в админке
                  </p>
                </div>
              )}

              {/* Editorial overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/55 via-transparent to-transparent pointer-events-none" />
              <NeuroLines variant="constellation" opacity={0.25} />

              {/* Corner accents */}
              <span className="absolute top-4 left-4 w-6 h-6 border-t border-l border-primary/60 rounded-tl-md" />
              <span className="absolute top-4 right-4 w-6 h-6 border-t border-r border-primary/60 rounded-tr-md" />
              <span className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-primary/60 rounded-bl-md" />
              <span className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-primary/60 rounded-br-md" />
            </div>
          </div>

          {/* Floating caption chip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="hidden md:block absolute -bottom-6 -left-6 glass rounded-2xl px-5 py-3 shadow-card"
          >
            <p className="font-display text-[10px] text-muted-foreground tracking-[0.3em] uppercase">
              {value.portrait_caption_top}
            </p>
            <p className="font-heading text-xl italic text-gradient">
              {value.portrait_caption_bottom}
            </p>
          </motion.div>

          {/* Floating numeric chip top-right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="hidden md:flex absolute -top-5 -right-5 glass rounded-full w-20 h-20 flex-col items-center justify-center shadow-card"
          >
            <span className="font-heading text-2xl text-primary leading-none">7+</span>
            <span className="font-display text-[9px] tracking-[0.2em] uppercase text-muted-foreground mt-1">лет</span>
          </motion.div>
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
