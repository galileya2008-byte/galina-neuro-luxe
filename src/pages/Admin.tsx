import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminArticles from "@/components/admin/AdminArticles";
import AdminNews from "@/components/admin/AdminNews";
import AdminGallery from "@/components/admin/AdminGallery";
import AdminMessages from "@/components/admin/AdminMessages";
import AdminStats from "@/components/admin/AdminStats";
import AdminContent from "@/components/admin/AdminContent";
import AdminCourses from "@/components/admin/AdminCourses";
import AdminWhyReasons from "@/components/admin/AdminWhyReasons";
import AdminLotusMessages from "@/components/admin/AdminLotusMessages";
import AdminSocials from "@/components/admin/AdminSocials";
import AdminSiteStats from "@/components/admin/AdminSiteStats";
import AdminEvents from "@/components/admin/AdminEvents";
import { LogOut, Home } from "lucide-react";
import { checkIsAdmin } from "@/lib/adminAuth";

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  const verifyAdmin = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setIsAdmin(false);
      setUserEmail(null);
      navigate("/admin-login");
      return false;
    }

    const admin = await checkIsAdmin(user.id);

    if (!admin) {
      await supabase.auth.signOut();
      setIsAdmin(false);
      setUserEmail(null);
      navigate("/admin-login");
      return false;
    }

    setUserEmail(user.email ?? null);
    setIsAdmin(true);
    setLoading(false);
    return true;
  }, [navigate]);

  useEffect(() => {
    verifyAdmin();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setIsAdmin(false);
        setUserEmail(null);
        navigate("/admin-login");
        return;
      }

      checkIsAdmin(session.user.id).then((admin) => {
        if (!admin) {
          supabase.auth.signOut();
          navigate("/admin-login");
          return;
        }
        setUserEmail(session.user.email ?? null);
        setIsAdmin(true);
        setLoading(false);
      });
    });

    return () => subscription.unsubscribe();
  }, [navigate, verifyAdmin]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-primary">Админ-панель</h1>
          {userEmail && <p className="text-sm text-muted-foreground mt-1">{userEmail}</p>}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <Home size={16} /> На сайт
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut size={16} /> Выйти
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-6 py-8">
        <Tabs defaultValue="stats">
          <TabsList className="mb-6 flex-wrap h-auto">
            <TabsTrigger value="stats">Статистика</TabsTrigger>
            <TabsTrigger value="messages">Заявки</TabsTrigger>
            <TabsTrigger value="content">Тексты сайта</TabsTrigger>
            <TabsTrigger value="courses">Курсы</TabsTrigger>
            <TabsTrigger value="why">Почему НГ</TabsTrigger>
            <TabsTrigger value="sitestats">Цифры</TabsTrigger>
            <TabsTrigger value="lotus">Послания лотоса</TabsTrigger>
            <TabsTrigger value="socials">Соцсети</TabsTrigger>
            <TabsTrigger value="articles">Статьи</TabsTrigger>
            <TabsTrigger value="news">Новости</TabsTrigger>
            <TabsTrigger value="events">События</TabsTrigger>
            <TabsTrigger value="gallery">Галерея</TabsTrigger>
          </TabsList>

          <TabsContent value="stats"><AdminStats /></TabsContent>
          <TabsContent value="messages"><AdminMessages /></TabsContent>
          <TabsContent value="content"><AdminContent /></TabsContent>
          <TabsContent value="courses"><AdminCourses /></TabsContent>
          <TabsContent value="why"><AdminWhyReasons /></TabsContent>
          <TabsContent value="sitestats"><AdminSiteStats /></TabsContent>
          <TabsContent value="lotus"><AdminLotusMessages /></TabsContent>
          <TabsContent value="socials"><AdminSocials /></TabsContent>
          <TabsContent value="articles"><AdminArticles /></TabsContent>
          <TabsContent value="news"><AdminNews /></TabsContent>
          <TabsContent value="events"><AdminEvents /></TabsContent>
          <TabsContent value="gallery"><AdminGallery /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
