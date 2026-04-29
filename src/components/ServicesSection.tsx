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
    <section id="courses" className="py-24 px-6 bg-muted/50">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm tracking-[0.2em] uppercase text-primary mb-3">
            {value.eyebrow}
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground">
            {value.title} <span className="italic text-primary">{value.title_accent}</span>
          </h2>
        </motion.div>

        {courses.length > 0 && (
          <div className="grid md:grid-cols-3 gap-8">
            {courses.map((service, index) => {
              const Icon = getIcon(service.icon);
              return (
                <motion.div
                  key={service.id}
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
                  <Icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-heading text-2xl font-semibold text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground font-body text-sm mb-6 leading-relaxed whitespace-pre-line">
                    {service.description}
                  </p>
                  <p className="font-heading text-3xl font-bold text-primary">{service.price}</p>
                  {service.price_note && (
                    <p className="text-muted-foreground font-body text-xs mt-1 mb-6">
                      {service.price_note}
                    </p>
                  )}
                  <Button
                    className="w-full gradient-primary text-primary-foreground font-body font-medium mt-2"
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
