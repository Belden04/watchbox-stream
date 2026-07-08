import { Download, X, Loader2, Check, Play, ChevronLeft, ChevronRight, Star, Layers } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  recordView,
  recordDownloadStart,
  recordDownloadComplete,
  type ContentType,
} from "@/lib/watchlist";
import { supabase } from "@/integrations/supabase/client";
import { mapMovieRow, type Movie } from "@/lib/sportflix-data";
import { SFLoader } from "./SFLoader";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  videoUrl?: string | null;
  poster?: string;
  contentType?: ContentType;
  contentId?: string;
  /** Optional full movie — used for smarter related lookup (genre + company + series) */
  movie?: Movie;
};

const QUALITIES = ["Auto", "1080p", "720p", "480p", "360p"] as const;
const PAGE_SIZE = 6;
const db = supabase as any;

export function WatchDialog({ open, onClose, title, videoUrl, poster, contentType, contentId, movie }: Props) {
  const [quality, setQuality] = useState<(typeof QUALITIES)[number]>("Auto");
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [pool, setPool] = useState<Movie[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [page, setPage] = useState(0);
  const [active, setActive] = useState<Movie | { id?: string; title: string; video_url?: string | null; poster?: string; thumbnail?: string | null; genre?: string; production_company?: string; series_title?: string | null; season_number?: number | null; episode_number?: number | null }>(
    movie ?? { id: contentId, title, video_url: videoUrl, poster, thumbnail: poster },
  );
  const viewLogged = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Reset when opening
  useEffect(() => {
    if (open) {
      setActive(movie ?? { id: contentId, title, video_url: videoUrl, poster, thumbnail: poster });
      setPage(0);
    }
  }, [open, movie, contentId, title, videoUrl, poster]);

  // Load related pool for movies (grouped by genre + company)
  useEffect(() => {
    if (!open || contentType !== "movie") return;
    setLoadingRelated(true);
    db.from("movies")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(60)
      .then(({ data }: { data: any[] | null }) => {
        setPool((data ?? []).map(mapMovieRow));
        setLoadingRelated(false);
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

  // Ranked related list: same series > same genre + same company > same genre > same company > others
  const related = useMemo(() => {
    const activeId = (active as any).id;
    const g = (active as any).genre?.toLowerCase();
    const c = (active as any).production_company?.toLowerCase();
    const s = (active as any).series_title?.toLowerCase();
    const score = (m: Movie) => {
      let n = 0;
      if (s && m.series_title?.toLowerCase() === s) n += 100;
      if (g && m.genre?.toLowerCase() === g) n += 10;
      if (c && m.production_company?.toLowerCase() === c) n += 8;
      return n;
    };
    return pool
      .filter((m) => m.id !== activeId)
      .map((m) => ({ m, s: score(m) }))
      .sort((a, b) => b.s - a.s)
      .map((x) => x.m);
  }, [pool, active]);

  // Episode list — only if the active movie is part of a series
  const episodes = useMemo(() => {
    const s = (active as any).series_title?.toLowerCase();
    if (!s) return [] as Movie[];
    return pool
      .filter((m) => m.series_title?.toLowerCase() === s)
      .sort((a, b) => {
        const sa = a.season_number ?? 0, sb = b.season_number ?? 0;
        if (sa !== sb) return sa - sb;
        return (a.episode_number ?? 0) - (b.episode_number ?? 0);
      });
  }, [pool, active]);

  const totalPages = Math.max(1, Math.ceil(related.length / PAGE_SIZE));
  const pageItems = related.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const handlePlay = () => {
    const id = (active as any).id;
    if (viewLogged.current || !contentType || !id) return;
    viewLogged.current = true;
    recordView(contentType, id);
  };

  const switchTo = (m: Movie) => {
    setActive(m);
    viewLogged.current = false;
    setProgress(0);
    setDownloaded(false);
    setDownloading(false);
    setTimeout(() => videoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const activeVideoUrl = (active as any).video_url as string | null | undefined;
  const activePoster = (active as any).poster || (active as any).thumbnail;
  const activeTitle = (active as any).title as string;
  const activeId = (active as any).id as string | undefined;

  const handleDownload = async () => {
    if (!activeVideoUrl) return;
    setDownloading(true);
    setProgress(0);
    const trackingId = contentType && activeId ? await recordDownloadStart(contentType, activeId) : null;
    try {
      const res = await fetch(activeVideoUrl);
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
      a.download = `${activeTitle.replace(/[^\w.-]+/g, "_")}.mp4`;
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

  const showSidePanel = contentType === "movie";

  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center bg-black/90 p-2 backdrop-blur-sm md:p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[95vh] w-full max-w-[1400px] flex-col overflow-hidden rounded-xl border border-border bg-black lg:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-20 grid size-9 place-items-center rounded-full bg-black/70 text-white transition hover:bg-primary"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        {/* MAIN PLAYER */}
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
          {activeVideoUrl ? (
            <video
              ref={videoRef}
              key={`${activeId}-${quality}`}
              src={activeVideoUrl}
              controls
              autoPlay
              playsInline
              preload="auto"
              poster={activePoster}
              onPlay={handlePlay}
              className="aspect-video w-full bg-black"
            />
          ) : (
            <div
              className="grid aspect-video w-full place-items-center bg-cover bg-center"
              style={activePoster ? { backgroundImage: `url(${activePoster})` } : undefined}
            >
              <div className="rounded-lg bg-black/70 px-6 py-4 text-center backdrop-blur">
                <p className="font-display text-sm font-black">Preview</p>
                <p className="text-xs text-muted-foreground">No video file uploaded yet for this title.</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-border bg-surface p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-display truncate text-lg font-black leading-tight">{activeTitle}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-widest text-muted-foreground">
                  {(active as any).year && <span>{(active as any).year}</span>}
                  {(active as any).genre && <span className="text-primary">{(active as any).genre}</span>}
                  {(active as any).production_company && <span>· {(active as any).production_company}</span>}
                  {(active as any).rating ? (
                    <span className="flex items-center gap-1 text-accent">
                      <Star className="size-3 fill-current" /> {(active as any).rating}
                    </span>
                  ) : null}
                  {(active as any).series_title && (active as any).season_number != null && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-primary">
                      S{(active as any).season_number}
                      {(active as any).episode_number != null ? ` · E${(active as any).episode_number}` : ""}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Quality
                </label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as (typeof QUALITIES)[number])}
                  className="rounded-md border border-border bg-surface-2 px-2 py-1.5 text-xs font-medium focus:border-primary focus:outline-none"
                >
                  {QUALITIES.map((q) => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
                {activeVideoUrl && (
                  <>
                    <button
                      onClick={handleDownload}
                      disabled={downloading}
                      className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground transition hover:scale-105 disabled:opacity-70"
                    >
                      {downloading ? (
                        <><Loader2 className="size-3.5 animate-spin" /> {progress}%</>
                      ) : downloaded ? (
                        <><Check className="size-3.5" /> Downloaded</>
                      ) : (
                        <><Download className="size-3.5" /> Download</>
                      )}
                    </button>
                    <a
                      href={activeVideoUrl}
                      download={`${activeTitle.replace(/[^\w.-]+/g, "_")}.mp4`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Direct link — works with browser downloaders (IDM, ADM…)"
                      className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-2 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:border-primary hover:text-primary"
                    >
                      Direct
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
            {(active as any).description && (
              <p className="text-xs leading-relaxed text-muted-foreground">
                {(active as any).description}
              </p>
            )}
          </div>

          {/* Seasons/Episodes strip — only when it's part of a series */}
          {episodes.length > 0 && (
            <div className="border-t border-border bg-background p-4">
              <div className="mb-3 flex items-center gap-2">
                <Layers className="size-4 text-primary" />
                <h4 className="font-display text-xs font-black uppercase tracking-widest">
                  {(active as any).series_title} · Episodes
                </h4>
                <span className="text-[10px] text-muted-foreground">{episodes.length} total</span>
              </div>
              <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
                {episodes.map((ep) => {
                  const isActive = ep.id === activeId;
                  return (
                    <button
                      key={ep.id}
                      onClick={() => switchTo(ep)}
                      className={`shrink-0 rounded-md border px-3 py-2 text-left text-[11px] font-bold transition ${
                        isActive
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border bg-surface hover:border-primary/50"
                      }`}
                    >
                      <div className="uppercase tracking-widest opacity-70">
                        S{ep.season_number ?? "?"} · E{ep.episode_number ?? "?"}
                      </div>
                      <div className="mt-0.5 max-w-[160px] truncate text-xs">{ep.title}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* SIDE PANEL — More movies (right) */}
        {showSidePanel && (
          <aside className="flex w-full shrink-0 flex-col border-t border-border bg-[#0a0a0a] lg:w-[380px] lg:border-l lg:border-t-0">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div>
                <h4 className="font-display text-lg font-black tracking-tight text-white">
                  More Films
                </h4>
                <div className="mt-1 h-[3px] w-14 rounded-full bg-primary" />
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="grid size-8 place-items-center rounded-full border border-border bg-surface transition hover:border-primary disabled:opacity-30"
                  aria-label="Previous"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <span className="w-10 text-center text-[10px] font-bold tabular-nums text-muted-foreground">
                  {page + 1}/{totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="grid size-8 place-items-center rounded-full border border-border bg-surface transition hover:border-primary disabled:opacity-30"
                  aria-label="Next"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-5">
              {loadingRelated ? (
                <div className="grid h-40 place-items-center">
                  <SFLoader size="sm" label="Loading" />
                </div>
              ) : pageItems.length === 0 ? (
                <p className="p-4 text-center text-xs text-muted-foreground">
                  No related movies yet.
                </p>
              ) : (
                <ul className="grid grid-cols-2 gap-3">
                  {pageItems.map((m) => (
                    <li key={m.id}>
                      <button
                        onClick={() => switchTo(m)}
                        className="group block w-full text-left"
                      >
                        <div className="relative aspect-square overflow-hidden rounded-lg border border-white/5 bg-surface-2">
                          <img
                            src={m.thumbnail || m.poster}
                            alt={m.title}
                            loading="lazy"
                            className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          {m.genre && (
                            <span className="absolute left-2 top-2 rounded-md bg-primary px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-primary-foreground shadow-lg">
                              {m.genre}
                            </span>
                          )}
                          <div className="absolute inset-0 grid place-items-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                            <Play className="size-8 fill-white text-white" />
                          </div>
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm font-bold leading-snug text-white group-hover:text-primary">
                          {m.title}
                        </p>
                        {m.production_company && (
                          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                            {m.production_company}
                          </p>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
