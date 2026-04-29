import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type Social = {
  id: string;
  label: string;
  url: string;
  icon: string;
  sort_order: number;
};

const AdminSocials = () => {
  const [items, setItems] = useState<Social[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await supabase
      .from("social_links")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setItems(data);
  };

  const update = (id: string, patch: Partial<Social>) =>
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const save = async (s: Social) => {
    const { id, ...rest } = s;
    const { error } = await supabase.from("social_links").update(rest).eq("id", id);
    toast(
      error
        ? { title: "Ошибка", description: error.message, variant: "destructive" }
        : { title: "Сохранено!" }
    );
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить ссылку?")) return;
    await supabase.from("social_links").delete().eq("id", id);
    load();
  };

  const add = async () => {
    await supabase.from("social_links").insert({
      label: "Новая ссылка",
      url: "https://",
      icon: "ExternalLink",
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
      supabase.from("social_links").update({ sort_order: swap.sort_order }).eq("id", a.id),
      supabase.from("social_links").update({ sort_order: a.sort_order }).eq("id", swap.id),
    ]);
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-xl">Соцсети в футере ({items.length})</h2>
        <Button onClick={add} className="gradient-primary text-primary-foreground">
          <Plus size={16} /> Добавить
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((s, i) => (
          <div key={s.id} className="bg-card border border-border rounded-xl p-4 grid md:grid-cols-[auto_1fr_1fr_auto_auto] gap-3 items-end">
            <div className="flex md:flex-col gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => move(s.id, -1)} disabled={i === 0}>
                <ChevronUp size={14} />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => move(s.id, 1)} disabled={i === items.length - 1}>
                <ChevronDown size={14} />
              </Button>
            </div>
            <div>
              <Label className="text-xs">Название</Label>
              <Input value={s.label} onChange={(e) => update(s.id, { label: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">URL (для email — mailto:..., для тел. — tel:...)</Label>
              <Input value={s.url} onChange={(e) => update(s.id, { url: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">Иконка</Label>
              <Select value={s.icon} onValueChange={(v) => update(s.id, { icon: v })}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ICON_NAMES.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-1">
              <Button size="sm" onClick={() => save(s)} className="gradient-primary text-primary-foreground">
                <Save size={14} />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => remove(s.id)}>
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSocials;
