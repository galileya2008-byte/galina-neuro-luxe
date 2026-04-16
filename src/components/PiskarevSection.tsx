import { motion } from "framer-motion";

const PiskarevSection = () => {
  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-body text-sm tracking-[0.2em] uppercase text-secondary mb-3">
            Об авторе метода
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground">
            Павел <span className="italic text-secondary">Пискарёв</span>
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
            <div className="w-full md:w-1/3 flex-shrink-0">
              <img
                src="https://neurographica.metamodern.ru/local/templates/.default/kartiny/pavel-index2.webp"
                alt="Павел Михайлович Пискарёв — создатель метода НейроГрафика"
                className="w-full rounded-xl object-cover aspect-[3/4]"
                loading="lazy"
              />
            </div>
            <div className="space-y-5 text-muted-foreground font-body text-sm leading-relaxed">
              <p>
                <strong className="text-foreground">Пискарёв Павел Михайлович</strong> — профессор,
                доктор психологических наук, создатель метода{" "}
                <span className="text-primary font-medium">НейроГрафика</span>, известного по всему миру.
                Автор теорий, книг и уникальных образовательных программ. Психолог, художник, архитектор, спикер.
              </p>
              <p>
                Павел Пискарёв — основатель <strong className="text-foreground">Института Психологии Творчества</strong>,
                действительный член Международной Академии Психологических Наук (МАПН),
                председатель совета директоров МАНГо. Обладатель более 40 авторских свидетельств
                в гуманитарных науках.
              </p>
              <p>
                Метод НейроГрафика был создан в 2014 году на стыке психологии, нейронауки и искусства.
                Это научно обоснованный метод, который позволяет через рисование специальных линий
                перестроить нейронные связи и найти решения для любых жизненных задач.
                Сегодня НейроГрафика практикуется в более чем 40 странах мира.
              </p>
              <p>
                Путь Павла Пискарёва к созданию метода прошёл через глубокое изучение восточных практик,
                медитации, боевых искусств, архитектуры и психологии. Более 25 лет ежедневной медитативной
                практики, обучение у ведущих мастеров и собственный уникальный жизненный опыт стали
                фундаментом для создания НейроГрафики.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <a
              href="https://neurograff.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors font-body text-sm font-medium"
            >
              Институт Психологии Творчества →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PiskarevSection;
