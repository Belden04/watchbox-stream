import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { mapMovieRow, mapHighlightRow, type Movie, type Highlight } from "@/lib/watchbox7-data";
import { MovieCard } from "@/components/watchbox7/MovieCard";
import { HighlightCard } from "@/components/watchbox7/HighlightCard";

const db = supabase as any;

export const Route = createFileRoute("/watchlist")({
  head: () => ({
    meta: [
      { title: "Watchlist — WatchBox7" },
      { name: "description", content: "Your saved movies and highlights." },
    ],
  }),
  component: WatchlistPage,
});

function WatchlistPage() {
  const { user, loading } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [busy, setBusy] = useState(true);

  const load = async () => {
    if (!user) return;
    setBusy(true);
    const { data: rows } = await db.from("watchlist").select("content_type, content_id").eq("user_id", user.id);
    const movieIds = (rows ?? []).filter((r: any) => r.content_type === "movie").map((r: any) => r.content_id);
    const hlIds = (rows ?? []).filter((r: any) => r.content_type === "highlight").map((r: any) => r.content_id);
    const [{ data: m }, { data: h }] = await Promise.all([
      movieIds.length ? db.from("movies").select("*").in("id", movieIds) : Promise.resolve({ data: [] }),
      hlIds.length ? db.from("highlights").select("*").in("id", hlIds) : Promise.resolve({ data: [] }),
    ]);
    setMovies((m ?? []).map(mapMovieRow));
    setHighlights((h ?? []).map(mapHighlightRow));
    setBusy(false);
  };

  useEffect(() => { if (user) load(); else setBusy(false); }, [user]);

  if (loading) return <div className="grid min-h-screen place-items-center pt-24 text-muted-foreground">Loading…</div>;

  if (!user) {
    return (
      <div className="pt-24">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8">
          <header className="mb-12">
            <h1 className="font-display text-5xl font-black tracking-tighter md:text-6xl">Watchlist</h1>
            <p className="mt-3 text-muted-foreground">Sign in to save and sync your library.</p>
          </header>
          <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-surface/40 py-24">
            <div className="max-w-md text-center">
              <div className="mx-auto mb-6 grid size-16 place-items-center rounded-full bg-surface-2">
                <Bookmark className="size-7 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold">Sign in required</h2>
              <p className="mt-2 text-sm text-muted-foreground">Create an account or sign in to save movies and highlights.</p>
              <div className="mt-6">
                <Link to="/login" className="rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:scale-105">Sign In</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isEmpty = !busy && movies.length === 0 && highlights.length === 0;

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <header className="mb-12">
          <h1 className="font-display text-5xl font-black tracking-tighter md:text-6xl">Watchlist</h1>
          <p className="mt-3 text-muted-foreground">Everything you've saved — in one place.</p>
        </header>

        {busy && <p className="py-12 text-center text-muted-foreground">Loading your watchlist…</p>}

        {isEmpty && (
          <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-surface/40 py-24">
            <div className="max-w-md text-center">
              <div className="mx-auto mb-6 grid size-16 place-items-center rounded-full bg-surface-2">
                <Bookmark className="size-7 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold">Your watchlist is empty</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Tap <span className="font-bold text-primary">+</span> on any movie or highlight to save it.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link to="/movies" className="rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:scale-105">Browse Movies</Link>
                <Link to="/sports" className="rounded-md border border-border bg-surface-2 px-5 py-2.5 text-sm font-bold hover:border-primary">Browse Highlights</Link>
              </div>
            </div>
          </div>
        )}

        {movies.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 font-display text-2xl font-black tracking-tight">Saved Movies</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {movies.map((m) => (
                <div key={m.id} className="flex justify-center">
                  <MovieCard movie={m} inWatchlist onWatchlistChange={load} />
                </div>
              ))}
            </div>
          </section>
        )}

        {highlights.length > 0 && (
          <section className="mb-20">
            <h2 className="mb-4 font-display text-2xl font-black tracking-tight">Saved Highlights</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {highlights.map((h) => (
                <HighlightCard key={h.id} h={h} inWatchlist onWatchlistChange={load} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
