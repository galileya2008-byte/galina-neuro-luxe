import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";

type EventItem = {
  id: string;
  event_date: string;
  title: string;
  description: string | null;
  event_type: string;
  link_url: string | null;
  sort_order: number;
  is_published: boolean;
};

const TYPE_LABELS: Record<string, string> = {
  masterclass: "Мастер-класс",
  news: "Новость",
  article: "Статья",
  other: "Другое",
};

const empty = {
  event_date: new Date().toISOString().slice(0, 10),
  title: "",
  description: "",
  event_type: "masterclass",
  link_url: "",
  sort_order: 0,
  is_published: true,
};

const AdminEvents = () => {
  const [items, setItems] = useState<EventItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState(empty);
  const { toast } = useToast();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });
    if (data) setItems(data as EventItem[]);
  };

  const startNew = () => {
    setIsNew(true);
    setEditingId(null);
    setForm(empty);
  };

  const startEdit = (item: EventItem) => {
    setIsNew(false);
    setEditingId(item.id);
    setForm({
      event_date: item.event_date,
      title: item.title,
      description: item.description || "",
      event_type: item.event_type,
      link_url: item.link_url || "",
      sort_order: item.sort_order,
      is_published: item.is_published,
    });
  };

  const save = async () => {
    if (!form.title || !form.event_date) {
      toast({ title: "Заполните дату и название", variant: "destructive" });
      return;
    }
    const payload = {
      event_date: form.event_date,
      title: form.title,
      description: form.description || null,
      event_type: form.event_type,
      link_url: form.link_url || null,
      sort_order: form.sort_order,
      is_published: form.is_published,
    };
    if (isNew) {
      const { error } = await supabase.from("events").insert(payload);
      if (error) return toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else if (editingId) {
      const { error } = await supabase.from("events").update(payload).eq("id", editingId);
      if (error) return toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    }
    toast({ title: "Сохранено!" });
    setIsNew(false);
    setEditingId(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить событие?")) return;
    await supabase.from("events").delete().eq("id", id);
    load();
  };

  const togglePublish = async (item: EventItem) => {
    await supabase.from("events").update({ is_published: !item.is_published }).eq("id", item.id);
    load();
  };

  if (isNew || editingId) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-heading text-xl">{isNew ? "Новое событие" : "Редактирование"}</h2>
          <Button variant="ghost" onClick={() => { setIsNew(false); setEditingId(null); }}>Отмена</Button>
        </div>

        <div>
          <Label className="text-sm">Дата события</Label>
          <Input
            type="date"
            value={form.event_date}
            onChange={(e) => setForm({ ...form, event_date: e.target.value })}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label className="text-sm">Название</Label>
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Например: Мастер-класс «Очищение»"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label className="text-sm">Тип события</Label>
          <Select value={form.event_type} onValueChange={(v) => setForm({ ...form, event_type: v })}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(TYPE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm">Краткое описание (необязательно)</Label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label className="text-sm">
            Ссылка (например, /news/slug, /articles/slug или внешний URL)
          </Label>
          <Input
            value={form.link_url}
            onChange={(e) => setForm({ ...form, link_url: e.target.value })}
            placeholder="/news/example  или  https://..."
            className="mt-1.5"
          />
          <p className="text-xs text-muted-foreground mt-1">
            При клике на дату в календаре откроется эта ссылка. Оставьте пустым — откроется только описание.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
            />
            Показывать на сайте
          </label>
          <Button onClick={save} className="gradient-primary text-primary-foreground">Сохранить</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-xl">События ({items.length})</h2>
        <Button onClick={startNew} className="gradient-primary text-primary-foreground">
          <Plus size={16} /> Новое событие
        </Button>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between bg-card border border-border rounded-xl p-4">
            <div>
              <h3 className="font-medium text-foreground">{item.title}</h3>
              <p className="text-xs text-muted-foreground">
                {new Date(item.event_date).toLocaleDateString("ru")} · {TYPE_LABELS[item.event_type] || item.event_type}
                {!item.is_published && " · Скрыто"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => togglePublish(item)}>
                {item.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
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
        {items.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Событий пока нет</p>
        )}
      </div>
    </div>
  );
};

export default AdminEvents;
