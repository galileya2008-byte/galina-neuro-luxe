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
import { ICON_NAMES } from "@/lib/icons";
import { Plus, Trash2, Save, ChevronUp, ChevronDown } from "lucide-react";

type Reason = {
  id: string;
  icon: string;
  title: string;
  description: string;
  sort_order: number;
};

const AdminWhyReasons = () => {
  const [items, setItems] = useState<Reason[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await supabase
      .from("why_reasons")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setItems(data);
  };

  const update = (id: string, patch: Partial<Reason>) => {
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const save = async (item: Reason) => {
    setSaving(item.id);
    const { id, ...rest } = item;
    const { error } = await supabase.from("why_reasons").update(rest).eq("id", id);
    setSaving(null);
    toast(
      error
        ? { title: "Ошибка", description: error.message, variant: "destructive" }
        : { title: "Сохранено!" }
    );
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить причину?")) return;
    await supabase.from("why_reasons").delete().eq("id", id);
    load();
  };

  const add = async () => {
    await supabase.from("why_reasons").insert({
      icon: "Sparkles",
      title: "Новая причина",
      description: "",
      sort_order: items.length + 1,
    });
    load();
  };

  const move = async (id: string, dir: -1 | 1) => {
    const idx = items.findIndex((c) => c.id === id);
    const swap = items[idx + dir];
    if (!swap) return;
    const a = items[idx];
    await Promise.all([
      supabase.from("why_reasons").update({ sort_order: swap.sort_order }).eq("id", a.id),
      supabase.from("why_reasons").update({ sort_order: a.sort_order }).eq("id", swap.id),
    ]);
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-xl">Почему НейроГрафика — карточки ({items.length})</h2>
        <Button onClick={add} className="gradient-primary text-primary-foreground">
          <Plus size={16} /> Добавить
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((c, i) => (
          <div key={c.id} className="bg-card border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => move(c.id, -1)} disabled={i === 0}>
                  <ChevronUp size={14} />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => move(c.id, 1)} disabled={i === items.length - 1}>
                  <ChevronDown size={14} />
                </Button>
              </div>
              <Button variant="ghost" size="icon" onClick={() => remove(c.id)}>
                <Trash2 size={14} />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Заголовок</Label>
                <Input value={c.title} onChange={(e) => update(c.id, { title: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Иконка</Label>
                <Select value={c.icon} onValueChange={(v) => update(c.id, { icon: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ICON_NAMES.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
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
            </div>

            <div className="flex justify-end">
              <Button size="sm" onClick={() => save(c)} disabled={saving === c.id} className="gradient-primary text-primary-foreground">
                <Save size={14} />
                {saving === c.id ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminWhyReasons;
