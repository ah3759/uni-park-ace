import { cn } from "@/lib/utils";

import sedanLeft from "@/assets/inspection/sedan-left.png";
import sedanFront from "@/assets/inspection/sedan-front.png";
import sedanBack from "@/assets/inspection/sedan-back.png";
import suvLeft from "@/assets/inspection/suv-left.png";
import suvFront from "@/assets/inspection/suv-front.png";
import suvBack from "@/assets/inspection/suv-back.png";

type CarAngle = "front" | "back" | "left" | "right";
type VehicleType = "sedan" | "suv";

const imageMap: Record<VehicleType, Record<CarAngle, { src: string; flip?: boolean }>> = {
  sedan: {
    left: { src: sedanLeft },
    right: { src: sedanLeft, flip: true },
    front: { src: sedanFront },
    back: { src: sedanBack },
  },
  suv: {
    left: { src: suvLeft },
    right: { src: suvLeft, flip: true },
    front: { src: suvFront },
    back: { src: suvBack },
  },
};

// Common SUV model name patterns
const SUV_PATTERNS = [
  /suv/i, /crossover/i,
  /^(x|q|glc|gle|gls|glb|gla|ux|nx|rx|lx|gx|tx|rz|bz|cx|cr-v|hr-v|rv|rav4|4runner|highlander|sequoia|land ?cruiser|tahoe|suburban|yukon|blazer|trailblazer|equinox|traverse|trax|expedition|explorer|bronco|escape|edge|ecosport|excursion|pilot|passport|mdx|rdx|tucson|santa ?fe|palisade|kona|venue|telluride|sorento|sportage|seltos|carnival|soul|outlander|eclipse ?cross|rogue|murano|pathfinder|armada|kicks|terra|xterra|wrangler|gladiator|cherokee|grand ?cherokee|compass|renegade|durango|range ?rover|defender|discovery|evoque|velar|cayenne|macan|tiguan|atlas|touareg|id\.4|urus|cullinan|bentayga|dbx|levante|grecale|e-?pace|f-?pace|i-?pace|xc40|xc60|xc90|ex30|ex90|model ?x|model ?y|ioniq ?5|ioniq ?7|ev6|ev9|id\.4|id\.5|eletre|eqs ?suv|eqb|eqe ?suv|r1s|solterra|bz4x|ariya|ix|x1|x2|x3|x4|x5|x6|x7|q3|q5|q7|q8|e-?tron)$/i,
];

export function getVehicleType(model: string): VehicleType {
  const trimmed = model.trim();
  for (const pattern of SUV_PATTERNS) {
    if (pattern.test(trimmed)) return "suv";
  }
  return "sedan";
}

interface CarOutlineOverlayProps {
  angle: CarAngle;
  vehicleType?: VehicleType;
  className?: string;
}

const CarOutlineOverlay = ({ angle, vehicleType = "sedan", className }: CarOutlineOverlayProps) => {
  const { src, flip } = imageMap[vehicleType][angle];

  return (
    <img
      src={src}
      alt={`${vehicleType} ${angle} guide`}
      className={cn(
        "absolute inset-0 w-full h-full object-contain pointer-events-none z-10 opacity-40 mix-blend-multiply",
        flip && "scale-x-[-1]",
        className
      )}
      draggable={false}
    />
  );
};

export default CarOutlineOverlay;
