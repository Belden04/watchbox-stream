import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CATEGORIES, mapMovieRow, type Movie } from "@/lib/sportflix-data";
import { MovieCard } from "@/components/sportflix/MovieCard";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/movies")({
  head: () => ({
    meta: [
      { title: "Movies — SPORTFLIX" },
      { name: "description", content: "Browse translated (umusobanuwe) and non-translated movies." },
    ],
  }),
  component: MoviesPage,
});

const db = supabase as any;

function MoviesPage() {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("All");
  const [tab, setTab] = useState<"all" | "translated" | "non">("all");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.from("movies")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }: { data: any[] | null }) => {
        setMovies((data ?? []).map(mapMovieRow));
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    const ql = q.toLowerCase();
    return movies.filter((m) => {
      if (tab === "translated" && !m.is_translated) return false;
      if (tab === "non" && m.is_translated) return false;
      const matchQ =
        !ql ||
        m.title.toLowerCase().includes(ql) ||
        m.genre.toLowerCase().includes(ql) ||
        m.director.toLowerCase().includes(ql) ||
        m.country.toLowerCase().includes(ql) ||
        m.language.toLowerCase().includes(ql) ||
        (m.translator ?? "").toLowerCase().includes(ql) ||
        String(m.year).includes(ql);
      const matchG = genre === "All" || m.genre.includes(genre);
      return matchQ && matchG;
    });
  }, [q, genre, tab, movies]);

  const tabs: { key: typeof tab; label: string; count: number }[] = [
    { key: "all", label: "All", count: movies.length },
    { key: "translated", label: "Translated (Umusobanuwe)", count: movies.filter((m) => m.is_translated).length },
    { key: "non", label: "Non-Translated", count: movies.filter((m) => !m.is_translated).length },
  ];

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <header className="mb-8 space-y-4">
          <h1 className="font-display text-5xl font-black tracking-tighter md:text-6xl">Movies</h1>
          <p className="max-w-2xl text-muted-foreground">
            Translated and non-translated films, uploaded by the SPORTFLIX team.
          </p>
        </header>

        <div className="mb-6 flex flex-wrap gap-2 border-b border-border">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative px-4 py-3 text-sm font-bold transition-colors ${
                tab === t.key ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label} <span className="ml-1 text-xs opacity-70">({t.count})</span>
              {tab === t.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
          ))}
        </div>

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title, genre, director, country, year, translator..."
              className="w-full rounded-full border border-border bg-surface-2 py-3 pl-11 pr-5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="scrollbar-hide flex gap-2 overflow-x-auto">
            {["All", ...CATEGORIES.slice(0, 8)].map((g) => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  genre === g
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface-2 text-muted-foreground hover:text-foreground"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid place-items-center py-24 text-muted-foreground">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="grid place-items-center py-24 text-muted-foreground">
            {movies.length === 0
              ? "No movies have been uploaded yet."
              : "No movies match your search."}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 pb-20 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filtered.map((m) => (
              <div key={m.id} className="flex justify-center">
                <MovieCard movie={m} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
