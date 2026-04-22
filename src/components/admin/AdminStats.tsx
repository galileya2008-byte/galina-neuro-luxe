import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, Users, FileText, Newspaper, Image as ImageIcon, MessageSquare, Globe, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type SourceRow = { label: string; count: number };
type DailyRow = { date: string; label: string; views: number; visitors: number };

type Stats = {
  total: number;
  today: number;
  week: number;
  month: number;
  uniqueSessions: number;
  topPaths: { path: string; count: number }[];
  sources: SourceRow[];
  daily: DailyRow[];
  articles: number;
  news: number;
  gallery: number;
  newRequests: number;
};

const StatCard = ({ icon: Icon, label, value }: { icon: any; label: string; value: number | string }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      <Icon size={18} className="text-primary" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-heading text-foreground">{value}</div>
    </CardContent>
  </Card>
);

const categorize = (referrer: string | null): string => {
  if (!referrer || referrer.trim() === "") return "Прямые заходы";
  let host = "";
  try {
    host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "Другое";
  }
  // Don't count internal navigation as referrer source
  if (host === window.location.hostname.replace(/^www\./, "")) return "Внутренние";
  if (/yandex\./.test(host)) return "Яндекс";
  if (/google\./.test(host)) return "Google";
  if (/bing\./.test(host)) return "Bing";
  if (/mail\.ru|go\.mail\.ru/.test(host)) return "Mail.ru";
  if (/duckduckgo\./.test(host)) return "DuckDuckGo";
  if (/vk\.com|vk\.ru/.test(host)) return "ВКонтакте";
  if (/t\.me|telegram/.test(host)) return "Telegram";
  if (/instagram\./.test(host)) return "Instagram";
  if (/facebook\.|fb\.com/.test(host)) return "Facebook";
  if (/wa\.me|whatsapp/.test(host)) return "WhatsApp";
  if (/youtube\.|youtu\.be/.test(host)) return "YouTube";
  if (/ok\.ru|odnoklassniki/.test(host)) return "Одноклассники";
  if (/dzen\.|zen\.yandex/.test(host)) return "Дзен";
  return host;
};

const AdminStats = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<Stats | null>(null);
  const [metrikaId, setMetrikaId] = useState("");
  const [savingMetrika, setSavingMetrika] = useState(false);

  useEffect(() => {
    load();
    loadMetrikaId();
  }, []);

  const loadMetrikaId = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "yandex_metrika_id")
      .maybeSingle();
    if (data?.value) setMetrikaId(data.value);
  };

  const saveMetrikaId = async () => {
    setSavingMetrika(true);
    const value = metrikaId.trim();
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: "yandex_metrika_id", value }, { onConflict: "key" });
    setSavingMetrika(false);
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "Сохранено",
        description: value
          ? "Счётчик Яндекс.Метрики подключён. Обновите главную страницу."
          : "Счётчик Яндекс.Метрики отключён.",
      });
    }
  };

  const load = async () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const week = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const month = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [
      totalRes,
      todayRes,
      weekRes,
      monthRes,
      pathsRes,
      sessionsRes,
      referrersRes,
      articlesRes,
      newsRes,
      galleryRes,
      requestsRes,
    ] = await Promise.all([
      supabase.from("page_views").select("*", { count: "exact", head: true }),
      supabase.from("page_views").select("*", { count: "exact", head: true }).gte("created_at", today),
      supabase.from("page_views").select("*", { count: "exact", head: true }).gte("created_at", week),
      supabase.from("page_views").select("*", { count: "exact", head: true }).gte("created_at", month),
      supabase.from("page_views").select("path").gte("created_at", month).limit(5000),
      supabase.from("page_views").select("session_id, created_at").gte("created_at", month).limit(5000),
      supabase.from("page_views").select("referrer").gte("created_at", month).limit(5000),
      supabase.from("articles").select("*", { count: "exact", head: true }),
      supabase.from("news").select("*", { count: "exact", head: true }),
      supabase.from("gallery_images").select("*", { count: "exact", head: true }),
      supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
    ]);

    const pathCounts: Record<string, number> = {};
    (pathsRes.data ?? []).forEach((r: any) => {
      pathCounts[r.path] = (pathCounts[r.path] ?? 0) + 1;
    });
    const topPaths = Object.entries(pathCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const sourceCounts: Record<string, number> = {};
    (referrersRes.data ?? []).forEach((r: any) => {
      const label = categorize(r.referrer);
      if (label === "Внутренние") return;
      sourceCounts[label] = (sourceCounts[label] ?? 0) + 1;
    });
    const sources = Object.entries(sourceCounts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const uniqueSessions = new Set((sessionsRes.data ?? []).map((r: any) => r.session_id).filter(Boolean)).size;

    setStats({
      total: totalRes.count ?? 0,
      today: todayRes.count ?? 0,
      week: weekRes.count ?? 0,
      month: monthRes.count ?? 0,
      uniqueSessions,
      topPaths,
      sources,
      articles: articlesRes.count ?? 0,
      news: newsRes.count ?? 0,
      gallery: galleryRes.count ?? 0,
      newRequests: requestsRes.count ?? 0,
    });
  };

  if (!stats) return <p className="text-muted-foreground">Загрузка...</p>;

  const sourcesTotal = stats.sources.reduce((s, x) => s + x.count, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Яндекс.Метрика</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label htmlFor="metrika-id" className="text-sm">
            Номер счётчика (8 цифр)
          </Label>
          <div className="flex gap-2">
            <Input
              id="metrika-id"
              inputMode="numeric"
              placeholder="например, 12345678"
              value={metrikaId}
              onChange={(e) => setMetrikaId(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={saveMetrikaId} disabled={savingMetrika}>
              {savingMetrika ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Создайте счётчик на metrika.yandex.ru → скопируйте номер → вставьте сюда. Поисковые фразы появятся в кабинете
            Метрики через 1–2 дня.
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="font-heading text-xl mb-4">Посещения сайта</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Eye} label="Сегодня" value={stats.today} />
          <StatCard icon={Eye} label="За неделю" value={stats.week} />
          <StatCard icon={Eye} label="За месяц" value={stats.month} />
          <StatCard icon={Users} label="Уник. сессий (30д)" value={stats.uniqueSessions} />
        </div>
      </div>

      <div>
        <h2 className="font-heading text-xl mb-4">Контент</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={FileText} label="Статьи" value={stats.articles} />
          <StatCard icon={Newspaper} label="Новости" value={stats.news} />
          <StatCard icon={ImageIcon} label="Работы" value={stats.gallery} />
          <StatCard icon={MessageSquare} label="Новые заявки" value={stats.newRequests} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe size={18} className="text-primary" />
            Источники трафика (30 дней)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.sources.length === 0 ? (
            <p className="text-muted-foreground text-sm">Пока нет данных</p>
          ) : (
            <ul className="space-y-2">
              {stats.sources.map((s) => {
                const pct = sourcesTotal ? Math.round((s.count / sourcesTotal) * 100) : 0;
                return (
                  <li
                    key={s.label}
                    className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0"
                  >
                    <span className="text-foreground truncate mr-3">{s.label}</span>
                    <span className="text-primary font-medium whitespace-nowrap">
                      {s.count} <span className="text-muted-foreground font-normal">({pct}%)</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="text-xs text-muted-foreground mt-3">
            Поисковые системы не передают сами фразы — их видно только в Яндекс.Метрике / Google Search Console.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Популярные страницы (30 дней)</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.topPaths.length === 0 ? (
            <p className="text-muted-foreground text-sm">Пока нет данных</p>
          ) : (
            <ul className="space-y-2">
              {stats.topPaths.map((p) => (
                <li key={p.path} className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0">
                  <span className="font-mono text-foreground truncate mr-3">{p.path}</span>
                  <span className="text-primary font-medium">{p.count}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Всего просмотров за всё время: {stats.total}
      </p>
    </div>
  );
};

export default AdminStats;
