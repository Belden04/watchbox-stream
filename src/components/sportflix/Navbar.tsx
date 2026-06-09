import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, User, Crown, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { SFMark } from "./SFMark";
import { SearchAutocomplete } from "./SearchAutocomplete";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/movies", label: "Movies" },
  { to: "/sports", label: "Sports" },
  { to: "/categories", label: "Categories" },
  { to: "/premium", label: "Premium" },
  { to: "/watchlist", label: "Watchlist" },
  { to: "/bio", label: "Bio" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

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
          <Link to="/" className="flex items-center gap-2" aria-label="SPORTFLIX home">
            <SFMark size={36} />
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
            {isAdmin && (
              <Link to="/admin" className="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-glow">
                <Shield className="size-4" /> Admin
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <SearchAutocomplete />
          </div>
          {user ? (
            <button
              onClick={() => signOut()}
              className="hidden items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-secondary md:inline-flex"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-secondary md:inline-flex"
            >
              <User className="size-4" /> Sign In
            </Link>
          )}
          <Link
            to="/premium"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground transition-transform hover:scale-105 hover:shadow-[var(--shadow-glow-primary)] md:px-4"
          >
            <Crown className="size-4" /> Premium
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
            <SearchAutocomplete compact />
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
            {isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-bold text-primary">
                <Shield className="-mt-0.5 mr-1 inline size-4" /> Admin
              </Link>
            )}
            {user ? (
              <button onClick={() => { setOpen(false); signOut(); }} className="rounded-md border border-border px-3 py-2 text-left text-sm font-medium">
                Sign out
              </button>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="rounded-md border border-border px-3 py-2 text-sm font-medium">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
