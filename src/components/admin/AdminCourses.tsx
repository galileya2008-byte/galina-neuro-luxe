import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ICON_NAMES } from "@/lib/icons";
import { Plus, Trash2, Save, ChevronUp, ChevronDown } from "lucide-react";

type Course = {
  id: string;
  icon: string;
  title: string;
  description: string;
  price: string;
  price_note: string | null;
  popular: boolean;
  payment_url: string | null;
  sort_order: number;
};

const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await supabase
      .from("courses")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setCourses(data);
  };

  const update = (id: string, patch: Partial<Course>) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const save = async (course: Course) => {
    setSaving(course.id);
    const { id, ...rest } = course;
    const { error } = await supabase.from("courses").update(rest).eq("id", id);
    setSaving(null);
    toast(
      error
        ? { title: "Ошибка", description: error.message, variant: "destructive" }
        : { title: "Сохранено!" }
    );
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить карточку курса?")) return;
    await supabase.from("courses").delete().eq("id", id);
    load();
  };

  const add = async () => {
    const { error } = await supabase.from("courses").insert({
      icon: "Sparkles",
      title: "Новый курс",
      description: "",
      price: "0 ₽",
      sort_order: courses.length + 1,
    });
    if (error) toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    load();
  };

  const move = async (id: string, dir: -1 | 1) => {
    const idx = courses.findIndex((c) => c.id === id);
    const swap = courses[idx + dir];
    if (!swap) return;
    const a = courses[idx];
    await Promise.all([
      supabase.from("courses").update({ sort_order: swap.sort_order }).eq("id", a.id),
      supabase.from("courses").update({ sort_order: a.sort_order }).eq("id", swap.id),
    ]);
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-xl">Курсы и мастер-классы ({courses.length})</h2>
        <Button onClick={add} className="gradient-primary text-primary-foreground">
          <Plus size={16} /> Добавить
        </Button>
      </div>

      <div className="space-y-4">
        {courses.map((c, i) => (
          <div key={c.id} className="bg-card border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => move(c.id, -1)}
                  disabled={i === 0}
                >
                  <ChevronUp size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => move(c.id, 1)}
                  disabled={i === courses.length - 1}
                >
                  <ChevronDown size={14} />
                </Button>
              </div>
              <Button variant="ghost" size="icon" onClick={() => remove(c.id)}>
                <Trash2 size={14} />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Название</Label>
                <Input value={c.title} onChange={(e) => update(c.id, { title: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Иконка</Label>
                <Select value={c.icon} onValueChange={(v) => update(c.id, { icon: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ICON_NAMES.map((n) => (
                      <SelectItem key={n} value={n}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs">Описание</Label>
                <Textarea
                  rows={2}
                  value={c.description}
                  onChange={(e) => update(c.id, { description: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-xs">Цена</Label>
                <Input value={c.price} onChange={(e) => update(c.id, { price: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Подпись к цене</Label>
                <Input
                  value={c.price_note || ""}
                  onChange={(e) => update(c.id, { price_note: e.target.value })}
                  placeholder="например: экономия 4 000 ₽"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs">Ссылка на оплату (GetCourse)</Label>
                <Input
                  value={c.payment_url || ""}
                  onChange={(e) => update(c.id, { payment_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center gap-2 md:col-span-2">
                <Switch
                  checked={c.popular}
                  onCheckedChange={(v) => update(c.id, { popular: v })}
                />
                <Label className="text-sm">Отметить как «Популярный»</Label>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={() => save(c)}
                disabled={saving === c.id}
                className="gradient-primary text-primary-foreground"
              >
                <Save size={14} />
                {saving === c.id ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Курсов пока нет. Нажмите «Добавить».
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminCourses;
