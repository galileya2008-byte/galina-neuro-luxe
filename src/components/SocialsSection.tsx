import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent } from "@/hooks/useSiteContent";
import { getIcon } from "@/lib/icons";
import NeuroLines from "@/components/NeuroLines";

type SocialLink = {
  id: string;
  label: string;
  url: string;
  icon: string;
};

const DEFAULTS = {
  eyebrow: "Будем на связи",
  title: "Мои",
  title_accent: "соцсети",
  subtitle:
    "Подписывайтесь — там я делюсь работами, мыслями о НейроГрафике и анонсами встреч.",
};

const SocialsSection = () => {
  const { value: content } = useSiteContent("socials_section", DEFAULTS);
  const [socials, setSocials] = useState<SocialLink[]>([]);

  useEffect(() => {
    supabase
      .from("social_links")
      .select("id, label, url, icon")
      .order("sort_order", { ascending: true })
      .then(({ data }) => data && setSocials(data));
  }, []);

  if (socials.length === 0) return null;

  return (
    <section id="socials" className="relative py-24 px-6 overflow-hidden">
      <NeuroLines variant="constellation" className="opacity-40" />

      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-body text-sm tracking-[0.2em] uppercase text-accent mb-3">
            {content.eyebrow}
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground">
            {content.title}{" "}
            <span className="italic text-accent">{content.title_accent}</span>
          </h2>
          {content.subtitle && (
            <p className="mt-4 font-body text-base text-muted-foreground max-w-xl mx-auto">
              {content.subtitle}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {socials.map((s, i) => {
            const Icon = getIcon(s.icon);
            const isExternal = /^https?:\/\//.test(s.url);
            return (
              <motion.a
                key={s.id}
                href={s.url}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="glass group relative rounded-2xl p-5 flex flex-col items-center text-center gap-3 border border-border/60 hover:border-accent/60 transition-colors"
              >
                <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
                <span className="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-accent group-hover:scale-110 transition-transform">
                  <Icon size={22} />
                </span>
                <span className="relative font-body text-sm font-medium text-foreground">
                  {s.label}
                </span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SocialsSection;
