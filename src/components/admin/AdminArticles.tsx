import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, EyeOff, ImagePlus, Clock } from "lucide-react";
import RichTextEditor from "./RichTextEditor";

type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
};

const AdminArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [editing, setEditing] = useState<Article | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", content: "", excerpt: "", cover_image_url: "", published: false, published_at: "" });
  
  const toLocalDatetime = (iso: string) => {
    const d = new Date(iso);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };
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
    setForm({ title: "", slug: "", content: "", excerpt: "", cover_image_url: "", published: false, published_at: toLocalDatetime(new Date().toISOString()) });
  };

  const startEdit = (article: Article) => {
    setIsNew(false);
    setEditing(article);
    setForm({
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt || "",
      cover_image_url: article.cover_image_url || "",
      published: article.published,
      published_at: article.published_at ? toLocalDatetime(article.published_at) : toLocalDatetime(new Date().toISOString()),
    });
  };

  const uploadCover = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const ext = file.name.split(".").pop();
      const fileName = `covers/${Date.now()}.${ext}`;

      const { error } = await supabase.storage.from("gallery").upload(fileName, file);
      if (error) {
        toast({ title: "Ошибка загрузки", description: error.message, variant: "destructive" });
        return;
      }

      const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(fileName);
      setForm(f => ({ ...f, cover_image_url: urlData.publicUrl }));
      toast({ title: "Обложка загружена" });
    };
    input.click();
  };

  const save = async () => {
    if (!form.title || !form.content) {
      toast({ title: "Ошибка", description: "Заполните заголовок и содержание", variant: "destructive" });
      return;
    }

    const slug = form.slug || generateSlug(form.title);
    const payload = {
      title: form.title,
      slug,
      content: form.content,
      excerpt: form.excerpt || null,
      cover_image_url: form.cover_image_url || null,
      published: form.published,
      published_at: form.published_at ? new Date(form.published_at).toISOString() : new Date().toISOString(),
    };

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
        <Input placeholder="Краткое описание (для SEO)" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Обложка статьи</label>
          <div className="flex items-center gap-3">
            {form.cover_image_url && (
              <img src={form.cover_image_url} alt="Обложка" className="h-20 w-32 object-cover rounded-lg" />
            )}
            <Button type="button" variant="outline" onClick={uploadCover}>
              <ImagePlus size={16} /> {form.cover_image_url ? "Заменить" : "Загрузить обложку"}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Содержание</label>
          <RichTextEditor content={form.content} onChange={(html) => setForm(f => ({ ...f, content: html }))} />
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
            Если дата в будущем — статья появится автоматически в указанное время
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
        <h2 className="font-heading text-xl">Статьи ({articles.length})</h2>
        <Button onClick={startNew} className="gradient-primary text-primary-foreground">
          <Plus size={16} /> Новая статья
        </Button>
      </div>
      <div className="space-y-3">
        {articles.map((article) => (
          <div key={article.id} className="flex items-center justify-between bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3">
              {article.cover_image_url && (
                <img src={article.cover_image_url} alt="" className="h-12 w-20 object-cover rounded-lg" />
              )}
              <div>
                <h3 className="font-medium text-foreground">{article.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {article.published ? "Опубликовано" : "Черновик"} • {new Date(article.created_at).toLocaleDateString("ru")}
                </p>
              </div>
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
