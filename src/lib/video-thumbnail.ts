/**
 * Capture a still frame from a local video file and return it as a JPEG File.
 * Used to auto-generate a 16:9 thumbnail when the admin doesn't upload one.
 */
export async function captureVideoThumbnail(
  file: File,
  opts: { atFraction?: number; width?: number } = {},
): Promise<File | null> {
  const atFraction = opts.atFraction ?? 0.15;
  const targetW = opts.width ?? 1280;

  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    (video as any).playsInline = true;
    video.crossOrigin = "anonymous";

    const cleanup = () => {
      URL.revokeObjectURL(url);
      video.removeAttribute("src");
      video.load();
    };

    const fail = () => {
      cleanup();
      resolve(null);
    };

    const timer = setTimeout(fail, 20000);

    video.onerror = fail;

    video.onloadedmetadata = () => {
      const d = video.duration;
      const t = Number.isFinite(d) && d > 0 ? Math.min(Math.max(d * atFraction, 0.5), d - 0.1) : 1;
      const seek = () => {
        try {
          video.currentTime = t;
        } catch {
          fail();
        }
      };
      // Some browsers need a tick before seeking is allowed.
      setTimeout(seek, 50);
    };

    video.onseeked = () => {
      try {
        const vw = video.videoWidth;
        const vh = video.videoHeight;
        if (!vw || !vh) return fail();
        const w = Math.min(targetW, vw);
        const h = Math.round((w * vh) / vw);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return fail();
        ctx.drawImage(video, 0, 0, w, h);
        canvas.toBlob(
          (blob) => {
            clearTimeout(timer);
            cleanup();
            if (!blob) return resolve(null);
            const base = file.name.replace(/\.[^.]+$/, "") || "thumbnail";
            resolve(new File([blob], `${base}-thumb.jpg`, { type: "image/jpeg" }));
          },
          "image/jpeg",
          0.85,
        );
      } catch {
        fail();
      }
    };

    video.src = url;
  });
}
