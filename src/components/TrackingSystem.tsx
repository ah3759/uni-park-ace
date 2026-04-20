import { MapPin, Clock, Bell, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CarLogo from "@/components/CarLogo";

const TrackingSystem = () => {
  const parkingSpots = [
    { id: "A-01", status: "occupied", car: "Tesla Model 3" },
    { id: "A-02", status: "available", car: null },
    { id: "A-03", status: "reserved", car: null },
    { id: "A-04", status: "occupied", car: "Honda Civic" },
    { id: "B-01", status: "occupied", car: "BMW X5" },
    { id: "B-02", status: "available", car: null },
    { id: "B-03", status: "occupied", car: "Toyota Camry" },
    { id: "B-04", status: "available", car: null },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "occupied":
        return "bg-primary";
      case "available":
        return "bg-secondary";
      case "reserved":
        return "bg-muted-foreground";
      default:
        return "bg-muted";
    }
  };

  return (
    <section id="tracking" className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
              <MapPin className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">Digital Tracking</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
              Real-Time
              <span className="text-gradient"> Visibility</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our advanced digital tracking system keeps you informed every step of the way. Know exactly where your car is parked and when it'll be ready.
            </p>

            {/* Features List */}
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <CarLogo className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-foreground mb-1">Live Location</h4>
                  <p className="text-muted-foreground">Track your vehicle's exact parking spot in real-time through our app.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-foreground mb-1">ETA Updates</h4>
                  <p className="text-muted-foreground">Get accurate estimates for pickup times with minute-by-minute updates.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-foreground mb-1">Smart Notifications</h4>
                  <p className="text-muted-foreground">Receive alerts when your car is being moved, parked, or ready for pickup.</p>
                </div>
              </div>
            </div>

            <Button variant="secondary" size="lg" className="mt-8">
              Download the App
            </Button>
          </div>

          {/* Right - Interactive Demo */}
          <div className="relative">
            {/* Parking Grid Visualization */}
            <div className="bg-card rounded-3xl shadow-elevated p-8 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-semibold text-foreground">Lot A & B - Live View</h3>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-secondary" />
                    Available
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary" />
                    Occupied
                  </span>
                </div>
              </div>

              {/* Parking Grid */}
              <div className="grid grid-cols-4 gap-3 mb-8">
                {parkingSpots.map((spot) => (
                  <div
                    key={spot.id}
                    className={`aspect-[3/4] rounded-xl flex flex-col items-center justify-center p-2 transition-all duration-300 hover:scale-105 cursor-pointer ${
                      spot.status === "available"
                        ? "bg-secondary/10 border-2 border-dashed border-secondary/40"
                        : spot.status === "occupied"
                        ? "bg-primary/10 border border-primary/30"
                        : "bg-muted border border-muted-foreground/30"
                    }`}
                  >
                    <span className="text-xs font-medium text-muted-foreground mb-1">{spot.id}</span>
                    {spot.car ? (
                      <CarLogo className="w-6 h-6 text-primary" />
                    ) : spot.status === "reserved" ? (
                      <Clock className="w-6 h-6 text-muted-foreground" />
                    ) : (
                      <CheckCircle2 className="w-6 h-6 text-secondary" />
                    )}
                  </div>
                ))}
              </div>

              {/* Active Request Card */}
              <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-2xl p-5 border border-secondary/20">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Your Vehicle</p>
                    <p className="font-display font-semibold text-foreground">2023 Tesla Model 3</p>
                    <p className="text-sm text-secondary mt-1">Spot B-01 • Parked 2h 15m</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Request Pickup</p>
                    <p className="font-display font-semibold text-secondary">~3 min ETA</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex gap-2">
                    <div className="flex-1 h-2 rounded-full bg-secondary" />
                    <div className="flex-1 h-2 rounded-full bg-secondary" />
                    <div className="flex-1 h-2 rounded-full bg-secondary/50 animate-pulse" />
                    <div className="flex-1 h-2 rounded-full bg-muted" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Attendant en route to your vehicle</p>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrackingSystem;
