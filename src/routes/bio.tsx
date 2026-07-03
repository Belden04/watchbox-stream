import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Globe, Mail, Github, Linkedin, Twitter, Youtube, MapPin } from "lucide-react";
import { WBMark } from "@/components/watchbox7/WBMark";
import beldenPhoto from "@/assets/belden.webp.asset.json";

export const Route = createFileRoute("/bio")({
  head: () => ({
    meta: [
      { title: "Bio — Belden Right · WatchBox7" },
      { name: "description", content: "About Belden Right, creator of WatchBox7 — portfolio and social links." },
      { property: "og:title", content: "Belden Right — WatchBox7" },
      { property: "og:image", content: beldenPhoto.url },
    ],
  }),
  component: BioPage,
});

const LINKS = [
  {
    label: "Instagram",
    sub: "@b.e.l.d.e.n_1",
    href: "https://instagram.com/b.e.l.d.e.n_1",
    icon: Instagram,
    color: "from-pink-500 via-fuchsia-500 to-purple-600",
  },
  {
    label: "WatchBox7 on Instagram",
    sub: "@__watchbox7",
    href: "https://instagram.com/__watchbox7",
    icon: Instagram,
    color: "from-primary via-orange-500 to-amber-400",
  },
  {
    label: "Twitter / X",
    sub: "@beldenright",
    href: "https://twitter.com/beldenright",
    icon: Twitter,
    color: "from-sky-500 to-blue-500",
  },
  {
    label: "YouTube",
    sub: "@beldenright",
    href: "https://youtube.com/@beldenright",
    icon: Youtube,
    color: "from-red-600 to-red-400",
  },
  {
    label: "LinkedIn",
    sub: "in/beldenright",
    href: "https://linkedin.com/in/beldenright",
    icon: Linkedin,
    color: "from-blue-700 to-cyan-500",
  },
  {
    label: "GitHub",
    sub: "@beldenright",
    href: "https://github.com/beldenright",
    icon: Github,
    color: "from-gray-700 to-gray-500",
  },
  {
    label: "Portfolio",
    sub: "beldenright.com",
    href: "https://beldenright.com",
    icon: Globe,
    color: "from-emerald-500 to-teal-500",
  },
  {
    label: "Email",
    sub: "contact@beldenright.com",
    href: "mailto:contact@beldenright.com",
    icon: Mail,
    color: "from-amber-500 to-orange-500",
  },
];

function BioPage() {
  return (
    <div className="relative min-h-screen overflow-hidden pt-24">
      {/* ambient gradient blobs */}
      <div className="pointer-events-none absolute -right-32 -top-32 size-[520px] rounded-full bg-primary/25 blur-[160px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 size-[520px] rounded-full bg-fuchsia-500/10 blur-[160px]" />

      <div className="relative mx-auto max-w-4xl px-4 pb-24 md:px-8">
        {/* Header card */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface to-surface-2/40 p-8 shadow-[0_20px_80px_-30px_var(--color-primary)] md:p-12">
          <div className="absolute -right-20 -top-20 size-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 size-56 rounded-full bg-fuchsia-500/10 blur-3xl" />

          <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:gap-10 md:text-left">
            {/* Avatar with animated ring */}
            <div className="relative shrink-0">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary via-fuchsia-500 to-amber-300 opacity-80 blur-md" />
              <div className="absolute -inset-[3px] animate-[spin_8s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,var(--color-primary),#f0abfc,#facc15,var(--color-primary))]" />
              <img
                src={beldenPhoto.url}
                alt="Belden Right"
                className="relative size-36 rounded-full border-4 border-background object-cover shadow-2xl md:size-44"
              />
              <span className="absolute -bottom-1 -right-1 grid size-10 place-items-center rounded-full border-4 border-background bg-gradient-to-br from-primary to-orange-400 shadow-lg">
                <WBMark size={22} />
              </span>
            </div>

            <div className="flex-1 space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary">Founder · Developer</p>
              <h1 className="font-display text-4xl font-black tracking-tighter md:text-6xl">
                Belden <span className="bg-gradient-to-r from-primary via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">Right</span>
              </h1>
              <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground md:justify-start">
                <MapPin className="size-4 text-primary" /> Kigali, Rwanda · Building from Africa
              </p>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Creator of <span className="font-bold text-foreground">WatchBox7</span> — the home of translated
                &amp; non-translated movies and all matches highlights. Developer, designer, storyteller.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 md:justify-start">
                {["React", "TanStack", "Supabase", "Design"].map((t) => (
                  <span key={t} className="rounded-full border border-border bg-surface-2/60 px-3 py-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Links grid */}
        <h2 className="mt-12 mb-5 font-display text-xs font-black uppercase tracking-[0.4em] text-muted-foreground">
          Connect
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {LINKS.map(({ label, sub, href, icon: Icon, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-border bg-surface/80 p-4 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[0_18px_40px_-15px_var(--color-primary)]"
            >
              <span className={`grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}>
                <Icon className="size-5" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-bold">{label}</p>
                <p className="truncate text-xs text-muted-foreground">{sub}</p>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-primary">
                Open →
              </span>
            </a>
          ))}
        </div>

        <p className="mt-12 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
          © {new Date().getFullYear()} WatchBox7 · Crafted by Belden Right
        </p>
      </div>
    </div>
  );
}
