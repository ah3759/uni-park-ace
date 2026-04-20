import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const LOCATION_LABELS: Record<string, string> = {
  gracies: "Gracie's Dining Hall",
  global_village: 'Global Village',
  sau: 'Student Alumni Union (SAU)',
  golisano: 'Golisano Hall',
  gleason: 'Gleason Circle',
  sentinel: 'The Sentinel',
  infinity_quad: 'Infinity Quad',
}

const generateToken = () => {
  const bytes = new Uint8Array(24)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  try {
    const { requestId } = await req.json()
    if (!requestId || typeof requestId !== 'string') {
      return new Response(JSON.stringify({ error: 'requestId required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: request, error: reqErr } = await supabase
      .from('parking_requests')
      .select('id, email, first_name, last_name, vehicle_make, vehicle_model, vehicle_color, pickup_location')
      .eq('id', requestId)
      .maybeSingle()

    if (reqErr || !request) {
      return new Response(JSON.stringify({ error: 'Request not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Reuse existing token if one exists, else create
    let { data: existingToken } = await supabase
      .from('pickup_ping_tokens')
      .select('token')
      .eq('parking_request_id', request.id)
      .is('used_at', null)
      .maybeSingle()

    let token = existingToken?.token
    if (!token) {
      token = generateToken()
      const { error: tokenErr } = await supabase.from('pickup_ping_tokens').insert({
        parking_request_id: request.id,
        token,
        email: request.email,
      })
      if (tokenErr) throw tokenErr
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const pickupUrl = `${supabaseUrl}/functions/v1/request-pickup?token=${token}`
    const vehicleInfo = `${request.vehicle_color} ${request.vehicle_make} ${request.vehicle_model}`
    const locationLabel = LOCATION_LABELS[request.pickup_location] || request.pickup_location

    // Trigger transactional email
    const emailRes = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
      },
      body: JSON.stringify({
        templateName: 'pickup-ready',
        to: request.email,
        data: {
          customerName: request.first_name,
          vehicleInfo,
          pickupLocation: locationLabel,
          pickupUrl,
          dashboardUrl: 'https://univale.app/customer-login',
        },
      }),
    })

    const emailResult = await emailRes.json().catch(() => ({}))

    return new Response(JSON.stringify({ success: true, token, emailResult }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('send-pickup-ready-email error', err)
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
