
-- 1) thumbnail for movies
ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS thumbnail_url text;

-- 2) downloads
CREATE TABLE IF NOT EXISTS public.downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL CHECK (content_type IN ('movie','highlight')),
  content_id uuid NOT NULL,
  user_id uuid,
  status text NOT NULL DEFAULT 'started' CHECK (status IN ('started','completed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);
GRANT SELECT, INSERT, UPDATE ON public.downloads TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.downloads TO anon;
GRANT ALL ON public.downloads TO service_role;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY downloads_insert_anyone ON public.downloads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY downloads_update_anyone ON public.downloads FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY downloads_admin_read ON public.downloads FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- 3) views
CREATE TABLE IF NOT EXISTS public.views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL CHECK (content_type IN ('movie','highlight')),
  content_id uuid NOT NULL,
  user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.views TO authenticated;
GRANT SELECT, INSERT ON public.views TO anon;
GRANT ALL ON public.views TO service_role;
ALTER TABLE public.views ENABLE ROW LEVEL SECURITY;
CREATE POLICY views_insert_anyone ON public.views FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY views_admin_read ON public.views FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- 4) watchlist
CREATE TABLE IF NOT EXISTS public.watchlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('movie','highlight')),
  content_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, content_type, content_id)
);
GRANT SELECT, INSERT, DELETE ON public.watchlist TO authenticated;
GRANT ALL ON public.watchlist TO service_role;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY watchlist_self_read ON public.watchlist FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY watchlist_self_insert ON public.watchlist FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY watchlist_self_delete ON public.watchlist FOR DELETE TO authenticated USING (auth.uid() = user_id);
