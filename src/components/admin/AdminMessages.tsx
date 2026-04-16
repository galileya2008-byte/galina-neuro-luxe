import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, MailOpen } from "lucide-react";

type Message = {
  id: string;
  name: string;
  email: string | null;
  message: string;
  read: boolean;
  created_at: string;
};

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setMessages(data);
  };

  const toggleRead = async (msg: Message) => {
    await supabase.from("contact_messages").update({ read: !msg.read }).eq("id", msg.id);
    fetchMessages();
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="font-heading text-xl">Сообщения ({messages.length})</h2>
        {unreadCount > 0 && (
          <Badge variant="destructive">{unreadCount} новых</Badge>
        )}
      </div>

      <div className="space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`bg-card border rounded-xl p-4 ${msg.read ? "border-border opacity-70" : "border-primary/30"}`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-medium text-foreground">{msg.name}</span>
                {msg.email && <span className="text-xs text-muted-foreground ml-2">{msg.email}</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {new Date(msg.created_at).toLocaleString("ru")}
                </span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleRead(msg)}>
                  {msg.read ? <MailOpen size={14} /> : <Mail size={14} />}
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{msg.message}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Сообщений пока нет</p>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
