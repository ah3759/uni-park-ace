import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import {
  X, Phone, Mail, MapPin, Car, Clock, MessageSquare,
  Camera, ParkingSquare, FileText, User,
} from "lucide-react";

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

interface VehiclePhoto {
  id: string;
  angle: string;
  photo_path: string;
  notes: string | null;
  created_at: string;
}

interface InspectionData {
  id: string;
  status: string;
  notes: string | null;
  parking_description: string | null;
  parking_photo_path: string | null;
  parking_latitude: number | null;
  parking_longitude: number | null;
  created_at: string;
}

const statusConfig: Record<RequestStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  confirmed: { label: "Confirmed", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  in_progress: { label: "In Progress", className: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  completed: { label: "Completed", className: "bg-green-500/10 text-green-600 border-green-500/20" },
  cancelled: { label: "Cancelled", className: "bg-red-500/10 text-red-600 border-red-500/20" },
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

const angleLabels: Record<string, string> = {
  front: "Front",
  back: "Rear",
  driver_side: "Driver Side",
  passenger_side: "Passenger Side",
  dashboard: "Dashboard / Interior",
  damage: "Damage / Notes",
};

interface Props {
  request: ParkingRequest;
  userId: string;
  onClose: () => void;
  onStatusChange: (id: string, status: RequestStatus) => void;
}

const RequestDetailPanel = ({ request, userId, onClose, onStatusChange }: Props) => {
  const [notes, setNotes] = useState<RequestNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [photos, setPhotos] = useState<VehiclePhoto[]>([]);
  const [inspection, setInspection] = useState<InspectionData | null>(null);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
    fetchInspection();
  }, [request.id]);

  const fetchNotes = async () => {
    const { data } = await supabase
      .from("request_notes")
      .select("*")
      .eq("request_id", request.id)
      .order("created_at", { ascending: true });
    setNotes((data as RequestNote[]) || []);
  };

  const fetchInspection = async () => {
    setLoadingPhotos(true);
    const { data: inspData } = await supabase
      .from("vehicle_inspections")
      .select("*")
      .eq("request_id", request.id)
      .maybeSingle();

    if (inspData) {
      setInspection(inspData as unknown as InspectionData);
      const { data: photosData } = await supabase
        .from("vehicle_photos")
        .select("*")
        .eq("inspection_id", inspData.id)
        .order("created_at", { ascending: true });
      setPhotos((photosData as VehiclePhoto[]) || []);
    } else {
      setInspection(null);
      setPhotos([]);
    }
    setLoadingPhotos(false);
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .single();
    if (!profile) return;

    const { error } = await supabase
      .from("request_notes")
      .insert({ request_id: request.id, author_id: profile.id, content: newNote.trim() });

    if (error) {
      toast({ title: "Error adding note", description: error.message, variant: "destructive" });
    } else {
      setNewNote("");
      fetchNotes();
    }
  };

  const getPhotoUrl = (path: string) => {
    const { data } = supabase.storage.from("vehicle-photos").getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-card border-l border-border z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-secondary" />
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-lg font-bold text-foreground truncate">
                {request.first_name} {request.last_name}
              </h2>
              <p className="text-xs text-muted-foreground">
                {new Date(request.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className={statusConfig[request.status].className}>
              {statusConfig[request.status].label}
            </Badge>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Body */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-5">
            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Car className="w-3.5 h-3.5" /> Vehicle
                </div>
                <p className="text-sm font-medium text-foreground">
                  {request.vehicle_color} {request.vehicle_make} {request.vehicle_model}
                </p>
                <p className="text-xs font-mono text-muted-foreground">{request.license_plate}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" /> Pickup Location
                </div>
                <p className="text-sm font-medium text-foreground">
                  {locationLabels[request.pickup_location] || request.pickup_location}
                </p>
                <p className="text-xs text-muted-foreground capitalize">{request.service_type} service</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone className="w-3.5 h-3.5" /> Phone
                </div>
                <p className="text-sm font-medium text-foreground">{request.phone}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" /> Email
                </div>
                <p className="text-sm font-medium text-foreground truncate">{request.email}</p>
              </div>
            </div>

            {request.special_instructions && (
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <FileText className="w-3.5 h-3.5" /> Special Instructions
                </div>
                <p className="text-sm text-foreground">{request.special_instructions}</p>
              </div>
            )}

            {/* Status Controls */}
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Update Status</h3>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(statusConfig) as RequestStatus[]).map(s => (
                  <Button
                    key={s}
                    variant={request.status === s ? "default" : "outline"}
                    size="sm"
                    onClick={() => onStatusChange(request.id, s)}
                    className="text-xs"
                  >
                    {statusConfig[s].label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Tabs for Photos, Parking, Notes */}
            <Tabs defaultValue="photos" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="photos" className="gap-1.5 text-xs">
                  <Camera className="w-3.5 h-3.5" />
                  Photos {photos.length > 0 && `(${photos.length})`}
                </TabsTrigger>
                <TabsTrigger value="parking" className="gap-1.5 text-xs">
                  <ParkingSquare className="w-3.5 h-3.5" />
                  Parking
                </TabsTrigger>
                <TabsTrigger value="notes" className="gap-1.5 text-xs">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Notes {notes.length > 0 && `(${notes.length})`}
                </TabsTrigger>
              </TabsList>

              {/* Photos Tab */}
              <TabsContent value="photos" className="mt-3">
                {loadingPhotos ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">Loading photos...</div>
                ) : photos.length === 0 ? (
                  <div className="text-center py-8">
                    <Camera className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No inspection photos yet</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Photos will appear here after an employee completes the vehicle inspection
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Photo grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {photos.map(photo => (
                        <button
                          key={photo.id}
                          className="relative group rounded-lg overflow-hidden border border-border aspect-[4/3] bg-muted/30 hover:ring-2 hover:ring-secondary/50 transition-all"
                          onClick={() => setSelectedPhoto(photo.photo_path)}
                        >
                          <img
                            src={getPhotoUrl(photo.photo_path)}
                            alt={angleLabels[photo.angle] || photo.angle}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                            <p className="text-[10px] font-medium text-white">
                              {angleLabels[photo.angle] || photo.angle}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                    {inspection?.notes && (
                      <div className="p-2 rounded bg-muted/50 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Inspector notes: </span>
                        {inspection.notes}
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* Parking Tab */}
              <TabsContent value="parking" className="mt-3">
                {!inspection ? (
                  <div className="text-center py-8">
                    <ParkingSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No parking info recorded</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {inspection.parking_photo_path && (
                      <button
                        className="w-full rounded-lg overflow-hidden border border-border aspect-video bg-muted/30 hover:ring-2 hover:ring-secondary/50 transition-all"
                        onClick={() => setSelectedPhoto(inspection.parking_photo_path!)}
                      >
                        <img
                          src={getPhotoUrl(inspection.parking_photo_path)}
                          alt="Parking location"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    )}
                    {inspection.parking_description && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Parking Description</p>
                        <p className="text-sm text-foreground">{inspection.parking_description}</p>
                      </div>
                    )}
                    {inspection.parking_latitude && inspection.parking_longitude && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">GPS Coordinates</p>
                        <p className="text-sm font-mono text-foreground">
                          {inspection.parking_latitude.toFixed(6)}, {inspection.parking_longitude.toFixed(6)}
                        </p>
                      </div>
                    )}
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Inspection Status</p>
                      <Badge variant="outline" className="capitalize">{inspection.status.replace("_", " ")}</Badge>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="mt-3">
                <div className="space-y-3">
                  {notes.length === 0 ? (
                    <div className="text-center py-6">
                      <MessageSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No internal notes yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {notes.map(n => (
                        <div key={n.id} className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm text-foreground">{n.content}</p>
                          <p className="text-[10px] text-muted-foreground mt-1.5">
                            {new Date(n.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Add an internal note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="min-h-[60px] text-sm"
                    />
                    <Button size="sm" onClick={addNote} disabled={!newNote.trim()} className="self-end">
                      Add
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>

      {/* Full-size photo lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={() => setSelectedPhoto(null)}
          >
            <X className="w-6 h-6" />
          </Button>
          <img
            src={getPhotoUrl(selectedPhoto)}
            alt="Full size photo"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default RequestDetailPanel;
