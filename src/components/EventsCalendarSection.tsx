import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { ru } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent } from "@/hooks/useSiteContent";
import { cn } from "@/lib/utils";
import { Sparkles, Newspaper, BookOpen, CalendarDays, ArrowUpRight } from "lucide-react";

type EventItem = {
  id: string;
  event_date: string;
  title: string;
  description: string | null;
  event_type: string;
  link_url: string | null;
};

const TYPE_META: Record<string, { label: string; Icon: typeof Sparkles }> = {
  masterclass: { label: "Мастер-класс", Icon: Sparkles },
  news: { label: "Новость", Icon: Newspaper },
  article: { label: "Статья", Icon: BookOpen },
  other: { label: "Событие", Icon: CalendarDays },
};

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const EventsCalendarSection = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [month, setMonth] = useState<Date>(new Date());
  const [selected, setSelected] = useState<Date | undefined>();

  const { value: copy } = useSiteContent("events_section", {
    title: "Календарь событий",
    subtitle:
      "Запланированные мастер-классы, публикации и новости. Нажмите на дату, чтобы перейти к событию.",
  });

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from("events")
        .select("id, event_date, title, description, event_type, link_url")
        .eq("is_published", true)
        .order("event_date", { ascending: true });
      if (data) setEvents(data as EventItem[]);
    };
    fetchEvents();
  }, []);

  const eventDates = useMemo(
    () => events.map((e) => new Date(e.event_date + "T00:00:00")),
    [events]
  );

  const eventsForSelected = useMemo(() => {
    if (!selected) return [];
    return events.filter((e) => sameDay(new Date(e.event_date + "T00:00:00"), selected));
  }, [selected, events]);

  const upcoming = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events
      .filter((e) => new Date(e.event_date + "T00:00:00") >= today)
      .slice(0, 5);
  }, [events]);

  const handleDayClick = (date: Date) => {
    setSelected(date);
    const matched = events.filter((e) => sameDay(new Date(e.event_date + "T00:00:00"), date));
    if (matched.length === 1 && matched[0].link_url) {
      const url = matched[0].link_url;
      if (url.startsWith("http")) window.open(url, "_blank");
      else window.location.href = url;
    }
  };

  if (events.length === 0) return null;

  return (
    <section id="events" className="py-24 px-6 bg-background relative overflow-hidden">
      <div className="container mx-auto max-w-6xl relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="font-body text-sm tracking-[0.2em] uppercase text-primary mb-3">
            Расписание
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground">
            {copy.title.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="italic text-primary">
              {copy.title.split(" ").slice(-1)}
            </span>
          </h2>
          <p className="font-body text-base text-muted-foreground mt-4 max-w-2xl mx-auto">
            {copy.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-[auto,1fr] gap-8 items-start justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-4 shadow-lg mx-auto"
          >
            <Calendar
              mode="single"
              locale={ru}
              selected={selected}
              month={month}
              onMonthChange={setMonth}
              onDayClick={handleDayClick}
              modifiers={{ hasEvent: eventDates }}
              modifiersClassNames={{
                hasEvent:
                  "relative font-semibold text-primary after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-primary cursor-pointer hover:bg-primary/10",
              }}
              className={cn("p-3 pointer-events-auto")}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h3 className="font-heading text-2xl text-foreground">
              {selected
                ? `События ${selected.toLocaleDateString("ru", { day: "numeric", month: "long" })}`
                : "Ближайшие события"}
            </h3>

            <div className="space-y-3">
              {(selected ? eventsForSelected : upcoming).map((e) => {
                const meta = TYPE_META[e.event_type] || TYPE_META.other;
                const Icon = meta.Icon;
                const content = (
                  <div className="group bg-card/60 backdrop-blur-sm border border-border rounded-xl p-5 hover:border-primary/40 transition-all hover:shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground">
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs uppercase tracking-wider text-primary">
                            {meta.label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            · {new Date(e.event_date + "T00:00:00").toLocaleDateString("ru", { day: "numeric", month: "long" })}
                          </span>
                        </div>
                        <h4 className="font-heading text-lg text-foreground group-hover:text-primary transition-colors">
                          {e.title}
                        </h4>
                        {e.description && (
                          <p className="font-body text-sm text-muted-foreground mt-1">
                            {e.description}
                          </p>
                        )}
                      </div>
                      {e.link_url && (
                        <ArrowUpRight
                          size={18}
                          className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors"
                        />
                      )}
                    </div>
                  </div>
                );
                if (!e.link_url) return <div key={e.id}>{content}</div>;
                const isExternal = e.link_url.startsWith("http");
                return (
                  <a
                    key={e.id}
                    href={e.link_url}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="block"
                  >
                    {content}
                  </a>
                );
              })}

              {selected && eventsForSelected.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  В этот день событий нет.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EventsCalendarSection;
