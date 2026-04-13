-- Allow employees to insert parking requests on behalf of customers
CREATE POLICY "Employees can create requests"
ON public.parking_requests
FOR INSERT
TO authenticated
WITH CHECK (is_employee());

-- Allow employees to delete parking requests
CREATE POLICY "Employees can delete requests"
ON public.parking_requests
FOR DELETE
TO authenticated
USING (is_employee());