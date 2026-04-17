import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Users, FileText, Newspaper, Image as ImageIcon, MessageSquare } from "lucide-react";

type Stats = {
  total: number;
  today: number;
  week: number;
  month: number;
  uniqueSessions: number;
  topPaths: { path: string; count: number }[];
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

const AdminStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    load();
  }, []);

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
      supabase.from("page_views").select("session_id").gte("created_at", month).limit(5000),
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

    const uniqueSessions = new Set((sessionsRes.data ?? []).map((r: any) => r.session_id).filter(Boolean)).size;

    setStats({
      total: totalRes.count ?? 0,
      today: todayRes.count ?? 0,
      week: weekRes.count ?? 0,
      month: monthRes.count ?? 0,
      uniqueSessions,
      topPaths,
      articles: articlesRes.count ?? 0,
      news: newsRes.count ?? 0,
      gallery: galleryRes.count ?? 0,
      newRequests: requestsRes.count ?? 0,
    });
  };

  if (!stats) return <p className="text-muted-foreground">Загрузка...</p>;

  return (
    <div className="space-y-6">
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
