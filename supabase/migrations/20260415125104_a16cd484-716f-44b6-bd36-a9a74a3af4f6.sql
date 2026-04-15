
CREATE OR REPLACE FUNCTION public.get_queue_position(p_request_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
  req_status text;
  req_created_at timestamptz;
  req_first_name text;
  req_pickup_location text;
  position_in_queue int;
  total_in_queue int;
BEGIN
  -- Get the request details
  SELECT status, created_at, first_name, pickup_location
  INTO req_status, req_created_at, req_first_name, req_pickup_location
  FROM public.parking_requests
  WHERE id = p_request_id;

  -- Return null if request not found
  IF req_status IS NULL THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  -- If request is already completed or cancelled, return status only
  IF req_status NOT IN ('pending', 'confirmed') THEN
    RETURN jsonb_build_object(
      'found', true,
      'status', req_status,
      'firstName', req_first_name,
      'position', 0,
      'total', 0
    );
  END IF;

  -- Calculate position: count requests with pending/confirmed status created before this one
  SELECT COUNT(*) + 1
  INTO position_in_queue
  FROM public.parking_requests
  WHERE status IN ('pending', 'confirmed')
    AND created_at < req_created_at
    AND id != p_request_id;

  -- Get total in queue
  SELECT COUNT(*)
  INTO total_in_queue
  FROM public.parking_requests
  WHERE status IN ('pending', 'confirmed');

  RETURN jsonb_build_object(
    'found', true,
    'status', req_status,
    'firstName', req_first_name,
    'pickupLocation', req_pickup_location,
    'position', position_in_queue,
    'total', total_in_queue
  );
END;
$$;
