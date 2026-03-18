import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Clock, CreditCard, Crown, LogOut, History, Package } from "lucide-react";

interface ParkingRequest {
  id: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_color: string;
  license_plate: string;
  pickup_location: string;
  service_type: string;
  status: string;
  created_at: string;
  special_instructions: string | null;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  confirmed: { label: "Confirmed", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  in_progress: { label: "In Progress", className: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  completed: { label: "Completed", className: "bg-green-500/10 text-green-500 border-green-500/20" },
  cancelled: { label: "Cancelled", className: "bg-red-500/10 text-red-500 border-red-500/20" },
};

const locationLabels: Record<string, string> = {
  main_entrance: "Main Entrance",
  north_gate: "North Gate",
  south_parking: "South Parking",
  east_wing: "East Wing",
  west_plaza: "West Plaza",
};

const CustomerDashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ParkingRequest[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/customer-login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    setLoadingData(true);
    const { data } = await supabase
      .from("parking_requests")
      .select("*")
      .eq("email", user?.email ?? "")
      .order("created_at", { ascending: false });

    setRequests(data ?? []);
    setLoadingData(false);
  };

  const activeRequests = requests.filter(r => ["pending", "confirmed", "in_progress"].includes(r.status));
  const completedRequests = requests.filter(r => r.status === "completed");
  const displayName = user?.user_metadata?.display_name || user?.email || "Customer";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 accent-gradient rounded-lg flex items-center justify-center">
              <Car className="w-4 h-4 text-accent-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground">
              UNi<span className="text-gradient">Vale</span>
            </span>
          </a>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Welcome, {displayName}
            </span>
            <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }}>
              <LogOut className="w-4 h-4 mr-1" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="font-display text-2xl font-bold text-foreground mb-6">
          My Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="glass-card border-border/50">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activeRequests.length}</p>
                <p className="text-sm text-muted-foreground">Active Requests</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <History className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completedRequests.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{requests.length}</p>
                <p className="text-sm text-muted-foreground">Total Requests</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>

          {/* Active Requests */}
          <TabsContent value="active" className="space-y-4">
            {loadingData ? (
              <Card className="glass-card border-border/50">
                <CardContent className="py-12 text-center text-muted-foreground">Loading...</CardContent>
              </Card>
            ) : activeRequests.length === 0 ? (
              <Card className="glass-card border-border/50">
                <CardContent className="py-12 text-center">
                  <Clock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No active requests</p>
                  <Button variant="secondary" size="sm" className="mt-4" onClick={() => navigate("/")}>
                    Request Valet Service
                  </Button>
                </CardContent>
              </Card>
            ) : (
              activeRequests.map((req) => (
                <RequestCard key={req.id} request={req} />
              ))
            )}
          </TabsContent>

          {/* History */}
          <TabsContent value="history" className="space-y-4">
            {completedRequests.length === 0 ? (
              <Card className="glass-card border-border/50">
                <CardContent className="py-12 text-center">
                  <History className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No completed requests yet</p>
                </CardContent>
              </Card>
            ) : (
              completedRequests.map((req) => (
                <RequestCard key={req.id} request={req} />
              ))
            )}
          </TabsContent>

          {/* Subscription */}
          <TabsContent value="subscription">
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <Crown className="w-5 h-5 text-secondary" />
                  Subscription Plan
                </CardTitle>
                <CardDescription>Manage your valet subscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">Current Plan</span>
                    <Badge variant="outline" className="text-muted-foreground">Free</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You're using pay-per-use. Upgrade to a monthly plan for discounted rates.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-secondary/30 bg-secondary/5">
                    <h4 className="font-display font-semibold text-foreground mb-1">Monthly Basic</h4>
                    <p className="text-2xl font-bold text-secondary mb-2">$49<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                    <p className="text-sm text-muted-foreground mb-3">Up to 20 valet requests per month</p>
                    <Button variant="secondary" size="sm" className="w-full">Upgrade</Button>
                  </div>
                  <div className="p-4 rounded-lg border border-secondary/30 bg-secondary/5">
                    <h4 className="font-display font-semibold text-foreground mb-1">Monthly Premium</h4>
                    <p className="text-2xl font-bold text-secondary mb-2">$89<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                    <p className="text-sm text-muted-foreground mb-3">Unlimited valet requests</p>
                    <Button variant="secondary" size="sm" className="w-full">Upgrade</Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Transaction History
                  </h4>
                  {requests.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No transactions yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {requests.slice(0, 5).map((req) => (
                        <div key={req.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {req.vehicle_make} {req.vehicle_model} — {req.service_type}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(req.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline" className={statusConfig[req.status]?.className}>
                            {statusConfig[req.status]?.label || req.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

const RequestCard = ({ request }: { request: ParkingRequest }) => {
  const config = statusConfig[request.status] || { label: request.status, className: "" };
  return (
    <Card className="glass-card border-border/50">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-medium text-foreground">
              {request.vehicle_color} {request.vehicle_make} {request.vehicle_model}
            </p>
            <p className="text-sm text-muted-foreground">Plate: {request.license_plate}</p>
          </div>
          <Badge variant="outline" className={config.className}>{config.label}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Location: </span>
            <span className="text-foreground">{locationLabels[request.pickup_location] || request.pickup_location}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Service: </span>
            <span className="text-foreground capitalize">{request.service_type}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Date: </span>
            <span className="text-foreground">{new Date(request.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        {request.special_instructions && (
          <p className="mt-2 text-sm text-muted-foreground italic">"{request.special_instructions}"</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerDashboard;
