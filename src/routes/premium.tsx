import { createFileRoute } from "@tanstack/react-router";
import { Check, Zap } from "lucide-react";
import { PREMIUM_PLANS } from "@/lib/sportflix-data";

export const Route = createFileRoute("/premium")({
  head: () => ({
    meta: [
      { title: "Premium — SPORTFLIX" },
      { name: "description", content: "Go Premium for ad-free, 4K Ultra HD, exclusive originals, faster downloads, and early access." },
      { property: "og:title", content: "SPORTFLIX Premium" },
      { property: "og:description", content: "Ad-free 4K streaming, exclusive content, faster downloads." },
    ],
  }),
  component: PremiumPage,
});

function PremiumPage() {
  return (
    <div className="pt-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <header className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
            <Zap className="size-3 fill-current" /> Premium Membership
          </div>
          <h1 className="font-display text-5xl font-black tracking-tighter md:text-7xl">
            Built for <span className="text-gradient-primary">superfans</span>.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Watch as a guest, or unlock the full SPORTFLIX arena — zero ads, 4K, exclusive drops, faster downloads.
          </p>
        </header>

        <div className="grid gap-6 pb-20 lg:grid-cols-3">
          {PREMIUM_PLANS.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl border p-8 transition-all hover-lift ${
                p.highlight
                  ? "border-primary bg-gradient-to-br from-primary/10 to-surface shadow-[var(--shadow-glow-primary)]"
                  : "border-border bg-surface"
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary-foreground">
                  Most Popular
                </div>
              )}
              <h3 className="font-display text-2xl font-black">{p.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-5xl font-black">${p.price}</span>
                <span className="text-sm text-muted-foreground">/ {p.period}</span>
              </div>
              <ul className="mt-8 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className={`mt-0.5 size-4 shrink-0 ${p.highlight ? "text-primary" : "text-accent"}`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`mt-10 w-full rounded-lg py-3 font-black uppercase tracking-wider transition-all ${
                  p.highlight
                    ? "bg-primary text-primary-foreground hover:scale-105"
                    : "border border-border bg-surface-2 hover:border-primary hover:text-primary"
                }`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
