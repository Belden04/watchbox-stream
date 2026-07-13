import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | WatchBox7" },
      { name: "description", content: "How WatchBox7 collects, uses, and protects your information." },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://watchbox-stream.lovable.app/privacy" }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="relative mx-auto max-w-3xl px-4 py-20 md:px-8">
      <div className="mb-8 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-[#1e5bff] to-[#5a8dff] text-white shadow-lg">
          <ShieldCheck className="size-5" />
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-muted-foreground">Legal</p>
          <h1 className="font-display text-3xl font-black md:text-4xl">Privacy Policy</h1>
        </div>
      </div>
      <p className="mb-8 text-xs uppercase tracking-widest text-muted-foreground">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className="prose prose-invert max-w-none space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-display text-lg font-black text-foreground">1. Who we are</h2>
          <p>
            WatchBox7 (“we”, “our”, “us”) is a streaming platform for translated and
            non-translated movies and series. This page explains what we collect and how
            we use it.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-black text-foreground">2. What we collect</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li><strong>Account data</strong> — email address and display name when you register.</li>
            <li><strong>Activity data</strong> — watch history, downloads, and watchlist entries so we can improve recommendations.</li>
            <li><strong>Technical data</strong> — device, browser, and approximate location for security and analytics.</li>
            <li><strong>Payment data</strong> — when you claim Premium via MoMo, Airtel Money, or PayPal, we record the phone / reference to verify the transfer. We do not store PINs.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-black text-foreground">3. How we use your data</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Deliver the streaming service and remember your preferences.</li>
            <li>Verify payments and grant Premium access.</li>
            <li>Prevent abuse, fraud and copyright violations.</li>
            <li>Reply to your requests via WhatsApp or email.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-black text-foreground">4. Sharing</h2>
          <p>We do not sell personal data. We only share information with providers who host our infrastructure (database, storage, CDN) under strict processing agreements.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-black text-foreground">5. Your rights</h2>
          <p>You can request access, correction, or deletion of your data at any time by contacting us on WhatsApp or email listed on our <Link to="/bio" className="text-[#5a8dff] hover:underline">About page</Link>.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-black text-foreground">6. Cookies</h2>
          <p>We use essential cookies for authentication and small local-storage entries for your watchlist. No third-party ad tracking.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-black text-foreground">7. Contact</h2>
          <p>For any privacy question, WhatsApp <strong>0725639512</strong> or email <a className="text-[#5a8dff] hover:underline" href="mailto:beldenbyiringiro116@gmail.com">beldenbyiringiro116@gmail.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
