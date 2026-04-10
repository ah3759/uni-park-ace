import { cn } from "@/lib/utils";

type CarAngle = "front" | "back" | "left" | "right";

const outlines: Record<CarAngle, { path: string; viewBox: string }> = {
  front: {
    viewBox: "0 0 200 170",
    path: `M 40 130 L 40 80 Q 40 55 55 45 L 75 35 Q 100 28 125 35 L 145 45 Q 160 55 160 80 L 160 130 Q 160 145 150 150 L 50 150 Q 40 145 40 130 Z
           M 55 65 L 70 48 L 130 48 L 145 65 Z
           M 50 100 L 65 95 L 65 105 L 50 100 Z
           M 135 100 L 150 95 L 150 105 L 135 100 Z
           M 80 140 L 120 140`,
  },
  back: {
    viewBox: "0 0 200 170",
    path: `M 40 130 L 40 80 Q 40 55 55 45 L 75 35 Q 100 28 125 35 L 145 45 Q 160 55 160 80 L 160 130 Q 160 145 150 150 L 50 150 Q 40 145 40 130 Z
           M 55 60 L 68 42 L 132 42 L 145 60 Z
           M 50 100 L 65 95 L 65 105 L 50 100 Z
           M 135 100 L 150 95 L 150 105 L 135 100 Z
           M 60 135 L 85 135 M 115 135 L 140 135
           M 90 150 L 110 150`,
  },
  left: {
    viewBox: "0 0 220 150",
    path: `M 20 100 L 20 75 Q 22 55 40 48 L 70 42 L 95 30 L 130 28 Q 145 30 150 42 L 155 48 Q 185 50 195 65 L 200 80 L 200 100 Q 200 115 190 120 L 30 120 Q 20 115 20 100 Z
           M 75 44 L 90 28 L 135 28 L 145 44 Z
           M 30 105 A 14 14 0 1 1 58 105 A 14 14 0 1 1 30 105
           M 162 105 A 14 14 0 1 1 190 105 A 14 14 0 1 1 162 105
           M 65 70 L 65 100 M 155 70 L 155 100`,
  },
  right: {
    viewBox: "0 0 220 150",
    path: `M 200 100 L 200 75 Q 198 55 180 48 L 150 42 L 125 30 L 90 28 Q 75 30 70 42 L 65 48 Q 35 50 25 65 L 20 80 L 20 100 Q 20 115 30 120 L 190 120 Q 200 115 200 100 Z
           M 145 44 L 130 28 L 85 28 L 75 44 Z
           M 162 105 A 14 14 0 1 1 190 105 A 14 14 0 1 1 162 105
           M 30 105 A 14 14 0 1 1 58 105 A 14 14 0 1 1 30 105
           M 65 70 L 65 100 M 155 70 L 155 100`,
  },
};

interface CarOutlineOverlayProps {
  angle: CarAngle;
  className?: string;
}

const CarOutlineOverlay = ({ angle, className }: CarOutlineOverlayProps) => {
  const { path, viewBox } = outlines[angle];
  return (
    <svg
      viewBox={viewBox}
      className={cn("absolute inset-0 w-full h-full pointer-events-none z-10", className)}
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d={path}
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="2"
        strokeDasharray="6 4"
      />
    </svg>
  );
};

export default CarOutlineOverlay;
