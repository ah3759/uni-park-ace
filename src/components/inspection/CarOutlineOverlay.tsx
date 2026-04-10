import { cn } from "@/lib/utils";

type CarAngle = "front" | "back" | "left" | "right";

const outlines: Record<CarAngle, { path: string; viewBox: string }> = {
  front: {
    viewBox: "0 0 300 250",
    path: `
      M 75 200 L 75 170 Q 75 155 80 145 L 85 135 L 85 120 Q 85 105 95 95 L 105 88
      Q 110 75 120 65 L 130 58 Q 140 52 150 50 Q 160 52 170 58 L 180 65 Q 190 75 195 88
      L 205 95 Q 215 105 215 120 L 215 135 L 220 145 Q 225 155 225 170 L 225 200

      M 95 95 L 115 72 Q 125 62 150 60 Q 175 62 185 72 L 205 95 Z

      M 80 155 Q 78 148 82 142 L 95 140 L 95 158 Q 90 160 82 158 Z
      M 220 155 Q 222 148 218 142 L 205 140 L 205 158 Q 210 160 218 158 Z

      M 110 200 A 15 15 0 1 1 140 200 A 15 15 0 1 1 110 200
      M 160 200 A 15 15 0 1 1 190 200 A 15 15 0 1 1 160 200

      M 130 120 L 140 115 L 160 115 L 170 120

      M 120 175 L 180 175
      M 135 185 L 165 185
    `,
  },
  back: {
    viewBox: "0 0 300 250",
    path: `
      M 75 200 L 75 170 Q 75 155 80 145 L 85 135 L 85 120 Q 85 105 95 95 L 105 88
      Q 110 78 118 70 L 128 62 Q 140 55 150 53 Q 160 55 172 62 L 182 70 Q 190 78 195 88
      L 205 95 Q 215 105 215 120 L 215 135 L 220 145 Q 225 155 225 170 L 225 200

      M 98 92 L 115 70 Q 130 60 150 58 Q 170 60 185 70 L 202 92 Z

      M 80 155 Q 78 148 82 142 L 95 138 L 95 160 Q 88 162 82 158 Z
      M 220 155 Q 222 148 218 142 L 205 138 L 205 160 Q 212 162 218 158 Z

      M 110 200 A 15 15 0 1 1 140 200 A 15 15 0 1 1 110 200
      M 160 200 A 15 15 0 1 1 190 200 A 15 15 0 1 1 160 200

      M 100 175 L 130 175 M 170 175 L 200 175

      M 125 185 L 140 185 M 160 185 L 175 185

      M 140 200 L 160 200
    `,
  },
  left: {
    viewBox: "0 0 400 220",
    path: `
      M 30 170 L 30 145 Q 32 130 40 120 L 48 112
      L 55 105 Q 58 95 65 88 L 80 78 L 100 68
      Q 110 60 125 55 L 145 50 L 160 48

      L 180 48 Q 195 48 210 46 L 230 44
      Q 248 42 260 44 L 280 48
      Q 300 52 315 60 L 330 70
      Q 345 80 352 95 L 358 110 Q 362 122 362 135
      L 365 145 L 370 160 L 370 170

      M 160 48 L 155 55 Q 148 65 130 75 L 115 82 Q 100 90 90 95
      L 160 48

      M 160 48 L 260 44

      M 42 160 A 22 22 0 1 1 86 160 A 22 22 0 1 1 42 160
      M 310 160 A 22 22 0 1 1 354 160 A 22 22 0 1 1 310 160

      M 95 120 L 95 150 M 300 120 L 300 150

      M 35 130 L 45 125 L 45 138 L 35 135 Z
      M 365 130 L 358 125 L 358 138 L 365 135 Z

      M 100 105 L 160 95 L 160 48
      M 260 44 L 295 100

      M 120 140 L 280 140
    `,
  },
  right: {
    viewBox: "0 0 400 220",
    path: `
      M 370 170 L 370 145 Q 368 130 360 120 L 352 112
      L 345 105 Q 342 95 335 88 L 320 78 L 300 68
      Q 290 60 275 55 L 255 50 L 240 48

      L 220 48 Q 205 48 190 46 L 170 44
      Q 152 42 140 44 L 120 48
      Q 100 52 85 60 L 70 70
      Q 55 80 48 95 L 42 110 Q 38 122 38 135
      L 35 145 L 30 160 L 30 170

      M 240 48 L 245 55 Q 252 65 270 75 L 285 82 Q 300 90 310 95
      L 240 48

      M 240 48 L 140 44

      M 314 160 A 22 22 0 1 1 358 160 A 22 22 0 1 1 314 160
      M 46 160 A 22 22 0 1 1 90 160 A 22 22 0 1 1 46 160

      M 305 120 L 305 150 M 100 120 L 100 150

      M 365 130 L 355 125 L 355 138 L 365 135 Z
      M 35 130 L 42 125 L 42 138 L 35 135 Z

      M 300 105 L 240 95 L 240 48
      M 140 44 L 105 100

      M 120 140 L 280 140
    `,
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
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="2.5"
        strokeDasharray="8 5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CarOutlineOverlay;
