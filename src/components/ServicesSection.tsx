import { motion } from "framer-motion";
import { Sparkles, Package, Star } from "lucide-react";

const services = [
  {
    icon: Sparkles,
    title: "Индивидуальная работа",
    description: "Онлайн занятие 1,5 часа — персональная сессия нейрографики по вашему запросу",
    price: "6 000 ₽",
    note: "за сессию",
  },
  {
    icon: Package,
    title: "Пакет из 3 сессий",
    description: "Глубокая проработка запроса через серию последовательных сессий",
    price: "14 000 ₽",
    note: "экономия 4 000 ₽",
    popular: true,
  },
  {
    icon: Star,
    title: "Пакет из 5 сессий",
    description: "Комплексная трансформация — максимальный результат и глубокие изменения",
    price: "22 000 ₽",
    note: "экономия 8 000 ₽",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 px-6 bg-muted/50">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm tracking-[0.2em] uppercase text-primary mb-3">
            Услуги
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground">
            Индивидуальная <span className="italic text-primary">работа</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`relative bg-card rounded-2xl p-8 shadow-card border border-border hover:border-primary/30 transition-colors ${
                service.popular ? "ring-2 ring-primary/20" : ""
              }`}
            >
              {service.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground text-xs font-body font-medium px-4 py-1 rounded-full">
                  Популярный
                </span>
              )}
              <service.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-heading text-2xl font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground font-body text-sm mb-6 leading-relaxed">
                {service.description}
              </p>
              <p className="font-heading text-3xl font-bold text-primary">
                {service.price}
              </p>
              <p className="text-muted-foreground font-body text-xs mt-1">
                {service.note}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Products for beginners */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <div className="text-center mb-10">
            <h3 className="font-heading text-3xl font-light text-foreground">
              Другие <span className="italic text-secondary">продукты</span>
            </h3>
          </div>
          <div className="max-w-lg mx-auto bg-card rounded-2xl p-8 shadow-card border border-border text-center">
            <h4 className="font-heading text-xl font-semibold text-foreground mb-3">
              Для новичков — Знакомство
            </h4>
            <p className="text-muted-foreground font-body text-sm mb-4 leading-relaxed">
              2 алгоритма и работа с нейролинией — идеальный старт для тех, кто хочет попробовать нейрографику
            </p>
            <p className="font-heading text-3xl font-bold text-accent">
              2 500 ₽
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
