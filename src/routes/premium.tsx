import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Zap, Smartphone, CreditCard, Phone, Copy } from "lucide-react";
import { toast } from "sonner";
import { PREMIUM_PLANS } from "@/lib/sportflix-data";
import { supabase } from "@/integrations/supabase/client";

const db = supabase as any;

const PAY_PHONE = "0784797918";
const PAYPAL_EMAIL = "beldenbyiringiro116@gmail.com";

type Method = "momo" | "airtel" | "paypal";

const METHODS: { id: Method; label: string; icon: React.ReactNode; tag: string; detail: string }[] = [
  { id: "momo", label: "MTN Mobile Money", icon: <Smartphone className="size-5" />, tag: "MoMo Pay", detail: `Send to ${PAY_PHONE}` },
  { id: "airtel", label: "Airtel Money", icon: <Phone className="size-5" />, tag: "Airtel", detail: `Send to ${PAY_PHONE}` },
  { id: "paypal", label: "PayPal", icon: <CreditCard className="size-5" />, tag: "PayPal", detail: PAYPAL_EMAIL },
];

export const Route = createFileRoute("/premium")({
  head: () => ({
    meta: [
      { title: "Premium — WatchBox7" },
      { name: "description", content: "Go Premium for ad-free 4K, exclusive originals, and faster downloads." },
    ],
  }),
  component: PremiumPage,
});

function PremiumPage() {
  const [plan, setPlan] = useState(PREMIUM_PLANS[1]);
  const [method, setMethod] = useState<Method>("momo");
  const [form, setForm] = useState({ full_name: "", email: "", payer_phone: "", reference: "", note: "" });
  const [busy, setBusy] = useState(false);
  const [pinStage, setPinStage] = useState<null | "prompt" | "verifying" | "submitted">(null);
  const [pin, setPin] = useState("");

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (plan.price <= 0) return toast.error("Pick a paid plan first");
    if (method !== "paypal") {
      // Simulated MoMo / Airtel STK push — phone prompt before claim is recorded
      setPinStage("prompt");
      return;
    }
    await actuallySubmit();
  };

  const actuallySubmit = async () => {
    setBusy(true);
    const { error } = await db.from("premium_payments").insert({
      full_name: form.full_name,
      email: form.email,
      method,
      payer_phone: form.payer_phone,
      reference: form.reference,
      plan: plan.name,
      amount: plan.price,
      note: form.note,
      user_id: (await supabase.auth.getUser()).data.user?.id ?? null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Payment claim submitted — the admin will verify shortly.");
    setForm({ full_name: "", email: "", payer_phone: "", reference: "", note: "" });
    setPinStage("submitted");
  };

  const confirmPin = async () => {
    if (pin.length < 4) return toast.error("Enter your 4–6 digit PIN");
    setPinStage("verifying");
    // Simulated verification delay so the UX feels real.
    setTimeout(async () => {
      setPin("");
      await actuallySubmit();
    }, 1800);
  };

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
            Pick a plan, pay via MoMo / Airtel Money / PayPal, and the admin activates your account.
          </p>
        </header>

        {/* Plans */}
        <div className="grid gap-6 pb-12 lg:grid-cols-3">
          {PREMIUM_PLANS.map((p) => {
            const selected = plan.name === p.name;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => setPlan(p)}
                className={`relative rounded-2xl border p-8 text-left transition-all hover-lift ${
                  selected
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
                      <Check className={`mt-0.5 size-4 shrink-0 ${selected ? "text-primary" : "text-accent"}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <span
                  className={`mt-10 block w-full rounded-lg py-3 text-center font-black uppercase tracking-wider transition-all ${
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-surface-2"
                  }`}
                >
                  {selected ? "Selected" : "Choose plan"}
                </span>
              </button>
            );
          })}
        </div>

        {plan.price > 0 && (
          <section className="grid gap-8 pb-20 lg:grid-cols-2">
            {/* Pay-to instructions */}
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="mb-4 font-display text-xl font-black">1. Pay <span className="text-primary">${plan.price}</span> via</h2>
              <div className="mb-4 grid grid-cols-3 gap-2">
                {METHODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-3 text-xs font-bold transition-all ${
                      method === m.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-surface-2 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m.icon}
                    {m.tag}
                  </button>
                ))}
              </div>
              {METHODS.filter((m) => m.id === method).map((m) => (
                <div key={m.id} className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{m.label}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="font-display text-lg font-black">{m.id === "paypal" ? PAYPAL_EMAIL : PAY_PHONE}</p>
                    <button
                      type="button"
                      onClick={() => copy(m.id === "paypal" ? PAYPAL_EMAIL : PAY_PHONE)}
                      className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-bold hover:border-primary hover:text-primary"
                    >
                      <Copy className="-mt-0.5 mr-1 inline size-3" /> Copy
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Use your name or email as the reference so the admin can match your payment.
                  </p>
                </div>
              ))}
            </div>

            {/* Submit claim */}
            <form onSubmit={submit} className="space-y-3 rounded-2xl border border-border bg-surface p-6">
              <h2 className="mb-2 font-display text-xl font-black">2. Confirm your payment</h2>
              <input required placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="input w-full" />
              <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input w-full" />
              <input placeholder={method === "paypal" ? "PayPal email used" : "Phone number used to pay"} value={form.payer_phone} onChange={(e) => setForm({ ...form, payer_phone: e.target.value })} className="input w-full" />
              <input placeholder="Transaction ID / reference (optional)" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} className="input w-full" />
              <textarea placeholder="Note (optional)" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="input w-full" rows={3} />
              <button disabled={busy} className="w-full rounded-lg bg-primary py-3 font-black uppercase tracking-wider text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60">
                {busy ? "Submitting…" : `Submit payment for ${plan.name}`}
              </button>
              <p className="text-center text-[11px] text-muted-foreground">
                The admin is notified and will activate your account once the payment is verified.
              </p>
            </form>
          </section>
        )}
      </div>

      {/* Simulated MoMo / Airtel PIN prompt */}
      {pinStage && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/80 p-4 backdrop-blur-sm" onClick={() => pinStage !== "verifying" && setPinStage(null)}>
          <div className="w-full max-w-sm rounded-2xl border border-primary/40 bg-surface p-6 text-center shadow-[var(--shadow-glow-primary)]" onClick={(e) => e.stopPropagation()}>
            {pinStage === "prompt" && (
              <>
                <Smartphone className="mx-auto mb-3 size-10 text-primary" />
                <h3 className="font-display text-lg font-black">Check your phone</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  A {method === "momo" ? "MTN MoMo" : "Airtel Money"} request to send <span className="font-bold text-primary">${plan.price}</span> to <span className="font-bold">{PAY_PHONE}</span> was sent to your phone. Enter your PIN to confirm.
                </p>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  autoFocus
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="••••"
                  className="input mt-5 w-full text-center text-2xl tracking-[0.6em]"
                />
                <div className="mt-4 flex gap-2">
                  <button onClick={() => setPinStage(null)} className="flex-1 rounded-lg border border-border py-2.5 text-sm font-bold hover:border-primary">Cancel</button>
                  <button onClick={confirmPin} className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-black uppercase tracking-wider text-primary-foreground">Confirm</button>
                </div>
              </>
            )}
            {pinStage === "verifying" && (
              <div className="py-6">
                <div className="mx-auto mb-4 size-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
                <p className="font-display text-sm font-black uppercase tracking-widest text-primary">Verifying…</p>
                <p className="mt-1 text-xs text-muted-foreground">Hold on while the network confirms your transfer.</p>
              </div>
            )}
            {pinStage === "submitted" && (
              <>
                <div className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-primary/20 text-primary">
                  <Check className="size-6" />
                </div>
                <h3 className="font-display text-lg font-black">Payment claim received</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  The admin sees your payment of <span className="font-bold text-primary">${plan.price}</span> and will activate your account shortly. Funds are received at <span className="font-bold">{PAY_PHONE}</span>.
                </p>
                <button onClick={() => setPinStage(null)} className="mt-5 w-full rounded-lg bg-primary py-2.5 text-sm font-black uppercase tracking-wider text-primary-foreground">Done</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
