import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — PORTFLIX" },
      { name: "description", content: "Sign in to PORTFLIX to save your watchlist, comments, and history. Watching and downloading work without an account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="grid min-h-screen place-items-center px-4 pt-24">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-surface p-8">
        <div>
          <h1 className="font-display text-3xl font-black">Sign In</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Watching and downloading work without an account. Sign in to save your watchlist, comments, and history.
          </p>
        </div>

        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-primary py-3 font-black uppercase tracking-wider text-primary-foreground hover:scale-[1.02]"
          >
            Sign In
          </button>
        </form>

        <div className="text-center text-xs text-muted-foreground">
          Authentication is enabled in Phase 2. <br />
          <Link to="/" className="text-primary hover:underline">
            Continue as guest →
          </Link>
        </div>
      </div>
    </div>
  );
}
