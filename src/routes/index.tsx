import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/portflix/Hero";
import { Rail } from "@/components/portflix/Rail";
import { MovieCard } from "@/components/portflix/MovieCard";
import { HighlightCard } from "@/components/portflix/HighlightCard";
import {
  TRENDING,
  MOST_DOWNLOADED,
  RECENTLY_ADDED,
  RECOMMENDED,
  CONTINUE_WATCHING,
  HIGHLIGHTS,
  SPORT_CATEGORIES,
  PREMIUM_PLANS,
} from "@/lib/portflix-data";
import { Link } from "@tanstack/react-router";
import { Check, Zap } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PORTFLIX — Stream Premium Movies & Sports Highlights" },
      {
        name: "description",
        content:
          "Watch and download translated and non-translated movies, plus the best football, basketball, AFCON, Champions League, and Rwanda League highlights. No login required.",
      },
      { property: "og:title", content: "PORTFLIX — Premium Streaming" },
      { property: "og:description", content: "Movies, sports highlights, no login required." },
    ],
  }),
  component: Home,
});

function Home() {
  const [sportFilter, setSportFilter] = useState<string>("All");
  const filteredHighlights =
    sportFilter === "All" ? HIGHLIGHTS : HIGHLIGHTS.filter((h) => h.category === sportFilter);

  return (
    <>
      <Hero />

      {/* Continue Watching */}
      <Rail title="Continue Watching" accent="primary">
        {CONTINUE_WATCHING.map((m) => (
          <MovieCard key={m.id} movie={m} progress={m.progress} />
        ))}
      </Rail>

      {/* Trending Today */}
      <Rail title="Trending Today" accent="primary" viewAllHref="/movies">
        {TRENDING.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </Rail>

      {/* Most Downloaded */}
      <Rail title="Most Downloaded" accent="primary" viewAllHref="/movies">
        {MOST_DOWNLOADED.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </Rail>

      {/* Sports Highlights — distinct stadium-energy block */}
      <section className="border-y border-border bg-surface/40 py-16">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="size-2 animate-pulse-live rounded-full bg-accent" />
                <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-accent">
                  Live Arena
                </span>
              </div>
              <h2 className="font-display text-4xl font-black italic tracking-tighter md:text-5xl">
                SPORTS HIGHLIGHTS
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Goals, dunks, spikes, trophies — the moments that made history.
              </p>
            </div>
            <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
              {["All", ...SPORT_CATEGORIES].map((c) => (
                <button
                  key={c}
                  onClick={() => setSportFilter(c)}
                  className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                    sportFilter === c
                      ? "bg-accent text-accent-foreground shadow-[var(--shadow-glow-accent)]"
                      : "bg-surface-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredHighlights.map((h) => (
              <HighlightCard key={h.id} h={h} />
            ))}
          </div>
        </div>
      </section>

      {/* Recently Added */}
      <Rail title="Recently Added" accent="primary" viewAllHref="/movies">
        {RECENTLY_ADDED.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </Rail>

      {/* Recommended */}
      <Rail title="Recommended For You" accent="primary" viewAllHref="/movies">
        {RECOMMENDED.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </Rail>

      {/* Premium CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-[1200px] px-4 md:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-surface to-surface-2 p-10 md:p-16">
            <div className="absolute -right-20 -top-20 size-80 rounded-full bg-primary/20 blur-[100px]" />
            <div className="absolute -bottom-20 -left-20 size-80 rounded-full bg-accent/10 blur-[100px]" />

            <div className="relative grid items-center gap-10 lg:grid-cols-2">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                  <Zap className="size-3 fill-current" /> Premium
                </div>
                <h2 className="font-display text-4xl font-black italic tracking-tighter md:text-5xl">
                  UNLEASH THE FULL ARENA
                </h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {PREMIUM_PLANS[1].features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-accent" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col items-stretch gap-3">
                <Link
                  to="/premium"
                  className="rounded-lg bg-primary px-8 py-4 text-center text-lg font-black tracking-tight text-primary-foreground transition-transform hover:scale-105 hover:shadow-[var(--shadow-glow-primary)]"
                >
                  UPGRADE NOW
                </Link>
                <p className="text-center text-xs uppercase tracking-widest text-muted-foreground">
                  Starting at $4.99/month · Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
