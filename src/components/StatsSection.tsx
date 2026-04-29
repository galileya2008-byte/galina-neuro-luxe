import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent } from "@/hooks/useSiteContent";
import { getIcon } from "@/lib/icons";
import NeuroLines from "@/components/NeuroLines";

const DEFAULTS = {
  title: "В цифрах",
  subtitle: "Опыт, который говорит сам за себя",
  description: "Каждая цифра — это история трансформации, преодоления и нового вдохновения.",
};

type Stat = {
  id: string;
  label: string;
  value: string;
  suffix: string | null;
  icon: string | null;
};

const StatsSection = () => {
  const { value } = useSiteContent("stats", DEFAULTS);
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    supabase
      .from("site_stats")
      .select("id, label, value, suffix, icon")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => data && setStats(data));
  }, []);

  if (stats.length === 0) return null;

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <NeuroLines variant="wave" opacity={0.18} />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background pointer-events-none" />

      <div className="relative container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <p className="eyebrow mb-3">{value.title}</p>
          <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground leading-tight">
            {value.subtitle?.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="italic text-gradient">{value.subtitle?.split(" ").slice(-1)}</span>
          </h2>
          {value.description && (
            <p className="mt-4 font-body text-muted-foreground">{value.description}</p>
          )}
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s, i) => {
            const Icon = getIcon(s.icon);
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative glass rounded-2xl p-6 md:p-8 text-center hover:shadow-glow transition-shadow duration-500 group"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-primary/10 bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="font-heading text-4xl md:text-5xl font-light text-foreground">
                  <span className="text-gradient font-medium">{s.value}</span>
                  {s.suffix && <span className="text-primary">{s.suffix}</span>}
                </p>
                <p className="mt-2 font-body text-xs md:text-sm text-muted-foreground tracking-wide">
                  {s.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
