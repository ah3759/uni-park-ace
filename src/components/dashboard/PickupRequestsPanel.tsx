import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Bell, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import CarLogo from "@/components/CarLogo";

interface PickupPing {
  id: string;
  parking_request_id: string;
  customer_email: string;
  customer_name: string | null;
  source: string;
  status: string;
  created_at: string;
  acknowledged_at: string | null;
  parking_requests?: {
    first_name: string;
    last_name: string;
    phone: string;
    vehicle_color: string;
    vehicle_make: string;
    vehicle_model: string;
    license_plate: string;
    license_plate_state: string | null;
    pickup_location: string;
  } | null;
}

const locationLabels: Record<string, string> = {
  gracies: "Gracie's Dining Hall",
  global_village: "Global Village",
  sau: "Student Alumni Union (SAU)",
  golisano: "Golisano Hall",
  gleason: "Gleason Circle",
  sentinel: "The Sentinel",
  infinity_quad: "Infinity Quad",
};

const PickupRequestsPanel = ({ profileId }: { profileId: string | null }) => {
  const [pings, setPings] = useState<PickupPing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPings = async () => {
    const { data, error } = await supabase
      .from("pickup_requests")
      .select(`
        *,
        parking_requests (
          first_name, last_name, phone,
          vehicle_color, vehicle_make, vehicle_model,
          license_plate, license_plate_state, pickup_location
        )
      `)
      .in("status", ["pending", "acknowledged"])
      .order("created_at", { ascending: true });

    if (!error && data) setPings(data as PickupPing[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchPings();

    const channel = supabase
      .channel("pickup-requests-employee")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "pickup_requests" },
        (payload) => {
          const row = payload.new as PickupPing;
          toast({
            title: "🚨 New pickup request",
            description: `${row.customer_name || row.customer_email} is asking for their car.`,
          });
          fetchPings();
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "pickup_requests" },
        () => fetchPings()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const acknowledge = async (id: string) => {
    const { error } = await supabase
      .from("pickup_requests")
      .update({
        status: "acknowledged",
        acknowledged_at: new Date().toISOString(),
        acknowledged_by: profileId,
      })
      .eq("id", id);
    if (error) toast({ title: "Failed to acknowledge", description: error.message, variant: "destructive" });
  };

  const complete = async (id: string) => {
    const { error } = await supabase
      .from("pickup_requests")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) toast({ title: "Failed to mark complete", description: error.message, variant: "destructive" });
    else toast({ title: "Pickup completed" });
  };

  if (loading) return null;
  if (pings.length === 0) return null;

  return (
    <Card className="border-destructive/50 bg-destructive/5 mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-destructive">
          <Bell className="w-5 h-5 animate-pulse" />
          Active Pickup Requests ({pings.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {pings.map((p) => {
          const r = p.parking_requests;
          const ago = formatDistanceToNow(new Date(p.created_at), { addSuffix: true });
          return (
            <div
              key={p.id}
              className="rounded-lg border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground">
                      {p.customer_name || `${r?.first_name ?? ""} ${r?.last_name ?? ""}`.trim() || p.customer_email}
                    </span>
                    <Badge variant={p.status === "acknowledged" ? "secondary" : "destructive"}>
                      {p.status === "acknowledged" ? "Acknowledged" : "Pending"}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {p.source === "email_link" ? "via email" : "via dashboard"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Requested {ago}
                  </p>
                </div>
                <div className="flex gap-2">
                  {p.status === "pending" && (
                    <Button size="sm" variant="secondary" onClick={() => acknowledge(p.id)}>
                      Acknowledge
                    </Button>
                  )}
                  <Button size="sm" onClick={() => complete(p.id)}>
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Done
                  </Button>
                </div>
              </div>
              {r && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CarLogo className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">
                        {r.vehicle_color} {r.vehicle_make} {r.vehicle_model}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Plate: {r.license_plate}{r.license_plate_state ? ` (${r.license_plate_state})` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">
                        {locationLabels[r.pickup_location] || r.pickup_location}
                      </p>
                      <p className="text-xs text-muted-foreground">Drop-off / pickup point</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground text-xs">Contact</p>
                    <p className="font-medium text-foreground">{r.phone}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.customer_email}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default PickupRequestsPanel;
