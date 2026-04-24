import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Zap, Crown, Loader2, Car, Plus } from "lucide-react";
import CarLogo from "@/components/CarLogo";

interface SavedVehicle {
  id: string;
  nickname: string | null;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_color: string;
  license_plate: string;
  license_plate_state: string | null;
  is_default: boolean;
}

interface SavedProfile {
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  default_pickup_location: string | null;
}

interface Membership {
  isMember: boolean;
  tier?: "monthly-pro" | "semester-pass";
  guestRemaining?: number;
}

interface Props {
  userEmail: string;
  onBooked: () => void;
  onAddVehicle: () => void;
}

const PICKUP_LOCATIONS = [
  { value: "gleason-circle", label: "Gleason Circle Bus Stop" },
  { value: "sentinel", label: "Sentinel" },
  { value: "ntid", label: "NTID Bus Stop" },
  { value: "north-bus-shelter", label: "North Bus Shelter" },
  { value: "slaughter-hall", label: "Slaughter Hall Bus Stop" },
  { value: "kimball-loop", label: "Kimball Loop" },
  { value: "global-village", label: "Global Village Bus Stop" },
];

const TIER_LABEL: Record<string, string> = {
  "monthly-pro": "Monthly Pro",
  "semester-pass": "Semester Pass",
};

const QuickBookCard = ({ userEmail, onBooked, onAddVehicle }: Props) => {
  const [vehicles, setVehicles] = useState<SavedVehicle[]>([]);
  const [profile, setProfile] = useState<SavedProfile | null>(null);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [vehicleId, setVehicleId] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    const [{ data: vData }, { data: pData }, { data: mData }] = await Promise.all([
      supabase
        .from("customer_vehicles")
        .select("*")
        .eq("customer_email", userEmail)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false }),
      supabase
        .from("customer_profiles")
        .select("first_name,last_name,phone,default_pickup_location")
        .eq("customer_email", userEmail)
        .maybeSingle(),
      supabase.functions.invoke("check-membership", { body: { email: userEmail } }),
    ]);
    const list = (vData as SavedVehicle[]) || [];
    setVehicles(list);
    setProfile((pData as SavedProfile) || null);
    setMembership((mData as Membership) || { isMember: false });
    const def = list.find((v) => v.is_default) || list[0];
    if (def) setVehicleId(def.id);
    if (pData?.default_pickup_location) setLocation(pData.default_pickup_location);
    setLoading(false);
  };

  useEffect(() => {
    if (userEmail) loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  const handleQuickBook = async () => {
    const v = vehicles.find((x) => x.id === vehicleId);
    if (!v) {
      toast({ title: "Pick a vehicle", variant: "destructive" });
      return;
    }
    if (!location) {
      toast({ title: "Pick a location", variant: "destructive" });
      return;
    }
    if (!profile?.first_name || !profile?.last_name || !profile?.phone) {
      toast({
        title: "Profile incomplete",
        description: "Add your name & phone in the New Request tab once — we'll save it.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("parking_requests").insert({
      email: userEmail,
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone: profile.phone,
      vehicle_make: v.vehicle_make,
      vehicle_model: v.vehicle_model,
      vehicle_color: v.vehicle_color,
      license_plate: v.license_plate,
      license_plate_state: v.license_plate_state,
      pickup_location: location,
      service_type: membership?.isMember ? "membership" : "single",
      special_instructions: notes || null,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Booking failed", description: error.message, variant: "destructive" });
      return;
    }
    setNotes("");
    toast({
      title: "Valet requested!",
      description: membership?.isMember
        ? "Covered by your membership — staff is on the way."
        : "Staff will be in touch to confirm payment.",
    });
    onBooked();
  };

  if (loading) {
    return (
      <Card className="glass-card border-border/50">
        <CardContent className="py-10 flex items-center justify-center text-muted-foreground gap-2 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading your saved details…
        </CardContent>
      </Card>
    );
  }

  const noVehicles = vehicles.length === 0;
  const profileIncomplete = !profile?.first_name || !profile?.last_name || !profile?.phone;

  return (
    <Card className="glass-card border-secondary/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <CardTitle className="font-display flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5 text-secondary" />
              Quick Book
            </CardTitle>
            <CardDescription>One-tap valet using your saved details</CardDescription>
          </div>
          {membership?.isMember && (
            <Badge variant="secondary" className="gap-1">
              <Crown className="w-3 h-3" />
              {TIER_LABEL[membership.tier!]}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {noVehicles || profileIncomplete ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center space-y-3">
            <Car className="w-8 h-8 text-muted-foreground/50 mx-auto" />
            <p className="text-sm text-muted-foreground">
              {noVehicles
                ? "No saved vehicles yet. Submit one full request and we'll save it for one-tap booking next time."
                : "Finish your profile (name + phone) once and we'll remember it."}
            </p>
            <Button variant="secondary" size="sm" onClick={onAddVehicle} className="gap-1">
              <Plus className="w-3 h-3" />
              {noVehicles ? "Add a Vehicle" : "Complete Profile"}
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-1.5">
              <Label>Vehicle</Label>
              <Select value={vehicleId} onValueChange={setVehicleId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.nickname ? `${v.nickname} — ` : ""}
                      {v.vehicle_color} {v.vehicle_make} {v.vehicle_model} • {v.license_plate}
                      {v.is_default ? " ★" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Pickup Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  {PICKUP_LOCATIONS.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Notes (optional)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything the valet should know?"
                rows={2}
              />
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={handleQuickBook}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Booking…
                </>
              ) : (
                <>
                  <CarLogo className="w-4 h-4 mr-2" /> Request Valet
                </>
              )}
            </Button>

            {membership?.isMember && (
              <p className="text-[11px] text-center text-muted-foreground">
                This request will be covered by your {TIER_LABEL[membership.tier!]} membership.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickBookCard;