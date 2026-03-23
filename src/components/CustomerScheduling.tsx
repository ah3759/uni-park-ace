import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock, Car, MapPin } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const timeSlots = [
  "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00", "20:30", "21:00",
];

const CustomerScheduling = () => {
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
      "vehicle_make", "vehicle_model", "vehicle_color",
      "license_plate", "pickup_location", "scheduled_time",
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
        vehicle_make: "", vehicle_model: "", vehicle_color: "",
        license_plate: "", pickup_location: "", scheduled_time: "",
        special_instructions: "",
      });
      setDate(undefined);
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
              <Car className="w-5 h-5 text-secondary" />
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
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Make *</Label>
                    <Input value={form.vehicle_make} onChange={(e) => update("vehicle_make", e.target.value)} placeholder="e.g. Toyota" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Model *</Label>
                    <Input value={form.vehicle_model} onChange={(e) => update("vehicle_model", e.target.value)} placeholder="e.g. Camry" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Color *</Label>
                    <Input value={form.vehicle_color} onChange={(e) => update("vehicle_color", e.target.value)} placeholder="e.g. White" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>License Plate *</Label>
                    <Input value={form.license_plate} onChange={(e) => update("license_plate", e.target.value)} placeholder="e.g. ABC-1234" />
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
                    <SelectItem value="main_entrance">Main Entrance</SelectItem>
                    <SelectItem value="north_gate">North Gate</SelectItem>
                    <SelectItem value="south_parking">South Parking</SelectItem>
                    <SelectItem value="east_wing">East Wing</SelectItem>
                    <SelectItem value="west_plaza">West Plaza</SelectItem>
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
