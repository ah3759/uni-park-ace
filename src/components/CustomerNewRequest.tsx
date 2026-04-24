import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Car, Trash2, Star } from "lucide-react";
import VehicleSelector from "@/components/VehicleSelector";
import { US_STATES } from "@/data/usStates";
import CarLogo from "@/components/CarLogo";
import { LOCATION_LABELS } from "@/components/schedule/scheduleConstants";

interface CustomerNewRequestProps {
  userEmail: string;
  onSuccess: () => void;
}

const CustomerNewRequest = ({ userEmail, onSuccess }: CustomerNewRequestProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedVehicles, setSavedVehicles] = useState<any[]>([]);
  const [pickedSavedId, setPickedSavedId] = useState<string>("");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_year: "",
    vehicle_color: "",
    license_plate: "",
    license_plate_state: "",
    pickup_location: "",
    service_type: "single",
    special_instructions: "",
  });

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Prefill from saved profile + load saved vehicles
  useEffect(() => {
    if (!userEmail) return;
    (async () => {
      const [{ data: profile }, { data: vehicles }] = await Promise.all([
        supabase
          .from("customer_profiles")
          .select("*")
          .eq("customer_email", userEmail)
          .maybeSingle(),
        supabase
          .from("customer_vehicles")
          .select("*")
          .eq("customer_email", userEmail)
          .order("is_default", { ascending: false })
          .order("created_at", { ascending: false }),
      ]);
      if (profile) {
        setForm((prev) => ({
          ...prev,
          first_name: profile.first_name || prev.first_name,
          last_name: profile.last_name || prev.last_name,
          phone: profile.phone || prev.phone,
          pickup_location: profile.default_pickup_location || prev.pickup_location,
        }));
      }
      setSavedVehicles(vehicles || []);
    })();
  }, [userEmail]);

  const applySavedVehicle = (id: string) => {
    setPickedSavedId(id);
    if (id === "__new__") {
      setForm((p) => ({
        ...p,
        vehicle_make: "",
        vehicle_model: "",
        vehicle_year: "",
        vehicle_color: "",
        license_plate: "",
        license_plate_state: "",
      }));
      return;
    }
    const v = savedVehicles.find((x) => x.id === id);
    if (!v) return;
    setForm((p) => ({
      ...p,
      vehicle_make: v.vehicle_make || "",
      vehicle_model: v.vehicle_model || "",
      vehicle_year: v.vehicle_year || "",
      vehicle_color: v.vehicle_color || "",
      license_plate: v.license_plate || "",
      license_plate_state: v.license_plate_state || "",
    }));
  };

  const deleteSavedVehicle = async (id: string) => {
    const { error } = await supabase.from("customer_vehicles").delete().eq("id", id);
    if (error) {
      toast({ title: "Couldn't remove vehicle", description: error.message, variant: "destructive" });
      return;
    }
    setSavedVehicles((prev) => prev.filter((v) => v.id !== id));
    if (pickedSavedId === id) setPickedSavedId("");
    toast({ title: "Vehicle removed" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const required = ["first_name", "last_name", "phone", "vehicle_make", "vehicle_model", "vehicle_year", "vehicle_color", "license_plate", "license_plate_state", "pickup_location"];
    const missing = required.filter((k) => !form[k as keyof typeof form]);
    if (missing.length) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("parking_requests").insert({
      email: userEmail,
      first_name: form.first_name,
      last_name: form.last_name,
      phone: form.phone,
      vehicle_make: form.vehicle_make,
      vehicle_model: form.vehicle_model,
      vehicle_color: form.vehicle_color,
      license_plate: form.license_plate,
      license_plate_state: form.license_plate_state,
      pickup_location: form.pickup_location,
      service_type: form.service_type,
      special_instructions: form.special_instructions || null,
    });

    if (error) {
      setIsSubmitting(false);
      toast({ title: "Failed to submit request", description: error.message, variant: "destructive" });
      return;
    }

    // Save profile (upsert) + vehicle for future quick-book
    await supabase.from("customer_profiles").upsert(
      {
        customer_email: userEmail,
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
        default_pickup_location: form.pickup_location,
      },
      { onConflict: "customer_email" }
    );

    // Only insert a saved vehicle if not already saved (unique on email + license_plate)
    const exists = savedVehicles.some(
      (v) => v.license_plate?.toLowerCase() === form.license_plate.toLowerCase()
    );
    if (!exists) {
      const { data: newV } = await supabase
        .from("customer_vehicles")
        .insert({
          customer_email: userEmail,
          vehicle_make: form.vehicle_make,
          vehicle_model: form.vehicle_model,
          vehicle_year: form.vehicle_year || null,
          vehicle_color: form.vehicle_color,
          license_plate: form.license_plate,
          license_plate_state: form.license_plate_state,
          is_default: savedVehicles.length === 0,
        })
        .select()
        .single();
      if (newV) setSavedVehicles((prev) => [newV, ...prev]);
    }

    setIsSubmitting(false);
    toast({ title: "Request submitted!", description: "Vehicle saved for one-tap booking next time." });
    setForm((p) => ({ ...p, special_instructions: "" }));
    onSuccess();
  };

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Plus className="w-5 h-5 text-secondary" />
          New Valet Request
        </CardTitle>
        <CardDescription>
          {savedVehicles.length > 0
            ? "Pick a saved vehicle, or add a new one. Your name & phone are remembered."
            : "First time? Fill this out — we'll remember your details for next time."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Saved vehicles picker */}
          {savedVehicles.length > 0 && (
            <div className="space-y-2 rounded-lg border border-border/60 bg-muted/30 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Car className="w-4 h-4 text-secondary" />
                Use a saved vehicle
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {savedVehicles.map((v) => (
                  <div
                    key={v.id}
                    className={`rounded-md border p-2 text-xs flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                      pickedSavedId === v.id
                        ? "border-secondary bg-secondary/10"
                        : "border-border bg-background/60 hover:border-secondary/40"
                    }`}
                    onClick={() => applySavedVehicle(v.id)}
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-foreground truncate flex items-center gap-1">
                        {v.is_default && <Star className="w-3 h-3 text-secondary fill-secondary" />}
                        {v.vehicle_color} {v.vehicle_make} {v.vehicle_model}
                      </div>
                      <div className="text-muted-foreground">{v.license_plate}</div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSavedVehicle(v.id);
                      }}
                      className="text-muted-foreground hover:text-destructive p-1"
                      aria-label="Remove vehicle"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => applySavedVehicle("__new__")}
                  className={`rounded-md border border-dashed p-2 text-xs flex items-center justify-center gap-1 transition-colors ${
                    pickedSavedId === "__new__"
                      ? "border-secondary bg-secondary/10 text-secondary"
                      : "border-border text-muted-foreground hover:border-secondary/40 hover:text-foreground"
                  }`}
                >
                  <Plus className="w-3 h-3" /> Add a new vehicle
                </button>
              </div>
            </div>
          )}

          {/* Personal Info */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Personal Information</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="cr-fn">First Name *</Label>
                <Input id="cr-fn" value={form.first_name} onChange={(e) => update("first_name", e.target.value)} placeholder="First name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cr-ln">Last Name *</Label>
                <Input id="cr-ln" value={form.last_name} onChange={(e) => update("last_name", e.target.value)} placeholder="Last name" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="cr-phone">Phone *</Label>
                <Input id="cr-phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="(555) 123-4567" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Vehicle Information</h4>
            <div className="grid sm:grid-cols-3 gap-4">
              <VehicleSelector
                make={form.vehicle_make}
                model={form.vehicle_model}
                year={form.vehicle_year}
                onMakeChange={(v) => update("vehicle_make", v)}
                onModelChange={(v) => update("vehicle_model", v)}
                onYearChange={(v) => update("vehicle_year", v)}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="space-y-1.5">
                <Label htmlFor="cr-color">Color *</Label>
                <Input id="cr-color" value={form.vehicle_color} onChange={(e) => update("vehicle_color", e.target.value)} placeholder="e.g. White" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cr-plate">License Plate *</Label>
                <Input id="cr-plate" value={form.license_plate} onChange={(e) => update("license_plate", e.target.value)} placeholder="e.g. ABC-1234" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cr-plate-state">Plate State *</Label>
                <Select value={form.license_plate_state} onValueChange={(v) => update("license_plate_state", v)}>
                  <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Location & Service */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Pickup Location *</Label>
              <Select value={form.pickup_location} onValueChange={(v) => update("pickup_location", v)}>
                <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(LOCATION_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Service Type</Label>
              <Select value={form.service_type} onValueChange={(v) => update("service_type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Use</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="semester">Semester</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="space-y-1.5">
            <Label htmlFor="cr-instructions">Special Instructions</Label>
            <Textarea
              id="cr-instructions"
              value={form.special_instructions}
              onChange={(e) => update("special_instructions", e.target.value)}
              placeholder="Any special notes for the valet..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <CarLogo className="w-4 h-4 mr-2" />
            {isSubmitting ? "Submitting..." : "Submit Valet Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomerNewRequest;
