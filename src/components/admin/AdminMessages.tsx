import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MailOpen } from "lucide-react";

type Status = "new" | "in_progress" | "closed";

type Message = {
  id: string;
  name: string;
  email: string | null;
  message: string;
  read: boolean;
  status: Status;
  created_at: string;
};

const statusLabel: Record<Status, string> = {
  new: "Новая",
  in_progress: "В работе",
  closed: "Закрыта",
};

const statusVariant: Record<Status, "default" | "secondary" | "outline"> = {
  new: "default",
  in_progress: "secondary",
  closed: "outline",
};

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setMessages(data as Message[]);
  };

  const toggleRead = async (msg: Message) => {
    await supabase.from("contact_messages").update({ read: !msg.read }).eq("id", msg.id);
    fetchMessages();
  };

  const updateStatus = async (msg: Message, status: Status) => {
    await supabase.from("contact_messages").update({ status }).eq("id", msg.id);
    fetchMessages();
  };

  const newCount = messages.filter((m) => m.status === "new").length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="font-heading text-xl">Заявки ({messages.length})</h2>
        {newCount > 0 && <Badge variant="destructive">{newCount} новых</Badge>}
      </div>

      <div className="space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`bg-card border rounded-xl p-4 ${msg.read ? "border-border opacity-80" : "border-primary/30"}`}
          >
            <div className="flex justify-between items-start mb-2 gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-foreground">{msg.name}</span>
                {msg.email && <span className="text-xs text-muted-foreground">{msg.email}</span>}
                <Badge variant={statusVariant[msg.status]}>{statusLabel[msg.status]}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {new Date(msg.created_at).toLocaleString("ru")}
                </span>
                <Select value={msg.status} onValueChange={(v) => updateStatus(msg, v as Status)}>
                  <SelectTrigger className="h-8 w-32 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Новая</SelectItem>
                    <SelectItem value="in_progress">В работе</SelectItem>
                    <SelectItem value="closed">Закрыта</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleRead(msg)}>
                  {msg.read ? <MailOpen size={14} /> : <Mail size={14} />}
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{msg.message}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Заявок пока нет</p>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
