-- Create chat messages table
CREATE TABLE public.request_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.parking_requests(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('customer', 'employee')),
  sender_user_id UUID,
  sender_name TEXT,
  body TEXT NOT NULL CHECK (length(body) > 0 AND length(body) <= 2000),
  read_by_customer BOOLEAN NOT NULL DEFAULT false,
  read_by_employee BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_request_messages_request_id ON public.request_messages(request_id, created_at);
CREATE INDEX idx_request_messages_created_at ON public.request_messages(created_at);

ALTER TABLE public.request_messages ENABLE ROW LEVEL SECURITY;

-- Employees: full access
CREATE POLICY "Employees view all messages"
ON public.request_messages FOR SELECT
TO authenticated
USING (is_employee());

CREATE POLICY "Employees insert messages"
ON public.request_messages FOR INSERT
TO authenticated
WITH CHECK (is_employee() AND sender_role = 'employee');

CREATE POLICY "Employees update messages"
ON public.request_messages FOR UPDATE
TO authenticated
USING (is_employee());

-- Customers: only their own request threads (matched by email)
CREATE POLICY "Customers view own request messages"
ON public.request_messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.parking_requests pr
    WHERE pr.id = request_messages.request_id
      AND pr.email = (SELECT auth.jwt() ->> 'email')
  )
);

CREATE POLICY "Customers insert own request messages"
ON public.request_messages FOR INSERT
TO authenticated
WITH CHECK (
  sender_role = 'customer'
  AND EXISTS (
    SELECT 1 FROM public.parking_requests pr
    WHERE pr.id = request_messages.request_id
      AND pr.email = (SELECT auth.jwt() ->> 'email')
  )
);

CREATE POLICY "Customers update read flag on own messages"
ON public.request_messages FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.parking_requests pr
    WHERE pr.id = request_messages.request_id
      AND pr.email = (SELECT auth.jwt() ->> 'email')
  )
);

-- Enable realtime
ALTER TABLE public.request_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.request_messages;

-- 30-day cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_old_request_messages()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.request_messages WHERE created_at < now() - INTERVAL '30 days';
$$;