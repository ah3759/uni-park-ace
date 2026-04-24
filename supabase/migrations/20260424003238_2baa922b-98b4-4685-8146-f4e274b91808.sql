CREATE TABLE public.membership_uses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parking_request_id uuid NOT NULL REFERENCES public.parking_requests(id) ON DELETE CASCADE,
  customer_email text NOT NULL,
  plan_tier text NOT NULL,
  period_start date NOT NULL,
  is_guest_pass boolean NOT NULL DEFAULT false,
  recorded_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_membership_uses_email_period ON public.membership_uses (customer_email, period_start);
CREATE UNIQUE INDEX idx_membership_uses_request ON public.membership_uses (parking_request_id);

ALTER TABLE public.membership_uses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees view membership uses"
  ON public.membership_uses FOR SELECT TO authenticated
  USING (is_employee());

CREATE POLICY "Employees insert membership uses"
  ON public.membership_uses FOR INSERT TO authenticated
  WITH CHECK (is_employee());

CREATE POLICY "Employees delete membership uses"
  ON public.membership_uses FOR DELETE TO authenticated
  USING (is_employee());

CREATE POLICY "Service role manages membership uses"
  ON public.membership_uses FOR ALL TO public
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');