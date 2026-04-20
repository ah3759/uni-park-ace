import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle2 } from "lucide-react";
import CarLogo from "@/components/CarLogo";

interface Props {
  parkingRequestId: string;
  customerEmail: string;
  customerName?: string;
  /** Only show button when parking_requests.status is one of these */
  requestStatus: string;
}

/**
 * Lets a logged-in customer ping the valet team to bring their car back.
 * Disabled until the request is in_progress (vehicle has been parked).
 * Hides itself once the request is completed.
 */
const PickupRequestButton = ({ parkingRequestId, customerEmail, customerName, requestStatus }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const [activePing, setActivePing] = useState<{ id: string; status: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data } = await supabase
        .from("pickup_requests")
        .select("id, status")
        .eq("parking_request_id", parkingRequestId)
        .in("status", ["pending", "acknowledged"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!cancelled) setActivePing(data ?? null);
    };
    load();

    const channel = supabase
      .channel(`pickup-${parkingRequestId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pickup_requests", filter: `parking_request_id=eq.${parkingRequestId}` },
        load
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [parkingRequestId]);

  if (requestStatus === "completed" || requestStatus === "cancelled") return null;

  const canRequest = requestStatus === "in_progress";
  const handlePing = async () => {
    setSubmitting(true);
    const { error } = await supabase.from("pickup_requests").insert({
      parking_request_id: parkingRequestId,
      customer_email: customerEmail,
      customer_name: customerName ?? null,
      source: "dashboard",
      status: "pending",
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Couldn't send pickup request", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Pickup requested!", description: "Our team is on the way to bring your car." });
  };

  if (activePing) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-secondary/40 bg-secondary/10 px-3 py-2 text-sm text-secondary-foreground">
        <CheckCircle2 className="w-4 h-4 text-secondary" />
        <span className="font-medium">
          {activePing.status === "acknowledged" ? "Valet is on the way" : "Pickup requested — heading your way"}
        </span>
      </div>
    );
  }

  return (
    <Button
      onClick={handlePing}
      disabled={!canRequest || submitting}
      className="w-full"
      variant={canRequest ? "default" : "secondary"}
    >
      {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CarLogo className="w-4 h-4 mr-2" />}
      {canRequest ? "Request my car back" : "Available once parked"}
    </Button>
  );
};

export default PickupRequestButton;
