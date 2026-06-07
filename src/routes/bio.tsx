import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Facebook, Globe, Mail, Github, Linkedin, Twitter, Youtube } from "lucide-react";
import { SFMark } from "@/components/sportflix/SFMark";

export const Route = createFileRoute("/bio")({
  head: () => ({
    meta: [
      { title: "Bio — Belden Right · SPORTFLIX" },
      { name: "description", content: "About Belden Right, creator of SPORTFLIX — portfolio and social links." },
      { property: "og:title", content: "Belden Right — SPORTFLIX" },
    ],
  }),
  component: BioPage,
});

const LINKS = [
  { label: "Portfolio", href: "https://beldenright.com", icon: Globe, color: "from-primary to-primary-glow" },
  { label: "Instagram", href: "https://instagram.com/beldenright", icon: Instagram, color: "from-pink-500 to-purple-600" },
  { label: "Facebook", href: "https://facebook.com/beldenright", icon: Facebook, color: "from-blue-600 to-blue-400" },
  { label: "Twitter / X", href: "https://twitter.com/beldenright", icon: Twitter, color: "from-sky-500 to-blue-500" },
  { label: "YouTube", href: "https://youtube.com/@beldenright", icon: Youtube, color: "from-red-600 to-red-400" },
  { label: "LinkedIn", href: "https://linkedin.com/in/beldenright", icon: Linkedin, color: "from-blue-700 to-cyan-500" },
  { label: "GitHub", href: "https://github.com/beldenright", icon: Github, color: "from-gray-700 to-gray-500" },
  { label: "Email", href: "mailto:contact@beldenright.com", icon: Mail, color: "from-emerald-500 to-teal-500" },
];

function BioPage() {
  return (
    <div className="relative min-h-screen pt-24">
      <div className="pointer-events-none absolute -right-32 -top-32 size-[480px] rounded-full bg-primary/20 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 size-[480px] rounded-full bg-accent/10 blur-[140px]" />

      <div className="relative mx-auto max-w-3xl px-4 pb-20 md:px-8">
        <div className="flex flex-col items-center gap-5 text-center">
          <SFMark size={88} />
          <h1 className="font-display text-4xl font-black tracking-tighter md:text-5xl">
            Belden Right
          </h1>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">
            Creator of SPORTFLIX
          </p>
          <p className="max-w-xl text-base text-muted-foreground md:text-lg">
            Developer, designer and storyteller. SPORTFLIX is the home of translated &amp;
            non-translated movies and all matches highlights — built from Rwanda for the world.
          </p>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2">
          {LINKS.map(({ label, href, icon: Icon, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-border bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_10px_30px_-10px_var(--color-primary)]"
            >
              <span className={`grid size-11 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${color} text-white`}>
                <Icon className="size-5" />
              </span>
              <div className="flex-1">
                <p className="font-bold">{label}</p>
                <p className="truncate text-xs text-muted-foreground">{href.replace(/^https?:\/\//, "")}</p>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-primary">
                Open →
              </span>
            </a>
          ))}
        </div>

        <p className="mt-12 text-center text-xs uppercase tracking-widest text-muted-foreground">
          © {new Date().getFullYear()} SPORTFLIX · Crafted by Belden Right
        </p>
      </div>
    </div>
  );
}
