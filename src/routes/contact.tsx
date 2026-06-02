import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, Instagram, Music2, Facebook, Youtube, Send, Mail } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — PORTFLIX" },
      { name: "description", content: "Get in touch with PORTFLIX via WhatsApp, Instagram, TikTok, Facebook, YouTube, Telegram, or email." },
    ],
  }),
  component: ContactPage,
});

const CHANNELS = [
  { icon: MessageCircle, label: "WhatsApp", handle: "+250 7XX XXX XXX", href: "#", color: "text-accent" },
  { icon: Instagram, label: "Instagram", handle: "@portflix", href: "#", color: "text-primary" },
  { icon: Music2, label: "TikTok", handle: "@portflix", href: "#", color: "text-foreground" },
  { icon: Facebook, label: "Facebook", handle: "PORTFLIX", href: "#", color: "text-primary" },
  { icon: Youtube, label: "YouTube", handle: "PORTFLIX Official", href: "#", color: "text-primary" },
  { icon: Send, label: "Telegram", handle: "@portflix", href: "#", color: "text-accent" },
];

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-[1400px] px-4 pb-24 md:px-8">
        <header className="mb-12 max-w-2xl">
          <h1 className="font-display text-5xl font-black tracking-tighter md:text-6xl">Contact</h1>
          <p className="mt-4 text-muted-foreground">
            Reach the PORTFLIX team — for support, partnerships, content suggestions, or just to say hi.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Channels */}
          <div className="grid grid-cols-2 gap-3">
            {CHANNELS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="group rounded-xl border border-border bg-surface p-5 transition-all hover-lift"
              >
                <c.icon className={`mb-3 size-6 ${c.color} transition-transform group-hover:scale-110`} />
                <div className="font-display text-lg font-bold">{c.label}</div>
                <div className="text-xs text-muted-foreground">{c.handle}</div>
              </a>
            ))}
          </div>

          {/* Email form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              setTimeout(() => setSent(false), 4000);
            }}
            className="space-y-4 rounded-2xl border border-border bg-surface p-8"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
              <Mail className="size-4" /> Email us
            </div>
            <h2 className="font-display text-3xl font-black">Send a message</h2>
            <input
              required
              placeholder="Your name"
              className="w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              required
              type="email"
              placeholder="Your email"
              className="w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              placeholder="Subject"
              className="w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <textarea
              required
              rows={5}
              maxLength={1000}
              placeholder="Your message..."
              className="w-full resize-none rounded-md border border-border bg-surface-2 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              className="w-full rounded-md bg-primary py-3 font-black uppercase tracking-wider text-primary-foreground transition-transform hover:scale-[1.02] hover:shadow-[var(--shadow-glow-primary)]"
            >
              {sent ? "✓ Message sent" : "Send message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
