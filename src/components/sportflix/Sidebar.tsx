import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Home, Film, LayoutGrid, Crown, Bookmark, User, LogOut,
  Shield, Menu, X, Search,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { WBMark } from "./WBMark";
import { SearchAutocomplete } from "./SearchAutocomplete";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/movies", label: "Movies", icon: Film },
  { to: "/categories", label: "Categories", icon: LayoutGrid },
  { to: "/watchlist", label: "Watchlist", icon: Bookmark },
  { to: "/premium", label: "Premium", icon: Crown },
];

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => { setOpen(false); }, []);

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-black/85 px-4 backdrop-blur-md lg:hidden">
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="grid size-9 place-items-center rounded-md hover:bg-white/10">
          <Menu className="size-5" />
        </button>
        <Link to="/"><WBMark size={34} /></Link>
        <button onClick={() => setMobileSearch(v => !v)} aria-label="Search" className="grid size-9 place-items-center rounded-md hover:bg-white/10">
          <Search className="size-5" />
        </button>
      </div>
      {mobileSearch && (
        <div className="fixed left-0 right-0 top-14 z-40 border-b border-border bg-black/95 p-3 lg:hidden">
          <SearchAutocomplete compact />
        </div>
      )}

      {/* MOBILE OVERLAY */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-black/70 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] flex w-64 flex-col border-r border-border bg-[oklch(0.06_0_0)] transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5">
            <WBMark size={40} />
            <span className="font-display text-sm font-black leading-tight">
              Watch<span className="text-[#5a8dff]">Box</span><span className="text-[#5a8dff]">7</span>
            </span>
          </Link>
          <button onClick={() => setOpen(false)} className="grid size-8 place-items-center rounded-md hover:bg-white/10 lg:hidden">
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
          <p className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">Browse</p>
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              activeProps={{ className: "bg-primary/15 text-primary" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              <n.icon className="size-4" />
              {n.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2.5 text-sm font-bold text-primary hover:bg-primary/20"
            >
              <Shield className="size-4" /> Admin Console
            </Link>
          )}
        </nav>

        <div className="border-t border-border p-3">
          {user ? (
            <button
              onClick={() => signOut()}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/5"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/5"
            >
              <User className="size-4" /> Sign in
            </Link>
          )}
        </div>
      </aside>

      {/* TOP STRIP (desktop) with search */}
      <div className="fixed inset-x-0 top-0 z-40 hidden h-16 items-center gap-4 border-b border-border bg-black/60 pl-72 pr-8 backdrop-blur-md lg:flex">
        <div className="flex-1 max-w-2xl">
          <SearchAutocomplete />
        </div>
        <Link
          to="/premium"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:scale-105"
        >
          <Crown className="size-4" /> Go Premium
        </Link>
      </div>
    </>
  );
}
