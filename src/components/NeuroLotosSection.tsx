import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const MESSAGES = [
  "Доверься потоку жизни — он несёт тебя туда, где ты нужна больше всего.",
  "Сегодня прекрасный день, чтобы отпустить контроль и позволить чуду случиться.",
  "Твоя внутренняя красота проявляется через каждый штрих, который ты создаёшь.",
  "Перемены уже начались — просто позволь себе их заметить.",
  "Ты заслуживаешь всего, о чём мечтаешь. Начни с маленького шага прямо сейчас.",
  "Твоя уникальность — это дар миру. Не прячь её.",
  "Отпусти старые убеждения — они уже не служат тебе. Новое пространство ждёт.",
  "Каждая линия, которую ты проводишь, — это разговор с собой. Слушай внимательно.",
  "Вселенная поддерживает тебя. Расслабься и позволь ресурсу прийти.",
  "Сегодня идеальный день, чтобы начать рисовать свою новую реальность.",
  "Ты сильнее, чем думаешь, и мудрее, чем предполагаешь.",
  "Гармония внутри тебя — ключ к гармонии вокруг.",
];

const PETAL_COLORS = [
  "hsl(320, 70%, 45%)",   // fuchsia
  "hsl(330, 65%, 55%)",   // rose
  "hsl(310, 60%, 50%)",   // magenta
  "hsl(340, 70%, 50%)",   // pink
  "hsl(220, 60%, 50%)",   // blue
  "hsl(200, 55%, 50%)",   // sky
  "hsl(160, 50%, 42%)",   // green
  "hsl(280, 50%, 55%)",   // violet
];

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const NeuroLotosSection = () => {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(() => {
    const saved = localStorage.getItem("neurolotus_message");
    const savedDate = localStorage.getItem("neurolotus_date");
    return savedDate === getTodayKey() ? saved : null;
  });
  const [hasPickedToday] = useState(() => localStorage.getItem("neurolotus_date") === getTodayKey());
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());
  const [isRevealing, setIsRevealing] = useState(false);

  const handlePetalClick = useCallback((petalIndex: number) => {
    if (isRevealing || selectedMessage) return;

    // Check if already picked today
    if (localStorage.getItem("neurolotus_date") === getTodayKey()) return;

    setIsRevealing(true);

    let available = MESSAGES.map((_, i) => i).filter(i => !usedIndices.has(i));
    if (available.length === 0) {
      setUsedIndices(new Set());
      available = MESSAGES.map((_, i) => i);
    }

    const randomIdx = available[Math.floor(Math.random() * available.length)];
    setUsedIndices(prev => new Set([...prev, randomIdx]));

    setTimeout(() => {
      const msg = MESSAGES[randomIdx];
      setSelectedMessage(msg);
      localStorage.setItem("neurolotus_message", msg);
      localStorage.setItem("neurolotus_date", getTodayKey());
      setIsRevealing(false);
    }, 800);
  }, [isRevealing, usedIndices, selectedMessage]);

  const petalCount = 8;
  const radius = 100;

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="font-body text-sm tracking-[0.2em] uppercase text-accent mb-3">
            Интерактив
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground mb-4">
            Нейро<span className="italic text-primary">Лотос</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-md mx-auto">
            Выберите лепесток лотоса и получите своё послание на сегодня
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-[300px] h-[300px] mx-auto mb-10"
        >
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center z-10 shadow-lg">
            <Sparkles className="text-primary-foreground" size={24} />
          </div>

          {/* Petals */}
          {Array.from({ length: petalCount }).map((_, i) => {
            const angle = (i * 360) / petalCount - 90;
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;
            const color = PETAL_COLORS[i % PETAL_COLORS.length];

            return (
              <motion.button
                key={i}
                className="absolute w-16 h-16 rounded-full cursor-pointer border-2 border-white/30 shadow-md hover:shadow-xl transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={{
                  top: `calc(50% + ${y}px - 32px)`,
                  left: `calc(50% + ${x}px - 32px)`,
                  background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                }}
                whileHover={{ scale: 1.2, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                animate={isRevealing ? { scale: [1, 1.1, 1], opacity: [1, 0.7, 1] } : {}}
                transition={{ duration: 0.3 }}
                onClick={() => handlePetalClick(i)}
                aria-label={`Лепесток ${i + 1}`}
              />
            );
          })}
        </motion.div>

        {/* Message display */}
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

        {/* CTA block — only after picking */}
        {selectedMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 max-w-lg mx-auto bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border shadow-card"
        >
          <p className="font-heading text-xl md:text-2xl font-light text-foreground mb-3">
            Хочешь получить изменения <span className="italic text-primary">прямо сейчас</span>?
          </p>
          <p className="font-body text-muted-foreground mb-6">
            Поработай с этой моделью НейроЛотоса Посланий — видеоурок с пошаговым алгоритмом
          </p>
          <Button
            size="lg"
            className="text-base px-8"
            onClick={() => window.open('https://getcourse.ru', '_blank')}
          >
            <Sparkles size={18} />
            Получить урок — 970 ₽
          </Button>
        </motion.div>
        )}
      </div>
    </section>
  );
};

export default NeuroLotosSection;
