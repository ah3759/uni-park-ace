import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, action, email } = await req.json();

    // Handle status lookup action
    if (action === "check_status" && email) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: requests, error } = await supabase
        .from("parking_requests")
        .select("id, first_name, last_name, vehicle_make, vehicle_model, vehicle_color, license_plate, pickup_location, service_type, status, created_at")
        .eq("email", email)
        .order("created_at", { ascending: false })
        .limit(5);

      const { data: schedules } = await supabase
        .from("valet_schedules")
        .select("id, vehicle_make, vehicle_model, vehicle_color, license_plate, pickup_location, scheduled_date, scheduled_time, status, created_at")
        .eq("customer_email", email)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        return new Response(JSON.stringify({ error: "Failed to look up requests" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ requests: requests || [], schedules: schedules || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Regular chat flow
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are UNiVale's friendly AI concierge assistant. You help customers navigate the website and answer questions about UNiVale's valet parking services.

Key information about UNiVale:
- UNiVale is a premium valet parking service
- Services: Standard Valet, Premium Valet, Event Valet for businesses
- Customers can schedule pickups, track their vehicle status, and manage requests
- Pricing plans are available on the website
- Business/event bookings are available for large gatherings
- Customers can sign in to their dashboard to manage requests
- The website sections include: Services, Schedule, Pricing, and Events

Website navigation help:
- To schedule a pickup → scroll to the "Schedule" section or use the parking form at the top
- To view pricing → scroll to the "Pricing" section
- To book for an event → scroll to the "Events" section  
- To sign in → click "Customer Sign In" in the navigation bar
- To learn about services → scroll to the "Services" section
- To get started → click "Get Started" button

If a customer asks about their request status, tell them to use the "Check My Status" button below the chat to look up their requests by email.

Keep responses concise, friendly, and helpful. Use markdown formatting for better readability. If you don't know something specific, suggest the customer contact support or explore the relevant section of the website.`
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
