import { Download, X } from "lucide-react";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  videoUrl?: string | null;
  poster?: string;
};

export function WatchDialog({ open, onClose, title, videoUrl, poster }: Props) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

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
            src={videoUrl}
            controls
            autoPlay
            poster={poster}
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
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface p-4">
          <h3 className="font-display text-lg font-black">{title}</h3>
          {videoUrl && (
            <a
              href={videoUrl}
              download
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:scale-105"
            >
              <Download className="size-4" /> Download
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
