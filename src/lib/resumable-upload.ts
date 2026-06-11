// Chunked, resumable uploads to Supabase Storage via the TUS protocol.
// Bypasses the ~50 MB single-request cap so users can upload large movies
// without "Network error" failures.
import * as tus from "tus-js-client";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export async function resumableUpload(
  bucket: string,
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const path = `${Date.now()}-${file.name.replace(/[^\w.-]+/g, "-")}`;
  const { data: sess } = await supabase.auth.getSession();
  const token = sess.session?.access_token ?? ANON_KEY;

  await new Promise<void>((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: `${SUPABASE_URL}/storage/v1/upload/resumable`,
      retryDelays: [0, 1000, 3000, 5000, 10000],
      headers: {
        authorization: `Bearer ${token}`,
        "x-upsert": "true",
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      metadata: {
        bucketName: bucket,
        objectName: path,
        contentType: file.type || "application/octet-stream",
        cacheControl: "3600",
      },
      // 6 MB chunks — well under Supabase's per-request limit
      chunkSize: 6 * 1024 * 1024,
      onError: (err) => reject(err),
      onProgress: (sent, total) => {
        if (onProgress && total) onProgress(Math.round((sent / total) * 100));
      },
      onSuccess: () => resolve(),
    });
    // Resume if a previous upload exists for this exact file
    upload.findPreviousUploads().then((prev) => {
      if (prev.length) upload.resumeFromPreviousUpload(prev[0]);
      upload.start();
    });
  });

  return path;
}
