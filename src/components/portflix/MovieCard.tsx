import { Play, Download, Plus } from "lucide-react";
import type { Movie } from "@/lib/portflix-data";

type Props = {
  movie: Movie;
  progress?: number;
};

export function MovieCard({ movie, progress }: Props) {
  return (
    <div className="group w-[180px] shrink-0 cursor-pointer space-y-3 md:w-[200px]">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-border bg-surface-2 transition-all duration-300 group-hover:border-primary/60 group-hover:shadow-[0_0_30px_-5px_var(--color-primary)]">
        <img
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute right-2 top-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10px] font-bold text-foreground backdrop-blur-sm">
          {movie.language}
        </div>
        <div className="absolute bottom-2 left-2 right-2 flex translate-y-2 gap-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button className="flex flex-1 items-center justify-center gap-1 rounded bg-primary px-2 py-1.5 text-[10px] font-bold text-primary-foreground hover:bg-primary-glow">
            <Play className="size-3 fill-current" /> WATCH
          </button>
          <button
            className="grid size-7 place-items-center rounded bg-foreground text-background hover:bg-accent"
            aria-label="Download"
          >
            <Download className="size-3" />
          </button>
          <button
            className="grid size-7 place-items-center rounded border border-border bg-surface-2 hover:border-primary"
            aria-label="Add to watchlist"
          >
            <Plus className="size-3" />
          </button>
        </div>
        {progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
            <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
      <div>
        <h3 className="truncate text-sm font-semibold transition-colors group-hover:text-primary">
          {movie.title}
        </h3>
        <p className="text-[11px] text-muted-foreground">
          {movie.genre} · {movie.year} · ⭐ {movie.rating}
        </p>
      </div>
    </div>
  );
}
