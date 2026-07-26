import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { checkIsAdmin, getAuthRedirectUrl } from "@/lib/adminAuth";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({ title: "Ошибка входа", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const isAdmin = await checkIsAdmin(user.id);

    if (isAdmin) {
      navigate("/admin");
    } else {
      await supabase.auth.signOut();
      toast({
        title: "Доступ запрещён",
        description: "У этого аккаунта нет прав администратора",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      toast({
        title: "Укажите email",
        description: "Введите email, на который отправить ссылку для сброса пароля",
        variant: "destructive",
      });
      return;
    }

    setResetting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: getAuthRedirectUrl("admin-login"),
    });
    setResetting(false);

    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "Письмо отправлено",
        description: "Проверьте почту и перейдите по ссылке для сброса пароля",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-heading text-3xl text-center text-primary mb-2">Вход в админку</h1>
        <p className="text-center text-sm text-muted-foreground mb-8">
          Управление контентом, заявками и статистикой сайта
        </p>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <Input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground">
            {loading ? "Вход..." : "Войти"}
          </Button>
        </form>
        <button
          type="button"
          onClick={handleResetPassword}
          disabled={resetting}
          className="block w-full text-center mt-4 text-sm text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
        >
          {resetting ? "Отправка..." : "Забыли пароль?"}
        </button>
        <Link to="/" className="block text-center mt-4 text-sm text-muted-foreground hover:text-primary">
          ← На главную
        </Link>
      </div>
    </div>
  );
};

export default AdminLogin;
