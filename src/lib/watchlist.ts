import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
const db = supabase as any;

export type ContentType = "movie" | "highlight";

export async function addToWatchlist(content_type: ContentType, content_id: string) {
  const { data: s } = await supabase.auth.getUser();
  if (!s.user) {
    toast.error("Sign in to save items to your watchlist");
    return false;
  }
  const { error } = await db.from("watchlist").insert({ user_id: s.user.id, content_type, content_id });
  if (error && !String(error.message).includes("duplicate")) {
    toast.error(error.message);
    return false;
  }
  toast.success("Added to your watchlist");
  return true;
}

export async function removeFromWatchlist(content_type: ContentType, content_id: string) {
  const { data: s } = await supabase.auth.getUser();
  if (!s.user) return false;
  const { error } = await db
    .from("watchlist")
    .delete()
    .eq("user_id", s.user.id)
    .eq("content_type", content_type)
    .eq("content_id", content_id);
  if (error) return false;
  toast.success("Removed from watchlist");
  return true;
}

export async function recordView(content_type: ContentType, content_id: string) {
  const { data: s } = await supabase.auth.getUser();
  await db.from("views").insert({ content_type, content_id, user_id: s.user?.id ?? null });
}

export async function recordDownloadStart(content_type: ContentType, content_id: string): Promise<string | null> {
  const { data: s } = await supabase.auth.getUser();
  const { data, error } = await db
    .from("downloads")
    .insert({ content_type, content_id, user_id: s.user?.id ?? null, status: "started" })
    .select("id")
    .maybeSingle();
  if (error) return null;
  return data?.id ?? null;
}

export async function recordDownloadComplete(id: string) {
  await db.from("downloads").update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", id);
}
