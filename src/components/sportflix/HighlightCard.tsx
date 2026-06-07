import { Play, Bookmark, Check } from "lucide-react";
import { useState } from "react";
import type { Highlight } from "@/lib/sportflix-data";
import { WatchDialog } from "./WatchDialog";
import { addToWatchlist, removeFromWatchlist } from "@/lib/watchlist";

export function HighlightCard({ h, inWatchlist, onWatchlistChange }: { h: Highlight; inWatchlist?: boolean; onWatchlistChange?: () => void }) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(!!inWatchlist);

  const toggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (saved) {
      const ok = await removeFromWatchlist("highlight", h.id);
      if (ok) { setSaved(false); onWatchlistChange?.(); }
    } else {
      const ok = await addToWatchlist("highlight", h.id);
      if (ok) { setSaved(true); onWatchlistChange?.(); }
    }
  };

  return (
    <>
      <div className="group cursor-pointer" onClick={() => setOpen(true)}>
        <div className="relative mb-3 aspect-video overflow-hidden rounded-lg border-l-4 border-accent bg-surface-2 transition-all duration-300 group-hover:shadow-[0_0_30px_-5px_var(--color-accent)]">
          <img
            src={h.thumbnail}
            alt={h.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <div className="absolute left-3 top-3 rounded bg-accent px-2 py-0.5 font-mono text-[10px] font-black uppercase italic text-accent-foreground">
            {h.category}
          </div>
          {h.duration && (
            <div className="absolute right-3 top-3 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10px] font-bold backdrop-blur-sm">
              {h.duration}
            </div>
          )}
          <div className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="grid size-16 place-items-center rounded-full bg-accent shadow-[var(--shadow-glow-accent)]">
              <Play className="size-6 fill-accent-foreground text-accent-foreground" />
            </div>
          </div>
        </div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold transition-colors group-hover:text-accent">{h.title}</h3>
            <p className="text-[11px] text-muted-foreground">{h.views ? `${(h.views / 1000).toFixed(0)}K views` : "New"}</p>
          </div>
          <button
            onClick={toggleSave}
            className={`grid size-7 shrink-0 place-items-center rounded ${saved ? "bg-accent text-accent-foreground" : "bg-surface-2 hover:bg-accent hover:text-accent-foreground"}`}
            aria-label={saved ? "Remove from watchlist" : "Save"}
          >
            {saved ? <Check className="size-3" /> : <Bookmark className="size-3" />}
          </button>
        </div>
      </div>
      <WatchDialog
        open={open}
        onClose={() => setOpen(false)}
        title={h.title}
        videoUrl={h.video_url}
        poster={h.thumbnail}
        contentType="highlight"
        contentId={h.id}
      />
    </>
  );
}
