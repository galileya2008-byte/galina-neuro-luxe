import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save } from "lucide-react";

type Msg = { id: string; message: string; sort_order: number };

const AdminLotusMessages = () => {
  const [items, setItems] = useState<Msg[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await supabase
      .from("lotus_messages")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setItems(data);
  };

  const update = (id: string, message: string) =>
    setItems((prev) => prev.map((m) => (m.id === id ? { ...m, message } : m)));

  const save = async (m: Msg) => {
    const { error } = await supabase
      .from("lotus_messages")
      .update({ message: m.message })
      .eq("id", m.id);
    toast(
      error
        ? { title: "Ошибка", description: error.message, variant: "destructive" }
        : { title: "Сохранено!" }
    );
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить послание?")) return;
    await supabase.from("lotus_messages").delete().eq("id", id);
    load();
  };

  const add = async () => {
    await supabase.from("lotus_messages").insert({
      message: "Новое послание",
      sort_order: items.length + 1,
    });
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-xl">Послания НейроЛотоса ({items.length})</h2>
        <Button onClick={add} className="gradient-primary text-primary-foreground">
          <Plus size={16} /> Добавить послание
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Когда посетитель нажимает на лепесток, ему случайным образом выпадает одно из этих посланий.
      </p>

      <div className="space-y-3">
        {items.map((m) => (
          <div key={m.id} className="bg-card border border-border rounded-xl p-4 flex gap-2 items-start">
            <Textarea
              value={m.message}
              onChange={(e) => update(m.id, e.target.value)}
              rows={2}
              className="flex-1"
            />
            <div className="flex flex-col gap-2">
              <Button size="sm" onClick={() => save(m)} className="gradient-primary text-primary-foreground">
                <Save size={14} />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => remove(m.id)}>
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminLotusMessages;
