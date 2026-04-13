ALTER TABLE public.parking_requests ADD COLUMN license_plate_state text;
ALTER TABLE public.valet_schedules ADD COLUMN license_plate_state text;
ALTER TABLE public.business_inquiries ADD COLUMN license_plate_state text;