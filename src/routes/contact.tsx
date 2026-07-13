import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, Instagram, Facebook, Youtube, Send, Mail, Sparkles, Globe } from "lucide-react";
import { SOCIALS } from "@/lib/socials";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — WatchBox7" },
      { name: "description", content: "Get in touch with WatchBox7 via WhatsApp, Instagram, TikTok, Facebook, YouTube, Telegram, or email." },
    ],
  }),
  component: ContactPage,
});

const ICONS: Record<string, any> = {
  whatsapp: MessageCircle, instagram: Instagram, facebook: Facebook,
  youtube: Youtube, telegram: Send, tiktok: Sparkles, x: Globe, email: Mail,
};

const CHANNELS = SOCIALS.map((s) => ({
  icon: ICONS[s.key] ?? Globe,
  label: s.label,
  handle: s.handle,
  href: s.href,
  color: "text-primary",
}));

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-[1400px] px-4 pb-24 md:px-8">
        <header className="mb-12 max-w-2xl">
          <h1 className="font-display text-5xl font-black tracking-tighter md:text-6xl">Contact</h1>
          <p className="mt-4 text-muted-foreground">
            Reach the WatchBox7 team — for support, partnerships, content suggestions, or just to say hi.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Channels */}
          <div className="grid grid-cols-2 gap-3">
            {CHANNELS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group rounded-xl border border-border bg-surface p-5 transition-all hover-lift"
              >
                <c.icon className={`mb-3 size-6 ${c.color} transition-transform group-hover:scale-110`} />
                <div className="font-display text-lg font-bold">{c.label}</div>
                <div className="truncate text-xs text-muted-foreground">{c.handle}</div>
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
