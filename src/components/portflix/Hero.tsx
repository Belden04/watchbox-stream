import { useEffect, useState } from "react";
import { Play, Download, Plus } from "lucide-react";
import heroStadium from "@/assets/hero-stadium.jpg";
import { MOVIES } from "@/lib/portflix-data";

const SLIDES = [
  {
    type: "highlight" as const,
    badge: "LIVE · RWANDA LEAGUE",
    title: "RAYON SPORTS\nVS APR FC",
    meta: "Kigali Derby · 90 mins · 4K",
    description: "The fiercest derby in East African football — every goal, every chance, every roar of the crowd.",
    image: heroStadium,
    accent: true,
  },
  {
    type: "movie" as const,
    badge: "FEATURED MOVIE",
    title: "ADLEN'ANN",
    meta: `${MOVIES[5].year} · ${MOVIES[5].duration} · ⭐ ${MOVIES[5].rating}`,
    description: MOVIES[5].description,
    image: MOVIES[5].poster,
    accent: false,
  },
  {
    type: "movie" as const,
    badge: "TRENDING NOW",
    title: "UNDERGROUND\nKINGS",
    meta: `${MOVIES[4].year} · ${MOVIES[4].duration} · ⭐ ${MOVIES[4].rating}`,
    description: MOVIES[4].description,
    image: MOVIES[4].poster,
    accent: false,
  },
];

export function Hero() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 7000);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[idx];

  return (
    <section className="relative h-[92vh] min-h-[600px] w-full overflow-hidden">
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === idx ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={s.image}
            alt=""
            className="size-full object-cover animate-kenburns"
            fetchPriority={i === 0 ? "high" : "low"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        </div>
      ))}

      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-4 pb-24 md:px-8">
        <div key={idx} className="animate-slide-up max-w-2xl space-y-5">
          <div className="flex items-center gap-3">
            <span
              className={`rounded px-2 py-1 font-mono text-[10px] font-black uppercase tracking-wider ${
                slide.accent
                  ? "bg-accent text-accent-foreground animate-pulse-live"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {slide.badge}
            </span>
            <span className="text-sm font-medium text-muted-foreground">{slide.meta}</span>
          </div>
          <h1 className="font-display text-5xl font-black leading-[0.9] tracking-tighter whitespace-pre-line md:text-7xl lg:text-8xl">
            {slide.title}
          </h1>
          <p className="max-w-xl text-base text-muted-foreground md:text-lg">{slide.description}</p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button className="group flex items-center gap-2 rounded-md bg-primary px-7 py-3 font-bold text-primary-foreground transition-all hover:scale-105 hover:shadow-[var(--shadow-glow-primary)]">
              <Play className="size-4 fill-current" />
              WATCH FREE
            </button>
            <button className="flex items-center gap-2 rounded-md border border-border bg-surface-2/80 px-7 py-3 font-bold backdrop-blur-md transition-colors hover:bg-surface-2">
              <Download className="size-4" />
              DOWNLOAD
            </button>
            <button
              className="grid size-12 place-items-center rounded-md border border-border bg-surface-2/80 backdrop-blur-md transition-colors hover:border-primary hover:text-primary"
              aria-label="Add to watchlist"
            >
              <Plus className="size-5" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 right-4 flex gap-2 md:right-8">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-1 transition-all ${
                i === idx ? "w-10 bg-primary" : "w-6 bg-foreground/30"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
