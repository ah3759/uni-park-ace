import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Check, RotateCcw } from "lucide-react";
import CarOutlineOverlay from "./CarOutlineOverlay";

type CarAngle = "front" | "back" | "left" | "right";

type VehicleType = "sedan" | "suv";

interface PhotoCaptureProps {
  angle: CarAngle;
  label: string;
  photo: string | null;
  vehicleType?: VehicleType;
  onCapture: (angle: CarAngle, dataUrl: string) => void;
  onClear: (angle: CarAngle) => void;
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

const PhotoCapture = ({ angle, label, photo, vehicleType = "sedan", onCapture, onClear }: PhotoCaptureProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showOverlay] = useState(true);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const resized = await resizeImage(file);
    onCapture(angle, resized);
    if (inputRef.current) inputRef.current.value = "";
  }, [angle, onCapture]);

  if (photo) {
    return (
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase">{label}</p>
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border bg-muted">
          <img src={photo} alt={label} className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 flex gap-1">
            <Check className="w-5 h-5 text-green-500 bg-background/80 rounded-full p-0.5" />
          </div>
        </div>
        <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => onClear(angle)}>
          <RotateCcw className="w-3 h-3 mr-1" /> Retake
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase">{label}</p>
      <div
        className="relative aspect-[4/3] rounded-lg overflow-hidden border-2 border-dashed border-border bg-muted/50 cursor-pointer hover:border-secondary/50 transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        {showOverlay && <CarOutlineOverlay angle={angle} vehicleType={vehicleType} />}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-20">
          <Camera className="w-8 h-8 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Tap to capture</span>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
};

export default PhotoCapture;
