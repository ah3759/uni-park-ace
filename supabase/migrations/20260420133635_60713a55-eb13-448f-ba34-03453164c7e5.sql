-- Pickup ping tokens (sent via email, one-click no-login flow)
CREATE TABLE public.pickup_ping_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parking_request_id UUID NOT NULL REFERENCES public.parking_requests(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  used_at TIMESTAMPTZ
);

CREATE INDEX idx_pickup_ping_tokens_token ON public.pickup_ping_tokens(token);
CREATE INDEX idx_pickup_ping_tokens_request ON public.pickup_ping_tokens(parking_request_id);

ALTER TABLE public.pickup_ping_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages pickup tokens"
ON public.pickup_ping_tokens FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Employees can view pickup tokens"
ON public.pickup_ping_tokens FOR SELECT
TO authenticated
USING (is_employee());

-- Pickup requests (the actual "bring my car back" pings)
CREATE TABLE public.pickup_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parking_request_id UUID NOT NULL REFERENCES public.parking_requests(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  source TEXT NOT NULL DEFAULT 'dashboard',
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  acknowledged_at TIMESTAMPTZ,
  acknowledged_by UUID REFERENCES public.profiles(id),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pickup_requests_status ON public.pickup_requests(status);
CREATE INDEX idx_pickup_requests_email ON public.pickup_requests(customer_email);
CREATE INDEX idx_pickup_requests_parking ON public.pickup_requests(parking_request_id);

ALTER TABLE public.pickup_requests ENABLE ROW LEVEL SECURITY;

-- Customers can see their own pickup requests
CREATE POLICY "Customers view own pickup requests"
ON public.pickup_requests FOR SELECT
TO authenticated
USING (customer_email = (SELECT auth.jwt() ->> 'email'));

-- Logged-in customers can create pickup requests for their own email
CREATE POLICY "Customers create own pickup requests"
ON public.pickup_requests FOR INSERT
TO authenticated
WITH CHECK (
  customer_email = (SELECT auth.jwt() ->> 'email')
  AND status = 'pending'
);

-- Employees full access
CREATE POLICY "Employees view all pickup requests"
ON public.pickup_requests FOR SELECT
TO authenticated
USING (is_employee());

CREATE POLICY "Employees update pickup requests"
ON public.pickup_requests FOR UPDATE
TO authenticated
USING (is_employee());

CREATE POLICY "Employees create pickup requests"
ON public.pickup_requests FOR INSERT
TO authenticated
WITH CHECK (is_employee());

-- Service role (for token-based anonymous pings via edge function)
CREATE POLICY "Service role manages pickup requests"
ON public.pickup_requests FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Updated_at trigger
CREATE TRIGGER trg_pickup_requests_updated_at
BEFORE UPDATE ON public.pickup_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Reminder dedupe table for scheduled valet appointments
CREATE TABLE public.schedule_reminders_sent (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  schedule_id UUID NOT NULL REFERENCES public.valet_schedules(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(schedule_id, reminder_type)
);

ALTER TABLE public.schedule_reminders_sent ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages reminders"
ON public.schedule_reminders_sent FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Employees view reminders"
ON public.schedule_reminders_sent FOR SELECT
TO authenticated
USING (is_employee());

-- Enable realtime for pickup_requests
ALTER PUBLICATION supabase_realtime ADD TABLE public.pickup_requests;
ALTER TABLE public.pickup_requests REPLICA IDENTITY FULL;