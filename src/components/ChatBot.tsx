import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import ChatStatusLookup from "@/components/ChatStatusLookup";
import ChatQuickActions from "@/components/ChatQuickActions";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Msg[];
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: "Something went wrong" }));
    onError(err.error || "Something went wrong");
    return;
  }

  if (!resp.body) { onError("No response"); return; }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, idx);
      buf = buf.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { onDone(); return; }
      try {
        const parsed = JSON.parse(json);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch {
        buf = line + "\n" + buf;
        break;
      }
    }
  }
  onDone();
}

const SUGGESTIONS = [
  "How do I schedule a pickup?",
  "What are your pricing plans?",
  "How do I book for an event?",
  "What services do you offer?",
];

type View = "chat" | "status";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<View>("chat");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current && view === "chat") {
      inputRef.current.focus();
    }
  }, [isOpen, view]);

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: allMessages,
        onDelta: upsert,
        onDone: () => setIsLoading(false),
        onError: (msg) => {
          setMessages((prev) => [...prev, { role: "assistant", content: `Sorry, I encountered an issue: ${msg}` }]);
          setIsLoading(false);
        },
      });
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    if (action === "status") {
      setView("status");
    } else if (action === "schedule") {
      setIsOpen(false);
      document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" });
    } else if (action === "pricing") {
      setIsOpen(false);
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
    } else if (action === "events") {
      setIsOpen(false);
      document.getElementById("events")?.scrollIntoView({ behavior: "smooth" });
    } else if (action === "services") {
      setIsOpen(false);
      document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
    } else if (action === "signin") {
      setIsOpen(false);
      window.location.href = "/customer-login";
    }
  };

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full accent-gradient shadow-glow flex items-center justify-center transition-all duration-300 hover:scale-110",
          isOpen && "scale-0 opacity-0 pointer-events-none"
        )}
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6 text-accent-foreground" />
      </button>

      {/* Chat window */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-4rem)] rounded-2xl border border-border/50 bg-background shadow-elevated flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right",
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 accent-gradient">
          <div className="flex items-center gap-2">
            {view !== "chat" && (
              <button onClick={() => setView("chat")} className="text-accent-foreground/70 hover:text-accent-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <Bot className="w-5 h-5 text-accent-foreground" />
            <span className="font-display font-semibold text-accent-foreground">
              {view === "status" ? "Check Status" : "UNiVale Assistant"}
            </span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-accent-foreground/70 hover:text-accent-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {view === "status" ? (
          <ChatStatusLookup />
        ) : (
          <>
            {/* Messages */}
            <ScrollArea className="flex-1 px-4 py-3" ref={scrollRef}>
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    👋 Hi! I'm your UNiVale assistant. How can I help you today?
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="text-left text-xs px-3 py-2 rounded-lg border border-border/50 bg-muted/30 text-foreground hover:bg-muted/60 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={cn("flex gap-2 mb-3", m.role === "user" ? "justify-end" : "justify-start")}>
                  {m.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full accent-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3 h-3 text-accent-foreground" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[75%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    )}
                  >
                    {m.content}
                  </div>
                  {m.role === "user" && (
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-3 h-3 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full accent-gradient flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3 h-3 text-accent-foreground" />
                  </div>
                  <div className="bg-muted rounded-xl px-3 py-2 rounded-bl-sm">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>

            {/* Quick Actions */}
            <ChatQuickActions onAction={handleQuickAction} />

            {/* Input */}
            <div className="px-3 py-3 border-t border-border/50">
              <form
                onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="flex gap-2"
              >
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 text-sm h-9"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" className="h-9 w-9 accent-gradient" disabled={isLoading || !input.trim()}>
                  <Send className="w-4 h-4 text-accent-foreground" />
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ChatBot;
