import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { HIGHLIGHTS, SPORT_CATEGORIES } from "@/lib/portflix-data";
import { HighlightCard } from "@/components/portflix/HighlightCard";

export const Route = createFileRoute("/sports")({
  head: () => ({
    meta: [
      { title: "Sports Highlights — PORTFLIX" },
      { name: "description", content: "Watch and download highlights from Football, Basketball, Volleyball, World Cup, Champions League, AFCON, and Rwanda League." },
      { property: "og:title", content: "Sports Highlights — PORTFLIX" },
      { property: "og:description", content: "Football, Basketball, AFCON, Champions League, Rwanda League highlights." },
    ],
  }),
  component: SportsPage,
});

function SportsPage() {
  const [cat, setCat] = useState<string>("All");
  const list = useMemo(
    () => (cat === "All" ? HIGHLIGHTS : HIGHLIGHTS.filter((h) => h.category === cat)),
    [cat]
  );

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <header className="mb-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="size-2 animate-pulse-live rounded-full bg-accent" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-accent">
              Live Arena
            </span>
          </div>
          <h1 className="font-display text-5xl font-black italic tracking-tighter md:text-6xl">
            SPORTS HIGHLIGHTS
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            The biggest moments from the world's biggest leagues. No live matches — pure highlights, downloadable.
          </p>
        </header>

        <div className="scrollbar-hide mb-10 flex gap-2 overflow-x-auto pb-2">
          {["All", ...SPORT_CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-all ${
                cat === c
                  ? "bg-accent text-accent-foreground shadow-[var(--shadow-glow-accent)]"
                  : "bg-surface-2 text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 pb-20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((h) => (
            <HighlightCard key={h.id} h={h} />
          ))}
        </div>
      </div>
    </div>
  );
}
