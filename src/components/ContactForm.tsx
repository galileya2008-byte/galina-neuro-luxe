import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent } from "@/hooks/useSiteContent";

const DEFAULTS = {
  eyebrow: "Обратная связь",
  title: "Задать",
  title_accent: "вопрос",
};

const ContactForm = () => {
  const { value: content } = useSiteContent("contacts", DEFAULTS);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.message.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните имя и сообщение",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    const { error } = await supabase.from("contact_messages").insert({
      name: formData.name.trim(),
      email: formData.email.trim() || null,
      message: formData.message.trim(),
    });

    if (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить сообщение. Попробуйте ещё раз.",
        variant: "destructive",
      });
    } else {
      // Send Telegram notification (fire-and-forget)
      supabase.functions.invoke("send-telegram", {
        body: { name: formData.name.trim(), email: formData.email.trim() || null, message: formData.message.trim() },
      }).catch(console.error);

      toast({
        title: "Сообщение отправлено!",
        description: "Галина свяжется с вами в ближайшее время",
      });
      setFormData({ name: "", email: "", message: "" });
    }

    setIsSubmitting(false);
  };

  return (
    <section id="contacts" className="py-24 px-6">
      <div className="container mx-auto max-w-xl">
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
            {content.title} <span className="italic text-accent">{content.title_accent}</span>
          </h2>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          onSubmit={handleSubmit}
          className="bg-card rounded-2xl p-8 shadow-card border border-border space-y-5"
        >
          <div>
            <label className="font-body text-sm font-medium text-foreground mb-1.5 block">
              Имя
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ваше имя"
              maxLength={100}
              required
            />
          </div>

          <div>
            <label className="font-body text-sm font-medium text-foreground mb-1.5 block">
              Email (необязательно)
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              maxLength={255}
            />
          </div>

          <div>
            <label className="font-body text-sm font-medium text-foreground mb-1.5 block">
              Сообщение
            </label>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Ваш вопрос или сообщение..."
              rows={5}
              maxLength={1000}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full gradient-primary text-primary-foreground font-body font-medium"
            size="lg"
          >
            <Send size={16} />
            {isSubmitting ? "Отправка..." : "Отправить сообщение"}
          </Button>
        </motion.form>
      </div>
    </section>
  );
};

export default ContactForm;
