import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, ArrowLeft, Lock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const plans = {
  "pay-per-use": {
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
  },
  "monthly-pro": {
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
  },
  "semester-pass": {
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
  },
};

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const planId = searchParams.get("plan") as keyof typeof plans;
  const plan = planId ? plans[planId] : null;

  if (!plan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <h2 className="font-display text-2xl font-bold text-foreground">Plan not found</h2>
            <p className="text-muted-foreground">Please select a plan from our pricing page.</p>
            <Button variant="secondary" onClick={() => navigate("/#pricing")}>
              View Plans
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to subscribe to a plan.",
        variant: "destructive",
      });
      navigate("/customer-login");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { planId },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create checkout session.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-8 gap-2"
          onClick={() => navigate("/#pricing")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Plans
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-display text-xl">Order Summary</CardTitle>
              <CardDescription>Review your selected plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-lg font-bold text-foreground">{plan.name}</h3>
                <div className="text-right">
                  <span className="font-display text-3xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">{plan.description}</p>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-secondary" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Payment Section */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-display text-xl">Payment</CardTitle>
              <CardDescription>Secure checkout via Stripe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-2xl border border-border bg-muted/30 p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Secure Stripe Checkout
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  You'll be redirected to Stripe's secure checkout to complete your payment.
                </p>
              </div>

              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={handleSubscribe}
                disabled={isLoading || authLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  `Subscribe — ${plan.price} ${plan.period}`
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                Payments secured with 256-bit SSL encryption
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
