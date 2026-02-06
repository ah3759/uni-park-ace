import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const Pricing = () => {
  const plans = [
    {
      name: "Pay-Per-Use",
      price: "$8",
      period: "per valet",
      description: "Perfect for occasional campus visitors",
      features: [
        "Single-use valet service",
        "Real-time car tracking",
        "5-minute guarantee",
        "Text notifications",
        "Insurance coverage",
      ],
      cta: "Book Now",
      popular: false,
    },
    {
      name: "Monthly Pro",
      price: "$99",
      period: "per month",
      description: "Unlimited access for regular parkers",
      features: [
        "Unlimited valet services",
        "Priority pickup queue",
        "Reserved premium spots",
        "Guest passes (2/month)",
        "Premium support",
        "Early event access",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Semester Pass",
      price: "$399",
      period: "per semester",
      description: "Best value for students & faculty",
      features: [
        "Everything in Monthly Pro",
        "4 months of coverage",
        "Save $97 vs monthly",
        "Guest passes (8 total)",
        "Exclusive member events",
        "Free car washes (4x)",
      ],
      cta: "Get Semester Pass",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
            <Star className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">Simple Pricing</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Choose Your
            <span className="text-gradient"> Parking Plan</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Transparent pricing with no hidden fees. Cancel anytime.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-3xl border transition-all duration-500 ${
                plan.popular
                  ? "bg-gradient-to-b from-card to-secondary/5 border-secondary/30 shadow-elevated scale-105"
                  : "bg-card border-border hover:border-secondary/30 hover:shadow-card"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 accent-gradient rounded-full text-sm font-semibold text-accent-foreground shadow-glow">
                  Most Popular
                </div>
              )}

              {/* Plan Info */}
              <div className="text-center mb-8">
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="font-display text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-secondary" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                variant={plan.popular ? "hero" : "secondary"}
                size="lg"
                className="w-full"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Trust Note */}
        <p className="text-center text-sm text-muted-foreground mt-12">
          All plans include our 5-minute guarantee, full insurance, and 24/7 support.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
