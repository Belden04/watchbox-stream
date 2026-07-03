import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube, Send } from "lucide-react";
import { WBMark } from "./WBMark";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50 pt-16 pb-10">
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-12 px-4 md:grid-cols-4 md:px-8">
        <div className="space-y-5">
          <Link to="/" className="flex items-center gap-3">
            <WBMark size={44} />
            <span className="font-display text-xl font-black tracking-tight">
              Watch<span className="text-[#5a8dff]">Box</span><span className="text-[#5a8dff]">7</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The home of translated &amp; non-translated movies and full-series episodes.
          </p>
          <div className="flex gap-3">
            {[Facebook, Instagram, Youtube, Send].map((Icon, i) => (
              <a key={i} href="#" className="grid size-10 place-items-center rounded-full border border-border bg-surface-2 transition-all hover:scale-110 hover:border-[#1e5bff] hover:text-[#5a8dff]">
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em]">Platform</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/movies" className="hover:text-[#5a8dff]">Movies</Link></li>
            <li><Link to="/categories" className="hover:text-[#5a8dff]">Categories</Link></li>
            <li><Link to="/watchlist" className="hover:text-[#5a8dff]">Watchlist</Link></li>
            <li><Link to="/premium" className="hover:text-[#5a8dff]">Premium</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em]">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-[#5a8dff]">About</Link></li>
            <li><Link to="/bio" className="hover:text-[#5a8dff]">Bio</Link></li>
            <li><Link to="/contact" className="hover:text-[#5a8dff]">Contact</Link></li>
            <li><a href="#" className="hover:text-[#5a8dff]">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#5a8dff]">Terms of Service</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em]">Newsletter</h4>
          <p className="text-sm text-muted-foreground">Get alerts for new drops and premium offers.</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex overflow-hidden rounded-md border border-border bg-surface-2 focus-within:border-[#1e5bff]">
            <input type="email" placeholder="your@email.com" className="flex-1 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none" />
            <button className="bg-[#1e5bff] px-4 text-sm font-bold text-white hover:bg-[#3970ff]">Join</button>
          </form>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-[1500px] flex-col items-center justify-between gap-4 border-t border-border px-4 pt-8 text-xs uppercase tracking-widest text-muted-foreground md:flex-row md:px-8">
        <p>© {new Date().getFullYear()} WatchBox7. All rights reserved.</p>
        <p>Crafted by <span className="font-bold text-[#5a8dff]">Belden Right</span></p>
      </div>
    </footer>
  );
}
