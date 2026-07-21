import { Play, Plus, Check, Star } from "lucide-react";
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

  const img = movie.poster || movie.thumbnail;

  return (
    <>
      <div
        className="group w-[150px] shrink-0 cursor-pointer sm:w-[168px] md:w-[184px]"
        onClick={() => setOpen(true)}
      >
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-surface-2 ring-1 ring-white/5 transition-all duration-300 group-hover:ring-primary/70 group-hover:shadow-[0_18px_50px_-14px_var(--color-primary)]">
          <img
            src={img}
            alt={movie.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          />

          {/* Top row badges */}
          <div className="pointer-events-none absolute inset-x-2 top-2 flex items-start justify-between gap-1">
            {movie.genre ? (
              <span className="rounded-sm bg-primary/95 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-[0.14em] text-primary-foreground shadow">
                {movie.genre}
              </span>
            ) : <span />}
            {movie.is_translated && (
              <span className="rounded-sm bg-accent/95 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-[0.14em] text-accent-foreground shadow">
                Umusobanuwe
              </span>
            )}
          </div>

          {/* Bottom gradient + title overlay on poster */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent px-2.5 pb-2 pt-8">
            <h3 className="line-clamp-2 font-display text-[13px] font-black leading-tight tracking-tight text-white">
              {movie.title}
            </h3>
            <div className="mt-0.5 flex items-center gap-1.5 text-[10px] font-semibold text-white/70">
              {movie.year && <span>{movie.year}</span>}
              {movie.year && (movie.series_title || movie.production_company) && <span className="opacity-50">·</span>}
              <span className="truncate">
                {movie.series_title ? "Series" : movie.production_company || "Movie"}
              </span>
            </div>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 grid place-items-center bg-black/55 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
            <div className="grid size-12 place-items-center rounded-full bg-primary shadow-2xl ring-4 ring-primary/20 transition-transform duration-300 group-hover:scale-110">
              <Play className="size-5 fill-white text-white" />
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={toggleSave}
            className={`absolute right-2 top-8 z-10 grid size-7 place-items-center rounded-full border border-white/25 opacity-0 backdrop-blur transition-all group-hover:opacity-100 ${saved ? "bg-primary text-primary-foreground" : "bg-black/60 hover:border-primary hover:bg-primary/20"}`}
            aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
          >
            {saved ? <Check className="size-3" /> : <Plus className="size-3" />}
          </button>

          {/* Progress bar */}
          {progress !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/60">
              <div className="h-full bg-primary shadow-[0_0_8px_var(--color-primary)]" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>

        {/* Meta line below (translator) */}
        {movie.is_translated && movie.translator && (
          <div className="mt-1.5 flex items-center gap-1 px-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
            <Star className="size-2.5 fill-current" />
            <span className="truncate">{movie.translator}</span>
          </div>
        )}
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

