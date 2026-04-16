import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, EyeOff, Clock } from "lucide-react";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  published_at: string;
  created_at: string;
};

const AdminNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    published: false,
    published_at: "",
  });
  const { toast } = useToast();

  useEffect(() => { fetchNews(); }, []);

  const fetchNews = async () => {
    const { data } = await supabase
      .from("news")
      .select("*")
      .order("published_at", { ascending: false });
    if (data) setNews(data);
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, "-").replace(/^-|-$/g, "");

  const toLocalDatetime = (iso: string) => {
    const d = new Date(iso);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  const startNew = () => {
    setIsNew(true);
    setEditing(null);
    setForm({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      published: false,
      published_at: toLocalDatetime(new Date().toISOString()),
    });
  };

  const startEdit = (item: NewsItem) => {
    setIsNew(false);
    setEditing(item);
    setForm({
      title: item.title,
      slug: item.slug,
      content: item.content,
      excerpt: item.excerpt || "",
      published: item.published,
      published_at: toLocalDatetime(item.published_at),
    });
  };

  const save = async () => {
    if (!form.title) {
      toast({ title: "Ошибка", description: "Заполните заголовок", variant: "destructive" });
      return;
    }

    const slug = form.slug || generateSlug(form.title);
    const payload = {
      title: form.title,
      slug,
      content: form.content,
      excerpt: form.excerpt || null,
      published: form.published,
      published_at: new Date(form.published_at).toISOString(),
    };

    if (isNew) {
      const { error } = await supabase.from("news").insert(payload);
      if (error) {
        toast({ title: "Ошибка", description: error.message, variant: "destructive" });
        return;
      }
    } else if (editing) {
      const { error } = await supabase.from("news").update(payload).eq("id", editing.id);
      if (error) {
        toast({ title: "Ошибка", description: error.message, variant: "destructive" });
        return;
      }
    }

    toast({ title: "Сохранено!" });
    setEditing(null);
    setIsNew(false);
    fetchNews();
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить новость?")) return;
    await supabase.from("news").delete().eq("id", id);
    fetchNews();
  };

  const togglePublish = async (item: NewsItem) => {
    await supabase.from("news").update({ published: !item.published }).eq("id", item.id);
    fetchNews();
  };

  const isScheduled = (item: NewsItem) =>
    item.published && new Date(item.published_at) > new Date();

  if (isNew || editing) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-heading text-xl">{isNew ? "Новая новость" : "Редактирование"}</h2>
          <Button variant="ghost" onClick={() => { setEditing(null); setIsNew(false); }}>Отмена</Button>
        </div>
        <Input placeholder="Заголовок" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <Input placeholder="Slug (URL)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <Input placeholder="Краткое описание" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Содержание</label>
          <RichTextEditor
            content={form.content}
            onChange={(html) => setForm({ ...form, content: html })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Clock size={14} /> Дата публикации (для отложенного постинга)
          </label>
          <Input
            type="datetime-local"
            value={form.published_at}
            onChange={(e) => setForm({ ...form, published_at: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Если дата в будущем — новость появится автоматически в указанное время
          </p>
        </div>

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
        <h2 className="font-heading text-xl">Новости ({news.length})</h2>
        <Button onClick={startNew} className="gradient-primary text-primary-foreground">
          <Plus size={16} /> Новая новость
        </Button>
      </div>
      <div className="space-y-3">
        {news.map((item) => (
          <div key={item.id} className="flex items-center justify-between bg-card border border-border rounded-xl p-4">
            <div>
              <h3 className="font-medium text-foreground">{item.title}</h3>
              <p className="text-xs text-muted-foreground">
                {isScheduled(item) ? (
                  <span className="text-amber-500">⏳ Запланировано на {new Date(item.published_at).toLocaleString("ru")}</span>
                ) : item.published ? (
                  "Опубликовано"
                ) : (
                  "Черновик"
                )}
                {" • "}
                {new Date(item.published_at).toLocaleDateString("ru")}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => togglePublish(item)}>
                {item.published ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => startEdit(item)}>
                <Edit size={16} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => remove(item.id)}>
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
        {news.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Новостей пока нет</p>
        )}
      </div>
    </div>
  );
};

export default AdminNews;
