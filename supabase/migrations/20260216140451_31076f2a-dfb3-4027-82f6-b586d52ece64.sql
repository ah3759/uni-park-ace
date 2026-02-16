
-- Drop the overly permissive policy
DROP POLICY "Anyone can submit a parking request" ON public.parking_requests;

-- Recreate with column-level restriction: only allow setting customer-facing fields
-- Status defaults to 'pending', assigned_employee_id stays null
CREATE POLICY "Anyone can submit a parking request"
  ON public.parking_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'pending' 
    AND assigned_employee_id IS NULL
  );
