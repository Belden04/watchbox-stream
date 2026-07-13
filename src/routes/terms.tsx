import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | WatchBox7" },
      { name: "description", content: "The terms that govern your use of WatchBox7." },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://watchbox-stream.lovable.app/terms" }],
  }),
  component: Terms,
});

function Terms() {
  return (
    <div className="relative mx-auto max-w-3xl px-4 py-20 md:px-8">
      <div className="mb-8 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-orange-400 text-white shadow-lg">
          <FileText className="size-5" />
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-muted-foreground">Legal</p>
          <h1 className="font-display text-3xl font-black md:text-4xl">Terms of Service</h1>
        </div>
      </div>
      <p className="mb-8 text-xs uppercase tracking-widest text-muted-foreground">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className="prose prose-invert max-w-none space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-display text-lg font-black text-foreground">1. Acceptance</h2>
          <p>By accessing WatchBox7 you agree to these Terms. If you don't accept them, please stop using the service.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-black text-foreground">2. The service</h2>
          <p>WatchBox7 provides streaming and downloading of movies and series to registered users and guests. Availability of specific titles may change without notice.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-black text-foreground">3. Accounts</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>You are responsible for keeping your credentials safe.</li>
            <li>Do not share your account or resell downloaded content.</li>
            <li>We may suspend accounts that violate these Terms or applicable law.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-black text-foreground">4. Acceptable use</h2>
          <p>You may not: attempt to reverse-engineer the platform, scrape content, upload illegal material, or use WatchBox7 to infringe intellectual property.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-black text-foreground">5. Payments &amp; Premium</h2>
          <p>Premium is granted after WatchBox7 confirms a transfer via MoMo, Airtel Money, or PayPal. Payments are non-refundable except when required by law.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-black text-foreground">6. Content ownership</h2>
          <p>All movies, series, artwork, branding, and code remain the property of their respective owners. Downloads are for personal, non-commercial use only.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-black text-foreground">7. Disclaimer</h2>
          <p>The service is provided “as is”. WatchBox7 is not liable for indirect damages arising from use of the platform.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-black text-foreground">8. Changes</h2>
          <p>We may update these Terms. Continued use after changes means you accept them.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-black text-foreground">9. Contact</h2>
          <p>Questions? Reach us via the <Link to="/contact" className="text-[#5a8dff] hover:underline">Contact page</Link> or WhatsApp <strong>0725639512</strong>.</p>
        </section>
      </div>
    </div>
  );
}
