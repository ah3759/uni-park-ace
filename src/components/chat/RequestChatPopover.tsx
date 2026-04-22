import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RequestChat from "./RequestChat";

interface Props {
  requestId: string;
  viewerRole: "customer" | "employee";
  viewerName: string;
  viewerUserId?: string | null;
  vehicleLabel?: string;
  size?: "sm" | "default";
  variant?: "default" | "outline" | "secondary" | "ghost";
  label?: string;
}

const RequestChatPopover = ({
  requestId,
  viewerRole,
  viewerName,
  viewerUserId,
  vehicleLabel,
  size = "sm",
  variant = "outline",
  label = "Chat",
}: Props) => {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const readField = viewerRole === "customer" ? "read_by_customer" : "read_by_employee";

  // Track unread count even when popover is closed
  useEffect(() => {
    let active = true;
    const fetchUnread = async () => {
      const { count } = await supabase
        .from("request_messages")
        .select("id", { count: "exact", head: true })
        .eq("request_id", requestId)
        .neq("sender_role", viewerRole)
        .eq(readField, false);
      if (active) setUnread(count ?? 0);
    };
    fetchUnread();

    const channel = supabase
      .channel(`chat-unread-${requestId}-${viewerRole}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "request_messages", filter: `request_id=eq.${requestId}` },
        (payload) => {
          const msg = payload.new as { sender_role: string };
          if (msg.sender_role !== viewerRole && !open) {
            setUnread((u) => u + 1);
          }
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [requestId, viewerRole, readField, open]);

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (o) setUnread(0); }}>
      <PopoverTrigger asChild>
        <Button size={size} variant={variant} className="relative gap-2">
          <MessageCircle className="w-4 h-4" />
          {label}
          {unread > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 min-w-5 px-1 flex items-center justify-center bg-destructive text-destructive-foreground text-[10px]">
              {unread > 9 ? "9+" : unread}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="top"
        className="w-[360px] p-0 border-border/50"
        sideOffset={8}
      >
        <RequestChat
          requestId={requestId}
          viewerRole={viewerRole}
          viewerName={viewerName}
          viewerUserId={viewerUserId}
          vehicleLabel={vehicleLabel}
        />
      </PopoverContent>
    </Popover>
  );
};

export default RequestChatPopover;