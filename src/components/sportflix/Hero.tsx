import { useEffect, useState } from "react";
import { Play, Film } from "lucide-react";
import type { Movie } from "@/lib/sportflix-data";
import { WatchDialog } from "./WatchDialog";
import { Link } from "@tanstack/react-router";

export function Hero({ movies }: { movies: Movie[] }) {
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (movies.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % movies.length), 7000);
    return () => clearInterval(t);
  }, [movies.length]);

  if (movies.length === 0) {
    return (
      <section className="relative grid min-h-[70vh] w-full place-items-center overflow-hidden bg-gradient-to-br from-black via-[oklch(0.08_0.02_15)] to-black">
        <div className="absolute -right-20 -top-20 size-96 rounded-full bg-primary/20 blur-[120px]" />
        <div className="relative max-w-2xl space-y-5 px-6 text-center">
          <h1 className="font-display text-4xl font-black leading-tight tracking-tight md:text-6xl">
            Welcome to <span className="text-primary">WatchBox7</span>
          </h1>
          <p className="text-base text-muted-foreground">
            The home of translated & non-translated movies. Library loading soon…
          </p>
          <Link to="/admin" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-bold text-primary-foreground hover:scale-105">
            Go to Admin
          </Link>
        </div>
      </section>
    );
  }

  const slide = movies[idx];
  const poster = slide.poster || slide.thumbnail || "";
  const bg = slide.thumbnail || slide.poster;

  return (
    <section className="relative w-full overflow-hidden">
      {/* Ambient background */}
      {movies.map((s, i) => (
        <div key={s.id} className={`absolute inset-0 transition-opacity duration-1000 ${i === idx ? "opacity-100" : "opacity-0"}`}>
          <img src={s.thumbnail || s.poster} alt="" className="size-full object-cover opacity-30 blur-2xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
      ))}

      <div className="relative z-10 mx-auto grid max-w-[1500px] items-center gap-8 px-6 py-10 md:px-10 md:py-14 lg:grid-cols-[1fr_auto] lg:gap-10">

        {/* LEFT — Text */}
        <div key={slide.id} className="animate-slide-up max-w-xl space-y-5">
          <span className="inline-flex items-center rounded bg-primary px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-primary-foreground">
            Featured
          </span>
          <h1 className="font-display text-4xl font-black leading-[0.95] tracking-tight md:text-5xl lg:text-6xl">
            {slide.title}
          </h1>

          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            {slide.genre && <span>{slide.genre}</span>}
            <span className="size-1 rounded-full bg-muted-foreground/60" />
            <span>{slide.series_title ? "Series" : "Movie"}</span>
            {slide.year && (<><span className="size-1 rounded-full bg-muted-foreground/60" /><span>{slide.year}</span></>)}
          </div>
          {slide.production_company && (
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 py-1 pl-1 pr-3 text-xs font-bold">
              <span className="grid size-6 place-items-center rounded-full bg-[#1e5bff]/20 text-[10px] text-[#5a8dff]">
                <Film className="size-3" />
              </span>
              {slide.production_company}
            </div>
          )}
          {slide.description && (
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
              {slide.description}
            </p>
          )}
          {slide.is_translated && slide.translator && (
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Umusobanuzi · {slide.translator}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setOpen(true)}
              className="group flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:scale-105"
            >
              <span className="grid size-5 place-items-center rounded-full bg-white/25">
                <Play className="size-3 fill-current" />
              </span>
              Watch Now
            </button>
            <button
              onClick={() => setOpen(true)}
              className="rounded-md border border-border bg-black/50 px-6 py-3 text-sm font-bold hover:bg-white/10"
            >
              Trailer
            </button>
          </div>
        </div>

        {/* RIGHT — Poster card */}
        <div className="relative mx-auto w-full max-w-[220px] md:max-w-[260px] lg:max-w-none">
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] lg:w-[280px]">
            <img key={slide.id} src={poster} alt={slide.title} className="size-full object-cover animate-kenburns" />
          </div>
        </div>

      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-1 rounded-full transition-all ${i === idx ? "w-8 bg-primary" : "w-4 bg-white/30"}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      <WatchDialog
        open={open}
        onClose={() => setOpen(false)}
        title={slide.title}
        videoUrl={slide.video_url}
        poster={bg}
        contentType="movie"
        contentId={slide.id}
        movie={slide as any}
      />
    </section>
  );
}
