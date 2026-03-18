CREATE POLICY "Customers can view own requests by email"
ON public.parking_requests
FOR SELECT
TO authenticated
USING (email = (SELECT auth.jwt() ->> 'email'));