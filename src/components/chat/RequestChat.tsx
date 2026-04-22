import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  request_id: string;
  sender_role: "customer" | "employee";
  sender_name: string | null;
  body: string;
  created_at: string;
  read_by_customer: boolean;
  read_by_employee: boolean;
}

interface RequestChatProps {
  requestId: string;
  viewerRole: "customer" | "employee";
  viewerName: string;
  viewerUserId?: string | null;
  vehicleLabel?: string;
  className?: string;
  onUnreadChange?: (count: number) => void;
}

const RequestChat = ({
  requestId,
  viewerRole,
  viewerName,
  viewerUserId,
  vehicleLabel,
  className,
  onUnreadChange,
}: RequestChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const readField = viewerRole === "customer" ? "read_by_customer" : "read_by_employee";

  useEffect(() => {
    let active = true;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("request_messages")
        .select("*")
        .eq("request_id", requestId)
        .order("created_at", { ascending: true });
      if (!active) return;
      setMessages((data ?? []) as Message[]);
      setLoading(false);
    };
    fetchMessages();

    const channel = supabase
      .channel(`request-chat-${requestId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "request_messages", filter: `request_id=eq.${requestId}` },
        (payload) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === (payload.new as Message).id)) return prev;
            return [...prev, payload.new as Message];
          });
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [requestId]);

  // Auto-scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  // Mark incoming messages as read for the viewer
  useEffect(() => {
    const unread = messages.filter((m) => m.sender_role !== viewerRole && !m[readField]);
    onUnreadChange?.(unread.length);
    if (unread.length === 0) return;
    const ids = unread.map((m) => m.id);
    supabase
      .from("request_messages")
      .update({ [readField]: true })
      .in("id", ids)
      .then(() => {
        setMessages((prev) =>
          prev.map((m) => (ids.includes(m.id) ? { ...m, [readField]: true } : m))
        );
      });
  }, [messages, viewerRole, readField, onUnreadChange]);

  const send = async () => {
    const body = input.trim();
    if (!body || sending) return;
    setSending(true);
    const { error } = await supabase.from("request_messages").insert({
      request_id: requestId,
      sender_role: viewerRole,
      sender_user_id: viewerUserId ?? null,
      sender_name: viewerName,
      body,
      read_by_customer: viewerRole === "customer",
      read_by_employee: viewerRole === "employee",
    });
    if (!error) {
      setInput("");
      // Fire notification email to the other side (best-effort)
      supabase.functions
        .invoke("notify-chat-message", {
          body: { requestId, senderRole: viewerRole, senderName: viewerName, preview: body.slice(0, 200) },
        })
        .catch(() => {});
    }
    setSending(false);
  };

  return (
    <div className={cn("flex flex-col h-full bg-card border border-border/50 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
        <p className="text-sm font-semibold text-foreground">
          {viewerRole === "customer" ? "Chat with the valet team" : "Chat with customer"}
        </p>
        {vehicleLabel && <p className="text-xs text-muted-foreground">{vehicleLabel}</p>}
      </div>

      <ScrollArea className="flex-1">
        <div ref={scrollRef} className="p-3 space-y-2 min-h-[180px] max-h-[360px] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">
              No messages yet. Say hi 👋
            </p>
          ) : (
            messages.map((m) => {
              const mine = m.sender_role === viewerRole;
              return (
                <div key={m.id} className={cn("flex flex-col", mine ? "items-end" : "items-start")}>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                      mine
                        ? "bg-secondary text-secondary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    )}
                  >
                    {!mine && m.sender_name && (
                      <p className="text-[10px] font-medium opacity-70 mb-0.5">{m.sender_name}</p>
                    )}
                    <p className="whitespace-pre-wrap break-words">{m.body}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-0.5 px-1">
                    {new Date(m.created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      <div className="p-2 border-t border-border/50 bg-background/50 flex gap-2 items-end">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Type a message..."
          className="min-h-[40px] max-h-[120px] resize-none text-sm"
          rows={1}
        />
        <Button size="icon" onClick={send} disabled={sending || !input.trim()}>
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};

export default RequestChat;