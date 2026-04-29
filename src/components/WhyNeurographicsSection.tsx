import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent } from "@/hooks/useSiteContent";
import { getIcon } from "@/lib/icons";

const DEFAULTS = {
  eyebrow: "Почему именно это",
  title: "Почему",
  title_accent: "НейроГрафика",
  subtitle: "",
};

type Reason = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

const WhyNeurographicsSection = () => {
  const { value } = useSiteContent("why", DEFAULTS);
  const [reasons, setReasons] = useState<Reason[]>([]);

  useEffect(() => {
    supabase
      .from("why_reasons")
      .select("id, icon, title, description")
      .order("sort_order", { ascending: true })
      .then(({ data }) => data && setReasons(data));
  }, []);

  if (reasons.length === 0) return null;

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
            {value.eyebrow}
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground">
            {value.title} <span className="italic text-primary">{value.title_accent}</span>
          </h2>
          {value.subtitle && (
            <p className="font-body text-muted-foreground max-w-2xl mx-auto mt-5 leading-relaxed">
              {value.subtitle}
            </p>
          )}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => {
            const Icon = getIcon(reason.icon);
            return (
              <motion.div
                key={reason.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-2xl p-7 shadow-card border border-border hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-5">
                  <Icon className="text-primary-foreground" size={22} />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
                  {reason.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyNeurographicsSection;
