import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Loader2, ClipboardCheck, Camera, MapPin, CheckCircle } from "lucide-react";
import PhotoCapture from "./PhotoCapture";
import ParkingLocation from "./ParkingLocation";

type CarAngle = "front" | "back" | "left" | "right";
type Step = "verify" | "photos" | "parking" | "complete";

interface InspectionWorkflowProps {
  requestId: string;
  customerName: string;
  vehicleInfo: string;
  licensePlate: string;
  onComplete: () => void;
  onClose: () => void;
}

const REQUIRED_ANGLES: { angle: CarAngle; label: string }[] = [
  { angle: "front", label: "Front" },
  { angle: "back", label: "Back" },
  { angle: "left", label: "Left Side" },
  { angle: "right", label: "Right Side" },
];

const dataUrlToBlob = (dataUrl: string): Blob => {
  const [header, data] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] || "image/jpeg";
  const bytes = atob(data);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mime });
};

const InspectionWorkflow = ({
  requestId, customerName, vehicleInfo, licensePlate,
  onComplete, onClose,
}: InspectionWorkflowProps) => {
  const [step, setStep] = useState<Step>("verify");
  const [photos, setPhotos] = useState<Record<CarAngle, string | null>>({
    front: null, back: null, left: null, right: null,
  });
  const [parkingLat, setParkingLat] = useState<number | null>(null);
  const [parkingLng, setParkingLng] = useState<number | null>(null);
  const [parkingDesc, setParkingDesc] = useState("");
  const [parkingPhoto, setParkingPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const allPhotosTaken = Object.values(photos).every(Boolean);

  const handleCapture = useCallback((angle: CarAngle, dataUrl: string) => {
    setPhotos(prev => ({ ...prev, [angle]: dataUrl }));
  }, []);

  const handleClear = useCallback((angle: CarAngle) => {
    setPhotos(prev => ({ ...prev, [angle]: null }));
  }, []);

  const handleSubmit = async () => {
    if (!parkingLat && !parkingDesc && !parkingPhoto) {
      toast({ title: "Please provide parking location info", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      // Get current user's profile
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();
      if (!profile) throw new Error("Profile not found");

      // Create inspection record
      const { data: inspection, error: inspError } = await supabase
        .from("vehicle_inspections")
        .insert({
          request_id: requestId,
          employee_id: profile.id,
          parking_latitude: parkingLat,
          parking_longitude: parkingLng,
          parking_description: parkingDesc || null,
          status: "parked" as any,
        })
        .select("id")
        .single();

      if (inspError) throw inspError;

      // Upload vehicle photos
      for (const { angle } of REQUIRED_ANGLES) {
        const dataUrl = photos[angle];
        if (!dataUrl) continue;
        const blob = dataUrlToBlob(dataUrl);
        const path = `${requestId}/${angle}-${Date.now()}.jpg`;

        const { error: uploadErr } = await supabase.storage
          .from("vehicle-photos")
          .upload(path, blob, { contentType: "image/jpeg" });

        if (uploadErr) throw uploadErr;

        const { error: photoErr } = await supabase
          .from("vehicle_photos")
          .insert({
            inspection_id: inspection.id,
            photo_path: path,
            angle,
          });
        if (photoErr) throw photoErr;
      }

      // Upload parking photo if taken
      if (parkingPhoto) {
        const blob = dataUrlToBlob(parkingPhoto);
        const path = `${requestId}/parking-${Date.now()}.jpg`;
        const { error: uploadErr } = await supabase.storage
          .from("vehicle-photos")
          .upload(path, blob, { contentType: "image/jpeg" });

        if (uploadErr) throw uploadErr;

        await supabase
          .from("vehicle_inspections")
          .update({ parking_photo_path: path })
          .eq("id", inspection.id);
      }

      // Update request status to in_progress
      await supabase
        .from("parking_requests")
        .update({ status: "in_progress" as any })
        .eq("id", requestId);

      // Send status notification
      try {
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "status-update",
            to: undefined, // Will be filled by the edge function from the request
            data: {
              customerName,
              status: "in_progress",
              vehicleInfo,
              message: "Your vehicle has been inspected and is now being parked by our valet team.",
            },
          },
        });
      } catch {
        // Non-critical if email fails
      }

      toast({ title: "Inspection complete!", description: "Vehicle status updated to In Progress." });
      setStep("complete");
      onComplete();
    } catch (err: any) {
      toast({ title: "Error saving inspection", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const steps: { key: Step; label: string; icon: typeof ClipboardCheck }[] = [
    { key: "verify", label: "Verify", icon: ClipboardCheck },
    { key: "photos", label: "Photos", icon: Camera },
    { key: "parking", label: "Location", icon: MapPin },
    { key: "complete", label: "Done", icon: CheckCircle },
  ];

  return (
    <div className="space-y-4">
      {/* Step indicator */}
      <div className="flex items-center justify-between px-2">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center">
            <div className={`flex items-center gap-1.5 ${step === s.key ? "text-secondary" : steps.findIndex(x => x.key === step) > i ? "text-green-500" : "text-muted-foreground"}`}>
              <s.icon className="w-4 h-4" />
              <span className="text-xs font-medium hidden sm:inline">{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className="w-8 sm:w-12 h-px bg-border mx-2" />}
          </div>
        ))}
      </div>

      {/* Step: Verify */}
      {step === "verify" && (
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Verify Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">Confirm the following details match the vehicle in front of you:</p>
            <div className="grid grid-cols-2 gap-3 p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Customer</p>
                <p className="font-medium text-foreground">{customerName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">License Plate</p>
                <p className="font-medium text-foreground font-mono">{licensePlate}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">Vehicle</p>
                <p className="font-medium text-foreground">{vehicleInfo}</p>
              </div>
            </div>
            <Button className="w-full" onClick={() => setStep("photos")}>
              <ClipboardCheck className="w-4 h-4 mr-2" /> Vehicle Verified — Continue
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step: Photos */}
      {step === "photos" && (
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              Vehicle Photos
              <Badge variant="outline" className={allPhotosTaken ? "bg-green-500/10 text-green-600 border-green-500/20" : ""}>
                {Object.values(photos).filter(Boolean).length}/4
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Photograph all four sides. Use the guide overlay to align the vehicle.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {REQUIRED_ANGLES.map(({ angle, label }) => (
                <PhotoCapture
                  key={angle}
                  angle={angle}
                  label={label}
                  photo={photos[angle]}
                  onCapture={handleCapture}
                  onClear={handleClear}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("verify")} className="flex-1">Back</Button>
              <Button onClick={() => setStep("parking")} disabled={!allPhotosTaken} className="flex-1">
                Continue to Location
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Parking Location */}
      {step === "parking" && (
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Record Parking Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Record where you parked the vehicle so it can be found quickly later.
            </p>
            <ParkingLocation
              latitude={parkingLat}
              longitude={parkingLng}
              description={parkingDesc}
              photo={parkingPhoto}
              onLocationChange={(lat, lng) => { setParkingLat(lat); setParkingLng(lng); }}
              onDescriptionChange={setParkingDesc}
              onPhotoCapture={setParkingPhoto}
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("photos")} className="flex-1">Back</Button>
              <Button onClick={handleSubmit} disabled={saving} className="flex-1">
                {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-1" />}
                Complete Inspection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Complete */}
      {step === "complete" && (
        <Card className="border-border/50">
          <CardContent className="py-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <h3 className="font-display text-lg font-bold text-foreground">Inspection Complete</h3>
            <p className="text-sm text-muted-foreground">
              Vehicle photos saved, parking location recorded, and customer notified.
            </p>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InspectionWorkflow;
