// Type definitions and static lists. All movies & highlights now come from the database.

export type Movie = {
  id: string;
  title: string;
  poster: string;
  thumbnail?: string | null;
  year: number;
  genre: string;
  rating: number;
  duration: string;
  language: string;
  country: string;
  translator?: string;
  director: string;
  production_company?: string;
  description: string;
  downloads: number;
  is_translated: boolean;
  video_url?: string | null;
  series_title?: string | null;
  season_number?: number | null;
  episode_number?: number | null;
};

export type Highlight = {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  duration: string;
  description: string;
  views: number;
  video_url?: string | null;
};

export const CATEGORIES = [
  "Action", "Drama", "Romance", "Sci-Fi", "Thriller", "Comedy", "Horror", "Animation",
  "Crime", "Fantasy", "Historical", "Documentary", "Cyberpunk", "Adventure",
];

export const SPORT_CATEGORIES = [
  "Football", "Basketball", "Volleyball", "World Cup", "Champions League", "AFCON", "Rwanda League",
];

export const PREMIUM_PLANS = [
  { name: "Guest", price: 0, period: "Free forever", features: ["Watch any movie", "Download in SD", "Browse highlights", "Ads supported"], cta: "Start Watching", highlight: false },
  { name: "Gold", price: 4.99, period: "per month", features: ["Zero ads", "Full HD streaming", "Faster downloads", "Watchlist & history", "Early access drops"], cta: "Go Gold", highlight: true },
  { name: "Platinum", price: 9.99, period: "per month", features: ["Everything in Gold", "4K Ultra HD", "Exclusive originals", "8 device profiles", "Offline download bank"], cta: "Go Platinum", highlight: false },
];

/** Map a raw DB row → Movie. */
export function mapMovieRow(m: any): Movie {
  return {
    id: m.id,
    title: m.title,
    poster: m.poster_url,
    thumbnail: m.thumbnail_url ?? null,
    year: m.year ?? new Date().getFullYear(),
    genre: m.genre ?? "",
    rating: Number(m.rating ?? 0),
    duration: m.duration ?? "",
    language: m.language ?? "EN",
    country: m.country ?? "",
    translator: m.translator ?? undefined,
    director: m.director ?? "",
    production_company: m.production_company ?? "",
    description: m.description ?? "",
    downloads: m.downloads ?? 0,
    is_translated: !!m.is_translated,
    video_url: m.video_url,
    series_title: m.series_title ?? null,
    season_number: m.season_number ?? null,
    episode_number: m.episode_number ?? null,
  };
}

/** Map a raw DB row → Highlight. */
export function mapHighlightRow(h: any): Highlight {
  return {
    id: h.id,
    title: h.title,
    thumbnail: h.thumbnail_url,
    category: h.category ?? "Football",
    duration: h.duration ?? "",
    description: h.description ?? "",
    views: h.views ?? 0,
    video_url: h.video_url,
  };
}
