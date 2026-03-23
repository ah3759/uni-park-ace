import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Shield, MapPin } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen hero-gradient overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-secondary/30 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-sm font-medium text-primary-foreground/80">
              Campus Valet Revolution
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-slide-up">
            Premium Valet for the
            <span className="block text-gradient mt-2">Modern Campus</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Skip the parking hassle. UNiVale delivers seamless valet services with real-time tracking, guaranteed return times, and flexible plans designed for university life.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <Button variant="hero" size="xl" onClick={() => document.getElementById('parking-form')?.scrollIntoView({ behavior: 'smooth' })}>
              Start Parking Smarter Now
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="heroOutline" size="xl" onClick={() => document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' })}>
              Schedule a Pickup
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <div className="flex items-center justify-center gap-3 p-4 rounded-2xl glass-card border border-secondary/20">
              <Clock className="w-6 h-6 text-secondary" />
              <div className="text-left">
                <p className="font-display font-semibold text-primary-foreground">5-Min Guarantee</p>
                <p className="text-sm text-primary-foreground/60">Or your next valet is free</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 rounded-2xl glass-card border border-secondary/20">
              <MapPin className="w-6 h-6 text-secondary" />
              <div className="text-left">
                <p className="font-display font-semibold text-primary-foreground">Live Tracking</p>
                <p className="text-sm text-primary-foreground/60">Know where your car is</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 rounded-2xl glass-card border border-secondary/20">
              <Shield className="w-6 h-6 text-secondary" />
              <div className="text-left">
                <p className="font-display font-semibold text-primary-foreground">Fully Insured</p>
                <p className="text-sm text-primary-foreground/60">Complete protection</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-24 fill-background" viewBox="0 0 1440 96" preserveAspectRatio="none">
          <path d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,80C672,85,768,75,864,64C960,53,1056,43,1152,42.7C1248,43,1344,53,1392,58.7L1440,64L1440,96L1392,96C1344,96,1248,96,1152,96C1056,96,960,96,864,96C768,96,672,96,576,96C480,96,384,96,288,96C192,96,96,96,48,96L0,96Z" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
