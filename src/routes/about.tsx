import { createFileRoute } from "@tanstack/react-router";
import { Target, Eye, Sparkles, Users, Film, Trophy, Download } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — WatchBox7" },
      { name: "description", content: "WatchBox7 is a premium streaming platform for movies and sports highlights, founded by Belden Right." },
      { property: "og:title", content: "About WatchBox7" },
      { property: "og:description", content: "Our mission, vision, and the story behind WatchBox7." },
    ],
  }),
  component: AboutPage,
});

const STATS = [
  { icon: Film, label: "Movies", value: "2,400+" },
  { icon: Trophy, label: "Highlights", value: "8,900+" },
  { icon: Users, label: "Viewers", value: "1.2M" },
  { icon: Download, label: "Downloads", value: "18M+" },
];

function AboutPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="mx-auto max-w-[1400px] px-4 pb-20 md:px-8">
        <h1 className="font-display max-w-4xl text-5xl font-black tracking-tighter md:text-7xl">
          Premium streaming, <span className="text-gradient-primary">built in Kigali</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          WatchBox7 brings world-class movies and the biggest sports moments to fans across Africa and beyond — with first-class translations and the fastest downloads in the game.
        </p>
      </section>

      {/* Mission / Vision / Story */}
      <section className="border-y border-border bg-surface/40 py-20">
        <div className="mx-auto grid max-w-[1400px] gap-6 px-4 md:grid-cols-3 md:px-8">
          {[
            { icon: Target, title: "Mission", body: "Make the best movies and sports highlights accessible to every fan — translated, downloadable, and beautifully presented." },
            { icon: Eye, title: "Vision", body: "Become Africa's most-loved streaming destination by putting story, sport, and local language at the center." },
            { icon: Sparkles, title: "Our Story", body: "Born from a love of cinema and stadium roars, WatchBox7 was built to celebrate both — without compromise on quality or access." },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-border bg-surface p-8 hover-lift">
              <div className="mb-4 grid size-12 place-items-center rounded-lg bg-primary/10 text-primary">
                <c.icon className="size-5" />
              </div>
              <h3 className="font-display text-2xl font-bold">{c.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="mx-auto grid max-w-[1400px] gap-4 px-4 sm:grid-cols-2 md:grid-cols-4 md:px-8">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-surface p-8 text-center">
              <s.icon className="mx-auto mb-3 size-6 text-accent" />
              <div className="font-display text-4xl font-black text-foreground">{s.value}</div>
              <div className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Developer Bio */}
      <section className="pb-24">
        <div className="mx-auto max-w-[1000px] px-4 md:px-8">
          <div className="overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-surface to-surface-2 p-10 md:p-14">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
              <span className="h-px w-8 bg-primary" /> The Founder
            </div>
            <h2 className="font-display mt-4 text-4xl font-black tracking-tighter md:text-5xl">
              Belden Right
            </h2>
            <p className="mt-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Frontend Developer · Digital Creator
            </p>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Passionate about sports, entertainment, and modern technology. Belden built WatchBox7 to celebrate the stories and stadiums that define a generation — with the polish of a global streaming brand and the soul of a Kigali night.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
