import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/sportflix/Hero";
import { Rail } from "@/components/sportflix/Rail";
import { MovieCard } from "@/components/sportflix/MovieCard";
import {
  TRENDING,
  RECENTLY_ADDED,
  PREMIUM_PLANS,
} from "@/lib/sportflix-data";
import { Link } from "@tanstack/react-router";
import { Check, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SPORTFLIX — Stream Premium Movies" },
      {
        name: "description",
        content:
          "Watch and download translated and non-translated movies. New uploads and trending titles every week. No login required.",
      },
      { property: "og:title", content: "SPORTFLIX — Premium Movies" },
      { property: "og:description", content: "Trending movies and new uploads. No login required." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />

      <Rail title="Trending Now" accent="primary" viewAllHref="/movies">
        {TRENDING.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </Rail>

      <Rail title="New Uploads" accent="primary" viewAllHref="/movies">
        {RECENTLY_ADDED.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </Rail>

      {/* Premium CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-[1200px] px-4 md:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-surface to-surface-2 p-8 md:p-12">
            <div className="absolute -right-20 -top-20 size-80 rounded-full bg-primary/20 blur-[100px]" />
            <div className="absolute -bottom-20 -left-20 size-80 rounded-full bg-accent/10 blur-[100px]" />

            <div className="relative grid items-center gap-8 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                  <Zap className="size-3 fill-current" /> Premium
                </div>
                <h2 className="font-display text-2xl font-black italic tracking-tighter md:text-3xl">
                  UNLOCK THE FULL EXPERIENCE
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
                  className="rounded-lg bg-primary px-6 py-3 text-center text-base font-black tracking-tight text-primary-foreground transition-transform hover:scale-105 hover:shadow-[var(--shadow-glow-primary)]"
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
