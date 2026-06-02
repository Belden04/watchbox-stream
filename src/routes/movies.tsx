import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { MOVIES, CATEGORIES } from "@/lib/portflix-data";
import { MovieCard } from "@/components/portflix/MovieCard";

export const Route = createFileRoute("/movies")({
  head: () => ({
    meta: [
      { title: "Movies — PORTFLIX" },
      { name: "description", content: "Browse and download translated and non-translated movies. Search by title, genre, year, country, director, actor, language, translator." },
      { property: "og:title", content: "Movies — PORTFLIX" },
      { property: "og:description", content: "Browse and download premium movies." },
    ],
  }),
  component: MoviesPage,
});

function MoviesPage() {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("All");

  const filtered = useMemo(() => {
    const ql = q.toLowerCase();
    return MOVIES.filter((m) => {
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
  }, [q, genre]);

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <header className="mb-10 space-y-4">
          <h1 className="font-display text-5xl font-black tracking-tighter md:text-6xl">Movies</h1>
          <p className="max-w-2xl text-muted-foreground">
            Translated and non-translated films from around the world. Search by title, genre, director, country, language, year, or translator (Umusobanuzi).
          </p>
        </header>

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

        {filtered.length === 0 ? (
          <div className="grid place-items-center py-24 text-muted-foreground">
            No movies match your search.
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
