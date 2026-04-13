import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { LogOut, Car, Search, Clock, CheckCircle, XCircle, PlayCircle, AlertCircle, MessageSquare, RefreshCw, Shield, ClipboardCheck, Plus, Pencil, Trash2 } from "lucide-react";
import InspectionWorkflow from "@/components/inspection/InspectionWorkflow";
import { US_STATES } from "@/data/usStates";

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

const emptyForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  vehicle_make: "",
  vehicle_model: "",
  vehicle_color: "",
  license_plate: "",
  pickup_location: "",
  service_type: "single",
  special_instructions: "",
};

const Dashboard = () => {
  const { user, loading: authLoading, isEmployee, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ParkingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<ParkingRequest | null>(null);
  const [inspectingRequest, setInspectingRequest] = useState<ParkingRequest | null>(null);
  const [notes, setNotes] = useState<RequestNote[]>([]);
  const [newNote, setNewNote] = useState("");

  // Create / Edit form state
  const [formOpen, setFormOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<ParkingRequest | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Delete confirmation state
  const [deleteConfirmCode, setDeleteConfirmCode] = useState("");
  const DELETE_CODE = "8888";

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

  // Create / Edit handlers
  const openCreateForm = () => {
    setEditingRequest(null);
    setFormData(emptyForm);
    setFormOpen(true);
  };

  const openEditForm = (req: ParkingRequest) => {
    setEditingRequest(req);
    setFormData({
      first_name: req.first_name,
      last_name: req.last_name,
      email: req.email,
      phone: req.phone,
      vehicle_make: req.vehicle_make,
      vehicle_model: req.vehicle_model,
      vehicle_color: req.vehicle_color,
      license_plate: req.license_plate,
      pickup_location: req.pickup_location,
      service_type: req.service_type,
      special_instructions: req.special_instructions || "",
    });
    setFormOpen(true);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async () => {
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone || !formData.vehicle_make || !formData.vehicle_model || !formData.vehicle_color || !formData.license_plate || !formData.pickup_location) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    setFormSubmitting(true);
    const payload = {
      ...formData,
      special_instructions: formData.special_instructions || null,
    };

    if (editingRequest) {
      const { error } = await supabase
        .from("parking_requests")
        .update(payload)
        .eq("id", editingRequest.id);

      if (error) {
        toast({ title: "Error updating request", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Request updated successfully" });
        setFormOpen(false);
      }
    } else {
      const { error } = await supabase
        .from("parking_requests")
        .insert(payload);

      if (error) {
        toast({ title: "Error creating request", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Request created successfully" });
        setFormOpen(false);
      }
    }
    setFormSubmitting(false);
  };

  const deleteRequest = async (id: string) => {
    const { error } = await supabase
      .from("parking_requests")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error deleting request", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Request deleted" });
    }
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
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
                <Shield className="w-4 h-4 mr-1" /> Admin
              </Button>
            )}
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
          <Button onClick={openCreateForm}>
            <Plus className="w-4 h-4 mr-1" /> New Request
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
                        <div className="flex gap-1">
                          {(req.status === "pending" || req.status === "confirmed") && (
                            <Dialog open={inspectingRequest?.id === req.id} onOpenChange={(open) => !open && setInspectingRequest(null)}>
                              <DialogTrigger asChild>
                                <Button variant="default" size="sm" onClick={() => setInspectingRequest(req)}>
                                  <ClipboardCheck className="w-4 h-4 mr-1" /> Inspect
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="font-display">Vehicle Inspection</DialogTitle>
                                </DialogHeader>
                                <InspectionWorkflow
                                  requestId={req.id}
                                  customerName={`${req.first_name} ${req.last_name}`}
                                  vehicleInfo={`${req.vehicle_color} ${req.vehicle_make} ${req.vehicle_model}`}
                                  vehicleModel={req.vehicle_model}
                                  licensePlate={req.license_plate}
                                  onComplete={() => fetchRequests()}
                                  onClose={() => setInspectingRequest(null)}
                                />
                              </DialogContent>
                            </Dialog>
                          )}
                          <Button variant="outline" size="sm" onClick={() => openEditForm(req)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
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
                                    <div>
                                      <h4 className="font-medium text-foreground mb-1">Contact Info</h4>
                                      <p className="text-muted-foreground">{selectedRequest.email}</p>
                                      <p className="text-muted-foreground">{selectedRequest.phone}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-foreground mb-1">Vehicle</h4>
                                      <p className="text-muted-foreground">
                                        {selectedRequest.vehicle_color} {selectedRequest.vehicle_make} {selectedRequest.vehicle_model}
                                      </p>
                                      <p className="text-muted-foreground font-mono">{selectedRequest.license_plate}</p>
                                    </div>
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
                                    {selectedRequest.special_instructions && (
                                      <div>
                                        <h4 className="font-medium text-foreground mb-1">Special Instructions</h4>
                                        <p className="text-muted-foreground">{selectedRequest.special_instructions}</p>
                                      </div>
                                    )}
                                    <div>
                                      <h4 className="font-medium text-foreground mb-1">Submitted</h4>
                                      <p className="text-muted-foreground">{new Date(selectedRequest.created_at).toLocaleString()}</p>
                                    </div>
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
                          <AlertDialog onOpenChange={() => setDeleteConfirmCode("")}>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Request</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the request for {req.first_name} {req.last_name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <div className="py-4">
                                <Label htmlFor={`delete-code-${req.id}`} className="text-sm font-medium">
                                  Enter confirmation code <span className="font-bold">{DELETE_CODE}</span> to delete
                                </Label>
                                <Input
                                  id={`delete-code-${req.id}`}
                                  className="mt-2"
                                  placeholder="Enter 4-digit code"
                                  maxLength={4}
                                  value={deleteConfirmCode}
                                  onChange={(e) => setDeleteConfirmCode(e.target.value.replace(/\D/g, ""))}
                                />
                              </div>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  disabled={deleteConfirmCode !== DELETE_CODE}
                                  onClick={() => deleteRequest(req.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Create / Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingRequest ? "Edit Request" : "New Valet Request"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>First Name *</Label>
                <Input value={formData.first_name} onChange={e => handleFormChange("first_name", e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Last Name *</Label>
                <Input value={formData.last_name} onChange={e => handleFormChange("last_name", e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Email *</Label>
                <Input type="email" value={formData.email} onChange={e => handleFormChange("email", e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Phone *</Label>
                <Input value={formData.phone} onChange={e => handleFormChange("phone", e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label>Make *</Label>
                <Input value={formData.vehicle_make} onChange={e => handleFormChange("vehicle_make", e.target.value)} placeholder="Toyota" />
              </div>
              <div className="space-y-1">
                <Label>Model *</Label>
                <Input value={formData.vehicle_model} onChange={e => handleFormChange("vehicle_model", e.target.value)} placeholder="Camry" />
              </div>
              <div className="space-y-1">
                <Label>Color *</Label>
                <Input value={formData.vehicle_color} onChange={e => handleFormChange("vehicle_color", e.target.value)} placeholder="Black" />
              </div>
            </div>
            <div className="space-y-1">
              <Label>License Plate *</Label>
              <Input value={formData.license_plate} onChange={e => handleFormChange("license_plate", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Pickup Location *</Label>
                <Select value={formData.pickup_location} onValueChange={v => handleFormChange("pickup_location", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(locationLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Service Type</Label>
                <Select value={formData.service_type} onValueChange={v => handleFormChange("service_type", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="round-trip">Round Trip</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label>Special Instructions</Label>
              <Textarea value={formData.special_instructions} onChange={e => handleFormChange("special_instructions", e.target.value)} placeholder="Any special notes..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={handleFormSubmit} disabled={formSubmitting}>
              {formSubmitting ? "Saving..." : editingRequest ? "Save Changes" : "Create Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
