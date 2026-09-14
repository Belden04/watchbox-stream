import { useCallback, useEffect, useState } from "react";
import { Pin, Send, Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const db = supabase as any;

export type CommentRow = {
  id: string;
  movie_id: string | null;
  name: string;
  body: string;
  is_pinned: boolean;
  created_at: string;
};

const NAME_KEY = "wb7_comment_name";

const ago = (iso: string) => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const initials = (n: string) =>
  n.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";

export function CommentsPanel({ movieId }: { movieId?: string }) {
  const [rows, setRows] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") setName(localStorage.getItem(NAME_KEY) ?? "");
  }, []);

  const load = useCallback(async () => {
    if (!movieId) return;
    setLoading(true);
    const [own, pinned] = await Promise.all([
      db.from("comments").select("*").eq("movie_id", movieId).order("created_at", { ascending: false }).limit(200),
      db.from("comments").select("*").is("movie_id", null).eq("is_pinned", true).order("created_at", { ascending: false }),
    ]);
    const list = [...((pinned.data as CommentRow[]) ?? []), ...((own.data as CommentRow[]) ?? [])];
    setRows(list);
    setLoading(false);
  }, [movieId]);

  useEffect(() => { void load(); }, [load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieId) return;
    const n = name.trim();
    const b = body.trim();
    if (!n || !b) return toast.error("Add your name and a comment.");
    setSending(true);
    const { error } = await db.from("comments").insert({ movie_id: movieId, name: n.slice(0, 60), body: b.slice(0, 1000) });
    setSending(false);
    if (error) return toast.error(error.message);
    localStorage.setItem(NAME_KEY, n);
    setBody("");
    toast.success("Comment posted");
    void load();
  };

  return (
    <div className="flex h-full flex-col">
      <form onSubmit={submit} className="shrink-0 space-y-2 border-b border-white/10 px-4 pb-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          maxLength={60}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[13px] text-white placeholder:text-white/35 focus:border-primary focus:outline-none"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a comment about this movie…"
          rows={3}
          maxLength={1000}
          className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[13px] text-white placeholder:text-white/35 focus:border-primary focus:outline-none"
        />
        <button
          disabled={sending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-[12px] font-bold text-primary-foreground transition hover:brightness-110 disabled:opacity-60"
        >
          {sending ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />} Post comment
        </button>
      </form>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {loading ? (
          <p className="py-6 text-center text-xs text-white/40">Loading comments…</p>
        ) : rows.length === 0 ? (
          <div className="py-10 text-center text-white/40">
            <MessageCircle className="mx-auto mb-2 size-6" />
            <p className="text-xs">No comments yet. Be the first.</p>
          </div>
        ) : (
          rows.map((c) => (
            <div
              key={c.id}
              className={`rounded-xl border p-3 ${
                c.is_pinned ? "border-primary/40 bg-primary/10" : "border-white/10 bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/20 text-[10px] font-black text-primary">
                  {initials(c.name)}
                </div>
                <p className="min-w-0 flex-1 truncate text-[12px] font-bold text-white">{c.name}</p>
                {c.is_pinned && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-primary-foreground">
                    <Pin className="size-2.5" /> Pinned
                  </span>
                )}
                <span className="shrink-0 text-[10px] text-white/35">{ago(c.created_at)}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap break-words text-[13px] leading-relaxed text-white/80">{c.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
