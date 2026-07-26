import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getCookieConsent,
  setCookieConsent,
  COOKIE_CONSENT_EVENT,
} from "@/lib/cookieConsent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getCookieConsent() === null);

    const onChange = () => setVisible(getCookieConsent() === null);
    window.addEventListener(COOKIE_CONSENT_EVENT, onChange);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onChange);
  }, []);

  const accept = () => {
    setCookieConsent("accepted");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[70] p-4 md:p-6 pointer-events-none"
          role="dialog"
          aria-live="polite"
          aria-label="Уведомление о cookie"
        >
          <div className="pointer-events-auto mx-auto max-w-3xl glass rounded-2xl border border-border/80 shadow-elegant px-5 py-5 md:px-6 md:py-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <div className="flex items-start gap-3 flex-1">
                <span className="inline-flex shrink-0 items-center justify-center w-10 h-10 rounded-full bg-accent/15 text-accent">
                  <Cookie size={20} />
                </span>
                <div>
                  <p className="font-body text-sm md:text-base text-foreground leading-relaxed">
                    Мы используем cookie и сервисы аналитики, чтобы сайт работал корректно и становился
                    удобнее. Продолжая пользоваться сайтом, вы соглашаетесь с{" "}
                    <Link to="/offer#cookies" className="text-primary underline-offset-2 hover:underline">
                      использованием cookie
                    </Link>{" "}
                    и{" "}
                    <Link to="/offer" className="text-primary underline-offset-2 hover:underline">
                      публичной офертой
                    </Link>
                    .
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 shrink-0 md:min-w-[200px]">
                <Button onClick={accept} className="gradient-primary text-primary-foreground font-body">
                  Принять
                </Button>
                <Button variant="outline" asChild className="font-body">
                  <Link to="/offer">Подробнее</Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
