import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ScheduleCalendar from "@/components/schedule/ScheduleCalendar";
import CustomerScheduling from "@/components/CustomerScheduling";
import { CalendarDays, Sparkles, ArrowLeft } from "lucide-react";

const Schedule = () => {
  const [view, setView] = useState<"calendar" | "book">("calendar");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {view === "calendar" ? (
            <>
              {/* Header */}
              <div className="mb-8 text-center max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4">
                  <Sparkles className="h-3 w-3" />
                  Live Schedule
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3 flex items-center justify-center gap-2">
                  <CalendarDays className="h-8 w-8 text-accent" />
                  UNiVale Weekly Schedule
                </h1>
                <p className="text-muted-foreground">
                  See which time slots are still available across campus. Updates in real time as
                  new bookings come in. For privacy, reserved slots are hidden — only open
                  availability is shown.
                </p>
                <div className="mt-5 flex items-center justify-center gap-3">
                  <Button size="lg" onClick={() => setView("book")}>
                    Book Your Slot
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/#pricing">View Pricing</Link>
                  </Button>
                </div>
              </div>

              {/* Calendar (public, privacy-masked) */}
              <ScheduleCalendar showFullDetails={false} />

              {/* Helper note */}
              <Card className="mt-6 p-4 text-sm text-muted-foreground text-center max-w-3xl mx-auto">
                Don't see availability that works? Reserved slots are kept private —{" "}
                <button
                  onClick={() => setView("book")}
                  className="text-accent font-medium hover:underline"
                >
                  open the booking form
                </button>{" "}
                and submit a request.
              </Card>
            </>
          ) : (
            <div>
              <div className="max-w-3xl mx-auto mb-4">
                <Button variant="ghost" size="sm" onClick={() => setView("calendar")}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to schedule
                </Button>
              </div>
              <CustomerScheduling />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Schedule;
