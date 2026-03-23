import { Building2, Users, Trophy, GraduationCap, Music, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

const Partnerships = () => {
  const partners = [
    { icon: GraduationCap, name: "Athletics Dept", events: "48 events/year" },
    { icon: Building2, name: "Student Union", events: "36 events/year" },
    { icon: Music, name: "Fine Arts Center", events: "24 events/year" },
    { icon: Briefcase, name: "Alumni Association", events: "18 events/year" },
    { icon: Trophy, name: "Conference Center", events: "52 events/year" },
    { icon: Users, name: "Greek Life", events: "30 events/year" },
  ];

  return (
    <section id="partnerships" className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
              <Building2 className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">Campus Partnerships</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
              Event Valet
              <span className="text-gradient"> Made Easy</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              From football games to galas, we partner with campus departments to deliver seamless valet experiences for any event size. Custom branding, dedicated staff, and flexible packages.
            </p>

            {/* Partnership Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 rounded-2xl bg-card border border-border">
                <p className="font-display text-3xl font-bold text-foreground">15+</p>
                <p className="text-sm text-muted-foreground">Active Partners</p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-card border border-border">
                <p className="font-display text-3xl font-bold text-foreground">200+</p>
                <p className="text-sm text-muted-foreground">Events/Year</p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-card border border-border">
                <p className="font-display text-3xl font-bold text-foreground">50k+</p>
                <p className="text-sm text-muted-foreground">Guests Served</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="secondary" size="lg">
                Become a Partner
              </Button>
              <Button variant="outline" size="lg">
                Download Event Brochure
              </Button>
            </div>
          </div>

          {/* Right - Partner Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {partners.map((partner, index) => (
              <div
                key={partner.name}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-secondary/30 hover:shadow-card transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                  <partner.icon className="w-6 h-6 text-secondary" />
                </div>
                <h4 className="font-display font-semibold text-foreground mb-1">
                  {partner.name}
                </h4>
                <p className="text-sm text-muted-foreground">{partner.events}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Event CTA */}
        <div className="mt-20 p-8 md:p-12 rounded-3xl hero-gradient relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
          </div>
          
          <div className="relative text-center max-w-2xl mx-auto">
            <h3 className="font-display text-2xl md:text-4xl font-bold text-primary-foreground mb-4">
              Planning a Campus Event?
            </h3>
            <p className="text-primary-foreground/70 mb-8">
              Get a custom quote for your next event. We handle events of all sizes, from intimate gatherings to stadium-sized celebrations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="lg" onClick={() => document.getElementById('business-booking')?.scrollIntoView({ behavior: 'smooth' })}>
                Request Custom Quote
              </Button>
              <Button variant="heroOutline" size="lg" onClick={() => document.getElementById('business-booking')?.scrollIntoView({ behavior: 'smooth' })}>
                Book Event Valet
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partnerships;
