import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube, Send, MessageCircle } from "lucide-react";
import { WBMark } from "./WBMark";
import { SOCIALS } from "@/lib/socials";

const FOOTER_ICONS = [
  { key: "whatsapp", Icon: MessageCircle },
  { key: "instagram", Icon: Instagram },
  { key: "facebook", Icon: Facebook },
  { key: "youtube", Icon: Youtube },
  { key: "telegram", Icon: Send },
] as const;

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
          <div className="flex flex-wrap gap-3">
            {FOOTER_ICONS.map(({ key, Icon }) => {
              const s = SOCIALS.find((x) => x.key === key);
              if (!s) return null;
              return (
                <a
                  key={key}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`${s.label} · ${s.handle}`}
                  className="grid size-10 place-items-center rounded-full border border-border bg-surface-2 transition-all hover:scale-110 hover:border-[#1e5bff] hover:text-[#5a8dff]"
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em]">Platform</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/movies" className="hover:text-[#5a8dff]">Movies</Link></li>
            <li><Link to="/categories" className="hover:text-[#5a8dff]">Categories</Link></li>
            <li><Link to="/watchlist" className="hover:text-[#5a8dff]">Watchlist</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em]">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/bio" className="hover:text-[#5a8dff]">About WatchBox7</Link></li>
            <li><Link to="/contact" className="hover:text-[#5a8dff]">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-[#5a8dff]">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-[#5a8dff]">Terms of Service</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em]">Get in touch</h4>
          <p className="text-sm text-muted-foreground">
            WhatsApp us for requests, feedback, or partnerships.
          </p>
          <a
            href={SOCIALS.find((s) => s.key === "whatsapp")!.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-bold text-white transition hover:scale-105"
          >
            <MessageCircle className="size-4" /> Chat on WhatsApp
          </a>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-[1500px] flex-col items-center justify-between gap-4 border-t border-border px-4 pt-8 text-xs uppercase tracking-widest text-muted-foreground md:flex-row md:px-8">
        <p>© {new Date().getFullYear()} WatchBox7. All rights reserved.</p>
        <p>The home of cinema</p>
      </div>
    </footer>
  );
}
