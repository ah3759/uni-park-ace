import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Map Stripe price IDs -> internal plan tiers + period type + limits
const PRICE_TO_PLAN: Record<
  string,
  { tier: "monthly-pro" | "semester-pass"; period: "month" | "semester"; guestLimit: number; valetLimit: number | null }
> = {
  price_1TEXx9BJkLdDr3aBLtrLdwCS: { tier: "monthly-pro", period: "month", guestLimit: 2, valetLimit: null },
  price_1TEXxPBJkLdDr3aB1JBuQRaG: { tier: "semester-pass", period: "semester", guestLimit: 8, valetLimit: null },
};

// Semester boundaries (RIT-ish): Spring Jan 1 – Apr 30, Summer May 1 – Aug 15, Fall Aug 16 – Dec 31
function semesterStart(d: Date): string {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth(); // 0-11
  if (m <= 3) return `${y}-01-01`;
  if (m <= 6 || (m === 7 && d.getUTCDate() <= 15)) return `${y}-05-01`;
  return `${y}-08-16`;
}

function monthStart(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}-01`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { email } = await req.json();
    if (!email) throw new Error("email required");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Find Stripe customer
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (customers.data.length === 0) {
      return new Response(JSON.stringify({ isMember: false, reason: "no_customer" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const customerId = customers.data[0].id;

    // Find active subscription
    const subs = await stripe.subscriptions.list({ customer: customerId, status: "active", limit: 5 });
    let plan: (typeof PRICE_TO_PLAN)[string] | null = null;
    let subscriptionEnd: string | null = null;
    for (const sub of subs.data) {
      const priceId = sub.items.data[0]?.price?.id;
      if (priceId && PRICE_TO_PLAN[priceId]) {
        plan = PRICE_TO_PLAN[priceId];
        subscriptionEnd = new Date(sub.current_period_end * 1000).toISOString();
        break;
      }
    }

    if (!plan) {
      return new Response(JSON.stringify({ isMember: false, reason: "no_active_subscription" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Count uses in current period
    const now = new Date();
    const periodStart = plan.period === "month" ? monthStart(now) : semesterStart(now);

    const { data: uses } = await supabase
      .from("membership_uses")
      .select("id, is_guest_pass, created_at, parking_request_id")
      .eq("customer_email", email.toLowerCase())
      .gte("period_start", periodStart);

    const valetUses = (uses || []).filter((u) => !u.is_guest_pass).length;
    const guestUses = (uses || []).filter((u) => u.is_guest_pass).length;

    return new Response(
      JSON.stringify({
        isMember: true,
        tier: plan.tier,
        period: plan.period,
        periodStart,
        subscriptionEnd,
        valetUses,
        guestUses,
        guestLimit: plan.guestLimit,
        valetLimit: plan.valetLimit, // null = unlimited
        guestRemaining: Math.max(0, plan.guestLimit - guestUses),
        recentUses: uses || [],
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("check-membership error:", error);
    return new Response(JSON.stringify({ isMember: false, error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});