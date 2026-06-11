import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Upload, Star, Crown, BarChart3, Download as DownloadIcon, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
const db = supabase as any;
import { useAuth } from "@/lib/auth";
import { resumableUpload } from "@/lib/resumable-upload";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — SPORTFLIX" }] }),
  component: AdminPage,
});

type Movie = {
  id: string;
  title: string;
  poster_url: string;
  thumbnail_url: string | null;
  video_url: string | null;
  year: number;
  genre: string;
  language: string;
  is_translated: boolean;
  is_trending: boolean;
  director: string;
  translator: string | null;
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
  const [stats, setStats] = useState({ downloads: 0, views: 0 });

  const load = async () => {
    const [m, h, d, v] = await Promise.all([
      db.from("movies").select("*").order("created_at", { ascending: false }),
      db.from("highlights").select("*").order("created_at", { ascending: false }),
      db.from("downloads").select("id", { count: "exact", head: true }),
      db.from("views").select("id", { count: "exact", head: true }),
    ]);
    setMovies((m.data as Movie[]) ?? []);
    setHighlights((h.data as Highlight[]) ?? []);
    setStats({ downloads: d.count ?? 0, views: v.count ?? 0 });
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
          <p className="text-sm text-muted-foreground">You need to sign in to manage SPORTFLIX.</p>
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
          <h1 className="font-display text-2xl font-black">Admin only</h1>
          <p className="text-sm text-muted-foreground">
            This area is reserved for SPORTFLIX administrators.
          </p>
          <Link to="/" className="inline-block rounded-md border border-border px-6 py-2 font-bold hover:border-primary hover:text-primary">
            Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-[1400px] space-y-12 px-4 pb-20 md:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-4xl font-black tracking-tighter">Admin Console</h1>
            <p className="text-sm text-muted-foreground">Upload, trend, and curate the SPORTFLIX library.</p>
          </div>
          <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
            <Crown className="-mt-0.5 mr-1 inline size-3" /> Admin
          </span>
        </header>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={<BarChart3 className="size-5" />} label="Movies" value={movies.length} />
          <StatCard icon={<Eye className="size-5" />} label="Total views" value={stats.views} />
          <StatCard icon={<DownloadIcon className="size-5" />} label="Total downloads" value={stats.downloads} />
        </div>

        <UploadMovieForm onDone={load} />
        <MovieList movies={movies} reload={load} />

        <UploadHighlightForm onDone={load} />
        <HighlightList highlights={highlights} reload={load} />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {icon} {label}
      </div>
      <p className="mt-2 font-display text-3xl font-black tracking-tighter">{value}</p>
    </div>
  );
}

// Long-lived signed URL (10 years) — buckets are private, so getPublicUrl 404s.
const SIGNED_TTL = 60 * 60 * 24 * 365 * 10;

async function uploadTo(
  bucket: string,
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> {
  // Always use the resumable (TUS) protocol — supports multi-GB files,
  // resumes after disconnects, and never trips the 50 MB single-request cap.
  const path = await resumableUpload(bucket, file, onProgress);
  const { data: s, error: sErr } = await supabase.storage.from(bucket).createSignedUrl(path, SIGNED_TTL);
  if (sErr || !s) throw sErr ?? new Error("Could not create signed URL");
  onProgress?.(100);
  return s.signedUrl;
}

function ProgressBar({ value, label }: { value: number; label: string }) {
  if (value <= 0) return null;
  return (
    <div className="md:col-span-2">
      <div className="mb-1 flex justify-between text-xs text-muted-foreground">
        <span>{label}</span><span>{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full bg-primary transition-[width] duration-150" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function UploadMovieForm({ onDone }: { onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState({ label: "", pct: 0 });
  const [poster, setPoster] = useState<File | null>(null);
  const [thumb, setThumb] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    year: new Date().getFullYear(),
    genre: "Drama",
    language: "EN",
    country: "",
    director: "",
    production_company: "",
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
      setProgress({ label: "Uploading poster…", pct: 0 });
      const poster_url = await uploadTo("posters", poster, (p) => setProgress({ label: "Uploading poster…", pct: p }));
      let thumbnail_url: string | null = null;
      if (thumb) {
        setProgress({ label: "Uploading thumbnail…", pct: 0 });
        thumbnail_url = await uploadTo("thumbnails", thumb, (p) => setProgress({ label: "Uploading thumbnail…", pct: p }));
      }
      let video_url: string | null = null;
      if (video) {
        setProgress({ label: "Uploading video…", pct: 0 });
        video_url = await uploadTo("videos", video, (p) => setProgress({ label: "Uploading video…", pct: p }));
      }
      const payload = { ...form, poster_url, thumbnail_url, video_url };
      if (!form.is_translated) payload.translator = "";
      const { error } = await db.from("movies").insert(payload);
      if (error) throw error;
      toast.success("Movie published");
      setPoster(null);
      setThumb(null);
      setVideo(null);
      setForm({ ...form, title: "", description: "", translator: "" });
      onDone();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
      setProgress({ label: "", pct: 0 });
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
        <input placeholder="Production company (e.g. Warner Bros)" value={form.production_company} onChange={(e) => setForm({ ...form, production_company: e.target.value })} className="input" />
        <input placeholder="Director" value={form.director} onChange={(e) => setForm({ ...form, director: e.target.value })} className="input" />
        <input placeholder="Genre" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} className="input" />
        <input placeholder="Language (EN, KIN, EN/KIN...)" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="input" />
        <input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input" />
        <input placeholder="Duration (e.g. 1h 48m)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="input" />
        <input type="number" placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: +e.target.value })} className="input" />
        <input type="number" step="0.1" placeholder="Rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: +e.target.value })} className="input" />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input md:col-span-2" rows={3} />

        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input type="checkbox" checked={form.is_translated} onChange={(e) => setForm({ ...form, is_translated: e.target.checked, translator: e.target.checked ? form.translator : "" })} />
          Translated (Umusobanuwe)
        </label>
        {form.is_translated && (
          <input
            required
            placeholder="Umusobanuzi (Translator name)"
            value={form.translator}
            onChange={(e) => setForm({ ...form, translator: e.target.value })}
            className="input md:col-span-2 border-primary/50 ring-1 ring-primary/30"
          />
        )}
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input type="checkbox" checked={form.is_trending} onChange={(e) => setForm({ ...form, is_trending: e.target.checked })} />
          Add to Trending playlist
        </label>

        <label className="text-xs text-muted-foreground">
          Poster image (vertical, 2:3) *
          <input required type="file" accept="image/*" onChange={(e) => setPoster(e.target.files?.[0] ?? null)} className="mt-1 block w-full text-foreground" />
        </label>
        <label className="text-xs text-muted-foreground">
          Thumbnail / banner image (16:9) — optional
          <input type="file" accept="image/*" onChange={(e) => setThumb(e.target.files?.[0] ?? null)} className="mt-1 block w-full text-foreground" />
        </label>
        <label className="text-xs text-muted-foreground md:col-span-2">
          Video file (mp4) — from your PC
          <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files?.[0] ?? null)} className="mt-1 block w-full text-foreground" />
        </label>
        <ProgressBar value={progress.pct} label={progress.label} />
        <button disabled={busy} className="rounded-md bg-primary py-3 font-bold text-primary-foreground hover:scale-[1.01] disabled:opacity-50 md:col-span-2">
          {busy ? progress.label || "Uploading…" : "Publish movie"}
        </button>
      </form>
    </section>
  );
}

function MovieList({ movies, reload }: { movies: Movie[]; reload: () => void }) {
  const toggleTrending = async (m: Movie) => {
    const { error } = await db.from("movies").update({ is_trending: !m.is_trending }).eq("id", m.id);
    if (error) return toast.error(error.message);
    toast.success(m.is_trending ? "Removed from trending" : "Added to trending");
    reload();
  };
  const del = async (id: string) => {
    if (!confirm("Delete this movie?")) return;
    const { error } = await db.from("movies").delete().eq("id", id);
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
              <img src={m.thumbnail_url || m.poster_url} alt={m.title} className="h-20 w-14 rounded object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{m.title}</p>
                <p className="text-xs text-muted-foreground">
                  {m.year} · {m.genre} · {m.language} · {m.is_translated ? `Umusobanuwe${m.translator ? ` — ${m.translator}` : ""}` : "Non-translated"}
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
  const [progress, setProgress] = useState({ label: "", pct: 0 });
  const [thumb, setThumb] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [form, setForm] = useState({ title: "", category: "Football", duration: "", description: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thumb) return toast.error("Thumbnail required");
    setBusy(true);
    try {
      setProgress({ label: "Uploading thumbnail…", pct: 0 });
      const thumbnail_url = await uploadTo("thumbnails", thumb, (p) => setProgress({ label: "Uploading thumbnail…", pct: p }));
      let video_url: string | null = null;
      if (video) {
        setProgress({ label: "Uploading video…", pct: 0 });
        video_url = await uploadTo("videos", video, (p) => setProgress({ label: "Uploading video…", pct: p }));
      }
      const { error } = await db.from("highlights").insert({ ...form, thumbnail_url, video_url });
      if (error) throw error;
      toast.success("Highlight published");
      setThumb(null);
      setVideo(null);
      setForm({ ...form, title: "", description: "" });
      onDone();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
      setProgress({ label: "", pct: 0 });
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
          Video file — from your PC
          <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files?.[0] ?? null)} className="mt-1 block w-full" />
        </label>
        <ProgressBar value={progress.pct} label={progress.label} />
        <button disabled={busy} className="rounded-md bg-accent py-3 font-bold text-accent-foreground hover:scale-[1.01] disabled:opacity-50 md:col-span-2">
          {busy ? progress.label || "Uploading…" : "Publish highlight"}
        </button>
      </form>
    </section>
  );
}

function HighlightList({ highlights, reload }: { highlights: Highlight[]; reload: () => void }) {
  const del = async (id: string) => {
    if (!confirm("Delete this highlight?")) return;
    const { error } = await db.from("highlights").delete().eq("id", id);
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
