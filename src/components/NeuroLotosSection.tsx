import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent } from "@/hooks/useSiteContent";

const PETAL_COLORS = [
  "hsl(320, 70%, 45%)",
  "hsl(330, 65%, 55%)",
  "hsl(310, 60%, 50%)",
  "hsl(340, 70%, 50%)",
  "hsl(220, 60%, 50%)",
  "hsl(200, 55%, 50%)",
  "hsl(160, 50%, 42%)",
  "hsl(280, 50%, 55%)",
];

const DEFAULTS = {
  eyebrow: "Интерактив",
  title: "Нейро",
  title_accent: "Лотос",
  subtitle: "Выберите лепесток лотоса и получите своё послание на сегодня",
  cta_text: "Хочешь получить изменения",
  cta_text_accent: "прямо сейчас?",
  cta_description: "",
  cta_button_label: "Получить урок",
  cta_payment_url: "https://getcourse.ru",
};

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const NeuroLotosSection = () => {
  const { value } = useSiteContent("lotus", DEFAULTS);
  const [messages, setMessages] = useState<string[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(() => {
    const saved = localStorage.getItem("neurolotus_message");
    const savedDate = localStorage.getItem("neurolotus_date");
    return savedDate === getTodayKey() ? saved : null;
  });
  const [hasPickedToday] = useState(() => localStorage.getItem("neurolotus_date") === getTodayKey());
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    supabase
      .from("lotus_messages")
      .select("message")
      .order("sort_order", { ascending: true })
      .then(({ data }) => data && setMessages(data.map((d) => d.message)));
  }, []);

  const handlePetalClick = useCallback(
    (_petalIndex: number) => {
      if (isRevealing || selectedMessage || messages.length === 0) return;
      if (localStorage.getItem("neurolotus_date") === getTodayKey()) return;

      setIsRevealing(true);

      let available = messages.map((_, i) => i).filter((i) => !usedIndices.has(i));
      if (available.length === 0) {
        setUsedIndices(new Set());
        available = messages.map((_, i) => i);
      }

      const randomIdx = available[Math.floor(Math.random() * available.length)];
      setUsedIndices((prev) => new Set([...prev, randomIdx]));

      setTimeout(() => {
        const msg = messages[randomIdx];
        setSelectedMessage(msg);
        localStorage.setItem("neurolotus_message", msg);
        localStorage.setItem("neurolotus_date", getTodayKey());
        setIsRevealing(false);
      }, 800);
    },
    [isRevealing, usedIndices, selectedMessage, messages]
  );

  const petalCount = 8;
  const radius = 110;

  return (
    <section id="method" className="py-24 px-6 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="font-body text-sm tracking-[0.2em] uppercase text-accent mb-3">
            {value.eyebrow}
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground mb-4">
            {value.title}
            <span className="italic text-primary">{value.title_accent}</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-md mx-auto whitespace-pre-line">
            {value.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-[340px] h-[340px] mx-auto mb-10"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center z-10 shadow-lg">
            <Sparkles className="text-primary-foreground" size={24} />
          </div>

          {Array.from({ length: petalCount }).map((_, i) => {
            const angle = (i * 360) / petalCount - 90;
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;
            const color = PETAL_COLORS[i % PETAL_COLORS.length];

            return (
              <motion.button
                key={i}
                className="absolute w-20 h-20 rounded-full cursor-pointer border-2 border-white/40 shadow-lg hover:shadow-2xl transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={{
                  top: `calc(50% + ${y}px - 40px)`,
                  left: `calc(50% + ${x}px - 40px)`,
                  background: `radial-gradient(circle at 35% 35%, ${color}ee, ${color}99)`,
                  boxShadow: `0 4px 20px ${color}66, inset 0 1px 2px rgba(255,255,255,0.3)`,
                }}
                whileHover={{ scale: 1.25, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                animate={isRevealing ? { scale: [1, 1.15, 1], opacity: [1, 0.6, 1] } : {}}
                transition={{ duration: 0.3 }}
                onClick={() => handlePetalClick(i)}
                aria-label={`Лепесток ${i + 1}`}
              />
            );
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="relative max-w-lg mx-auto bg-card rounded-2xl p-8 shadow-card border border-border"
            >
              <button
                onClick={() => setSelectedMessage(null)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Закрыть"
              >
                <X size={18} />
              </button>
              <Sparkles className="text-primary mx-auto mb-4" size={28} />
              <p className="font-heading text-xl md:text-2xl font-light text-foreground italic leading-relaxed">
                «{selectedMessage}»
              </p>
              <p className="font-body text-sm text-muted-foreground mt-4">
                Ваше послание от НейроЛотоса ✨
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedMessage && !hasPickedToday && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-body text-sm text-muted-foreground italic"
          >
            Нажмите на любой лепесток, чтобы получить послание
          </motion.p>
        )}

        {!selectedMessage && hasPickedToday && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-body text-sm text-muted-foreground italic"
          >
            Вы уже получили своё послание сегодня. Приходите завтра ✨
          </motion.p>
        )}

        {selectedMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-14 max-w-lg mx-auto bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border shadow-card"
          >
            <p className="font-heading text-xl md:text-2xl font-light text-foreground mb-3">
              {value.cta_text}{" "}
              <span className="italic text-primary">{value.cta_text_accent}</span>
            </p>
            {value.cta_description && (
              <p className="font-body text-muted-foreground mb-6 whitespace-pre-line">
                {value.cta_description}
              </p>
            )}
            <Button
              size="lg"
              className="text-base px-8"
              onClick={() => window.open(value.cta_payment_url, "_blank")}
            >
              <Sparkles size={18} />
              {value.cta_button_label}
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default NeuroLotosSection;
