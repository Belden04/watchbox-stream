import { Download, X, Loader2, Check, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  recordView,
  recordDownloadStart,
  recordDownloadComplete,
  type ContentType,
} from "@/lib/watchlist";
import { supabase } from "@/integrations/supabase/client";
import { mapMovieRow, type Movie } from "@/lib/sportflix-data";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  videoUrl?: string | null;
  poster?: string;
  contentType?: ContentType;
  contentId?: string;
};

const QUALITIES = ["Auto", "1080p", "720p", "480p", "360p"] as const;
const db = supabase as any;

export function WatchDialog({ open, onClose, title, videoUrl, poster, contentType, contentId }: Props) {
  const [quality, setQuality] = useState<(typeof QUALITIES)[number]>("Auto");
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [others, setOthers] = useState<Movie[]>([]);
  const [active, setActive] = useState<{ title: string; videoUrl?: string | null; poster?: string; id?: string }>({ title, videoUrl, poster, id: contentId });
  const viewLogged = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Reset active when dialog reopens with a new movie
  useEffect(() => {
    if (open) setActive({ title, videoUrl, poster, id: contentId });
  }, [open, title, videoUrl, poster, contentId]);

  // Load "Other movies" once the dialog opens, only for movies (not highlights)
  useEffect(() => {
    if (!open || contentType !== "movie") return;
    db.from("movies").select("*").order("created_at", { ascending: false }).limit(24)
      .then(({ data }: { data: any[] | null }) => {
        setOthers((data ?? []).map(mapMovieRow));
      });
  }, [open, contentType]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      viewLogged.current = false;
      setProgress(0);
      setDownloaded(false);
      setDownloading(false);
    }
  }, [open]);

  const handlePlay = () => {
    if (viewLogged.current || !contentType || !active.id) return;
    viewLogged.current = true;
    recordView(contentType, active.id);
  };

  const switchTo = (m: Movie) => {
    setActive({ title: m.title, videoUrl: m.video_url, poster: m.thumbnail || m.poster, id: m.id });
    viewLogged.current = false;
    setProgress(0);
    setDownloaded(false);
    setDownloading(false);
    // smooth scroll the player back into view on mobile
    setTimeout(() => videoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const handleDownload = async () => {
    if (!active.videoUrl) return;
    setDownloading(true);
    setProgress(0);
    const trackingId = contentType && active.id ? await recordDownloadStart(contentType, active.id) : null;
    try {
      const res = await fetch(active.videoUrl);
      if (!res.ok || !res.body) throw new Error("Download failed");
      const total = Number(res.headers.get("content-length") ?? 0);
      const reader = res.body.getReader();
      const chunks: Uint8Array[] = [];
      let received = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          received += value.length;
          if (total) setProgress(Math.round((received / total) * 100));
        }
      }
      const blob = new Blob(chunks as BlobPart[]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${active.title.replace(/[^\w.-]+/g, "_")}.mp4`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setDownloaded(true);
      setProgress(100);
      if (trackingId) await recordDownloadComplete(trackingId);
      toast.success("Download complete");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setDownloading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/90 p-2 backdrop-blur-sm md:p-4" onClick={onClose}>
      <div
        className="relative max-h-[95vh] w-full max-w-5xl overflow-y-auto overflow-x-hidden rounded-xl border border-border bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-black/70 text-white hover:bg-primary"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
        {active.videoUrl ? (
          <video
            ref={videoRef}
            key={`${active.id}-${quality}`}
            src={active.videoUrl}
            controls
            autoPlay
            playsInline
            poster={active.poster}
            onPlay={handlePlay}
            className="aspect-video w-full bg-black"
          />
        ) : (
          <div
            className="grid aspect-video w-full place-items-center bg-cover bg-center"
            style={active.poster ? { backgroundImage: `url(${active.poster})` } : undefined}
          >
            <div className="rounded-lg bg-black/70 px-6 py-4 text-center backdrop-blur">
              <p className="font-display text-base font-black">Preview</p>
              <p className="text-sm text-muted-foreground">No video file uploaded yet for this title.</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-border bg-surface p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-base font-black">{active.title}</h3>
            <div className="flex flex-wrap items-center gap-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Quality</label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value as (typeof QUALITIES)[number])}
                className="rounded-md border border-border bg-surface-2 px-2 py-1.5 text-sm font-medium focus:border-primary focus:outline-none"
              >
                {QUALITIES.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
              {active.videoUrl && (
                <>
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:scale-105 disabled:opacity-70"
                  >
                    {downloading ? (
                      <><Loader2 className="size-4 animate-spin" /> {progress}%</>
                    ) : downloaded ? (
                      <><Check className="size-4" /> Downloaded</>
                    ) : (
                      <><Download className="size-4" /> Download</>
                    )}
                  </button>
                  <a
                    href={active.videoUrl}
                    download={`${active.title.replace(/[^\w.-]+/g, "_")}.mp4`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open direct link — works with browser download extensions (IDM, ADM, etc.)"
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-2 text-[11px] font-bold uppercase tracking-widest hover:border-primary hover:text-primary"
                  >
                    Direct link
                  </a>
                </>
              )}
            </div>
          </div>
          {downloading && (
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full bg-primary transition-[width] duration-200" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>

        {contentType === "movie" && others.length > 0 && (
          <div className="border-t border-border bg-background p-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-display text-sm font-black uppercase tracking-widest text-primary">More movies</h4>
              <span className="text-[11px] text-muted-foreground">{others.length} in library</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {others.filter((m) => m.id !== active.id).slice(0, 12).map((m) => (
                <button
                  key={m.id}
                  onClick={() => switchTo(m)}
                  className="group overflow-hidden rounded-lg border border-border bg-surface text-left transition-all hover:border-primary"
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    <img
                      src={m.thumbnail || m.poster}
                      alt={m.title}
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Play className="size-8 fill-white text-white" />
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="truncate text-xs font-bold">{m.title}</p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {m.year}{m.production_company ? ` · ${m.production_company}` : ` · ${m.genre}`}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
