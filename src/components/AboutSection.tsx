import { motion } from "framer-motion";
import aboutPhoto from "@/assets/about-photo.jpg";
import { useSiteContent } from "@/hooks/useSiteContent";

const DEFAULTS = {
  eyebrow: "Обо мне",
  title: "Путь к",
  title_accent: "гармонии",
  image_url: "",
  paragraphs: [] as string[],
};

const AboutSection = () => {
  const { value } = useSiteContent("about", DEFAULTS);
  const imgSrc = value.image_url?.trim() ? value.image_url : aboutPhoto;

  return (
    <section id="about" className="py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <img
                src={imgSrc}
                alt="Галина Оноприенко"
                className="rounded-2xl shadow-card w-full object-cover aspect-[4/5]"
                loading="lazy"
                width={800}
                height={1000}
              />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-2xl bg-primary/10 -z-10" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-body text-sm tracking-[0.2em] uppercase text-primary mb-3">
              {value.eyebrow}
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground mb-6">
              {value.title} <span className="italic text-primary">{value.title_accent}</span>
            </h2>
            <div className="space-y-4 text-muted-foreground font-body leading-relaxed">
              {value.paragraphs.map((p, i) => (
                <p key={i} className="whitespace-pre-line">{p}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
