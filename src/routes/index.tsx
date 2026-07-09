import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Hero } from "@/components/sportflix/Hero";
import { Rail } from "@/components/sportflix/Rail";
import { MovieCard } from "@/components/sportflix/MovieCard";
import { mapMovieRow, type Movie } from "@/lib/sportflix-data";
import { supabase } from "@/integrations/supabase/client";

const db = supabase as any;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WatchBox7 | The home of translated & non-translated & all matches highlights" },
      { name: "description", content: "Translated & non-translated movies and all matches highlights. Watch and download as a guest." },
      { property: "og:title", content: "WatchBox7" },
    ],
  }),
  component: Home,
});

function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    db.from("movies")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }: { data: any[] | null }) => {
        setMovies((data ?? []).map(mapMovieRow));
      });
  }, []);

  const hero = movies.slice(0, Math.max(3, Math.min(movies.length, 5)));
  const trending = movies.filter((m) => (m as any).is_trending) ?? [];
  const newUploads = movies.slice(0, 12);

  return (
    <>
      <Hero movies={hero} />

      {trending.length > 0 && (
        <Rail title="Trending Now" accent="primary" viewAllHref="/movies">
          {trending.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </Rail>
      )}

      <Rail title="New Uploads" accent="primary" viewAllHref="/movies">
        {newUploads.length === 0 ? (
          <p className="px-4 text-sm text-muted-foreground">No movies yet — the admin will upload soon.</p>
        ) : (
          newUploads.map((m) => <MovieCard key={m.id} movie={m} />)
        )}
      </Rail>

    </>
  );
}
