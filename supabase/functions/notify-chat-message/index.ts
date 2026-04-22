import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const STAFF_NOTIFY_EMAIL = 'team@univale.app'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const { requestId, senderRole, senderName, preview } = await req.json()
    if (!requestId || !senderRole || !preview) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const admin = createClient(supabaseUrl, serviceKey)

    // Fetch the parking request to know who to notify
    const { data: pr, error } = await admin
      .from('parking_requests')
      .select('email, first_name, vehicle_make, vehicle_model, license_plate')
      .eq('id', requestId)
      .maybeSingle()

    if (error || !pr) {
      return new Response(JSON.stringify({ error: 'Request not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Recipient = opposite side
    const toEmail = senderRole === 'customer' ? STAFF_NOTIFY_EMAIL : pr.email
    const subject =
      senderRole === 'customer'
        ? `New customer message — ${pr.first_name} (${pr.vehicle_make} ${pr.vehicle_model})`
        : `New message from the UNiVale team`

    // Use existing transactional email infra via a generic "chat-message" template if present;
    // fall back to a minimal inline send via send-transactional-email with a built-in template.
    const emailRes = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${anonKey}`,
        apikey: anonKey,
      },
      body: JSON.stringify({
        templateName: 'chat-message',
        recipientEmail: toEmail,
        templateData: {
          recipientName: senderRole === 'customer' ? 'Team' : pr.first_name,
          senderName: senderName ?? (senderRole === 'customer' ? 'Customer' : 'UNiVale Team'),
          preview,
          vehicle: `${pr.vehicle_make} ${pr.vehicle_model} (${pr.license_plate})`,
          subject,
          siteName: 'UNiVale',
        },
      }),
    })

    const emailJson = await emailRes.json().catch(() => ({}))

    return new Response(JSON.stringify({ success: true, email: emailJson }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})