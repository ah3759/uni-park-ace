-- Saved vehicles per customer (keyed by email so it ties to existing email-based RLS pattern)
CREATE TABLE public.customer_vehicles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email text NOT NULL,
  nickname text,
  vehicle_make text NOT NULL,
  vehicle_model text NOT NULL,
  vehicle_year text,
  vehicle_color text NOT NULL,
  license_plate text NOT NULL,
  license_plate_state text,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_customer_vehicles_email ON public.customer_vehicles (customer_email);
CREATE UNIQUE INDEX idx_customer_vehicles_unique_plate
  ON public.customer_vehicles (customer_email, lower(license_plate));

ALTER TABLE public.customer_vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers view own vehicles"
  ON public.customer_vehicles FOR SELECT TO authenticated
  USING (customer_email = (SELECT (auth.jwt() ->> 'email')));

CREATE POLICY "Customers insert own vehicles"
  ON public.customer_vehicles FOR INSERT TO authenticated
  WITH CHECK (customer_email = (SELECT (auth.jwt() ->> 'email')));

CREATE POLICY "Customers update own vehicles"
  ON public.customer_vehicles FOR UPDATE TO authenticated
  USING (customer_email = (SELECT (auth.jwt() ->> 'email')));

CREATE POLICY "Customers delete own vehicles"
  ON public.customer_vehicles FOR DELETE TO authenticated
  USING (customer_email = (SELECT (auth.jwt() ->> 'email')));

CREATE POLICY "Employees view all vehicles"
  ON public.customer_vehicles FOR SELECT TO authenticated
  USING (is_employee());

CREATE TRIGGER trg_customer_vehicles_updated
  BEFORE UPDATE ON public.customer_vehicles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Saved customer profile (name, phone, default pickup location)
CREATE TABLE public.customer_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email text NOT NULL UNIQUE,
  first_name text,
  last_name text,
  phone text,
  default_pickup_location text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers view own profile row"
  ON public.customer_profiles FOR SELECT TO authenticated
  USING (customer_email = (SELECT (auth.jwt() ->> 'email')));

CREATE POLICY "Customers insert own profile row"
  ON public.customer_profiles FOR INSERT TO authenticated
  WITH CHECK (customer_email = (SELECT (auth.jwt() ->> 'email')));

CREATE POLICY "Customers update own profile row"
  ON public.customer_profiles FOR UPDATE TO authenticated
  USING (customer_email = (SELECT (auth.jwt() ->> 'email')));

CREATE POLICY "Employees view all profile rows"
  ON public.customer_profiles FOR SELECT TO authenticated
  USING (is_employee());

CREATE TRIGGER trg_customer_profiles_updated
  BEFORE UPDATE ON public.customer_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();