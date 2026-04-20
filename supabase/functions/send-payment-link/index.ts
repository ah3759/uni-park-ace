import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRICE_MAP: Record<string, string> = {
  "pay-per-use": "price_1TEXwoBJkLdDr3aBmiDcKK5C",
  "monthly-pro": "price_1TEXx9BJkLdDr3aBLtrLdwCS",
  "semester-pass": "price_1TEXxPBJkLdDr3aB1JBuQRaG",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { requestId, planId = "pay-per-use" } = await req.json();
    if (!requestId) throw new Error("requestId required");
    const priceId = PRICE_MAP[planId];
    if (!priceId) throw new Error(`Invalid plan: ${planId}`);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: pr, error: prErr } = await supabase
      .from("parking_requests")
      .select("id, first_name, last_name, email, vehicle_make, vehicle_model, license_plate")
      .eq("id", requestId)
      .single();
    if (prErr || !pr) throw new Error("Request not found");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const origin = req.headers.get("origin") || "https://univale.app";
    const session = await stripe.checkout.sessions.create({
      customer_email: pr.email,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: planId === "pay-per-use" ? "payment" : "subscription",
      success_url: `${origin}/customer-dashboard?checkout=success`,
      cancel_url: `${origin}/checkout?plan=${planId}`,
      metadata: { parking_request_id: requestId },
    });

    // Send email with payment link
    const { error: emailErr } = await supabase.functions.invoke("send-transactional-email", {
      body: {
        template: "status-update",
        to: pr.email,
        data: {
          firstName: pr.first_name,
          status: "Payment Requested",
          message: `Thank you for using UNiVale! Your vehicle (${pr.vehicle_make} ${pr.vehicle_model} • ${pr.license_plate}) is ready. Please complete your payment using the secure link below.`,
          ctaUrl: session.url,
          ctaLabel: "Pay Now",
        },
      },
    });

    if (emailErr) console.error("Email send error:", emailErr);

    return new Response(
      JSON.stringify({ success: true, url: session.url, emailed: !emailErr }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    console.error("send-payment-link error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
