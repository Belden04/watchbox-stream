import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/lib/watchbox7-data";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — WatchBox7" },
      { name: "description", content: "Browse WatchBox7 by movie genre." },
    ],
  }),
  component: CategoriesPage,
});

const ACCENTS = [
  "from-[#1e5bff]/30 to-transparent",
  "from-primary/30 to-transparent",
  "from-accent/30 to-transparent",
  "from-fuchsia-500/25 to-transparent",
  "from-amber-500/25 to-transparent",
  "from-cyan-500/25 to-transparent",
];

function CategoriesPage() {
  return (
    <div className="pt-8">
      <div className="mx-auto max-w-[1500px] px-4 md:px-8">
        <header className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.35em] text-[#5a8dff]">
              <Sparkles className="size-3" /> Discover
            </p>
            <h1 className="font-display text-4xl font-black tracking-tight md:text-5xl">Categories</h1>
            <p className="mt-2 text-sm text-muted-foreground">Pick a mood. Find your next obsession.</p>
          </div>
        </header>

        <div className="grid gap-3 pb-20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CATEGORIES.map((c, i) => {
            const grad = ACCENTS[i % ACCENTS.length];
            return (
              <Link
                key={c}
                to="/movies"
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-5 transition-all hover:-translate-y-1 hover:border-[#1e5bff]/60"
              >
                <div className={`absolute -right-8 -top-8 size-40 rounded-full bg-gradient-to-br ${grad} blur-2xl transition-opacity group-hover:opacity-90`} />
                <div className="relative flex h-32 flex-col justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                    Genre · 0{(i % 9) + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-black tracking-tight group-hover:text-[#5a8dff]">
                      {c}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                      Browse all {c.toLowerCase()} titles →
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
