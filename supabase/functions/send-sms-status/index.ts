const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/twilio";
const TWILIO_FROM_NUMBER = "+18885764229";

const STATUS_MESSAGES: Record<string, string> = {
  confirmed: "Your valet request has been confirmed! We'll be ready for your vehicle. 🚗",
  in_progress: "Your vehicle is now being handled by our valet team. We'll notify you when it's ready! 🅿️",
  completed: "Your vehicle is ready for pickup! Please head to your designated location. ✅",
  cancelled: "Your valet request has been cancelled. If this was a mistake, please contact us.",
  queue_link: "You're checked in! Track your queue position here:",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const TWILIO_API_KEY = Deno.env.get("TWILIO_API_KEY");
    if (!TWILIO_API_KEY) throw new Error("TWILIO_API_KEY is not configured");

    const { phone, firstName, status, queueUrl } = await req.json();

    if (!phone || !firstName || !status) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: phone, firstName, status" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Ensure E.164 format (add +1 for US numbers if missing)
    let formattedPhone = phone.replace(/\D/g, "");
    if (formattedPhone.length === 10) {
      formattedPhone = `+1${formattedPhone}`;
    } else if (!formattedPhone.startsWith("+")) {
      formattedPhone = `+${formattedPhone}`;
    }

    // Validate: must be E.164 with 10–15 digits. Skip short codes / invalid numbers gracefully.
    const digitsOnly = formattedPhone.replace(/\D/g, "");
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      console.warn(`Skipping SMS — invalid phone number: ${phone}`);
      return new Response(
        JSON.stringify({ success: false, skipped: true, reason: "invalid_phone_number", phone }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const messageTemplate = STATUS_MESSAGES[status];
    if (!messageTemplate) {
      return new Response(
        JSON.stringify({ error: `No SMS template for status: ${status}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let body = `Hi ${firstName}! ${messageTemplate}`;
    if (status === "queue_link" && queueUrl) {
      body += ` ${queueUrl}`;
    }
    body += " — UniVale Valet";

    const response = await fetch(`${GATEWAY_URL}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": TWILIO_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: formattedPhone,
        From: TWILIO_FROM_NUMBER,
        Body: body,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Twilio API error:", data);
      throw new Error(`Twilio API error [${response.status}]: ${JSON.stringify(data)}`);
    }

    return new Response(
      JSON.stringify({ success: true, sid: data.sid }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("SMS send error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
