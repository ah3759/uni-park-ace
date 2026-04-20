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

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

const formatTime = (timeStr: string) => {
  const [h, m] = timeStr.split(':')
  const hour = parseInt(h, 10)
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${m} ${period}`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  try {
    const now = new Date()
    // 24h window: schedules between 23h and 25h from now
    const in23h = new Date(now.getTime() + 23 * 3600 * 1000)
    const in25h = new Date(now.getTime() + 25 * 3600 * 1000)
    // 1h window: schedules between 30min and 90min from now
    const in30m = new Date(now.getTime() + 30 * 60 * 1000)
    const in90m = new Date(now.getTime() + 90 * 60 * 1000)

    const sent: { id: string; type: string }[] = []
    const failed: string[] = []

    const { data: schedules, error } = await supabase
      .from('valet_schedules')
      .select('*')
      .eq('status', 'scheduled')

    if (error) throw error

    for (const sched of schedules ?? []) {
      const scheduledAt = new Date(`${sched.scheduled_date}T${sched.scheduled_time}`)

      const sendReminder = async (type: '24h' | '1h') => {
        // Already sent?
        const { data: dupe } = await supabase
          .from('schedule_reminders_sent')
          .select('id')
          .eq('schedule_id', sched.id)
          .eq('reminder_type', type)
          .maybeSingle()
        if (dupe) return

        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const res = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          },
          body: JSON.stringify({
            templateName: 'pickup-reminder',
            to: sched.customer_email,
            data: {
              customerName: sched.customer_name?.split(' ')[0] || 'there',
              vehicleInfo: `${sched.vehicle_color} ${sched.vehicle_make} ${sched.vehicle_model}`,
              pickupLocation: LOCATION_LABELS[sched.pickup_location] || sched.pickup_location,
              scheduledDate: formatDate(sched.scheduled_date),
              scheduledTime: formatTime(sched.scheduled_time),
              reminderType: type,
            },
          }),
        })

        if (res.ok) {
          await supabase.from('schedule_reminders_sent').insert({
            schedule_id: sched.id,
            reminder_type: type,
          })
          sent.push({ id: sched.id, type })
        } else {
          failed.push(sched.id)
        }
      }

      if (scheduledAt >= in23h && scheduledAt <= in25h) await sendReminder('24h')
      if (scheduledAt >= in30m && scheduledAt <= in90m) await sendReminder('1h')
    }

    return new Response(JSON.stringify({ success: true, sent, failed, checked: schedules?.length ?? 0 }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('send-schedule-reminders error', err)
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
