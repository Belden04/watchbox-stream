import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";

export const Route = createFileRoute("/watchlist")({
  head: () => ({
    meta: [
      { title: "Watchlist — SPORTFLIX" },
      { name: "description", content: "Your saved movies and highlights." },
    ],
  }),
  component: WatchlistPage,
});

function WatchlistPage() {
  return (
    <div className="pt-24">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <header className="mb-12">
          <h1 className="font-display text-5xl font-black tracking-tighter md:text-6xl">Watchlist</h1>
          <p className="mt-3 text-muted-foreground">Everything you've saved — in one place.</p>
        </header>

        <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-surface/40 py-24">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-6 grid size-16 place-items-center rounded-full bg-surface-2">
              <Bookmark className="size-7 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold">Your watchlist is empty</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tap the <span className="font-bold text-primary">+</span> on any movie or highlight to save it here. Sign in to sync across devices.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                to="/movies"
                className="rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:scale-105"
              >
                Browse Movies
              </Link>
              <Link
                to="/login"
                className="rounded-md border border-border bg-surface-2 px-5 py-2.5 text-sm font-bold hover:border-primary"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
