import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import VehicleSelector from "@/components/VehicleSelector";
import { US_STATES } from "@/data/usStates";
import CarLogo from "@/components/CarLogo";

interface CustomerNewRequestProps {
  userEmail: string;
  onSuccess: () => void;
}

const CustomerNewRequest = ({ userEmail, onSuccess }: CustomerNewRequestProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    setIsSubmitting(false);

    if (error) {
      toast({ title: "Failed to submit request", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Request submitted!", description: "Your valet request has been placed." });
      setForm({
        first_name: "", last_name: "", phone: "",
        vehicle_make: "", vehicle_model: "", vehicle_year: "", vehicle_color: "",
        license_plate: "", license_plate_state: "", pickup_location: "", service_type: "single",
        special_instructions: "",
      });
      onSuccess();
    }
  };

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Plus className="w-5 h-5 text-secondary" />
          New Valet Request
        </CardTitle>
        <CardDescription>Add a vehicle and request valet service</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
                  <SelectItem value="main_entrance">Main Entrance</SelectItem>
                  <SelectItem value="north_gate">North Gate</SelectItem>
                  <SelectItem value="south_parking">South Parking</SelectItem>
                  <SelectItem value="east_wing">East Wing</SelectItem>
                  <SelectItem value="west_plaza">West Plaza</SelectItem>
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
