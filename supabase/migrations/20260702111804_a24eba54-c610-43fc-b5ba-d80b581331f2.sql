
ALTER TABLE public.movies
  ADD COLUMN IF NOT EXISTS season_number integer,
  ADD COLUMN IF NOT EXISTS episode_number integer,
  ADD COLUMN IF NOT EXISTS series_title text;
CREATE INDEX IF NOT EXISTS movies_series_idx ON public.movies (series_title, season_number, episode_number);
