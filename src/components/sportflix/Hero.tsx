import { useEffect, useState } from "react";
import { Play, Plus, Check } from "lucide-react";
import type { Movie } from "@/lib/sportflix-data";
import { WatchDialog } from "./WatchDialog";
import { addToWatchlist } from "@/lib/watchlist";
import { Link } from "@tanstack/react-router";

export function Hero({ movies }: { movies: Movie[] }) {
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (movies.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % movies.length), 7000);
    return () => clearInterval(t);
  }, [movies.length]);

  if (movies.length === 0) {
    return (
      <section className="relative grid h-[70vh] min-h-[480px] w-full place-items-center overflow-hidden bg-gradient-to-br from-surface via-background to-surface-2">
        <div className="absolute -right-20 -top-20 size-96 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 size-96 rounded-full bg-accent/10 blur-[120px]" />
        <div className="relative max-w-2xl space-y-5 px-6 text-center">
          <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
            Welcome
          </span>
          <h1 className="font-display text-4xl font-black leading-tight tracking-tighter md:text-6xl">
            SPORTFLIX
          </h1>
          <p className="text-base text-muted-foreground md:text-lg">
            The home of translated &amp; non-translated movies and all matches highlights.
          </p>
          <p className="text-sm text-muted-foreground">
            The library is empty for now — the admin will start uploading content soon.
          </p>
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-bold text-primary-foreground hover:scale-105"
          >
            Go to Admin
          </Link>
        </div>
      </section>
    );
  }

  const slide = movies[idx];
  const image = slide.thumbnail || slide.poster;

  return (
    <section className="relative h-[92vh] min-h-[600px] w-full overflow-hidden">
      {movies.map((s, i) => {
        const img = s.thumbnail || s.poster;
        return (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === idx ? "opacity-100" : "opacity-0"}`}
          >
            <img
              src={img}
              alt=""
              className="size-full object-cover animate-kenburns"
              fetchPriority={i === 0 ? "high" : "low"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          </div>
        );
      })}

      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-4 pb-24 md:px-8">
        <div key={slide.id} className="animate-slide-up max-w-2xl space-y-5">
          <div className="flex items-center gap-3">
            <span className="rounded bg-primary px-2 py-1 font-mono text-[10px] font-black uppercase tracking-wider text-primary-foreground">
              {slide.is_translated ? "TRANSLATED · UMUSOBANUWE" : "NEW RELEASE"}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {slide.year}{slide.duration ? ` · ${slide.duration}` : ""}
              {slide.rating ? ` · ⭐ ${slide.rating}` : ""}
            </span>
          </div>
          <h1 className="font-display text-3xl font-black leading-[0.95] tracking-tighter md:text-5xl lg:text-6xl">
            {slide.title.toUpperCase()}
          </h1>
          {slide.description && (
            <p className="max-w-xl text-sm text-muted-foreground md:text-base">{slide.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setOpen(true)}
              className="group flex items-center gap-2 rounded-md bg-primary px-7 py-3 font-bold text-primary-foreground transition-all hover:scale-105 hover:shadow-[var(--shadow-glow-primary)]"
            >
              <Play className="size-4 fill-current" />
              WATCH FREE
            </button>
            <button
              onClick={async () => {
                const ok = await addToWatchlist("movie", slide.id);
                if (ok) setSaved((s) => ({ ...s, [slide.id]: true }));
              }}
              className="grid size-12 place-items-center rounded-md border border-border bg-surface-2/80 backdrop-blur-md transition-colors hover:border-primary hover:text-primary"
              aria-label="Add to watchlist"
            >
              {saved[slide.id] ? <Check className="size-5" /> : <Plus className="size-5" />}
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 right-4 flex gap-2 md:right-8">
          {movies.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-1 transition-all ${i === idx ? "w-10 bg-primary" : "w-6 bg-foreground/30"}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <WatchDialog
        open={open}
        onClose={() => setOpen(false)}
        title={slide.title}
        videoUrl={slide.video_url}
        poster={image}
        contentType="movie"
        contentId={slide.id}
        movie={slide as any}
      />
    </section>
  );
}
