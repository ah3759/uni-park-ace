import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LogOut, Car, Search, Clock, CheckCircle, XCircle, PlayCircle, AlertCircle, MessageSquare, RefreshCw } from "lucide-react";

type RequestStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";

interface ParkingRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_color: string;
  license_plate: string;
  pickup_location: string;
  service_type: string;
  special_instructions: string | null;
  status: RequestStatus;
  assigned_employee_id: string | null;
  created_at: string;
  updated_at: string;
}

interface RequestNote {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
}

const statusConfig: Record<RequestStatus, { label: string; icon: typeof Clock; className: string }> = {
  pending: { label: "Pending", icon: Clock, className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  confirmed: { label: "Confirmed", icon: AlertCircle, className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  in_progress: { label: "In Progress", icon: PlayCircle, className: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  completed: { label: "Completed", icon: CheckCircle, className: "bg-green-500/10 text-green-600 border-green-500/20" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "bg-red-500/10 text-red-600 border-red-500/20" },
};

const locationLabels: Record<string, string> = {
  "gleason-circle": "Gleason Circle Bus Stop",
  "sentinel": "Sentinel",
  "ntid": "NTID Bus Stop",
  "north-bus-shelter": "North Bus Shelter",
  "slaughter-hall": "Slaughter Hall Bus Stop",
  "kimball-loop": "Kimball Loop",
  "global-village": "Global Village Bus Stop",
};

const Dashboard = () => {
  const { user, loading: authLoading, isEmployee, signOut } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ParkingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<ParkingRequest | null>(null);
  const [notes, setNotes] = useState<RequestNote[]>([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || !isEmployee)) {
      navigate("/login");
    }
  }, [user, authLoading, isEmployee, navigate]);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("parking_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error loading requests", description: error.message, variant: "destructive" });
    } else {
      setRequests((data as ParkingRequest[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user && isEmployee) {
      fetchRequests();

      const channel = supabase
        .channel("parking_requests_realtime")
        .on("postgres_changes", { event: "*", schema: "public", table: "parking_requests" }, () => {
          fetchRequests();
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [user, isEmployee]);

  const updateStatus = async (id: string, status: RequestStatus) => {
    const { error } = await supabase
      .from("parking_requests")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({ title: "Error updating status", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Status updated to ${statusConfig[status].label}` });
      if (selectedRequest?.id === id) {
        setSelectedRequest(prev => prev ? { ...prev, status } : null);
      }
    }
  };

  const fetchNotes = async (requestId: string) => {
    const { data } = await supabase
      .from("request_notes")
      .select("*")
      .eq("request_id", requestId)
      .order("created_at", { ascending: true });
    setNotes((data as RequestNote[]) || []);
  };

  const addNote = async () => {
    if (!newNote.trim() || !selectedRequest || !user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!profile) return;

    const { error } = await supabase
      .from("request_notes")
      .insert({ request_id: selectedRequest.id, author_id: profile.id, content: newNote.trim() });

    if (error) {
      toast({ title: "Error adding note", description: error.message, variant: "destructive" });
    } else {
      setNewNote("");
      fetchNotes(selectedRequest.id);
    }
  };

  const openDetail = (req: ParkingRequest) => {
    setSelectedRequest(req);
    fetchNotes(req.id);
  };

  const filtered = requests.filter(r => {
    const matchesSearch =
      `${r.first_name} ${r.last_name} ${r.license_plate} ${r.email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    active: requests.filter(r => ["confirmed", "in_progress"].includes(r.status)).length,
    completed: requests.filter(r => r.status === "completed").length,
  };

  if (authLoading || (!user && loading)) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Car className="w-6 h-6 text-secondary" />
            <h1 className="font-display text-xl font-bold text-foreground">Valet Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={() => { signOut(); navigate("/"); }}>
              <LogOut className="w-4 h-4 mr-1" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Requests", value: stats.total, icon: Car },
            { label: "Pending", value: stats.pending, icon: Clock },
            { label: "Active", value: stats.active, icon: PlayCircle },
            { label: "Completed", value: stats.completed, icon: CheckCircle },
          ].map(s => (
            <Card key={s.label} className="border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <s.icon className="w-8 h-8 text-secondary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, license plate, or email..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(statusConfig).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={fetchRequests}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Request Table */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading requests...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No requests found</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium text-muted-foreground">Customer</th>
                  <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Vehicle</th>
                  <th className="text-left p-3 font-medium text-muted-foreground hidden lg:table-cell">Location</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-3 font-medium text-muted-foreground hidden sm:table-cell">Time</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(req => {
                  const sc = statusConfig[req.status];
                  return (
                    <tr key={req.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <p className="font-medium text-foreground">{req.first_name} {req.last_name}</p>
                        <p className="text-xs text-muted-foreground">{req.phone}</p>
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        <p className="text-foreground">{req.vehicle_color} {req.vehicle_make} {req.vehicle_model}</p>
                        <p className="text-xs text-muted-foreground font-mono">{req.license_plate}</p>
                      </td>
                      <td className="p-3 hidden lg:table-cell text-foreground">
                        {locationLabels[req.pickup_location] || req.pickup_location}
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className={sc.className}>{sc.label}</Badge>
                      </td>
                      <td className="p-3 hidden sm:table-cell text-muted-foreground text-xs">
                        {new Date(req.created_at).toLocaleString()}
                      </td>
                      <td className="p-3">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => openDetail(req)}>
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                            {selectedRequest && selectedRequest.id === req.id && (
                              <>
                                <DialogHeader>
                                  <DialogTitle className="font-display">
                                    {selectedRequest.first_name} {selectedRequest.last_name}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 text-sm">
                                  {/* Contact */}
                                  <div>
                                    <h4 className="font-medium text-foreground mb-1">Contact Info</h4>
                                    <p className="text-muted-foreground">{selectedRequest.email}</p>
                                    <p className="text-muted-foreground">{selectedRequest.phone}</p>
                                  </div>
                                  {/* Vehicle */}
                                  <div>
                                    <h4 className="font-medium text-foreground mb-1">Vehicle</h4>
                                    <p className="text-muted-foreground">
                                      {selectedRequest.vehicle_color} {selectedRequest.vehicle_make} {selectedRequest.vehicle_model}
                                    </p>
                                    <p className="text-muted-foreground font-mono">{selectedRequest.license_plate}</p>
                                  </div>
                                  {/* Location & Service */}
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-medium text-foreground mb-1">Pickup Location</h4>
                                      <p className="text-muted-foreground">
                                        {locationLabels[selectedRequest.pickup_location] || selectedRequest.pickup_location}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-foreground mb-1">Service Type</h4>
                                      <p className="text-muted-foreground capitalize">{selectedRequest.service_type}</p>
                                    </div>
                                  </div>
                                  {/* Special Instructions */}
                                  {selectedRequest.special_instructions && (
                                    <div>
                                      <h4 className="font-medium text-foreground mb-1">Special Instructions</h4>
                                      <p className="text-muted-foreground">{selectedRequest.special_instructions}</p>
                                    </div>
                                  )}
                                  {/* Timestamp */}
                                  <div>
                                    <h4 className="font-medium text-foreground mb-1">Submitted</h4>
                                    <p className="text-muted-foreground">{new Date(selectedRequest.created_at).toLocaleString()}</p>
                                  </div>
                                  {/* Status Update */}
                                  <div>
                                    <h4 className="font-medium text-foreground mb-2">Update Status</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {(Object.keys(statusConfig) as RequestStatus[]).map(s => (
                                        <Button
                                          key={s}
                                          variant={selectedRequest.status === s ? "default" : "outline"}
                                          size="sm"
                                          onClick={() => updateStatus(selectedRequest.id, s)}
                                          className="text-xs"
                                        >
                                          {statusConfig[s].label}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                  {/* Notes */}
                                  <div>
                                    <h4 className="font-medium text-foreground mb-2 flex items-center gap-1">
                                      <MessageSquare className="w-4 h-4" /> Internal Notes
                                    </h4>
                                    <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                                      {notes.length === 0 ? (
                                        <p className="text-muted-foreground text-xs">No notes yet</p>
                                      ) : (
                                        notes.map(n => (
                                          <div key={n.id} className="p-2 bg-muted/50 rounded text-xs">
                                            <p className="text-foreground">{n.content}</p>
                                            <p className="text-muted-foreground mt-1">{new Date(n.created_at).toLocaleString()}</p>
                                          </div>
                                        ))
                                      )}
                                    </div>
                                    <div className="flex gap-2">
                                      <Textarea
                                        placeholder="Add a note..."
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        className="min-h-[60px] text-sm"
                                      />
                                      <Button size="sm" onClick={addNote} disabled={!newNote.trim()}>
                                        Add
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
