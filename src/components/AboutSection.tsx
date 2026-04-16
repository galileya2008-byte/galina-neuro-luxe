import { motion } from "framer-motion";
import aboutPhoto from "@/assets/about-photo.jpg";

const AboutSection = () => {
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
                src={aboutPhoto}
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
              Обо мне
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground mb-6">
              Путь к <span className="italic text-primary">гармонии</span>
            </h2>
            <div className="space-y-4 text-muted-foreground font-body leading-relaxed">
              <p>
                Я — Галина Оноприенко, дипломированный Инструктор Нейрографики.
                Помогаю людям трансформировать свою жизнь через уникальный метод
                рисования, соединяющий творчество и нейронауку.
              </p>
              <p>
                Нейрографика — это научно обоснованный метод, который позволяет
                через рисование специальных линий перестроить нейронные связи и
                найти решения для любых жизненных задач.
              </p>
              <p>
                Каждая сессия — это путешествие внутрь себя, где вы обретаете
                ясность, спокойствие и новые возможности.
                <br />
                И я сама свой кейс!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
