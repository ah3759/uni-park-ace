import { CreditCard, Calendar, Building2, Sparkles } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: CreditCard,
      title: "Pay-Per-Use",
      description: "Perfect for occasional parkers. Pay only when you valet, with transparent per-visit pricing and no commitments.",
      features: ["$8 per valet", "No minimum", "Instant booking"],
      gradient: "from-secondary to-secondary/70",
    },
    {
      icon: Calendar,
      title: "Monthly Subscriptions",
      description: "Unlimited valet access for regular campus visitors. Save up to 40% compared to pay-per-use rates.",
      features: ["Unlimited valets", "Priority pickup", "Reserved spots"],
      gradient: "from-primary to-primary/80",
    },
    {
      icon: Building2,
      title: "Event Partnerships",
      description: "Partner with us for campus events, department functions, and special occasions with custom solutions.",
      features: ["Custom packages", "Dedicated staff", "Branded experience"],
      gradient: "from-secondary to-primary",
    },
  ];

  return (
    <section id="services" className="py-24 bg-background relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">Flexible Options</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Parking Plans That Fit
            <span className="text-gradient"> Your Life</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you're on campus daily or just for game days, we have the perfect valet solution for you.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group relative p-8 rounded-3xl bg-card shadow-card hover:shadow-elevated transition-all duration-500 border border-border hover:border-secondary/30"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 shadow-glow group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="w-7 h-7 text-accent-foreground" />
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
