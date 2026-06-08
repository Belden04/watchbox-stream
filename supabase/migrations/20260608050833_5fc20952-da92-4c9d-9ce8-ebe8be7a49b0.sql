
DROP POLICY IF EXISTS downloads_insert_anyone ON public.downloads;
CREATE POLICY downloads_insert_self_or_anon ON public.downloads
  FOR INSERT TO anon, authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

DROP POLICY IF EXISTS views_insert_anyone ON public.views;
CREATE POLICY views_insert_self_or_anon ON public.views
  FOR INSERT TO anon, authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());
