import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Camera, Loader2, Navigation } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ParkingLocationProps {
  latitude: number | null;
  longitude: number | null;
  description: string;
  photo: string | null;
  onLocationChange: (lat: number, lng: number) => void;
  onDescriptionChange: (desc: string) => void;
  onPhotoCapture: (dataUrl: string) => void;
}

const MAX_DIMENSION = 1200;

const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

const ParkingLocation = ({
  latitude, longitude, description, photo,
  onLocationChange, onDescriptionChange, onPhotoCapture,
}: ParkingLocationProps) => {
  const [gettingLocation, setGettingLocation] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast({ title: "Geolocation not supported", variant: "destructive" });
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocationChange(pos.coords.latitude, pos.coords.longitude);
        setGettingLocation(false);
        toast({ title: "Location captured" });
      },
      (err) => {
        setGettingLocation(false);
        toast({ title: "Could not get location", description: err.message, variant: "destructive" });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [onLocationChange]);

  const handlePhoto = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const resized = await resizeImage(file);
    onPhotoCapture(resized);
    if (fileRef.current) fileRef.current.value = "";
  }, [onPhotoCapture]);

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-foreground flex items-center gap-2">
        <MapPin className="w-4 h-4" /> Parking Location
      </h4>

      {/* GPS */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={getLocation} disabled={gettingLocation}>
          {gettingLocation ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Navigation className="w-4 h-4 mr-1" />}
          {latitude ? "Update Location" : "Get GPS Location"}
        </Button>
        {latitude && longitude && (
          <span className="text-xs text-muted-foreground font-mono">
            {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </span>
        )}
      </div>

      {/* Description */}
      <Input
        placeholder="e.g. Level 2, Spot B-14, near elevator"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />

      {/* Parking spot photo */}
      <div>
        <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
          <Camera className="w-4 h-4 mr-1" /> {photo ? "Retake Spot Photo" : "Take Spot Photo"}
        </Button>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
        {photo && (
          <div className="mt-2 aspect-video max-w-xs rounded-lg overflow-hidden border border-border">
            <img src={photo} alt="Parking spot" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkingLocation;
