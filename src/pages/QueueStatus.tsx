import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, Clock, MapPin, CheckCircle, ArrowLeft, RefreshCw } from "lucide-react";
import CarLogo from "@/components/CarLogo";

interface QueueData {
  found: boolean;
  status: string;
  firstName: string;
  pickupLocation?: string;
  position: number;
  total: number;
}

const locationLabels: Record<string, string> = {
  lot_a: "Parking Lot A",
  lot_b: "Parking Lot B",
  front_entrance: "Front Entrance",
  side_entrance: "Side Entrance",
  vip_area: "VIP Area",
};

const statusDisplay: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "Checked In — Waiting", color: "bg-amber-100 text-amber-800 border-amber-300", icon: <Clock className="w-4 h-4" /> },
  confirmed: { label: "Confirmed — In Queue", color: "bg-blue-100 text-blue-800 border-blue-300", icon: <Users className="w-4 h-4" /> },
  in_progress: { label: "Your Car is Being Parked", color: "bg-purple-100 text-purple-800 border-purple-300", icon: <CarLogo className="w-4 h-4" /> },
  completed: { label: "Completed", color: "bg-green-100 text-green-800 border-green-300", icon: <CheckCircle className="w-4 h-4" /> },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800 border-red-300", icon: <Clock className="w-4 h-4" /> },
};

const QueueStatus = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const [queueData, setQueueData] = useState<QueueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchQueuePosition = async () => {
    if (!requestId) return;
    try {
      const { data, error } = await supabase.rpc("get_queue_position", {
        p_request_id: requestId,
      });
      if (error) throw error;
      setQueueData(data as unknown as QueueData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching queue position:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueuePosition();
    const interval = setInterval(fetchQueuePosition, 10000);

    const channel = supabase
      .channel("queue-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "parking_requests" }, () => {
        fetchQueuePosition();
      })
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [requestId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!queueData || !queueData.found) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold mb-2">Request Not Found</h2>
            <p className="text-muted-foreground mb-6">We couldn't find a request with that ID.</p>
            <Link to="/">
              <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isInQueue = queueData.status === "pending" || queueData.status === "confirmed";
  const isActive = queueData.status === "in_progress";
  const isDone = queueData.status === "completed" || queueData.status === "cancelled";
  const status = statusDisplay[queueData.status] || statusDisplay.pending;
  const progressPercent = isInQueue && queueData.total > 0
    ? Math.max(5, ((queueData.total - queueData.position + 1) / queueData.total) * 100)
    : isDone ? 100 : 50;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-4">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">UniVale Queue</h1>
          <p className="text-sm text-muted-foreground">Live queue status • Auto-updates</p>
        </div>

        {/* Main Card */}
        <Card className="border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Hi, {queueData.firstName}! 👋</CardTitle>
              <Badge className={`${status.color} border gap-1`}>
                {status.icon} {status.label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Queue Position */}
            {isInQueue && (
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="text-7xl font-bold text-primary">{queueData.position}</div>
                  <div className="text-sm text-muted-foreground font-medium">
                    of {queueData.total} in line
                  </div>
                </div>
                <Progress value={progressPercent} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  {queueData.position === 1
                    ? "You're next! A valet attendant will be with you shortly."
                    : queueData.position <= 3
                    ? "Almost there! Just a few more ahead of you."
                    : "Hang tight — we're working through the queue as fast as we can."}
                </p>
              </div>
            )}

            {/* Active Status */}
            {isActive && (
              <div className="text-center space-y-3">
                <div className="text-6xl">🚗</div>
                <p className="text-lg font-semibold">Your car is being handled right now!</p>
                <p className="text-sm text-muted-foreground">
                  A valet attendant is currently parking your vehicle. We'll update you when it's done.
                </p>
                <Progress value={75} className="h-3" />
              </div>
            )}

            {/* Completed */}
            {isDone && (
              <div className="text-center space-y-3">
                <div className="text-6xl">{queueData.status === "completed" ? "✅" : "❌"}</div>
                <p className="text-lg font-semibold">
                  {queueData.status === "completed"
                    ? "Your vehicle has been parked!"
                    : "This request was cancelled."}
                </p>
                <Progress value={100} className="h-3" />
              </div>
            )}

            {/* Location */}
            {queueData.pickupLocation && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>Pickup: <strong>{locationLabels[queueData.pickupLocation] || queueData.pickupLocation}</strong></span>
              </div>
            )}

            {/* Last updated */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              <Button variant="ghost" size="sm" onClick={fetchQueuePosition} className="h-7 text-xs gap-1">
                <RefreshCw className="w-3 h-3" /> Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QueueStatus;
