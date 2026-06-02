import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube, Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50 pt-20 pb-10">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-4 md:grid-cols-4 md:px-8">
        <div className="space-y-5">
          <Link to="/" className="font-display text-3xl font-extrabold tracking-tighter text-primary">
            PORT<span className="text-foreground">FLIX</span>
          </Link>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The premium home for high-octane cinema and world-class sports highlights. Your arena, your screen.
          </p>
          <div className="flex gap-3">
            {[Facebook, Instagram, Youtube, Send].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid size-10 place-items-center rounded-full border border-border bg-surface-2 transition-all hover:scale-110 hover:border-primary hover:text-primary"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">Platform</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/movies" className="hover:text-primary">Movies</Link></li>
            <li><Link to="/sports" className="hover:text-primary">Sports Highlights</Link></li>
            <li><Link to="/categories" className="hover:text-primary">Categories</Link></li>
            <li><Link to="/premium" className="hover:text-primary">Premium</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
            <li><a href="#" className="hover:text-primary">FAQ</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">Newsletter</h4>
          <p className="text-sm text-muted-foreground">
            Get alerts for new drops, exclusive highlights, and premium offers.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex overflow-hidden rounded-md border border-border bg-surface-2 focus-within:border-primary"
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
            />
            <button className="bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-glow">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-[1600px] flex-col items-center justify-between gap-4 border-t border-border px-4 pt-8 text-xs uppercase tracking-widest text-muted-foreground md:flex-row md:px-8">
        <p>© {new Date().getFullYear()} PORTFLIX. All rights reserved.</p>
        <p>
          Crafted by <span className="font-bold text-primary">Belden Right</span>
        </p>
      </div>
    </footer>
  );
}
