import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Instagram, Facebook, Youtube, Send, Mail, Play, Film,
  Sparkles, Download, ShieldCheck, Globe, MessageCircle,
} from "lucide-react";
import { WBMark } from "@/components/sportflix/WBMark";
import { SOCIALS } from "@/lib/socials";

export const Route = createFileRoute("/bio")({
  head: () => ({
    meta: [
      { title: "About WatchBox7 | The home of movies" },
      { name: "description", content: "About WatchBox7 — a premium streaming home for translated & non-translated movies and full series. Connect with us on Instagram, WhatsApp, Facebook and more." },
      { property: "og:title", content: "About WatchBox7" },
      { property: "og:description", content: "The premium home of translated & non-translated movies." },
    ],
  }),
  component: AboutPage,
});

const ICONS: Record<string, any> = {
  instagram: Instagram, facebook: Facebook, youtube: Youtube,
  whatsapp: MessageCircle, telegram: Send, tiktok: Sparkles,
  x: Globe, email: Mail,
};

const FEATURES = [
  { icon: Film, title: "Curated Movies", body: "Translated & non-translated titles, plus full-series episodes — organized so you find your night's watch in seconds." },
  { icon: Play, title: "Smart Player", body: "Adaptive quality, cinematic transitions, and episode auto-grouping for series." },
  { icon: Download, title: "Watch or Download", body: "Stream instantly or download for offline. Guest access is always free." },
  { icon: ShieldCheck, title: "Private & Safe", body: "No trackers. Your watchlist and activity stay yours." },
];

function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden pt-24">
      {/* Cinematic ambient */}
      <div className="pointer-events-none absolute -right-40 -top-40 size-[560px] rounded-full bg-[#1e5bff]/25 blur-[160px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 size-[520px] rounded-full bg-primary/20 blur-[160px]" />

      <div className="relative mx-auto max-w-5xl px-4 pb-24 md:px-8">
        {/* HERO */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface to-black/60 p-8 shadow-[0_25px_100px_-30px_#1e5bff] md:p-14">
          <div className="absolute -right-24 -top-24 size-72 rounded-full bg-[#1e5bff]/25 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 size-56 rounded-full bg-primary/20 blur-3xl" />

          <div className="relative flex flex-col items-center gap-8 text-center">
            <div className="relative">
              <div className="absolute -inset-2 animate-[spin_10s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,#1e5bff,#e81d1d,#facc15,#1e5bff)] opacity-70 blur-md" />
              <div className="relative grid size-28 place-items-center rounded-full border-4 border-background bg-white shadow-2xl md:size-36">
                <WBMark size={92} />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#5a8dff]">The Home of Cinema</p>
              <h1 className="font-display text-4xl font-black tracking-tighter md:text-6xl">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-[#5a8dff] via-white to-primary bg-clip-text text-transparent">
                  WatchBox7
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                A premium streaming home for translated & non-translated movies and complete series.
                Built for viewers who care about quality, taste, and craft — with a modern player,
                smart discovery, and generous guest access. No noise. Just films.
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {["Movies", "Series", "Translated", "Guest Access", "Download"].map((t) => (
                  <span key={t} className="rounded-full border border-border bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                <Link to="/movies" search={{ q: "", company: "" }} className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:scale-105">
                  <Play className="size-4 fill-current" /> Browse Movies
                </Link>
                <Link to="/categories" className="inline-flex items-center gap-2 rounded-md border border-border bg-black/40 px-5 py-2.5 text-sm font-bold hover:bg-white/10">
                  Categories
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <h2 className="mt-14 mb-5 font-display text-xs font-black uppercase tracking-[0.4em] text-muted-foreground">
          Why WatchBox7
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="group relative overflow-hidden rounded-2xl border border-border bg-surface/70 p-5 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-[#1e5bff]/60 hover:shadow-[0_18px_40px_-15px_#1e5bff]">
              <span className="mb-3 grid size-11 place-items-center rounded-xl bg-gradient-to-br from-[#1e5bff] to-[#5a8dff] text-white shadow-lg">
                <Icon className="size-5" />
              </span>
              <h3 className="font-display text-base font-black">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>

        {/* SOCIALS */}
        <h2 className="mt-14 mb-5 font-display text-xs font-black uppercase tracking-[0.4em] text-muted-foreground">
          Connect with WatchBox7
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {SOCIALS.map(({ key, label, handle, href, color }) => {
            const Icon = ICONS[key] ?? Globe;
            return (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-border bg-surface/80 p-4 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-[#1e5bff]/60 hover:shadow-[0_18px_40px_-15px_#1e5bff]"
              >
                <span className={`grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}>
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{label}</p>
                  <p className="truncate text-xs text-muted-foreground">{handle}</p>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-[#5a8dff]">
                  Open →
                </span>
              </a>
            );
          })}
        </div>

        <p className="mt-14 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
          © {new Date().getFullYear()} WatchBox7 · The home of cinema
        </p>
      </div>
    </div>
  );
}
