
-- Fix downloads UPDATE: scope to row owner only
DROP POLICY IF EXISTS downloads_update_anyone ON public.downloads;
CREATE POLICY downloads_update_self ON public.downloads
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Lock down SECURITY DEFINER functions executable surface
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.claim_admin() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
-- claim_admin must remain callable by signed-in users (one-time admin claim)
GRANT EXECUTE ON FUNCTION public.claim_admin() TO authenticated;
