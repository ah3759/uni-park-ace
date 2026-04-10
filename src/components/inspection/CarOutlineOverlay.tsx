import { cn } from "@/lib/utils";

type CarAngle = "front" | "back" | "left" | "right";
type VehicleType = "sedan" | "suv";

interface OutlineData {
  path: string;
  viewBox: string;
}

const sedanOutlines: Record<CarAngle, OutlineData> = {
  left: {
    viewBox: "0 0 480 200",
    path: `
      M 40 155 Q 30 155 28 145 L 26 130 Q 24 118 30 108 L 50 95 L 75 82 L 95 72
      Q 110 64 125 58 L 150 52 L 170 48
      L 190 46 L 210 44 L 230 44 L 250 44
      Q 268 44 285 46 L 310 50 L 335 56
      Q 355 62 370 72 L 390 85 Q 405 95 415 108
      L 425 120 Q 430 130 430 140 L 432 148 Q 432 155 425 155

      M 170 48 L 165 56 Q 155 68 140 76 L 120 85 Q 105 92 90 97 L 170 48

      M 250 44 L 310 50
      M 250 44 Q 260 56 270 68 L 285 80 Q 298 90 310 96

      M 90 97 L 90 140 M 385 100 L 385 140

      M 48 148 A 28 28 0 1 1 104 148 A 28 28 0 1 1 48 148
      M 48 148 A 18 18 0 1 1 86 148 A 18 18 0 1 1 48 148

      M 358 148 A 28 28 0 1 1 414 148 A 28 28 0 1 1 358 148
      M 358 148 A 18 18 0 1 1 396 148 A 18 18 0 1 1 358 148

      M 30 108 L 40 105 L 50 108 L 50 125 L 38 128 L 28 125 Z
      M 415 108 L 425 105 L 432 110 L 432 128 L 422 132 L 415 128 Z

      M 120 140 L 345 140
      M 150 100 L 160 98 M 200 96 L 240 96 M 280 98 L 320 100
    `,
  },
  right: {
    viewBox: "0 0 480 200",
    path: `
      M 440 155 Q 450 155 452 145 L 454 130 Q 456 118 450 108 L 430 95 L 405 82 L 385 72
      Q 370 64 355 58 L 330 52 L 310 48
      L 290 46 L 270 44 L 250 44 L 230 44
      Q 212 44 195 46 L 170 50 L 145 56
      Q 125 62 110 72 L 90 85 Q 75 95 65 108
      L 55 120 Q 50 130 50 140 L 48 148 Q 48 155 55 155

      M 310 48 L 315 56 Q 325 68 340 76 L 360 85 Q 375 92 390 97 L 310 48

      M 230 44 L 170 50
      M 230 44 Q 220 56 210 68 L 195 80 Q 182 90 170 96

      M 390 97 L 390 140 M 95 100 L 95 140

      M 376 148 A 28 28 0 1 1 432 148 A 28 28 0 1 1 376 148
      M 376 148 A 18 18 0 1 1 414 148 A 18 18 0 1 1 376 148

      M 66 148 A 28 28 0 1 1 122 148 A 28 28 0 1 1 66 148
      M 66 148 A 18 18 0 1 1 104 148 A 18 18 0 1 1 66 148

      M 450 108 L 440 105 L 430 108 L 430 125 L 442 128 L 452 125 Z
      M 65 108 L 55 105 L 48 110 L 48 128 L 58 132 L 65 128 Z

      M 135 140 L 360 140
      M 160 100 L 200 98 M 240 96 L 280 96 M 320 98 L 340 100
    `,
  },
  front: {
    viewBox: "0 0 300 280",
    path: `
      M 55 230 L 55 185 Q 55 170 60 158 L 65 148
      Q 68 135 75 125 L 85 115
      Q 95 100 110 90 L 125 82 Q 140 76 150 74 Q 160 76 175 82
      L 190 90 Q 205 100 215 115 L 225 125 Q 232 135 235 148
      L 240 158 Q 245 170 245 185 L 245 230

      M 90 110 L 105 88 Q 120 78 150 76 Q 180 78 195 88 L 210 110 Z

      M 60 160 L 75 155 L 78 175 L 62 178 Z
      M 240 160 L 225 155 L 222 175 L 238 178 Z

      M 75 225 A 22 22 0 1 1 119 225 A 22 22 0 1 1 75 225
      M 75 225 A 14 14 0 1 1 103 225 A 14 14 0 1 1 75 225

      M 181 225 A 22 22 0 1 1 225 225 A 22 22 0 1 1 181 225
      M 181 225 A 14 14 0 1 1 209 225 A 14 14 0 1 1 181 225

      M 120 195 L 180 195
      M 110 145 L 130 140 L 170 140 L 190 145

      M 130 210 L 170 210
      M 140 220 L 160 220

      M 110 170 L 120 168 M 180 168 L 190 170
    `,
  },
  back: {
    viewBox: "0 0 300 280",
    path: `
      M 55 230 L 55 185 Q 55 170 60 158 L 65 148
      Q 68 135 75 125 L 85 115
      Q 95 102 108 92 L 122 84 Q 138 78 150 76 Q 162 78 178 84
      L 192 92 Q 205 102 215 115 L 225 125 Q 232 135 235 148
      L 240 158 Q 245 170 245 185 L 245 230

      M 92 108 L 108 88 Q 125 78 150 76 Q 175 78 192 88 L 208 108 Z

      M 60 160 L 75 155 L 78 178 L 62 182 Z
      M 240 160 L 225 155 L 222 178 L 238 182 Z

      M 75 225 A 22 22 0 1 1 119 225 A 22 22 0 1 1 75 225
      M 75 225 A 14 14 0 1 1 103 225 A 14 14 0 1 1 75 225

      M 181 225 A 22 22 0 1 1 225 225 A 22 22 0 1 1 181 225
      M 181 225 A 14 14 0 1 1 209 225 A 14 14 0 1 1 181 225

      M 75 195 L 110 195 M 190 195 L 225 195

      M 120 210 L 140 210 M 160 210 L 180 210

      M 140 230 L 160 230

      M 120 150 L 135 148 M 165 148 L 180 150
    `,
  },
};

const suvOutlines: Record<CarAngle, OutlineData> = {
  left: {
    viewBox: "0 0 480 220",
    path: `
      M 40 170 Q 28 170 26 158 L 24 142 Q 22 128 28 118 L 45 105 L 65 92 L 85 82
      Q 100 74 118 66 L 140 58 L 158 52 L 175 48

      L 195 46 L 220 44 L 250 42 L 280 42
      Q 300 42 320 44 L 345 48 L 368 54
      Q 388 60 405 72 L 420 84 Q 432 96 438 112
      L 442 128 Q 445 140 445 155 L 445 162 Q 445 170 438 170

      M 175 48 L 170 58 Q 160 72 142 82 L 122 92 Q 105 100 88 106

      M 175 48 L 280 42

      M 280 42 Q 295 55 310 68 L 330 82 Q 348 94 365 102

      M 88 106 L 88 148 M 400 105 L 400 148

      M 48 162 A 30 30 0 1 1 108 162 A 30 30 0 1 1 48 162
      M 48 162 A 20 20 0 1 1 88 162 A 20 20 0 1 1 48 162

      M 368 162 A 30 30 0 1 1 428 162 A 30 30 0 1 1 368 162
      M 368 162 A 20 20 0 1 1 408 162 A 20 20 0 1 1 368 162

      M 28 118 L 40 114 L 48 118 L 48 135 L 38 138 L 26 135 Z
      M 432 112 L 442 108 L 448 114 L 448 135 L 440 140 L 430 136 Z

      M 122 148 L 352 148

      M 80 75 L 80 50 L 175 48
      M 375 70 L 375 48 L 280 42

      M 155 105 L 165 102 M 210 98 L 260 98 M 300 100 L 340 104
    `,
  },
  right: {
    viewBox: "0 0 480 220",
    path: `
      M 440 170 Q 452 170 454 158 L 456 142 Q 458 128 452 118 L 435 105 L 415 92 L 395 82
      Q 380 74 362 66 L 340 58 L 322 52 L 305 48

      L 285 46 L 260 44 L 230 42 L 200 42
      Q 180 42 160 44 L 135 48 L 112 54
      Q 92 60 75 72 L 60 84 Q 48 96 42 112
      L 38 128 Q 35 140 35 155 L 35 162 Q 35 170 42 170

      M 305 48 L 310 58 Q 320 72 338 82 L 358 92 Q 375 100 392 106

      M 305 48 L 200 42

      M 200 42 Q 185 55 170 68 L 150 82 Q 132 94 115 102

      M 392 106 L 392 148 M 80 105 L 80 148

      M 372 162 A 30 30 0 1 1 432 162 A 30 30 0 1 1 372 162
      M 372 162 A 20 20 0 1 1 412 162 A 20 20 0 1 1 372 162

      M 52 162 A 30 30 0 1 1 112 162 A 30 30 0 1 1 52 162
      M 52 162 A 20 20 0 1 1 92 162 A 20 20 0 1 1 52 162

      M 452 118 L 440 114 L 432 118 L 432 135 L 442 138 L 454 135 Z
      M 48 112 L 38 108 L 32 114 L 32 135 L 40 140 L 50 136 Z

      M 128 148 L 358 148

      M 400 75 L 400 50 L 305 48
      M 105 70 L 105 48 L 200 42

      M 145 105 L 195 100 M 240 98 L 280 98 M 320 100 L 345 104
    `,
  },
  front: {
    viewBox: "0 0 300 280",
    path: `
      M 48 235 L 48 185 Q 48 168 52 155 L 58 142
      Q 62 128 70 118 L 80 108
      Q 90 95 105 85 L 120 78 Q 135 72 150 70 Q 165 72 180 78
      L 195 85 Q 210 95 220 108 L 230 118 Q 238 128 242 142
      L 248 155 Q 252 168 252 185 L 252 235

      M 85 105 L 100 82 Q 118 72 150 70 Q 182 72 200 82 L 215 105 Z

      M 52 155 L 70 148 L 72 172 L 55 176 Z
      M 248 155 L 230 148 L 228 172 L 245 176 Z

      M 68 228 A 24 24 0 1 1 116 228 A 24 24 0 1 1 68 228
      M 68 228 A 16 16 0 1 1 100 228 A 16 16 0 1 1 68 228

      M 184 228 A 24 24 0 1 1 232 228 A 24 24 0 1 1 184 228
      M 184 228 A 16 16 0 1 1 216 228 A 16 16 0 1 1 184 228

      M 115 195 L 185 195
      M 105 142 L 128 138 L 172 138 L 195 142

      M 125 210 L 175 210
      M 135 222 L 165 222

      M 70 118 L 72 85 L 80 80
      M 230 118 L 228 85 L 220 80

      M 105 168 L 118 165 M 182 165 L 195 168
    `,
  },
  back: {
    viewBox: "0 0 300 280",
    path: `
      M 48 235 L 48 185 Q 48 168 52 155 L 58 142
      Q 62 128 70 118 L 80 108
      Q 90 96 105 86 L 118 80 Q 135 74 150 72 Q 165 74 182 80
      L 195 86 Q 210 96 220 108 L 230 118 Q 238 128 242 142
      L 248 155 Q 252 168 252 185 L 252 235

      M 88 102 L 102 82 Q 120 72 150 70 Q 180 72 198 82 L 212 102 Z

      M 52 155 L 70 148 L 72 176 L 55 180 Z
      M 248 155 L 230 148 L 228 176 L 245 180 Z

      M 68 228 A 24 24 0 1 1 116 228 A 24 24 0 1 1 68 228
      M 68 228 A 16 16 0 1 1 100 228 A 16 16 0 1 1 68 228

      M 184 228 A 24 24 0 1 1 232 228 A 24 24 0 1 1 184 228
      M 184 228 A 16 16 0 1 1 216 228 A 16 16 0 1 1 184 228

      M 70 195 L 108 195 M 192 195 L 230 195

      M 115 212 L 138 212 M 162 212 L 185 212

      M 135 235 L 165 235

      M 70 118 L 72 85 L 80 80
      M 230 118 L 228 85 L 220 80

      M 108 165 L 125 162 M 175 162 L 192 165
    `,
  },
};

// Common SUV model name patterns
const SUV_PATTERNS = [
  /suv/i, /crossover/i,
  // Specific model prefixes/names commonly known as SUVs/crossovers
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
  const outlineSet = vehicleType === "suv" ? suvOutlines : sedanOutlines;
  const { path, viewBox } = outlineSet[angle];

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
