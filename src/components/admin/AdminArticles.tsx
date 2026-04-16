import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";

type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  created_at: string;
};

const AdminArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [editing, setEditing] = useState<Article | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", content: "", excerpt: "", published: false });
  const { toast } = useToast();

  useEffect(() => { fetchArticles(); }, []);

  const fetchArticles = async () => {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setArticles(data);
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, "-").replace(/^-|-$/g, "");

  const startNew = () => {
    setIsNew(true);
    setEditing(null);
    setForm({ title: "", slug: "", content: "", excerpt: "", published: false });
  };

  const startEdit = (article: Article) => {
    setIsNew(false);
    setEditing(article);
    setForm({
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt || "",
      published: article.published,
    });
  };

  const save = async () => {
    if (!form.title || !form.content) {
      toast({ title: "Ошибка", description: "Заполните заголовок и содержание", variant: "destructive" });
      return;
    }

    const slug = form.slug || generateSlug(form.title);
    const payload = { ...form, slug };

    if (isNew) {
      const { error } = await supabase.from("articles").insert(payload);
      if (error) {
        toast({ title: "Ошибка", description: error.message, variant: "destructive" });
        return;
      }
    } else if (editing) {
      const { error } = await supabase.from("articles").update(payload).eq("id", editing.id);
      if (error) {
        toast({ title: "Ошибка", description: error.message, variant: "destructive" });
        return;
      }
    }

    toast({ title: "Сохранено!" });
    setEditing(null);
    setIsNew(false);
    fetchArticles();
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить статью?")) return;
    await supabase.from("articles").delete().eq("id", id);
    fetchArticles();
  };

  const togglePublish = async (article: Article) => {
    await supabase.from("articles").update({ published: !article.published }).eq("id", article.id);
    fetchArticles();
  };

  if (isNew || editing) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-heading text-xl">{isNew ? "Новая статья" : "Редактирование"}</h2>
          <Button variant="ghost" onClick={() => { setEditing(null); setIsNew(false); }}>Отмена</Button>
        </div>
        <Input placeholder="Заголовок" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <Input placeholder="Slug (URL)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <Input placeholder="Краткое описание" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
        <Textarea placeholder="Содержание статьи" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={12} />
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Опубликовать
          </label>
          <Button onClick={save} className="gradient-primary text-primary-foreground">Сохранить</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-xl">Статьи ({articles.length})</h2>
        <Button onClick={startNew} className="gradient-primary text-primary-foreground">
          <Plus size={16} /> Новая статья
        </Button>
      </div>
      <div className="space-y-3">
        {articles.map((article) => (
          <div key={article.id} className="flex items-center justify-between bg-card border border-border rounded-xl p-4">
            <div>
              <h3 className="font-medium text-foreground">{article.title}</h3>
              <p className="text-xs text-muted-foreground">
                {article.published ? "Опубликовано" : "Черновик"} • {new Date(article.created_at).toLocaleDateString("ru")}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => togglePublish(article)}>
                {article.published ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => startEdit(article)}>
                <Edit size={16} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => remove(article.id)}>
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
        {articles.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Статей пока нет</p>
        )}
      </div>
    </div>
  );
};

export default AdminArticles;
