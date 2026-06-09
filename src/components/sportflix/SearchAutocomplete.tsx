import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, Building2, Film, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { mapMovieRow, type Movie } from "@/lib/sportflix-data";

const db = supabase as any;

type Suggestion =
  | { kind: "movie"; movie: Movie }
  | { kind: "company"; company: string; count: number };

export function SearchAutocomplete({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [active, setActive] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);

  // Load full library once (small) — we filter client-side for instant feel.
  useEffect(() => {
    db.from("movies").select("*").then(({ data }: { data: any[] | null }) => {
      setMovies((data ?? []).map(mapMovieRow));
    });
  }, []);

  // Click outside to close.
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const suggestions = useMemo<Suggestion[]>(() => {
    const ql = q.trim().toLowerCase();
    if (!ql) return [];
    // Company matches grouped
    const companyMap = new Map<string, number>();
    movies.forEach((m) => {
      const c = (m.production_company ?? "").trim();
      if (c && c.toLowerCase().includes(ql)) companyMap.set(c, (companyMap.get(c) ?? 0) + 1);
    });
    const companies: Suggestion[] = [...companyMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([company, count]) => ({ kind: "company", company, count }));

    const titleMatches: Suggestion[] = movies
      .filter(
        (m) =>
          m.title.toLowerCase().includes(ql) ||
          m.genre.toLowerCase().includes(ql) ||
          m.country.toLowerCase().includes(ql) ||
          (m.translator ?? "").toLowerCase().includes(ql),
      )
      .slice(0, 6)
      .map((movie) => ({ kind: "movie", movie }));

    return [...companies, ...titleMatches];
  }, [q, movies]);

  const submit = (s?: Suggestion) => {
    const target = s ?? suggestions[active];
    if (target?.kind === "company") {
      navigate({ to: "/movies", search: { company: target.company } as any });
    } else if (target?.kind === "movie") {
      navigate({ to: "/movies", search: { q: target.movie.title } as any });
    } else if (q.trim()) {
      navigate({ to: "/movies", search: { q: q.trim() } as any });
    }
    setOpen(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showTip = focused && q.trim().length === 0;

  return (
    <div ref={wrap} className={`relative ${compact ? "w-full" : "w-56 lg:w-72"}`}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={q}
        placeholder="Search movies, companies…"
        onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0); }}
        onFocus={() => { setFocused(true); setOpen(true); }}
        onBlur={() => setFocused(false)}
        onKeyDown={onKey}
        className="w-full rounded-full border border-border bg-secondary/60 py-1.5 pl-9 pr-9 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
      {q && (
        <button
          type="button"
          onClick={() => { setQ(""); setOpen(false); }}
          className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-surface-2"
          aria-label="Clear"
        >
          <X className="size-3.5" />
        </button>
      )}

      {/* Transparent tip overlay shown when input is focused but empty */}
      {showTip && (
        <div className="pointer-events-none absolute left-0 right-0 top-full z-50 mt-2 animate-in fade-in slide-in-from-top-1 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-xs text-foreground/80 backdrop-blur-md">
          <p className="font-bold text-primary">Tip</p>
          <p>Search by <span className="font-semibold">company</span> (e.g. Warner Bros, Marvel) to see every movie from that studio — or just type a title.</p>
        </div>
      )}

      {/* Suggestions dropdown */}
      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[60vh] overflow-y-auto rounded-xl border border-border bg-surface/95 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-1">
          {suggestions.map((s, i) => {
            const isActive = i === active;
            if (s.kind === "company") {
              return (
                <button
                  key={`c-${s.company}`}
                  onMouseDown={(e) => { e.preventDefault(); submit(s); }}
                  onMouseEnter={() => setActive(i)}
                  className={`flex w-full items-center gap-3 border-b border-border/40 px-3 py-2.5 text-left text-sm ${isActive ? "bg-primary/10" : "hover:bg-surface-2"}`}
                >
                  <Building2 className="size-4 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{s.company}</p>
                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Company · {s.count} title{s.count > 1 ? "s" : ""}</p>
                  </div>
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">View all</span>
                </button>
              );
            }
            return (
              <button
                key={`m-${s.movie.id}`}
                onMouseDown={(e) => { e.preventDefault(); submit(s); }}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-center gap-3 border-b border-border/40 px-3 py-2.5 text-left text-sm ${isActive ? "bg-primary/10" : "hover:bg-surface-2"}`}
              >
                <img src={s.movie.thumbnail || s.movie.poster} alt="" className="size-10 shrink-0 rounded object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{s.movie.title}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {s.movie.year} · {s.movie.genre}
                    {s.movie.production_company ? ` · ${s.movie.production_company}` : ""}
                  </p>
                </div>
                <Film className="size-4 shrink-0 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      )}

      {/* No results */}
      {open && q.trim().length > 0 && suggestions.length === 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-border bg-surface/95 px-4 py-3 text-sm text-muted-foreground backdrop-blur-md animate-in fade-in slide-in-from-top-1">
          No matches yet — press Enter to search the full library.
        </div>
      )}
    </div>
  );
}
