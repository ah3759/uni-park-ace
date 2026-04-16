import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Car } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import VehicleSelector from "@/components/VehicleSelector";
import { US_STATES } from "@/data/usStates";

interface PricingCheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: {
    id: string;
    name: string;
    price: string;
    period: string;
  } | null;
}

const PICKUP_LOCATIONS = [
  { value: "main_entrance", label: "Main Entrance" },
  { value: "north_gate", label: "North Gate" },
  { value: "south_parking", label: "South Parking" },
  { value: "east_wing", label: "East Wing" },
  { value: "west_plaza", label: "West Plaza" },
];

const SERVICE_TYPE_MAP: Record<string, string> = {
  "pay-per-use": "single",
  "monthly-pro": "monthly",
  "semester-pass": "semester",
};

const PricingCheckoutModal = ({ open, onOpenChange, plan }: PricingCheckoutModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_year: "",
    vehicle_color: "",
    license_plate: "",
    license_plate_state: "",
    pickup_location: "",
    special_instructions: "",
  });

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;

    const required = ["first_name", "last_name", "email", "phone", "vehicle_make", "vehicle_model", "vehicle_year", "vehicle_color", "license_plate", "license_plate_state", "pickup_location"];
    const missing = required.filter((k) => !form[k as keyof typeof form]);
    if (missing.length) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    // 1. Insert the parking request
    const serviceType = SERVICE_TYPE_MAP[plan.id] || "single";
    const { error: insertError } = await supabase.from("parking_requests").insert({
      email: form.email,
      first_name: form.first_name,
      last_name: form.last_name,
      phone: form.phone,
      vehicle_make: form.vehicle_make,
      vehicle_model: form.vehicle_model,
      vehicle_color: form.vehicle_color,
      license_plate: form.license_plate,
      license_plate_state: form.license_plate_state,
      pickup_location: form.pickup_location,
      service_type: serviceType,
      special_instructions: form.special_instructions || null,
    });

    if (insertError) {
      toast({ title: "Failed to submit request", description: insertError.message, variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    // 2. Create Stripe checkout session
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { planId: plan.id },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.assign(data.url);
        return;
      }
      throw new Error("No checkout URL returned");
    } catch (err: any) {
      toast({
        title: "Payment redirect failed",
        description: err.message || "Your request was saved. Please try paying again.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  if (!plan) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Car className="w-5 h-5 text-secondary" />
            {plan.name} — {plan.price} {plan.period}
          </DialogTitle>
          <DialogDescription>
            Fill in your details to submit a valet request and proceed to payment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Personal Info */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="modal-fn">First Name *</Label>
              <Input id="modal-fn" value={form.first_name} onChange={(e) => update("first_name", e.target.value)} placeholder="First name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="modal-ln">Last Name *</Label>
              <Input id="modal-ln" value={form.last_name} onChange={(e) => update("last_name", e.target.value)} placeholder="Last name" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="modal-email">Email *</Label>
              <Input id="modal-email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="modal-phone">Phone *</Label>
              <Input id="modal-phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="(555) 123-4567" />
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="grid sm:grid-cols-3 gap-3">
            <VehicleSelector
              make={form.vehicle_make}
              model={form.vehicle_model}
              year={form.vehicle_year}
              onMakeChange={(v) => update("vehicle_make", v)}
              onModelChange={(v) => update("vehicle_model", v)}
              onYearChange={(v) => update("vehicle_year", v)}
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="modal-color">Color *</Label>
              <Input id="modal-color" value={form.vehicle_color} onChange={(e) => update("vehicle_color", e.target.value)} placeholder="e.g. White" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="modal-plate">Plate *</Label>
              <Input id="modal-plate" value={form.license_plate} onChange={(e) => update("license_plate", e.target.value)} placeholder="ABC-1234" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="modal-state">State *</Label>
              <Select value={form.license_plate_state} onValueChange={(v) => update("license_plate_state", v)}>
                <SelectTrigger><SelectValue placeholder="State" /></SelectTrigger>
                <SelectContent>
                  {US_STATES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <Label>Pickup Location *</Label>
            <Select value={form.pickup_location} onValueChange={(v) => update("pickup_location", v)}>
              <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
              <SelectContent>
                {PICKUP_LOCATIONS.map((loc) => (
                  <SelectItem key={loc.value} value={loc.value}>{loc.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Special Instructions */}
          <div className="space-y-1.5">
            <Label htmlFor="modal-instructions">Special Instructions</Label>
            <Textarea
              id="modal-instructions"
              value={form.special_instructions}
              onChange={(e) => update("special_instructions", e.target.value)}
              placeholder="Any special notes..."
              rows={2}
            />
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Continue to Payment — ${plan.price}`
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PricingCheckoutModal;
