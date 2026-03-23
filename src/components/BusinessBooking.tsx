import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Building2, Users, Mail } from "lucide-react";
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

const BusinessBooking = () => {
  const [eventDate, setEventDate] = useState<Date>();
  const [eventEndDate, setEventEndDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    business_name: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    event_type: "",
    expected_guests: "",
    venue_location: "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_year: "",
    vehicle_color: "",
    license_plate: "",
    additional_details: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const required = [
      "business_name", "contact_name", "contact_email",
      "contact_phone", "event_type", "expected_guests", "venue_location",
    ];
    const missing = required.filter((k) => !form[k as keyof typeof form]);
    if (missing.length || !eventDate) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    const guests = parseInt(form.expected_guests);
    if (isNaN(guests) || guests < 1) {
      toast({ title: "Please enter a valid number of guests", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("business_inquiries" as any).insert({
      business_name: form.business_name,
      contact_name: form.contact_name,
      contact_email: form.contact_email,
      contact_phone: form.contact_phone,
      event_type: form.event_type,
      event_date: format(eventDate, "yyyy-MM-dd"),
      event_end_date: eventEndDate ? format(eventEndDate, "yyyy-MM-dd") : null,
      expected_guests: guests,
      venue_location: form.venue_location,
      additional_details: form.additional_details || null,
    } as any);
    setIsSubmitting(false);

    if (error) {
      toast({ title: "Failed to submit inquiry", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Inquiry Submitted!", description: "We'll be in touch within 24 hours to discuss your event." });
      setForm({
        business_name: "", contact_name: "", contact_email: "",
        contact_phone: "", event_type: "", expected_guests: "",
        venue_location: "", vehicle_make: "", vehicle_model: "",
        vehicle_year: "", vehicle_color: "", license_plate: "",
        additional_details: "",
      });
      setEventDate(undefined);
      setEventEndDate(undefined);
    }
  };

  return (
    <section id="business-booking" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Building2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Business & Events</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Plan Your <span className="text-gradient">Event Valet</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Hosting an event? Book our valet service for your guests. Choose your dates and we'll create a custom package.
          </p>
        </div>

        <Card className="max-w-3xl mx-auto glass-card border-border/50">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Event Valet Inquiry
            </CardTitle>
            <CardDescription>Tell us about your event and we'll put together a custom valet plan</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Business Info */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  Business Information
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Business / Organization Name *</Label>
                    <Input value={form.business_name} onChange={(e) => update("business_name", e.target.value)} placeholder="Your organization" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Contact Name *</Label>
                    <Input value={form.contact_name} onChange={(e) => update("contact_name", e.target.value)} placeholder="Your name" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Email *</Label>
                    <Input type="email" value={form.contact_email} onChange={(e) => update("contact_email", e.target.value)} placeholder="you@company.com" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Phone *</Label>
                    <Input value={form.contact_phone} onChange={(e) => update("contact_phone", e.target.value)} placeholder="(555) 123-4567" />
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  Event Details
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Event Type *</Label>
                    <Select value={form.event_type} onValueChange={(v) => update("event_type", v)}>
                      <SelectTrigger><SelectValue placeholder="Select event type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corporate">Corporate Event</SelectItem>
                        <SelectItem value="wedding">Wedding</SelectItem>
                        <SelectItem value="gala">Gala / Fundraiser</SelectItem>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="sports">Sporting Event</SelectItem>
                        <SelectItem value="concert">Concert / Performance</SelectItem>
                        <SelectItem value="private">Private Party</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      Expected Guests *
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      value={form.expected_guests}
                      onChange={(e) => update("expected_guests", e.target.value)}
                      placeholder="e.g. 200"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-1.5">
                    <Label>Event Start Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !eventDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {eventDate ? format(eventDate, "PPP") : "Select start date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={eventDate}
                          onSelect={setEventDate}
                          disabled={(d) => d < new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Event End Date (optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !eventEndDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {eventEndDate ? format(eventEndDate, "PPP") : "Select end date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={eventEndDate}
                          onSelect={setEventEndDate}
                          disabled={(d) => d < (eventDate || new Date())}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Venue / Location */}
              <div className="space-y-1.5">
                <Label>Pickup / Venue Location *</Label>
                <Select value={form.venue_location} onValueChange={(v) => update("venue_location", v)}>
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

              {/* Vehicle Info */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  Vehicle Information (Optional)
                </h4>
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
                    <Label>Color</Label>
                    <Input value={form.vehicle_color} onChange={(e) => update("vehicle_color", e.target.value)} placeholder="e.g. White" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>License Plate</Label>
                    <Input value={form.license_plate} onChange={(e) => update("license_plate", e.target.value)} placeholder="e.g. ABC-1234" />
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-1.5">
                <Label>Additional Details</Label>
                <Textarea
                  value={form.additional_details}
                  onChange={(e) => update("additional_details", e.target.value)}
                  placeholder="Tell us more about your event, special requirements, branding needs..."
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                <Mail className="w-4 h-4 mr-2" />
                {isSubmitting ? "Submitting..." : "Submit Event Inquiry"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BusinessBooking;
