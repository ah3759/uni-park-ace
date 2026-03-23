
-- Customer valet scheduling
CREATE TABLE public.valet_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  vehicle_make text NOT NULL,
  vehicle_model text NOT NULL,
  vehicle_color text NOT NULL,
  license_plate text NOT NULL,
  pickup_location text NOT NULL,
  scheduled_date date NOT NULL,
  scheduled_time time NOT NULL,
  special_instructions text,
  status text NOT NULL DEFAULT 'scheduled',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.valet_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a valet schedule" ON public.valet_schedules
  FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'scheduled');

CREATE POLICY "Customers can view own schedules" ON public.valet_schedules
  FOR SELECT TO authenticated
  USING (customer_email = (SELECT auth.jwt() ->> 'email'));

CREATE POLICY "Employees can view all schedules" ON public.valet_schedules
  FOR SELECT TO authenticated
  USING (is_employee());

CREATE POLICY "Employees can update schedules" ON public.valet_schedules
  FOR UPDATE TO authenticated
  USING (is_employee());

-- Business event inquiries
CREATE TABLE public.business_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text NOT NULL,
  event_type text NOT NULL,
  event_date date NOT NULL,
  event_end_date date,
  expected_guests integer NOT NULL,
  venue_location text NOT NULL,
  additional_details text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.business_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a business inquiry" ON public.business_inquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending');

CREATE POLICY "Employees can view all inquiries" ON public.business_inquiries
  FOR SELECT TO authenticated
  USING (is_employee());

CREATE POLICY "Employees can update inquiries" ON public.business_inquiries
  FOR UPDATE TO authenticated
  USING (is_employee());

-- Updated at triggers
CREATE TRIGGER update_valet_schedules_updated_at
  BEFORE UPDATE ON public.valet_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_inquiries_updated_at
  BEFORE UPDATE ON public.business_inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
