import { useState } from "react";
import { Search, Clock, CheckCircle, AlertCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import CarLogo from "@/components/CarLogo";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

type Request = {
  id: string;
  first_name: string;
  last_name: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_color: string;
  license_plate: string;
  pickup_location: string;
  service_type: string;
  status: string;
  created_at: string;
};

type Schedule = {
  id: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_color: string;
  license_plate: string;
  pickup_location: string;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
  created_at: string;
};

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Clock }> = {
  pending: { label: "Pending", variant: "outline", icon: Clock },
  confirmed: { label: "Confirmed", variant: "secondary", icon: CheckCircle },
  in_progress: { label: "In Progress", variant: "default", icon: Car },
  completed: { label: "Completed", variant: "secondary", icon: CheckCircle },
  cancelled: { label: "Cancelled", variant: "destructive", icon: AlertCircle },
  scheduled: { label: "Scheduled", variant: "outline", icon: Clock },
};

const locationLabels: Record<string, string> = {
  lot_a: "Lot A - Main Entrance",
  lot_b: "Lot B - Side Entrance",
  lot_c: "Lot C - VIP Section",
  garage_1: "Garage 1 - Level 1",
  garage_2: "Garage 2 - Level 2",
};

const ChatStatusLookup = () => {
  const [email, setEmail] = useState("");
  const [requests, setRequests] = useState<Request[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const lookup = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ action: "check_status", email: email.trim() }),
      });
      if (!resp.ok) throw new Error("Lookup failed");
      const data = await resp.json();
      setRequests(data.requests || []);
      setSchedules(data.schedules || []);
      setSearched(true);
    } catch {
      setError("Unable to look up your requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const total = requests.length + schedules.length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-border/50">
        <p className="text-xs text-muted-foreground mb-2">Enter your email to check the status of your requests.</p>
        <form onSubmit={(e) => { e.preventDefault(); lookup(); }} className="flex gap-2">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            type="email"
            className="flex-1 text-sm h-9"
            disabled={loading}
          />
          <Button type="submit" size="icon" className="h-9 w-9 accent-gradient" disabled={loading || !email.trim()}>
            <Search className="w-4 h-4 text-accent-foreground" />
          </Button>
        </form>
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </div>

      <ScrollArea className="flex-1 px-4 py-3">
        {searched && total === 0 && (
          <div className="text-center py-8">
            <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No requests found for this email.</p>
            <p className="text-xs text-muted-foreground mt-1">Make sure you're using the same email you used to submit your request.</p>
          </div>
        )}

        {requests.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Parking Requests</h4>
            <div className="space-y-2">
              {requests.map((r) => {
                const config = statusConfig[r.status] || statusConfig.pending;
                const StatusIcon = config.icon;
                return (
                  <div key={r.id} className="rounded-lg border border-border/50 bg-muted/20 p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <CarLogo className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-medium">{r.vehicle_color} {r.vehicle_make} {r.vehicle_model}</span>
                      </div>
                      <Badge variant={config.variant} className="text-[10px] h-5">
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {locationLabels[r.pickup_location] || r.pickup_location}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Plate: {r.license_plate} · {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {schedules.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Scheduled Pickups</h4>
            <div className="space-y-2">
              {schedules.map((s) => {
                const config = statusConfig[s.status] || statusConfig.scheduled;
                const StatusIcon = config.icon;
                return (
                  <div key={s.id} className="rounded-lg border border-border/50 bg-muted/20 p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <CarLogo className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-medium">{s.vehicle_color} {s.vehicle_make} {s.vehicle_model}</span>
                      </div>
                      <Badge variant={config.variant} className="text-[10px] h-5">
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {s.scheduled_date} at {s.scheduled_time}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {locationLabels[s.pickup_location] || s.pickup_location}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ChatStatusLookup;
