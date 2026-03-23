import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Car, User, Phone, Mail, Clock, MapPin } from "lucide-react";
import VehicleSelector from "@/components/VehicleSelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const parkingFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  lastName: z.string().trim().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(20, "Phone number must be less than 20 characters"),
  vehicleMake: z.string().trim().min(1, "Vehicle make is required").max(50, "Vehicle make must be less than 50 characters"),
  vehicleModel: z.string().trim().min(1, "Vehicle model is required").max(50, "Vehicle model must be less than 50 characters"),
  vehicleColor: z.string().trim().min(1, "Vehicle color is required").max(30, "Vehicle color must be less than 30 characters"),
  licensePlate: z.string().trim().min(1, "License plate is required").max(15, "License plate must be less than 15 characters"),
  pickupLocation: z.string().min(1, "Pickup location is required"),
  serviceType: z.enum(["single", "monthly", "semester"]),
  specialInstructions: z.string().max(500, "Special instructions must be less than 500 characters").optional(),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms"),
});

type ParkingFormData = z.infer<typeof parkingFormSchema>;

const ParkingForm = () => {
  const [formData, setFormData] = useState<Partial<ParkingFormData>>({
    serviceType: "single",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof ParkingFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const validatedData = parkingFormSchema.parse(formData);

      const { error: dbError } = await supabase.from("parking_requests").insert({
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        vehicle_make: validatedData.vehicleMake,
        vehicle_model: validatedData.vehicleModel,
        vehicle_color: validatedData.vehicleColor,
        license_plate: validatedData.licensePlate,
        pickup_location: validatedData.pickupLocation,
        service_type: validatedData.serviceType,
        special_instructions: validatedData.specialInstructions || null,
      });

      if (dbError) throw dbError;

      toast({
        title: "Parking Request Submitted!",
        description: "We'll send you a confirmation email shortly.",
      });

      setFormData({
        serviceType: "single",
        agreeToTerms: false,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="parking-form" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Request <span className="text-gradient">Valet Service</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Fill out the form below to request our premium valet parking service. We'll confirm your booking within minutes.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto glass-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5 text-secondary" />
              Parking Request Form
            </CardTitle>
            <CardDescription>
              Please provide your contact and vehicle information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <User className="w-4 h-4 text-secondary" />
                  Personal Information
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName || ""}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className={errors.firstName ? "border-destructive" : ""}
                    />
                    {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName || ""}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className={errors.lastName ? "border-destructive" : ""}
                    />
                    {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@university.edu"
                      value={formData.email || ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Phone *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone || ""}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Car className="w-4 h-4 text-secondary" />
                  Vehicle Information
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleMake">Make *</Label>
                    <Input
                      id="vehicleMake"
                      placeholder="Toyota"
                      value={formData.vehicleMake || ""}
                      onChange={(e) => handleInputChange("vehicleMake", e.target.value)}
                      className={errors.vehicleMake ? "border-destructive" : ""}
                    />
                    {errors.vehicleMake && <p className="text-sm text-destructive">{errors.vehicleMake}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vehicleModel">Model *</Label>
                    <Input
                      id="vehicleModel"
                      placeholder="Camry"
                      value={formData.vehicleModel || ""}
                      onChange={(e) => handleInputChange("vehicleModel", e.target.value)}
                      className={errors.vehicleModel ? "border-destructive" : ""}
                    />
                    {errors.vehicleModel && <p className="text-sm text-destructive">{errors.vehicleModel}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleColor">Color *</Label>
                    <Input
                      id="vehicleColor"
                      placeholder="Silver"
                      value={formData.vehicleColor || ""}
                      onChange={(e) => handleInputChange("vehicleColor", e.target.value)}
                      className={errors.vehicleColor ? "border-destructive" : ""}
                    />
                    {errors.vehicleColor && <p className="text-sm text-destructive">{errors.vehicleColor}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="licensePlate">License Plate *</Label>
                    <Input
                      id="licensePlate"
                      placeholder="ABC-1234"
                      value={formData.licensePlate || ""}
                      onChange={(e) => handleInputChange("licensePlate", e.target.value.toUpperCase())}
                      className={errors.licensePlate ? "border-destructive" : ""}
                    />
                    {errors.licensePlate && <p className="text-sm text-destructive">{errors.licensePlate}</p>}
                  </div>
                </div>
              </div>

              {/* Pickup Location */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <MapPin className="w-4 h-4 text-secondary" />
                  Pickup Location
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickupLocation">Select Location *</Label>
                  <Select
                    value={formData.pickupLocation || ""}
                    onValueChange={(value) => handleInputChange("pickupLocation", value)}
                  >
                    <SelectTrigger className={errors.pickupLocation ? "border-destructive" : ""}>
                      <SelectValue placeholder="Choose a pickup location" />
                    </SelectTrigger>
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
                  {errors.pickupLocation && <p className="text-sm text-destructive">{errors.pickupLocation}</p>}
                </div>
              </div>

              {/* Service Type */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Clock className="w-4 h-4 text-secondary" />
                  Service Type
                </div>
                
                <RadioGroup
                  value={formData.serviceType}
                  onValueChange={(value) => handleInputChange("serviceType", value)}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border/50 hover:border-secondary/50 transition-colors">
                    <RadioGroupItem value="single" id="single" />
                    <Label htmlFor="single" className="cursor-pointer">
                      <span className="font-medium">Single Use</span>
                      <p className="text-xs text-muted-foreground">$8 per use</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border/50 hover:border-secondary/50 transition-colors">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly" className="cursor-pointer">
                      <span className="font-medium">Monthly</span>
                      <p className="text-xs text-muted-foreground">$99/month</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border/50 hover:border-secondary/50 transition-colors">
                    <RadioGroupItem value="semester" id="semester" />
                    <Label htmlFor="semester" className="cursor-pointer">
                      <span className="font-medium">Semester</span>
                      <p className="text-xs text-muted-foreground">$399/semester</p>
                    </Label>
                  </div>
                </RadioGroup>
                {errors.serviceType && <p className="text-sm text-destructive">{errors.serviceType}</p>}
              </div>

              {/* Special Instructions */}
              <div className="space-y-2">
                <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                <Textarea
                  id="specialInstructions"
                  placeholder="Any special requests or notes about your vehicle..."
                  value={formData.specialInstructions || ""}
                  onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                  className="min-h-[100px]"
                />
                {errors.specialInstructions && <p className="text-sm text-destructive">{errors.specialInstructions}</p>}
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms || false}
                  onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="agreeToTerms" className="text-sm cursor-pointer">
                    I agree to the <a href="#" className="text-secondary hover:underline">Terms of Service</a> and <a href="#" className="text-secondary hover:underline">Privacy Policy</a> *
                  </Label>
                  {errors.agreeToTerms && <p className="text-sm text-destructive">{errors.agreeToTerms}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Parking Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ParkingForm;
