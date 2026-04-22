CREATE OR REPLACE FUNCTION public.cleanup_old_request_messages()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.request_messages WHERE created_at < now() - INTERVAL '30 days';
$$;