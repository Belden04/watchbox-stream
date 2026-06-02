import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/portflix-logo.png.asset.json";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — PORTFLIX" },
      { name: "description", content: "Sign in or create an account on PORTFLIX." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created — welcome to PORTFLIX!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in");
      }
      nav({ to: "/" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-4 pt-24">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-surface p-8">
        <div className="flex flex-col items-center gap-3">
          <img src={logo.url} alt="PORTFLIX" className="h-12 w-auto" />
          <h1 className="font-display text-3xl font-black">
            {mode === "signin" ? "Welcome back" : "Join PORTFLIX"}
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            Watching and downloading work without an account. Sign in to manage uploads, watchlist & comments.
          </p>
        </div>

        <form className="space-y-3" onSubmit={submit}>
          {mode === "signup" && (
            <input
              placeholder="Display name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm focus:border-primary focus:outline-none"
            />
          )}
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm focus:border-primary focus:outline-none"
          />
          <input
            required
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm focus:border-primary focus:outline-none"
          />
          <button
            disabled={busy}
            type="submit"
            className="w-full rounded-md bg-primary py-3 font-black uppercase tracking-wider text-primary-foreground hover:scale-[1.02] disabled:opacity-50"
          >
            {busy ? "…" : mode === "signin" ? "Sign In" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
        >
          {mode === "signin" ? "No account? Create one →" : "Already a member? Sign in →"}
        </button>

        <div className="rounded-md border border-primary/30 bg-primary/5 p-3 text-center text-xs">
          <Crown className="-mt-0.5 mr-1 inline size-3 text-primary" />
          First registered user can claim the <Link to="/admin" className="font-bold text-primary hover:underline">Admin role</Link>.
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <Link to="/" className="text-primary hover:underline">Continue as guest →</Link>
        </div>
      </div>
    </div>
  );
}
