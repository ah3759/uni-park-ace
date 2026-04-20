import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ScheduleCalendar from "@/components/schedule/ScheduleCalendar";
import { CalendarDays, Sparkles } from "lucide-react";

const Schedule = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
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
              See when valet slots are filling up across campus. Updates in real time as new
              bookings come in. Personal details are kept private.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link to="/#booking">Book Your Slot</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/#pricing">View Pricing</Link>
              </Button>
            </div>
          </div>

          {/* Calendar */}
          <ScheduleCalendar showFullDetails={false} />

          {/* Helper note */}
          <Card className="mt-6 p-4 text-sm text-muted-foreground text-center max-w-3xl mx-auto">
            Don't see a slot you need? Bookings are accepted in real time —{" "}
            <Link to="/#booking" className="text-accent font-medium hover:underline">
              submit a request
            </Link>{" "}
            and your slot will appear instantly.
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Schedule;
