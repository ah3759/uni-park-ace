import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, CalendarDays, MapPin, Clock, User, Car, FileText, Phone, Mail } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  LOCATION_LABELS,
  LOCATION_STYLES,
  FALLBACK_STYLE,
  DAYS,
  DAY_FULL,
  generateTimeSlots,
  getWeekStart,
  addDays,
  formatWeekRange,
  formatTime,
  getSlotIndex,
  getDayIndex,
  type ScheduleEvent,
} from "./scheduleConstants";

interface ScheduleCalendarProps {
  /** When true, shows customer names, vehicle, plate, instructions in cards. */
  showFullDetails?: boolean;
}

const ScheduleCalendar = ({ showFullDetails = false }: ScheduleCalendarProps) => {
  const [weekStart, setWeekStart] = useState<Date>(() => getWeekStart());
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const slots = useMemo(() => generateTimeSlots(), []);

  const weekEnd = useMemo(() => {
    const e = addDays(weekStart, 7);
    e.setHours(0, 0, 0, 0);
    return e;
  }, [weekStart]);

  const fetchEvents = async () => {
    setLoading(true);

    // Pull both sources in parallel
    const [requestsRes, schedulesRes] = await Promise.all([
      supabase
        .from("parking_requests")
        .select(
          "id, first_name, last_name, email, phone, vehicle_make, vehicle_model, vehicle_color, license_plate, pickup_location, special_instructions, status, created_at"
        )
        .gte("created_at", weekStart.toISOString())
        .lt("created_at", weekEnd.toISOString())
        .neq("status", "cancelled"),
      supabase
        .from("valet_schedules")
        .select(
          "id, customer_name, customer_email, customer_phone, vehicle_make, vehicle_model, vehicle_color, license_plate, pickup_location, scheduled_date, scheduled_time, special_instructions, status"
        )
        .gte("scheduled_date", weekStart.toISOString().slice(0, 10))
        .lt("scheduled_date", weekEnd.toISOString().slice(0, 10))
        .neq("status", "cancelled"),
    ]);

    const merged: ScheduleEvent[] = [];

    if (requestsRes.data) {
      for (const r of requestsRes.data) {
        const date = new Date(r.created_at);
        merged.push({
          id: `pr-${r.id}`,
          source: "parking_request",
          date,
          location: r.pickup_location,
          time: formatTime(date),
          customerName: `${r.first_name} ${r.last_name}`,
          customerEmail: r.email,
          customerPhone: r.phone,
          vehicle: `${r.vehicle_color} ${r.vehicle_make} ${r.vehicle_model}`,
          licensePlate: r.license_plate,
          specialInstructions: r.special_instructions,
          status: r.status,
        });
      }
    }

    if (schedulesRes.data) {
      for (const s of schedulesRes.data) {
        // scheduled_date is YYYY-MM-DD, scheduled_time is HH:MM:SS
        const dt = new Date(`${s.scheduled_date}T${s.scheduled_time}`);
        merged.push({
          id: `vs-${s.id}`,
          source: "valet_schedule",
          date: dt,
          location: s.pickup_location,
          time: formatTime(dt),
          customerName: s.customer_name,
          customerEmail: s.customer_email,
          customerPhone: s.customer_phone,
          vehicle: `${s.vehicle_color} ${s.vehicle_make} ${s.vehicle_model}`,
          licensePlate: s.license_plate,
          specialInstructions: s.special_instructions,
          status: s.status,
        });
      }
    }

    setEvents(merged);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();

    // Realtime: refetch on any change to either table
    const channel = supabase
      .channel("schedule-board")
      .on("postgres_changes", { event: "*", schema: "public", table: "parking_requests" }, () => {
        fetchEvents();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "valet_schedules" }, () => {
        fetchEvents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart.getTime()]);

  // Bucket events into a [dayIndex][slotIndex] grid
  const grid = useMemo(() => {
    const g: ScheduleEvent[][][] = Array.from({ length: 7 }, () =>
      Array.from({ length: slots.length }, () => [])
    );
    for (const ev of events) {
      const di = getDayIndex(ev.date, weekStart);
      const si = getSlotIndex(ev.date);
      if (di < 0 || si < 0) continue;
      g[di][si].push(ev);
    }
    return g;
  }, [events, weekStart, slots.length]);

  const totalBookings = events.length;

  const goPrev = () => setWeekStart(addDays(weekStart, -7));
  const goNext = () => setWeekStart(addDays(weekStart, 7));
  const goToday = () => setWeekStart(getWeekStart());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goPrev} aria-label="Previous week">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={goNext} aria-label="Next week">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="ml-2 flex items-center gap-2 text-sm font-medium">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span>{formatWeekRange(weekStart)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            {showFullDetails
              ? `${totalBookings} ${totalBookings === 1 ? "booking" : "bookings"} this week`
              : `${totalBookings} ${totalBookings === 1 ? "slot" : "slots"} reserved`}
          </Badge>
          {loading && <span className="text-xs">Updating…</span>}
        </div>
      </div>

      {/* Location color legend (employee view only) */}
      {showFullDetails && (
        <Card className="p-3">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
            {Object.entries(LOCATION_LABELS).map(([key, label]) => {
              const style = LOCATION_STYLES[key] ?? FALLBACK_STYLE;
              return (
                <div key={key} className="flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                  <span className="text-muted-foreground">{label}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Calendar grid */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            {/* Header row */}
            <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b bg-muted/30 sticky top-0 z-10">
              <div className="px-2 py-3 text-xs font-medium text-muted-foreground">Time</div>
              {DAYS.map((d, i) => {
                const dayDate = addDays(weekStart, i);
                const isToday = dayDate.getTime() === today.getTime();
                return (
                  <div
                    key={d}
                    className={`px-2 py-3 text-center border-l ${
                      isToday ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {d}
                    </div>
                    <div
                      className={`text-lg font-semibold ${
                        isToday ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {dayDate.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time slot rows */}
            <div>
              {slots.map((slot, si) => {
                const isHourMark = slot.minute === 0;
                return (
                  <div
                    key={si}
                    className={`grid grid-cols-[80px_repeat(7,1fr)] ${
                      isHourMark ? "border-t" : "border-t border-dashed border-border/40"
                    }`}
                  >
                    <div
                      className={`px-2 py-1 text-xs ${
                        isHourMark ? "text-foreground font-medium" : "text-muted-foreground/60"
                      }`}
                    >
                      {isHourMark ? slot.label : ""}
                    </div>
                    {DAYS.map((_, di) => {
                      const cellEvents = grid[di][si];
                      const dayDate = addDays(weekStart, di);
                      const isToday = dayDate.getTime() === today.getTime();
                      return (
                        <div
                          key={di}
                          className={`border-l min-h-[36px] p-0.5 space-y-0.5 ${
                            isToday ? "bg-primary/[0.02]" : ""
                          }`}
                        >
                          {cellEvents.map((ev) => (
                            <EventCard
                              key={ev.id}
                              event={ev}
                              showFullDetails={showFullDetails}
                            />
                          ))}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

interface EventCardProps {
  event: ScheduleEvent;
  showFullDetails: boolean;
}

const EventCard = ({ event, showFullDetails }: EventCardProps) => {
  const style = LOCATION_STYLES[event.location] ?? FALLBACK_STYLE;
  const locationLabel = LOCATION_LABELS[event.location] ?? event.location;

  // PUBLIC VIEW: hide all booking details (location, time, customer info).
  // Render a plain muted "Unavailable" block so available slots stand out.
  if (!showFullDetails) {
    return (
      <div
        className="rounded-md px-2 py-1 text-[11px] bg-muted text-muted-foreground/70 border border-border/40 cursor-not-allowed select-none"
        aria-label="Reserved time slot"
        title="Reserved"
      >
        Reserved
      </div>
    );
  }

  // EMPLOYEE VIEW: full color-coded card with popover containing all details.
  const cardContent = (
    <div
      className={`rounded-md px-2 py-1 text-xs cursor-pointer transition-colors ${style.bg} ${style.border}`}
    >
      <div className={`font-semibold flex items-center gap-1 ${style.text}`}>
        <Clock className="h-3 w-3 shrink-0" />
        {event.time}
      </div>
      <div className="text-foreground truncate flex items-center gap-1 mt-0.5">
        <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />
        <span className="truncate">{style.label}</span>
      </div>
      {event.customerName && (
        <div className="text-muted-foreground truncate mt-0.5 flex items-center gap-1">
          <User className="h-3 w-3 shrink-0" />
          <span className="truncate">{event.customerName}</span>
        </div>
      )}
    </div>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>{cardContent}</PopoverTrigger>
      <PopoverContent className="w-72" side="right" align="start">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-semibold text-sm flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                {locationLabel}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3" />
                {event.time}
              </div>
            </div>
            {event.status && (
              <Badge variant="outline" className="text-[10px] capitalize">
                {event.status.replace("_", " ")}
              </Badge>
            )}
          </div>

          <div className="space-y-1.5 pt-2 border-t text-xs">
            {event.customerName && (
              <div className="flex items-center gap-2">
                <User className="h-3 w-3 text-muted-foreground shrink-0" />
                <span>{event.customerName}</span>
              </div>
            )}
            {event.customerPhone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
                <a href={`tel:${event.customerPhone}`} className="hover:underline">
                  {event.customerPhone}
                </a>
              </div>
            )}
            {event.customerEmail && (
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                <a
                  href={`mailto:${event.customerEmail}`}
                  className="hover:underline truncate"
                >
                  {event.customerEmail}
                </a>
              </div>
            )}
            {event.vehicle && (
              <div className="flex items-center gap-2">
                <Car className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="truncate">
                  {event.vehicle}
                  {event.licensePlate ? ` · ${event.licensePlate}` : ""}
                </span>
              </div>
            )}
            {event.specialInstructions && (
              <div className="flex items-start gap-2 pt-1">
                <FileText className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground italic">
                  {event.specialInstructions}
                </span>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ScheduleCalendar;
