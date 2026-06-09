
ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS production_company text DEFAULT '';
CREATE INDEX IF NOT EXISTS movies_production_company_idx ON public.movies (lower(production_company));

CREATE TABLE IF NOT EXISTS public.premium_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  method text NOT NULL,
  payer_phone text,
  reference text,
  plan text NOT NULL,
  amount numeric NOT NULL,
  note text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.premium_payments TO authenticated;
GRANT INSERT ON public.premium_payments TO anon;
GRANT ALL ON public.premium_payments TO service_role;
ALTER TABLE public.premium_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pp_insert_anyone" ON public.premium_payments FOR INSERT WITH CHECK (true);
CREATE POLICY "pp_select_own" ON public.premium_payments FOR SELECT USING (auth.uid() IS NOT NULL AND user_id = auth.uid());
CREATE POLICY "pp_admin_all" ON public.premium_payments FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
