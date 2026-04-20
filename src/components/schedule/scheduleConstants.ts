// Shared constants for the weekly schedule calendar

export const LOCATION_LABELS: Record<string, string> = {
  "gleason-circle": "Gleason Circle Bus Stop",
  "sentinel": "Sentinel",
  "ntid": "NTID Bus Stop",
  "north-bus-shelter": "North Bus Shelter",
  "slaughter-hall": "Slaughter Hall Bus Stop",
  "kimball-loop": "Kimball Loop",
  "global-village": "Global Village Bus Stop",
};

// Each location gets a distinct color (semantic-friendly, all HSL-derived Tailwind classes).
// We pair a solid bg + border + text so cards are readable in light & dark mode.
export const LOCATION_STYLES: Record<
  string,
  { bg: string; border: string; text: string; dot: string; label: string }
> = {
  "gleason-circle": {
    bg: "bg-blue-500/15 hover:bg-blue-500/25",
    border: "border-l-4 border-blue-500",
    text: "text-blue-700 dark:text-blue-300",
    dot: "bg-blue-500",
    label: "Gleason Circle",
  },
  "sentinel": {
    bg: "bg-emerald-500/15 hover:bg-emerald-500/25",
    border: "border-l-4 border-emerald-500",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
    label: "Sentinel",
  },
  "ntid": {
    bg: "bg-purple-500/15 hover:bg-purple-500/25",
    border: "border-l-4 border-purple-500",
    text: "text-purple-700 dark:text-purple-300",
    dot: "bg-purple-500",
    label: "NTID",
  },
  "north-bus-shelter": {
    bg: "bg-amber-500/15 hover:bg-amber-500/25",
    border: "border-l-4 border-amber-500",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
    label: "North Bus Shelter",
  },
  "slaughter-hall": {
    bg: "bg-rose-500/15 hover:bg-rose-500/25",
    border: "border-l-4 border-rose-500",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
    label: "Slaughter Hall",
  },
  "kimball-loop": {
    bg: "bg-cyan-500/15 hover:bg-cyan-500/25",
    border: "border-l-4 border-cyan-500",
    text: "text-cyan-700 dark:text-cyan-300",
    dot: "bg-cyan-500",
    label: "Kimball Loop",
  },
  "global-village": {
    bg: "bg-fuchsia-500/15 hover:bg-fuchsia-500/25",
    border: "border-l-4 border-fuchsia-500",
    text: "text-fuchsia-700 dark:text-fuchsia-300",
    dot: "bg-fuchsia-500",
    label: "Global Village",
  },
};

export const FALLBACK_STYLE = {
  bg: "bg-muted hover:bg-muted/80",
  border: "border-l-4 border-muted-foreground/40",
  text: "text-foreground",
  dot: "bg-muted-foreground",
  label: "Other",
};

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export const DAY_FULL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

// Operating hours: 7 AM – 9 PM in 30-min slots
export const START_HOUR = 7;
export const END_HOUR = 21;

export function generateTimeSlots(): { label: string; hour: number; minute: number }[] {
  const slots: { label: string; hour: number; minute: number }[] = [];
  for (let h = START_HOUR; h < END_HOUR; h++) {
    for (const m of [0, 30]) {
      const period = h >= 12 ? "PM" : "AM";
      const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
      slots.push({
        label: `${displayH}:${m.toString().padStart(2, "0")} ${period}`,
        hour: h,
        minute: m,
      });
    }
  }
  return slots;
}

// Get the Monday of the current week (or a given date)
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 = Sun, 1 = Mon, ...
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  d.setDate(d.getDate() + diff);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function formatWeekRange(weekStart: Date): string {
  const end = addDays(weekStart, 4);
  const sameMonth = weekStart.getMonth() === end.getMonth();
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  if (sameMonth) {
    return `${weekStart.toLocaleDateString("en-US", opts)} – ${end.getDate()}, ${end.getFullYear()}`;
  }
  return `${weekStart.toLocaleDateString("en-US", opts)} – ${end.toLocaleDateString("en-US", opts)}, ${end.getFullYear()}`;
}

export type ScheduleEvent = {
  id: string;
  source: "parking_request" | "valet_schedule";
  date: Date; // exact scheduled datetime
  location: string; // raw key
  // Public-safe fields are always present
  time: string; // formatted "9:30 AM"
  // Employee-only fields
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  vehicle?: string;
  licensePlate?: string;
  specialInstructions?: string | null;
  status?: string;
};

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Snap a time to the nearest 30-min slot index (relative to START_HOUR)
export function getSlotIndex(date: Date): number {
  const h = date.getHours();
  const m = date.getMinutes();
  if (h < START_HOUR || h >= END_HOUR) return -1;
  return (h - START_HOUR) * 2 + (m >= 30 ? 1 : 0);
}

// Get day-of-week index 0..6 for Mon..Sun, -1 if outside week
export function getDayIndex(date: Date, weekStart: Date): number {
  const ws = new Date(weekStart);
  ws.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const diffDays = Math.round((d.getTime() - ws.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0 || diffDays > 6) return -1;
  return diffDays;
}
