import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent } from "@/hooks/useSiteContent";
import { getIcon } from "@/lib/icons";

const DEFAULTS = {
  eyebrow: "Обучение и работа",
  title: "Курсы и",
  title_accent: "Мастер-классы",
  beginner_title: "",
  beginner_description: "",
  beginner_price: "",
  beginner_payment_url: "",
  beginner_cta: "Записаться",
  others_title: "Другие",
  others_title_accent: "продукты",
};

type Course = {
  id: string;
  icon: string;
  title: string;
  description: string;
  price: string;
  price_note: string | null;
  popular: boolean;
  payment_url: string | null;
};

const ServicesSection = () => {
  const { value } = useSiteContent("courses_section", DEFAULTS);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    supabase
      .from("courses")
      .select("id, icon, title, description, price, price_note, popular, payment_url")
      .order("sort_order", { ascending: true })
      .then(({ data }) => data && setCourses(data));
  }, []);

  return (
    <section id="courses" className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/40 to-background pointer-events-none" />
      <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[120px] pointer-events-none" />

      <div className="relative container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="eyebrow mb-3">{value.eyebrow}</p>
          <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground">
            {value.title} <span className="italic text-gradient">{value.title_accent}</span>
          </h2>
          <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </motion.div>

        {courses.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {courses.map((service, index) => {
              const Icon = getIcon(service.icon);
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.12 }}
                  className={`group relative glass rounded-3xl p-8 hover:-translate-y-1 hover:shadow-glow transition-all duration-500 ${
                    service.popular ? "ring-1 ring-primary/40" : ""
                  }`}
                >
                  {service.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground text-[10px] tracking-[0.2em] uppercase font-display font-medium px-4 py-1.5 rounded-full shadow-glow">
                      Популярный
                    </span>
                  )}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-2xl font-semibold text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground font-body text-sm mb-6 leading-relaxed whitespace-pre-line min-h-[4.5rem]">
                    {service.description}
                  </p>
                  <div className="divider-line my-5" />
                  <p className="font-heading text-3xl font-bold text-gradient">{service.price}</p>
                  {service.price_note && (
                    <p className="text-muted-foreground font-body text-xs mt-1">
                      {service.price_note}
                    </p>
                  )}
                  <Button
                    className="w-full gradient-primary text-primary-foreground font-display font-medium mt-6 rounded-full py-6 shadow-soft hover:shadow-glow transition-shadow"
                    onClick={() =>
                      service.payment_url
                        ? window.open(service.payment_url, "_blank")
                        : (window.location.hash = "#contacts")
                    }
                  >
                    Записаться
                  </Button>
                </motion.div>
              );
            })}
          </div>
        )}

        {value.beginner_title && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16"
          >
            <div className="text-center mb-10">
              <h3 className="font-heading text-3xl font-light text-foreground">
                {value.others_title}{" "}
                <span className="italic text-secondary">{value.others_title_accent}</span>
              </h3>
            </div>
            <div className="max-w-lg mx-auto bg-card rounded-2xl p-8 shadow-card border border-border text-center">
              <h4 className="font-heading text-xl font-semibold text-foreground mb-3">
                {value.beginner_title}
              </h4>
              <p className="text-muted-foreground font-body text-sm mb-4 leading-relaxed whitespace-pre-line">
                {value.beginner_description}
              </p>
              <p className="font-heading text-3xl font-bold text-accent">{value.beginner_price}</p>
              <Button
                variant="outline"
                className="mt-4 w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground font-body font-medium"
                onClick={() =>
                  value.beginner_payment_url
                    ? window.open(value.beginner_payment_url, "_blank")
                    : (window.location.hash = "#contacts")
                }
              >
                {value.beginner_cta}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
