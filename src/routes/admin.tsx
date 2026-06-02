import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Upload, Star, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — PORTFLIX" }] }),
  component: AdminPage,
});

type Movie = {
  id: string;
  title: string;
  poster_url: string;
  video_url: string | null;
  year: number;
  genre: string;
  language: string;
  is_translated: boolean;
  is_trending: boolean;
  director: string;
};
type Highlight = {
  id: string;
  title: string;
  thumbnail_url: string;
  video_url: string | null;
  category: string;
  duration: string;
};

function AdminPage() {
  const { user, isAdmin, loading, refreshRole } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  const load = async () => {
    const [m, h] = await Promise.all([
      supabase.from("movies").select("*").order("created_at", { ascending: false }),
      supabase.from("highlights").select("*").order("created_at", { ascending: false }),
    ]);
    setMovies((m.data as Movie[]) ?? []);
    setHighlights((h.data as Highlight[]) ?? []);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  if (loading) return <div className="grid min-h-screen place-items-center pt-24">Loading…</div>;

  if (!user) {
    return (
      <div className="grid min-h-screen place-items-center px-4 pt-24">
        <div className="max-w-md space-y-4 rounded-xl border border-border bg-surface p-8 text-center">
          <Crown className="mx-auto size-10 text-primary" />
          <h1 className="font-display text-2xl font-black">Admin access</h1>
          <p className="text-sm text-muted-foreground">You need to sign in to manage PORTFLIX.</p>
          <Link to="/login" className="inline-block rounded-md bg-primary px-6 py-2 font-bold text-primary-foreground">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center px-4 pt-24">
        <div className="max-w-md space-y-4 rounded-xl border border-border bg-surface p-8 text-center">
          <Crown className="mx-auto size-10 text-primary" />
          <h1 className="font-display text-2xl font-black">Become admin</h1>
          <p className="text-sm text-muted-foreground">
            If no admin exists yet, you can claim ownership of this PORTFLIX instance.
          </p>
          <button
            onClick={async () => {
              const { data, error } = await supabase.rpc("claim_admin");
              if (error) return toast.error(error.message);
              if (data) {
                toast.success("You are now admin!");
                await refreshRole();
              } else toast.error("An admin already exists.");
            }}
            className="rounded-md bg-primary px-6 py-2 font-bold text-primary-foreground"
          >
            Claim admin role
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-[1400px] space-y-12 px-4 pb-20 md:px-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-black tracking-tighter">Admin Console</h1>
            <p className="text-sm text-muted-foreground">Upload, trend, and curate the PORTFLIX library.</p>
          </div>
          <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
            <Crown className="-mt-0.5 mr-1 inline size-3" /> Admin
          </span>
        </header>

        <UploadMovieForm onDone={load} />
        <MovieList movies={movies} reload={load} />

        <UploadHighlightForm onDone={load} />
        <HighlightList highlights={highlights} reload={load} />
      </div>
    </div>
  );
}

async function uploadTo(bucket: string, file: File) {
  const path = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

function UploadMovieForm({ onDone }: { onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  const [poster, setPoster] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    year: new Date().getFullYear(),
    genre: "Drama",
    language: "EN",
    country: "",
    director: "",
    translator: "",
    duration: "",
    rating: 0,
    description: "",
    is_translated: false,
    is_trending: false,
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!poster) return toast.error("Poster required");
    setBusy(true);
    try {
      const poster_url = await uploadTo("posters", poster);
      const video_url = video ? await uploadTo("videos", video) : null;
      const { error } = await supabase.from("movies").insert({ ...form, poster_url, video_url });
      if (error) throw error;
      toast.success("Movie uploaded");
      setPoster(null);
      setVideo(null);
      setForm({ ...form, title: "", description: "" });
      onDone();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-xl border border-border bg-surface p-6">
      <h2 className="mb-4 font-display text-xl font-black">
        <Upload className="-mt-1 mr-2 inline size-5 text-primary" />
        Upload Movie
      </h2>
      <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
        <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
        <input placeholder="Director" value={form.director} onChange={(e) => setForm({ ...form, director: e.target.value })} className="input" />
        <input placeholder="Genre" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} className="input" />
        <input placeholder="Language (EN, KIN, EN/KIN...)" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="input" />
        <input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input" />
        <input placeholder="Translator (Umusobanuzi)" value={form.translator} onChange={(e) => setForm({ ...form, translator: e.target.value })} className="input" />
        <input placeholder="Duration (e.g. 1h 48m)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="input" />
        <input type="number" placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: +e.target.value })} className="input" />
        <input type="number" step="0.1" placeholder="Rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: +e.target.value })} className="input" />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input md:col-span-2" rows={3} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_translated} onChange={(e) => setForm({ ...form, is_translated: e.target.checked })} />
          Translated (Umusobanuwe)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_trending} onChange={(e) => setForm({ ...form, is_trending: e.target.checked })} />
          Add to Trending playlist
        </label>
        <label className="text-xs text-muted-foreground">
          Poster image *
          <input required type="file" accept="image/*" onChange={(e) => setPoster(e.target.files?.[0] ?? null)} className="mt-1 block w-full text-foreground" />
        </label>
        <label className="text-xs text-muted-foreground">
          Video file (mp4) — optional
          <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files?.[0] ?? null)} className="mt-1 block w-full text-foreground" />
        </label>
        <button disabled={busy} className="rounded-md bg-primary py-3 font-bold text-primary-foreground hover:scale-[1.01] disabled:opacity-50 md:col-span-2">
          {busy ? "Uploading…" : "Publish movie"}
        </button>
      </form>
    </section>
  );
}

function MovieList({ movies, reload }: { movies: Movie[]; reload: () => void }) {
  const toggleTrending = async (m: Movie) => {
    const { error } = await supabase.from("movies").update({ is_trending: !m.is_trending }).eq("id", m.id);
    if (error) return toast.error(error.message);
    toast.success(m.is_trending ? "Removed from trending" : "Added to trending");
    reload();
  };
  const del = async (id: string) => {
    if (!confirm("Delete this movie?")) return;
    const { error } = await supabase.from("movies").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    reload();
  };
  return (
    <section>
      <h2 className="mb-4 font-display text-xl font-black">Movies library ({movies.length})</h2>
      {movies.length === 0 ? (
        <p className="text-sm text-muted-foreground">No movies uploaded yet.</p>
      ) : (
        <div className="grid gap-3">
          {movies.map((m) => (
            <div key={m.id} className="flex items-center gap-4 rounded-lg border border-border bg-surface p-3">
              <img src={m.poster_url} alt={m.title} className="h-20 w-14 rounded object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{m.title}</p>
                <p className="text-xs text-muted-foreground">
                  {m.year} · {m.genre} · {m.language} · {m.is_translated ? "Translated" : "Non-translated"}
                  {m.is_trending && <span className="ml-2 rounded bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">TRENDING</span>}
                </p>
              </div>
              <button onClick={() => toggleTrending(m)} className="rounded-md border border-border px-3 py-2 text-xs hover:border-primary" title="Toggle trending">
                <Star className={`size-4 ${m.is_trending ? "fill-primary text-primary" : ""}`} />
              </button>
              <button onClick={() => del(m.id)} className="rounded-md border border-destructive/40 px-3 py-2 text-xs text-destructive hover:bg-destructive hover:text-destructive-foreground">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function UploadHighlightForm({ onDone }: { onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  const [thumb, setThumb] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [form, setForm] = useState({ title: "", category: "Football", duration: "", description: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thumb) return toast.error("Thumbnail required");
    setBusy(true);
    try {
      const thumbnail_url = await uploadTo("thumbnails", thumb);
      const video_url = video ? await uploadTo("videos", video) : null;
      const { error } = await supabase.from("highlights").insert({ ...form, thumbnail_url, video_url });
      if (error) throw error;
      toast.success("Highlight uploaded");
      setThumb(null);
      setVideo(null);
      setForm({ ...form, title: "", description: "" });
      onDone();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-xl border border-border bg-surface p-6">
      <h2 className="mb-4 font-display text-xl font-black">
        <Upload className="-mt-1 mr-2 inline size-5 text-accent" />
        Upload Highlight
      </h2>
      <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
        <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
          {["Football", "Basketball", "Volleyball", "World Cup", "Champions League", "AFCON", "Rwanda League"].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input placeholder="Duration (e.g. 10:32)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="input" />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input md:col-span-2" rows={2} />
        <label className="text-xs text-muted-foreground">
          Thumbnail *
          <input required type="file" accept="image/*" onChange={(e) => setThumb(e.target.files?.[0] ?? null)} className="mt-1 block w-full" />
        </label>
        <label className="text-xs text-muted-foreground">
          Video file — optional
          <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files?.[0] ?? null)} className="mt-1 block w-full" />
        </label>
        <button disabled={busy} className="rounded-md bg-accent py-3 font-bold text-accent-foreground hover:scale-[1.01] disabled:opacity-50 md:col-span-2">
          {busy ? "Uploading…" : "Publish highlight"}
        </button>
      </form>
    </section>
  );
}

function HighlightList({ highlights, reload }: { highlights: Highlight[]; reload: () => void }) {
  const del = async (id: string) => {
    if (!confirm("Delete this highlight?")) return;
    const { error } = await supabase.from("highlights").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    reload();
  };
  return (
    <section>
      <h2 className="mb-4 font-display text-xl font-black">Highlights library ({highlights.length})</h2>
      {highlights.length === 0 ? (
        <p className="text-sm text-muted-foreground">No highlights uploaded yet.</p>
      ) : (
        <div className="grid gap-3">
          {highlights.map((h) => (
            <div key={h.id} className="flex items-center gap-4 rounded-lg border border-border bg-surface p-3">
              <img src={h.thumbnail_url} alt={h.title} className="h-16 w-28 rounded object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{h.title}</p>
                <p className="text-xs text-muted-foreground">{h.category} · {h.duration}</p>
              </div>
              <button onClick={() => del(h.id)} className="rounded-md border border-destructive/40 px-3 py-2 text-xs text-destructive hover:bg-destructive hover:text-destructive-foreground">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
