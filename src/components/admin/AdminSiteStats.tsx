import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type Stat = {
  id: string;
  label: string;
  value: string;
  suffix: string | null;
  icon: string | null;
  sort_order: number;
  is_published: boolean;
};

const AdminSiteStats = () => {
  const [items, setItems] = useState<Stat[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await supabase
      .from("site_stats")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setItems(data as Stat[]);
  };

  const update = (id: string, patch: Partial<Stat>) =>
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const save = async (item: Stat) => {
    setSaving(item.id);
    const { id, ...rest } = item;
    const { error } = await supabase.from("site_stats").update(rest).eq("id", id);
    setSaving(null);
    toast(
      error
        ? { title: "Ошибка", description: error.message, variant: "destructive" }
        : { title: "Сохранено!" }
    );
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить показатель?")) return;
    await supabase.from("site_stats").delete().eq("id", id);
    load();
  };

  const add = async () => {
    await supabase.from("site_stats").insert({
      label: "Новый показатель",
      value: "0",
      suffix: "+",
      icon: "Sparkles",
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
      supabase.from("site_stats").update({ sort_order: swap.sort_order }).eq("id", a.id),
      supabase.from("site_stats").update({ sort_order: a.sort_order }).eq("id", swap.id),
    ]);
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-xl">Цифры на главной ({items.length})</h2>
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
              <div className="flex items-center gap-3">
                <Label className="text-xs flex items-center gap-2">
                  Опубликовано
                  <Switch
                    checked={c.is_published}
                    onCheckedChange={(v) => update(c.id, { is_published: v })}
                  />
                </Label>
                <Button variant="ghost" size="icon" onClick={() => remove(c.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-3">
              <div>
                <Label className="text-xs">Значение</Label>
                <Input value={c.value} onChange={(e) => update(c.id, { value: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Суффикс (например +)</Label>
                <Input value={c.suffix ?? ""} onChange={(e) => update(c.id, { suffix: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs">Подпись</Label>
                <Input value={c.label} onChange={(e) => update(c.id, { label: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Иконка</Label>
                <Select value={c.icon ?? "Sparkles"} onValueChange={(v) => update(c.id, { icon: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ICON_NAMES.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                  </SelectContent>
                </Select>
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

export default AdminSiteStats;
