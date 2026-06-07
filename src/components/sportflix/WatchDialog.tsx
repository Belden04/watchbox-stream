import { Download, X, Loader2, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  recordView,
  recordDownloadStart,
  recordDownloadComplete,
  type ContentType,
} from "@/lib/watchlist";
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

export function WatchDialog({ open, onClose, title, videoUrl, poster, contentType, contentId }: Props) {
  const [quality, setQuality] = useState<(typeof QUALITIES)[number]>("Auto");
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const viewLogged = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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
    if (viewLogged.current || !contentType || !contentId) return;
    viewLogged.current = true;
    recordView(contentType, contentId);
  };

  const handleDownload = async () => {
    if (!videoUrl) return;
    setDownloading(true);
    setProgress(0);
    const trackingId = contentType && contentId ? await recordDownloadStart(contentType, contentId) : null;
    try {
      const res = await fetch(videoUrl);
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
      a.download = `${title.replace(/[^\w.-]+/g, "_")}.mp4`;
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
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/90 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-xl border border-border bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-black/70 text-white hover:bg-primary"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
        {videoUrl ? (
          <video
            ref={videoRef}
            key={quality}
            src={videoUrl}
            controls
            autoPlay
            playsInline
            poster={poster}
            onPlay={handlePlay}
            className="aspect-video w-full bg-black"
          />
        ) : (
          <div
            className="grid aspect-video w-full place-items-center bg-cover bg-center"
            style={poster ? { backgroundImage: `url(${poster})` } : undefined}
          >
            <div className="rounded-lg bg-black/70 px-6 py-4 text-center backdrop-blur">
              <p className="font-display text-lg font-black">Preview</p>
              <p className="text-sm text-muted-foreground">No video file uploaded yet for this title.</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-border bg-surface p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-lg font-black">{title}</h3>
            <div className="flex flex-wrap items-center gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Quality</label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value as (typeof QUALITIES)[number])}
                className="rounded-md border border-border bg-surface-2 px-2 py-1.5 text-sm font-medium focus:border-primary focus:outline-none"
              >
                {QUALITIES.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
              {videoUrl && (
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:scale-105 disabled:opacity-70"
                >
                  {downloading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> {progress}%
                    </>
                  ) : downloaded ? (
                    <>
                      <Check className="size-4" /> Downloaded
                    </>
                  ) : (
                    <>
                      <Download className="size-4" /> Download
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
          {downloading && (
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full bg-primary transition-[width] duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
