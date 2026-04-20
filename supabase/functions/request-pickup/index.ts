import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

const successPage = (vehicleInfo: string, location: string) => `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pickup requested — UNiVale</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: hsl(220, 20%, 97%); margin: 0; padding: 40px 16px; color: hsl(222, 47%, 11%); }
  .card { max-width: 480px; margin: 40px auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.06); text-align: center; }
  h1 { color: hsl(180, 60%, 35%); margin: 0 0 16px; font-size: 26px; }
  p { color: hsl(220, 9%, 35%); line-height: 1.6; margin: 12px 0; }
  .info { background: hsl(180, 50%, 95%); border-radius: 8px; padding: 16px; margin: 20px 0; }
  .label { font-size: 12px; text-transform: uppercase; color: hsl(220, 9%, 45%); letter-spacing: 0.5px; }
  .value { font-size: 16px; font-weight: 600; margin-top: 4px; }
  .check { font-size: 64px; line-height: 1; }
</style></head><body>
<div class="card">
  <div class="check">✅</div>
  <h1>We're on the way!</h1>
  <p>Your pickup request has been sent to our valet team. Head to your drop-off location — we'll have your car waiting.</p>
  <div class="info">
    <div class="label">Vehicle</div><div class="value">${vehicleInfo}</div>
    <div class="label" style="margin-top:12px">Meet us at</div><div class="value">${location}</div>
  </div>
  <p style="font-size:13px;color:hsl(220,9%,50%)">Typical arrival: 5–10 minutes</p>
</div></body></html>`

const errorPage = (msg: string) => `
<!DOCTYPE html><html><head><meta charset="utf-8"><title>UNiVale</title>
<style>body{font-family:-apple-system,sans-serif;background:hsl(220,20%,97%);padding:40px 16px;text-align:center;color:hsl(222,47%,11%)}
.card{max-width:480px;margin:40px auto;background:white;border-radius:16px;padding:40px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
h1{color:hsl(0,70%,45%)}</style></head><body>
<div class="card"><h1>Couldn't process pickup request</h1><p>${msg}</p>
<p><a href="https://univale.app/customer-login">Sign in to your account</a> to request pickup manually.</p></div></body></html>`

const LOCATION_LABELS: Record<string, string> = {
  gracies: "Gracie's Dining Hall",
  global_village: 'Global Village',
  sau: 'Student Alumni Union (SAU)',
  golisano: 'Golisano Hall',
  gleason: 'Gleason Circle',
  sentinel: 'The Sentinel',
  infinity_quad: 'Infinity Quad',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  try {
    let token: string | null = null
    let isJsonRequest = false

    if (req.method === 'GET') {
      token = new URL(req.url).searchParams.get('token')
    } else {
      isJsonRequest = true
      const body = await req.json().catch(() => ({}))
      token = body?.token ?? null
    }

    if (!token || typeof token !== 'string' || token.length < 16) {
      return req.method === 'GET'
        ? new Response(errorPage('Invalid or missing token.'), { status: 400, headers: { 'Content-Type': 'text/html', ...corsHeaders } })
        : new Response(JSON.stringify({ error: 'Invalid token' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Look up token
    const { data: tokenRow, error: tokenErr } = await supabase
      .from('pickup_ping_tokens')
      .select('id, parking_request_id, email, used_at')
      .eq('token', token)
      .maybeSingle()

    if (tokenErr || !tokenRow) {
      return req.method === 'GET'
        ? new Response(errorPage('This pickup link is invalid or has expired.'), { status: 404, headers: { 'Content-Type': 'text/html', ...corsHeaders } })
        : new Response(JSON.stringify({ error: 'Token not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Get parking request details
    const { data: request, error: reqErr } = await supabase
      .from('parking_requests')
      .select('id, first_name, last_name, vehicle_make, vehicle_model, vehicle_color, license_plate, pickup_location, status')
      .eq('id', tokenRow.parking_request_id)
      .maybeSingle()

    if (reqErr || !request) {
      return new Response(errorPage('Request not found.'), { status: 404, headers: { 'Content-Type': 'text/html', ...corsHeaders } })
    }

    const vehicleInfo = `${request.vehicle_color} ${request.vehicle_make} ${request.vehicle_model} (${request.license_plate})`
    const locationLabel = LOCATION_LABELS[request.pickup_location] || request.pickup_location

    // Check for existing active pickup request to avoid duplicates
    const { data: existing } = await supabase
      .from('pickup_requests')
      .select('id')
      .eq('parking_request_id', request.id)
      .in('status', ['pending', 'acknowledged'])
      .maybeSingle()

    if (!existing) {
      const { error: insertErr } = await supabase.from('pickup_requests').insert({
        parking_request_id: request.id,
        customer_email: tokenRow.email,
        customer_name: `${request.first_name} ${request.last_name}`.trim(),
        source: 'email_link',
        status: 'pending',
      })
      if (insertErr) throw insertErr
    }

    if (isJsonRequest) {
      return new Response(JSON.stringify({ success: true, vehicleInfo, location: locationLabel }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    return new Response(successPage(vehicleInfo, locationLabel), {
      status: 200, headers: { 'Content-Type': 'text/html', ...corsHeaders },
    })
  } catch (err) {
    console.error('request-pickup error', err)
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return req.method === 'GET'
      ? new Response(errorPage(msg), { status: 500, headers: { 'Content-Type': 'text/html', ...corsHeaders } })
      : new Response(JSON.stringify({ error: msg }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
