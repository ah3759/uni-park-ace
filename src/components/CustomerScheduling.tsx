import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import VehicleSelector from "@/components/VehicleSelector";
import { US_STATES } from "@/data/usStates";
import CarLogo from "@/components/CarLogo";

const timeSlots = [
  "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00", "20:30", "21:00",
];

interface CustomerSchedulingProps {
  onSuccess?: () => void;
}

const CustomerScheduling = ({ onSuccess }: CustomerSchedulingProps = {}) => {
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_year: "",
    vehicle_color: "",
    license_plate: "",
    license_plate_state: "",
    pickup_location: "",
    scheduled_time: "",
    special_instructions: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const required = [
      "customer_name", "customer_email", "customer_phone",
      "vehicle_make", "vehicle_model", "vehicle_year", "vehicle_color",
      "license_plate", "license_plate_state", "pickup_location", "scheduled_time",
    ];
    const missing = required.filter((k) => !form[k as keyof typeof form]);
    if (missing.length || !date) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("valet_schedules" as any).insert({
      customer_name: form.customer_name,
      customer_email: form.customer_email,
      customer_phone: form.customer_phone,
      vehicle_make: form.vehicle_make,
      vehicle_model: form.vehicle_model,
      vehicle_color: form.vehicle_color,
      license_plate: form.license_plate,
      license_plate_state: form.license_plate_state,
      pickup_location: form.pickup_location,
      scheduled_date: format(date, "yyyy-MM-dd"),
      scheduled_time: form.scheduled_time,
      special_instructions: form.special_instructions || null,
    } as any);
    setIsSubmitting(false);

    if (error) {
      toast({ title: "Failed to schedule", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Valet Scheduled!", description: `Your pickup is set for ${format(date, "PPP")} at ${form.scheduled_time}.` });
      setForm({
        customer_name: "", customer_email: "", customer_phone: "",
        vehicle_make: "", vehicle_model: "", vehicle_year: "", vehicle_color: "",
        license_plate: "", license_plate_state: "", pickup_location: "", scheduled_time: "",
        special_instructions: "",
      });
      setDate(undefined);
      onSuccess?.();
    }
  };

  return (
    <section id="schedule" className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
            <CalendarIcon className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">Schedule a Pickup</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Book Your <span className="text-gradient">Valet Service</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Pick a date and time, and we'll have a valet ready for you. No waiting, no hassle.
          </p>
        </div>

        <Card className="max-w-3xl mx-auto glass-card border-border/50">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <CarLogo className="w-5 h-5 text-secondary" />
              Schedule Valet Pickup
            </CardTitle>
            <CardDescription>Choose your preferred date, time, and provide vehicle details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date & Time */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-secondary" />
                  Date & Time
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Pickup Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(d) => d < new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Pickup Time *</Label>
                    <Select value={form.scheduled_time} onValueChange={(v) => update("scheduled_time", v)}>
                      <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Personal Information</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Full Name *</Label>
                    <Input value={form.customer_name} onChange={(e) => update("customer_name", e.target.value)} placeholder="Your full name" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Email *</Label>
                    <Input type="email" value={form.customer_email} onChange={(e) => update("customer_email", e.target.value)} placeholder="you@email.com" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Phone *</Label>
                    <Input value={form.customer_phone} onChange={(e) => update("customer_phone", e.target.value)} placeholder="(555) 123-4567" />
                  </div>
                </div>
              </div>

              {/* Vehicle Info */}
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
                    <Label>Color *</Label>
                    <Input value={form.vehicle_color} onChange={(e) => update("vehicle_color", e.target.value)} placeholder="e.g. White" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>License Plate *</Label>
                    <Input value={form.license_plate} onChange={(e) => update("license_plate", e.target.value)} placeholder="e.g. ABC-1234" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Plate State *</Label>
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

              {/* Location */}
              <div className="space-y-1.5">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-secondary" />
                  Pickup Location *
                </Label>
                <Select value={form.pickup_location} onValueChange={(v) => update("pickup_location", v)}>
                  <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gleason-circle">Gleason Circle Bus Stop</SelectItem>
                    <SelectItem value="sentinel">Sentinel</SelectItem>
                    <SelectItem value="ntid">NTID Bus Stop</SelectItem>
                    <SelectItem value="north-bus-shelter">North Bus Shelter</SelectItem>
                    <SelectItem value="slaughter-hall">Slaughter Hall Bus Stop</SelectItem>
                    <SelectItem value="kimball-loop">Kimball Loop</SelectItem>
                    <SelectItem value="global-village">Global Village Bus Stop</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Special Instructions */}
              <div className="space-y-1.5">
                <Label>Special Instructions</Label>
                <Textarea
                  value={form.special_instructions}
                  onChange={(e) => update("special_instructions", e.target.value)}
                  placeholder="Any special notes for the valet..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                <CalendarIcon className="w-4 h-4 mr-2" />
                {isSubmitting ? "Scheduling..." : "Schedule Valet Pickup"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CustomerScheduling;
