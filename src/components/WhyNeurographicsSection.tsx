import { motion } from "framer-motion";
import { Heart, Brain, Sparkles, Compass, Smile, TrendingUp } from "lucide-react";

const reasons = [
  {
    icon: Brain,
    title: "Перестраивает нейронные связи",
    description: "Через рисование специальных линий формируются новые паттерны мышления и поведения.",
  },
  {
    icon: Heart,
    title: "Снимает стресс и тревогу",
    description: "Медитативный процесс рисования возвращает в ресурсное состояние и внутренний покой.",
  },
  {
    icon: Compass,
    title: "Помогает найти решения",
    description: "Любой запрос — финансы, отношения, здоровье, цели — можно проработать через алгоритмы.",
  },
  {
    icon: Sparkles,
    title: "Раскрывает творческий потенциал",
    description: "Не нужно уметь рисовать. Нейрографика доступна каждому и пробуждает внутреннего творца.",
  },
  {
    icon: Smile,
    title: "Меняет отношение к себе и миру",
    description: "Появляется принятие, благодарность и радость от простых вещей.",
  },
  {
    icon: TrendingUp,
    title: "Даёт быстрые результаты",
    description: "Изменения чувствуются уже после первой сессии — в настроении, мыслях, теле.",
  },
];

const WhyNeurographicsSection = () => {
  return (
    <section id="why" className="py-24 px-6 bg-background">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm tracking-[0.2em] uppercase text-primary mb-3">
            Почему именно это
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground">
            Почему <span className="italic text-primary">НейроГрафика</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto mt-5 leading-relaxed">
            Это не просто рисование — это инструмент трансформации, который работает на уровне
            нейробиологии и психологии одновременно.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-2xl p-7 shadow-card border border-border hover:border-primary/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-5">
                <reason.icon className="text-primary-foreground" size={22} />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
                {reason.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyNeurographicsSection;
