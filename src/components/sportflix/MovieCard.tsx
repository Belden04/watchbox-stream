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
      <div className="group w-[180px] shrink-0 cursor-pointer space-y-2 md:w-[210px]" onClick={() => setOpen(true)}>
        <div className="relative aspect-square overflow-hidden rounded-lg border border-white/5 bg-surface-2 transition-all duration-300 group-hover:border-primary/60 group-hover:shadow-[0_10px_40px_-10px_var(--color-primary)]">
          <img
            src={img}
            alt={movie.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {movie.genre && (
            <span className="absolute left-2 top-2 rounded-md bg-primary px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-primary-foreground shadow-lg">
              {movie.genre}
            </span>
          )}
          {movie.is_translated && (
            <span className="absolute right-2 top-2 rounded-md bg-accent px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-accent-foreground">
              Umusobanuwe
            </span>
          )}
          <div className="absolute inset-0 grid place-items-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="grid size-14 place-items-center rounded-full bg-primary shadow-2xl">
              <Play className="size-6 fill-white text-white" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={toggleSave}
              className={`grid size-8 place-items-center rounded-full border border-white/20 backdrop-blur ${saved ? "bg-primary text-primary-foreground" : "bg-black/60 hover:border-primary"}`}
              aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
            >
              {saved ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
            </button>
          </div>
          {progress !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
              <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
        <div>
          <h3 className="line-clamp-2 text-sm font-bold leading-snug transition-colors group-hover:text-primary">
            {movie.title}
          </h3>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
            {movie.production_company || movie.year}
            {movie.translator ? ` · ${movie.translator}` : ""}
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
