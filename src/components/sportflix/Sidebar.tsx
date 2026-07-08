import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Home, Film, LayoutGrid, Bookmark, User, LogOut,
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
];

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  const menuBtnRef = useRef<HTMLButtonElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const asideRef = useRef<HTMLElement | null>(null);

  // Close on Escape + focus management + body scroll lock
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Move focus into the panel after the enter transition begins
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      // Simple focus trap within the sidebar
      if (e.key === "Tab" && asideRef.current) {
        const nodes = asideRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const activeEl = document.activeElement as HTMLElement | null;
        if (e.shiftKey && activeEl === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && activeEl === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      // Restore focus to the trigger
      menuBtnRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      {/* TOP BAR — hosts menu toggle + logo + search */}
      <div className="fixed inset-x-0 top-0 z-50 flex h-14 items-center gap-3 border-b border-border bg-black/85 px-4 backdrop-blur-md">
        <button
          ref={menuBtnRef}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="app-sidebar"
          className="group grid size-9 place-items-center rounded-md ring-primary/50 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2"
        >
          <span className="relative block size-5">
            <Menu
              className={`absolute inset-0 size-5 transition-all duration-300 ${
                open ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100"
              }`}
            />
            <X
              className={`absolute inset-0 size-5 transition-all duration-300 ${
                open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0"
              }`}
            />
          </span>
        </button>
        <Link to="/" className="flex items-center gap-2">
          <WBMark size={32} />
          <span className="hidden font-display text-sm font-black sm:inline">
            Watch<span className="text-[#5a8dff]">Box7</span>
          </span>
        </Link>

        <div className="ml-auto hidden max-w-xl flex-1 md:block">
          <SearchAutocomplete />
        </div>

        <button
          onClick={() => setMobileSearch((v) => !v)}
          aria-label="Search"
          className="ml-auto grid size-9 place-items-center rounded-md transition-colors hover:bg-white/10 md:hidden"
        >
          <Search className="size-5" />
        </button>
      </div>
      {mobileSearch && (
        <div className="fixed left-0 right-0 top-14 z-40 animate-fade-in border-b border-border bg-black/95 p-3 md:hidden">
          <SearchAutocomplete compact />
        </div>
      )}

      {/* OVERLAY — animated fade + blur, click to close */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden={!open}
        className={`fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* SIDEBAR — smooth slide + inert when closed */}
      <aside
        id="app-sidebar"
        ref={asideRef}
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
        aria-hidden={!open}
        className={`fixed inset-y-0 left-0 z-[70] flex w-64 flex-col border-r border-border bg-[oklch(0.06_0_0)] shadow-[8px_0_40px_-12px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        // Keep tab order out of the sidebar when it's closed
        {...(!open ? { inert: "" as unknown as boolean } : {})}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5">
            <WBMark size={40} />
            <span className="font-display text-sm font-black leading-tight">
              Watch<span className="text-[#5a8dff]">Box7</span>
            </span>
          </Link>
          <button
            ref={closeBtnRef}
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="grid size-8 place-items-center rounded-md ring-primary/50 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
          <p className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">Browse</p>
          {NAV.map((n, i) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              style={{ animationDelay: open ? `${80 + i * 45}ms` : "0ms" }}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-muted-foreground ring-primary/40 transition-colors hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 ${
                open ? "animate-fade-in opacity-0 [animation-fill-mode:forwards]" : ""
              }`}
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
              className="mt-2 flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/20"
            >
              <Shield className="size-4" /> Admin Console
            </Link>
          )}
        </nav>

        <div className="border-t border-border p-3">
          {user ? (
            <button
              onClick={() => signOut()}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-white/5"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-white/5"
            >
              <User className="size-4" /> Sign in
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
