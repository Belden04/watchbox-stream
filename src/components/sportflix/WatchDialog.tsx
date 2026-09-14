import {
  Download,
  X,
  Loader2,
  Check,
  Play,
  Pause,
  Star,
  Layers,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  RotateCw,
  ListVideo,
  Settings2,
  Youtube,
  MessageCircle,
} from "lucide-react";
import { CommentsPanel } from "./CommentsPanel";
import { openTrailer } from "@/lib/trailer";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  recordView,
  recordDownloadStart,
  recordDownloadComplete,
  type ContentType,
} from "@/lib/watchlist";
import { supabase } from "@/integrations/supabase/client";
import { mapMovieRow, type Movie } from "@/lib/sportflix-data";
import { WBMark } from "./WBMark";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  videoUrl?: string | null;
  poster?: string;
  contentType?: ContentType;
  contentId?: string;
  movie?: Movie;
};

const QUALITIES = ["Auto", "1080p", "720p", "480p", "360p"] as const;
const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;
const db = supabase as any;

const fmt = (s: number) => {
  if (!isFinite(s) || s < 0) s = 0;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
    : `${m}:${String(sec).padStart(2, "0")}`;
};

export function WatchDialog({ open, onClose, title, videoUrl, poster, contentType, contentId, movie }: Props) {
  const [quality, setQuality] = useState<(typeof QUALITIES)[number]>("Auto");
  const [speed, setSpeed] = useState<number>(1);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [pool, setPool] = useState<Movie[]>([]);
  const [drawer, setDrawer] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [booting, setBooting] = useState(true);

  // player state
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  const [active, setActive] = useState<any>(
    movie ?? { id: contentId, title, video_url: videoUrl, poster, thumbnail: poster },
  );
  const viewLogged = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      setActive(movie ?? { id: contentId, title, video_url: videoUrl, poster, thumbnail: poster });
      setBooting(true);
      const t = window.setTimeout(() => setBooting(false), 650);
      return () => window.clearTimeout(t);
    }
  }, [open, movie, contentId, title, videoUrl, poster]);

  useEffect(() => {
    if (!open || contentType !== "movie") return;
    db.from("movies")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(60)
      .then(({ data }: { data: any[] | null }) => setPool((data ?? []).map(mapMovieRow)));
  }, [open, contentType]);

  useEffect(() => {
    if (!open) {
      viewLogged.current = false;
      setProgress(0);
      setDownloaded(false);
      setDownloading(false);
      setDrawer(false);
      setSettingsOpen(false);
    } else {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const activeVideoUrl = active.video_url as string | null | undefined;
  const activePoster = active.poster || active.thumbnail;
  const activeTitle = active.title as string;
  const activeId = active.id as string | undefined;

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }, []);

  const seekBy = useCallback((d: number) => {
    const v = videoRef.current;
    if (v) v.currentTime = Math.min(Math.max(0, v.currentTime + d), v.duration || 0);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = shellRef.current;
    if (!el) return;
    if (!document.fullscreenElement) await el.requestFullscreen?.().catch(() => {});
    else await document.exitFullscreen?.().catch(() => {});
  }, []);

  useEffect(() => {
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      if (e.key === "Escape") return document.fullscreenElement ? undefined : onClose();
      if (e.key === " " || e.key.toLowerCase() === "k") { e.preventDefault(); togglePlay(); }
      if (e.key === "ArrowRight") seekBy(10);
      if (e.key === "ArrowLeft") seekBy(-10);
      if (e.key.toLowerCase() === "f") toggleFullscreen();
      if (e.key.toLowerCase() === "m") {
        const v = videoRef.current;
        if (v) { v.muted = !v.muted; setMuted(v.muted); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, togglePlay, seekBy, toggleFullscreen]);

  const nudgeUI = useCallback(() => {
    setUiVisible(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setUiVisible(false);
    }, 2800);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (v) v.playbackRate = speed;
  }, [speed, activeId]);

  const related = useMemo(() => {
    const g = active.genre?.toLowerCase();
    const c = active.production_company?.toLowerCase();
    const s = active.series_title?.toLowerCase();
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
  }, [pool, active, activeId]);

  const episodes = useMemo(() => {
    const s = active.series_title?.toLowerCase();
    if (!s) return [] as Movie[];
    return pool
      .filter((m) => m.series_title?.toLowerCase() === s)
      .sort((a, b) => {
        const sa = a.season_number ?? 0, sb = b.season_number ?? 0;
        if (sa !== sb) return sa - sb;
        return (a.episode_number ?? 0) - (b.episode_number ?? 0);
      });
  }, [pool, active]);

  const handlePlayEvent = () => {
    setPlaying(true);
    nudgeUI();
    if (viewLogged.current || !contentType || !activeId) return;
    viewLogged.current = true;
    recordView(contentType, activeId);
  };

  const switchTo = (m: Movie) => {
    setBooting(true);
    setDrawer(false);
    window.setTimeout(() => {
      setActive(m);
      viewLogged.current = false;
      setProgress(0);
      setCurrent(0);
      setDuration(0);
      setDownloaded(false);
      setDownloading(false);
      window.setTimeout(() => setBooting(false), 500);
    }, 200);
  };

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

  const pct = duration ? (current / duration) * 100 : 0;
  const bufPct = duration ? (buffered / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-[90] bg-black">
      {/* Ambient light bleed from the poster — the "unique" WatchBox stage */}
      {activePoster && (
        <>
          <img
            src={activePoster}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 size-full scale-110 object-cover opacity-25 blur-[70px]"
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_600px_at_50%_0%,rgba(30,91,255,0.18),transparent_65%)]" />
        </>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black" />

      <div ref={shellRef} className="relative flex h-full w-full flex-col">
        {/* TOP BAR */}
        <header
          className={`relative z-30 flex items-center gap-3 px-4 py-3 transition-all duration-300 md:px-6 ${
            uiVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <button
            onClick={onClose}
            className="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur transition hover:bg-primary"
            aria-label="Close player"
          >
            <X className="size-4" />
          </button>
          <div className="flex min-w-0 items-center gap-2">
            <WBMark size={26} />
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-black leading-tight text-white">{activeTitle}</p>
              <p className="truncate text-[10px] uppercase tracking-[0.3em] text-white/45">
                {active.genre || "Now Playing"}
                {active.season_number != null ? ` · S${active.season_number}` : ""}
                {active.episode_number != null ? ` · E${active.episode_number}` : ""}
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => openTrailer(activeTitle, active.year, active.series_title)}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-[11px] font-bold text-white transition hover:border-[#ff0000] hover:bg-[#ff0000]/15"
              title="Watch the trailer on YouTube"
            >
              <Youtube className="size-3.5 text-[#ff3b3b]" /> Trailer
            </button>
            {activeVideoUrl && (
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-3.5 py-2 text-[11px] font-bold text-primary-foreground transition hover:brightness-110 disabled:opacity-70"
              >
                {downloading ? (
                  <><Loader2 className="size-3.5 animate-spin" /> {progress}%</>
                ) : downloaded ? (
                  <><Check className="size-3.5" /> Saved</>
                ) : (
                  <><Download className="size-3.5" /> Download</>
                )}
              </button>
            )}
            <button
              onClick={() => setCommentsOpen((c) => !c)}
              className={`grid size-9 place-items-center rounded-full border transition ${
                commentsOpen ? "border-primary bg-primary text-primary-foreground" : "border-white/10 bg-white/5 text-white hover:border-primary"
              }`}
              aria-label="Comments"
              title="Comments"
            >
              <MessageCircle className="size-4" />
            </button>
            {contentType === "movie" && (
              <button
                onClick={() => setDrawer((d) => !d)}
                className={`grid size-9 place-items-center rounded-full border transition ${
                  drawer ? "border-primary bg-primary text-primary-foreground" : "border-white/10 bg-white/5 text-white hover:border-primary"
                }`}
                aria-label="Up next"
              >
                <ListVideo className="size-4" />
              </button>
            )}
          </div>
        </header>

        {/* STAGE */}
        <div
          className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-2 pb-2 md:px-6 md:pb-6"
          onMouseMove={nudgeUI}
          onTouchStart={nudgeUI}
        >
          <div className="relative w-full max-w-[1500px] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_40px_120px_-30px_rgba(30,91,255,0.45)]">
            {activeVideoUrl ? (
              <video
                ref={videoRef}
                key={`${activeId}-${quality}`}
                src={activeVideoUrl}
                autoPlay
                playsInline
                preload="auto"
                poster={activePoster}
                onClick={togglePlay}
                onPlay={handlePlayEvent}
                onPause={() => { setPlaying(false); setUiVisible(true); }}
                onWaiting={() => setWaiting(true)}
                onPlaying={() => setWaiting(false)}
                onTimeUpdate={(e) => {
                  const v = e.currentTarget;
                  setCurrent(v.currentTime);
                  if (v.buffered.length) setBuffered(v.buffered.end(v.buffered.length - 1));
                }}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onVolumeChange={(e) => { setVolume(e.currentTarget.volume); setMuted(e.currentTarget.muted); }}
                className="aspect-video max-h-[calc(100vh-190px)] w-full cursor-pointer bg-black object-contain"
              />
            ) : (
              <div
                className="grid aspect-video w-full place-items-center bg-cover bg-center"
                style={activePoster ? { backgroundImage: `url(${activePoster})` } : undefined}
              >
                <div className="rounded-xl border border-white/10 bg-black/70 px-6 py-4 text-center backdrop-blur">
                  <p className="font-display text-sm font-black text-white">Preview</p>
                  <p className="text-xs text-white/60">No video file uploaded yet for this title.</p>
                </div>
              </div>
            )}

            {/* Center play / buffering */}
            {activeVideoUrl && (
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                {waiting ? (
                  <span className="size-14 animate-spin rounded-full border-2 border-white/15 border-t-primary" />
                ) : !playing ? (
                  <button
                    onClick={togglePlay}
                    className="pointer-events-auto grid size-20 place-items-center rounded-full bg-primary/90 shadow-[0_0_60px_rgba(30,91,255,0.6)] transition hover:scale-105"
                    aria-label="Play"
                  >
                    <Play className="size-8 translate-x-0.5 fill-white text-white" />
                  </button>
                ) : null}
              </div>
            )}

            {/* CONTROL DECK */}
            {activeVideoUrl && (
              <div
                className={`absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/80 to-transparent px-3 pb-3 pt-10 transition-all duration-300 md:px-5 md:pb-4 ${
                  uiVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
              >
                {/* Scrubber */}
                <div
                  className="group relative h-6 cursor-pointer"
                  onClick={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    const v = videoRef.current;
                    if (v && duration) v.currentTime = ((e.clientX - r.left) / r.width) * duration;
                  }}
                >
                  <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/15">
                    <div className="h-full bg-white/25" style={{ width: `${bufPct}%` }} />
                  </div>
                  <div
                    className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-primary transition-[height] group-hover:h-[5px]"
                    style={{ width: `${pct}%` }}
                  />
                  <div
                    className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary opacity-0 shadow-[0_0_12px_var(--color-primary)] transition group-hover:opacity-100"
                    style={{ left: `${pct}%` }}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <button onClick={togglePlay} className="text-white transition hover:text-primary" aria-label="Play/Pause">
                    {playing ? <Pause className="size-6 fill-current" /> : <Play className="size-6 fill-current" />}
                  </button>
                  <button onClick={() => seekBy(-10)} className="text-white/80 transition hover:text-primary" aria-label="Back 10s">
                    <RotateCcw className="size-5" />
                  </button>
                  <button onClick={() => seekBy(10)} className="text-white/80 transition hover:text-primary" aria-label="Forward 10s">
                    <RotateCw className="size-5" />
                  </button>

                  <div className="group/vol flex items-center gap-2">
                    <button
                      onClick={() => { const v = videoRef.current; if (v) { v.muted = !v.muted; } }}
                      className="text-white/80 transition hover:text-primary"
                      aria-label="Mute"
                    >
                      {muted || volume === 0 ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={muted ? 0 : volume}
                      onChange={(e) => {
                        const v = videoRef.current;
                        if (v) { v.volume = Number(e.target.value); v.muted = Number(e.target.value) === 0; }
                      }}
                      className="h-1 w-0 cursor-pointer appearance-none rounded-full bg-white/25 opacity-0 transition-all duration-300 accent-[var(--color-primary)] group-hover/vol:w-20 group-hover/vol:opacity-100 md:w-16 md:opacity-100"
                      aria-label="Volume"
                    />
                  </div>

                  <span className="text-[11px] font-semibold tabular-nums text-white/70">
                    {fmt(current)} <span className="text-white/30">/ {fmt(duration)}</span>
                  </span>

                  <div className="ml-auto flex items-center gap-2">
                    <div className="relative">
                      <button
                        onClick={() => setSettingsOpen((s) => !s)}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition ${
                          settingsOpen ? "border-primary text-primary" : "border-white/15 text-white/80 hover:border-primary hover:text-primary"
                        }`}
                      >
                        <Settings2 className="size-3.5" /> {quality}
                      </button>
                      {settingsOpen && (
                        <div className="absolute bottom-11 right-0 w-44 rounded-xl border border-white/10 bg-black/90 p-2 backdrop-blur-xl">
                          <p className="px-2 pb-1 text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Quality</p>
                          <div className="grid grid-cols-3 gap-1">
                            {QUALITIES.map((q) => (
                              <button
                                key={q}
                                onClick={() => setQuality(q)}
                                className={`rounded-md px-2 py-1 text-[10px] font-bold transition ${
                                  q === quality ? "bg-primary text-primary-foreground" : "text-white/70 hover:bg-white/10"
                                }`}
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                          <p className="px-2 pb-1 pt-3 text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Speed</p>
                          <div className="grid grid-cols-3 gap-1">
                            {SPEEDS.map((s) => (
                              <button
                                key={s}
                                onClick={() => setSpeed(s)}
                                className={`rounded-md px-2 py-1 text-[10px] font-bold transition ${
                                  s === speed ? "bg-primary text-primary-foreground" : "text-white/70 hover:bg-white/10"
                                }`}
                              >
                                {s}x
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <button onClick={toggleFullscreen} className="text-white/80 transition hover:text-primary" aria-label="Fullscreen">
                      {fullscreen ? <Minimize2 className="size-5" /> : <Maximize2 className="size-5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Boot curtain */}
            <div
              className={`pointer-events-none absolute inset-0 z-30 grid place-items-center bg-black transition-opacity duration-500 ${
                booting ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="relative grid place-items-center">
                  <span className="absolute size-20 animate-[wbring_1.4s_linear_infinite] rounded-full border-2 border-transparent border-t-[#1e5bff] border-r-[#1e5bff]/40" />
                  <WBMark size={44} />
                </div>
                <p className="font-display text-[10px] font-black uppercase tracking-[0.5em] text-white/60">
                  WatchBox Live
                </p>
              </div>
              <style>{`@keyframes wbring{to{transform:rotate(360deg)}}`}</style>
            </div>
          </div>
        </div>

        {/* META + EPISODES STRIP */}
        <div
          className={`relative z-10 shrink-0 border-t border-white/5 bg-black/50 px-4 py-3 backdrop-blur transition-opacity duration-300 md:px-8 ${
            uiVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-x-4 gap-y-1 text-[11px] uppercase tracking-widest text-white/50">
            {active.year && <span>{active.year}</span>}
            {active.production_company && <span>{active.production_company}</span>}
            {active.rating ? (
              <span className="flex items-center gap-1 text-accent">
                <Star className="size-3 fill-current" /> {active.rating}
              </span>
            ) : null}
            {active.is_translated && <span className="text-primary">Umusobanuzi</span>}
            <span className="ml-auto hidden text-white/25 md:inline">Space · play  |  ← → · seek  |  F · fullscreen</span>
          </div>

          {episodes.length > 0 && (
            <div className="mx-auto mt-3 max-w-[1500px]">
              <div className="mb-2 flex items-center gap-2">
                <Layers className="size-3.5 text-primary" />
                <h4 className="font-display text-[11px] font-black uppercase tracking-widest text-white">
                  {active.series_title} · {episodes.length} Episodes
                </h4>
              </div>
              <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
                {episodes.map((ep) => (
                  <button
                    key={ep.id}
                    onClick={() => switchTo(ep)}
                    className={`shrink-0 rounded-lg border px-3 py-2 text-left text-[11px] font-bold transition ${
                      ep.id === activeId
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-white/10 bg-white/5 text-white hover:border-primary/50"
                    }`}
                  >
                    <div className="text-[9px] uppercase tracking-widest opacity-60">
                      S{ep.season_number ?? "?"} · E{ep.episode_number ?? "?"}
                    </div>
                    <div className="mt-0.5 max-w-[150px] truncate">{ep.title}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* UP NEXT DRAWER */}
        {contentType === "movie" && (
          <>
            <div
              onClick={() => setDrawer(false)}
              className={`absolute inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
                drawer ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            />
            <aside
              className={`absolute right-0 top-0 z-50 flex h-full w-[88%] max-w-[360px] flex-col border-l border-white/10 bg-[#08090c]/95 backdrop-blur-xl transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
                drawer ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <h4 className="font-display text-base font-black tracking-tight text-white">Up Next</h4>
                  <div className="mt-1 h-[3px] w-12 rounded-full bg-primary" />
                </div>
                <button
                  onClick={() => setDrawer(false)}
                  className="grid size-8 place-items-center rounded-full border border-white/10 text-white hover:border-primary"
                  aria-label="Close list"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto px-3 pb-5">
                {related.length === 0 ? (
                  <p className="p-4 text-center text-xs text-white/40">No related films yet.</p>
                ) : (
                  related.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => switchTo(m)}
                      className="group flex w-full gap-3 rounded-xl border border-transparent p-2 text-left transition hover:border-white/10 hover:bg-white/5"
                    >
                      <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-white/5">
                        <img
                          src={m.thumbnail || m.poster}
                          alt={m.title}
                          loading="lazy"
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 grid place-items-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                          <Play className="size-6 fill-white text-white" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-[13px] font-bold leading-snug text-white group-hover:text-primary">
                          {m.title}
                        </p>
                        {m.genre && (
                          <p className="mt-1 text-[10px] uppercase tracking-widest text-primary/80">{m.genre}</p>
                        )}
                        {m.production_company && (
                          <p className="truncate text-[10px] text-white/40">{m.production_company}</p>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </aside>
          </>
        )}

        {/* COMMENTS DRAWER */}
        <>
          <div
            onClick={() => setCommentsOpen(false)}
            className={`absolute inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
              commentsOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          />
          <aside
            className={`absolute right-0 top-0 z-50 flex h-full w-[92%] max-w-[380px] flex-col border-l border-white/10 bg-[#08090c]/95 backdrop-blur-xl transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
              commentsOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <h4 className="font-display text-base font-black tracking-tight text-white">Comments</h4>
                <div className="mt-1 h-[3px] w-12 rounded-full bg-primary" />
              </div>
              <button
                onClick={() => setCommentsOpen(false)}
                className="grid size-8 place-items-center rounded-full border border-white/10 text-white hover:border-primary"
                aria-label="Close comments"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              {commentsOpen && <CommentsPanel movieId={activeId} />}
            </div>
          </aside>
        </>
      </div>
    </div>
  );
}
