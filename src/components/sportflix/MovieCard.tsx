import { Play, Download, Plus, Check } from "lucide-react";
import { useState } from "react";
import type { Movie } from "@/lib/sportflix-data";
import { WatchDialog } from "./WatchDialog";
import { addToWatchlist, removeFromWatchlist } from "@/lib/watchlist";

type Props = {
  movie: Movie;
  progress?: number;
  inWatchlist?: boolean;
  onWatchlistChange?: () => void;
};

export function MovieCard({ movie, progress, inWatchlist, onWatchlistChange }: Props) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(!!inWatchlist);

  const toggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (saved) {
      const ok = await removeFromWatchlist("movie", movie.id);
      if (ok) { setSaved(false); onWatchlistChange?.(); }
    } else {
      const ok = await addToWatchlist("movie", movie.id);
      if (ok) { setSaved(true); onWatchlistChange?.(); }
    }
  };

  const img = movie.thumbnail || movie.poster;

  return (
    <>
      <div className="group w-[130px] shrink-0 cursor-pointer space-y-2 md:w-[150px]" onClick={() => setOpen(true)}>
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-border bg-surface-2 transition-all duration-300 group-hover:border-primary/60 group-hover:shadow-[0_0_30px_-5px_var(--color-primary)]">
          <img
            src={img}
            alt={movie.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute right-2 top-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10px] font-bold text-foreground backdrop-blur-sm">
            {movie.language}
          </div>
          {movie.is_translated && (
            <div className="absolute left-2 top-2 rounded bg-accent px-1.5 py-0.5 font-mono text-[10px] font-bold text-accent-foreground">
              Umusobanuwe
            </div>
          )}
          <div className="absolute bottom-2 left-2 right-2 flex translate-y-2 gap-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              onClick={(e) => { e.stopPropagation(); setOpen(true); }}
              className="flex flex-1 items-center justify-center gap-1 rounded bg-primary px-2 py-1.5 text-[10px] font-bold text-primary-foreground hover:bg-primary-glow"
            >
              <Play className="size-3 fill-current" /> WATCH
            </button>
            <button
              onClick={toggleSave}
              className={`grid size-7 place-items-center rounded border border-border ${saved ? "bg-primary text-primary-foreground" : "bg-surface-2 hover:border-primary"}`}
              aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
              title={saved ? "Remove from watchlist" : "Add to watchlist"}
            >
              {saved ? <Check className="size-3" /> : <Plus className="size-3" />}
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
            {movie.genre} · {movie.year} {movie.translator ? `· Umusobanuzi: ${movie.translator}` : ""}
          </p>
        </div>
      </div>
      <WatchDialog
        open={open}
        onClose={() => setOpen(false)}
        title={movie.title}
        videoUrl={movie.video_url}
        poster={img}
        contentType="movie"
        contentId={movie.id}
        movie={movie}
      />
    </>
  );
}
