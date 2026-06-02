import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Menu, X, User } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/movies", label: "Movies" },
  { to: "/sports", label: "Sports" },
  { to: "/categories", label: "Categories" },
  { to: "/premium", label: "Premium" },
  { to: "/watchlist", label: "Watchlist" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "glass-strong border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-10">
          <Link to="/" className="font-display text-2xl font-extrabold tracking-tighter text-primary">
            PORT<span className="text-foreground">FLIX</span>
          </Link>
          <div className="hidden items-center gap-6 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search movies, highlights..."
              className="w-56 rounded-full border border-border bg-secondary/60 py-1.5 pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary lg:w-72"
            />
          </div>
          <Link
            to="/login"
            className="hidden items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary md:inline-flex"
          >
            <User className="size-4" /> Sign In
          </Link>
          <Link
            to="/premium"
            className="rounded-md bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground transition-transform hover:scale-105 hover:shadow-[var(--shadow-glow-primary)]"
          >
            Go Premium
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 text-foreground lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="glass-strong border-t border-border px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "text-foreground bg-secondary" }}
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="rounded-md border border-border px-3 py-2 text-sm font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
