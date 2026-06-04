import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES, SPORT_CATEGORIES } from "@/lib/sportflix-data";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — SPORTFLIX" },
      { name: "description", content: "Browse SPORTFLIX by movie genre or sports category." },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <div className="pt-24">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <header className="mb-12">
          <h1 className="font-display text-5xl font-black tracking-tighter md:text-6xl">Categories</h1>
          <p className="mt-3 text-muted-foreground">Pick your genre. Find your obsession.</p>
        </header>

        <section className="mb-16">
          <h2 className="font-display mb-6 flex items-center gap-3 text-2xl font-bold">
            <span className="h-7 w-1.5 rounded-full bg-primary" /> Movie Genres
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                to="/movies"
                className="group relative aspect-[5/2] overflow-hidden rounded-lg border border-border bg-gradient-to-br from-surface-2 to-surface transition-all hover-lift"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative grid h-full place-items-center font-display text-xl font-bold tracking-tight group-hover:text-primary">
                  {c}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="pb-20">
          <h2 className="font-display mb-6 flex items-center gap-3 text-2xl font-bold">
            <span className="h-7 w-1.5 rounded-full bg-accent" /> Sports
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {SPORT_CATEGORIES.map((c) => (
              <Link
                key={c}
                to="/sports"
                className="group relative aspect-[5/2] overflow-hidden rounded-lg border border-border bg-gradient-to-br from-surface-2 to-surface transition-all hover-glow-accent hover:border-accent/60"
              >
                <div className="relative grid h-full place-items-center font-display text-xl font-bold italic tracking-tight group-hover:text-accent">
                  {c}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
