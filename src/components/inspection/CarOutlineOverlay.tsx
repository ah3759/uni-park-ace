import { cn } from "@/lib/utils";

type CarAngle = "front" | "back" | "left" | "right";

const outlines: Record<CarAngle, string> = {
  front: `M 30 80 Q 30 40 50 30 Q 70 20 100 18 Q 130 20 150 30 Q 170 40 170 80 L 170 120 Q 170 140 160 150 L 40 150 Q 30 140 30 120 Z
          M 50 60 L 70 45 L 130 45 L 150 60 Z
          M 45 100 A 10 8 0 1 1 65 100 A 10 8 0 1 1 45 100
          M 135 100 A 10 8 0 1 1 155 100 A 10 8 0 1 1 135 100`,
  back: `M 30 80 Q 30 40 50 30 Q 70 22 100 20 Q 130 22 150 30 Q 170 40 170 80 L 170 120 Q 170 140 160 150 L 40 150 Q 30 140 30 120 Z
         M 50 55 L 65 40 L 135 40 L 150 55 Z
         M 55 130 L 80 130 M 120 130 L 145 130
         M 45 100 A 10 8 0 1 1 65 100 A 10 8 0 1 1 45 100
         M 135 100 A 10 8 0 1 1 155 100 A 10 8 0 1 1 135 100`,
  left: `M 20 90 Q 25 50 60 40 L 90 38 L 120 30 L 160 38 Q 180 42 180 60 L 180 100 Q 180 120 170 130 L 30 130 Q 20 120 20 100 Z
         M 65 42 L 80 30 L 120 28 L 130 42 Z
         M 30 105 A 15 12 0 1 1 60 105 A 15 12 0 1 1 30 105
         M 140 105 A 15 12 0 1 1 170 105 A 15 12 0 1 1 140 105`,
  right: `M 20 60 Q 20 42 40 38 L 80 30 L 110 38 L 140 40 Q 175 50 180 90 L 180 100 Q 180 120 170 130 L 30 130 Q 20 120 20 100 Z
          M 70 42 L 80 28 L 120 30 L 135 42 Z
          M 30 105 A 15 12 0 1 1 60 105 A 15 12 0 1 1 30 105
          M 140 105 A 15 12 0 1 1 170 105 A 15 12 0 1 1 140 105`,
};

interface CarOutlineOverlayProps {
  angle: CarAngle;
  className?: string;
}

const CarOutlineOverlay = ({ angle, className }: CarOutlineOverlayProps) => {
  return (
    <svg
      viewBox="0 200"
      className={cn("absolute inset-0 w-full h-full pointer-events-none z-10", className)}
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d={outlines[angle]}
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="2"
        strokeDasharray="6 4"
      />
    </svg>
  );
};

export default CarOutlineOverlay;
