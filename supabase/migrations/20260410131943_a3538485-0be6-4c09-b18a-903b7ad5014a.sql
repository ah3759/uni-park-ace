
-- Create storage bucket for vehicle photos
INSERT INTO storage.buckets (id, name, public) VALUES ('vehicle-photos', 'vehicle-photos', true);

-- Storage policies for vehicle photos bucket
CREATE POLICY "Employees can upload vehicle photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'vehicle-photos' AND public.is_employee());

CREATE POLICY "Employees can view vehicle photos"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'vehicle-photos' AND public.is_employee());

CREATE POLICY "Anyone can view vehicle photos publicly"
ON storage.objects FOR SELECT TO anon
USING (bucket_id = 'vehicle-photos');

-- Create inspection status enum
CREATE TYPE public.inspection_status AS ENUM ('pending', 'photos_taken', 'parked', 'completed');

-- Vehicle inspections table
CREATE TABLE public.vehicle_inspections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.parking_requests(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL,
  parking_latitude DOUBLE PRECISION,
  parking_longitude DOUBLE PRECISION,
  parking_description TEXT,
  parking_photo_path TEXT,
  status inspection_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(request_id)
);

ALTER TABLE public.vehicle_inspections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees can view inspections"
ON public.vehicle_inspections FOR SELECT TO authenticated
USING (public.is_employee());

CREATE POLICY "Employees can create inspections"
ON public.vehicle_inspections FOR INSERT TO authenticated
WITH CHECK (public.is_employee());

CREATE POLICY "Employees can update inspections"
ON public.vehicle_inspections FOR UPDATE TO authenticated
USING (public.is_employee());

-- Vehicle photos table
CREATE TABLE public.vehicle_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inspection_id UUID NOT NULL REFERENCES public.vehicle_inspections(id) ON DELETE CASCADE,
  photo_path TEXT NOT NULL,
  angle TEXT NOT NULL CHECK (angle IN ('front', 'back', 'left', 'right', 'dashboard', 'other')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.vehicle_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees can view photos"
ON public.vehicle_photos FOR SELECT TO authenticated
USING (public.is_employee());

CREATE POLICY "Employees can add photos"
ON public.vehicle_photos FOR INSERT TO authenticated
WITH CHECK (public.is_employee());

-- Trigger for updated_at on inspections
CREATE TRIGGER update_vehicle_inspections_updated_at
BEFORE UPDATE ON public.vehicle_inspections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
