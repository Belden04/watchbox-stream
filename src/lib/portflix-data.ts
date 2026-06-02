import poster1 from "@/assets/poster-1.jpg";
import poster2 from "@/assets/poster-2.jpg";
import poster3 from "@/assets/poster-3.jpg";
import poster4 from "@/assets/poster-4.jpg";
import poster5 from "@/assets/poster-5.jpg";
import poster6 from "@/assets/poster-6.jpg";
import sportFootball from "@/assets/sport-football.jpg";
import sportBasketball from "@/assets/sport-basketball.jpg";
import sportWorldcup from "@/assets/sport-worldcup.jpg";
import sportRwanda from "@/assets/sport-rwanda.jpg";
import sportVolleyball from "@/assets/sport-volleyball.jpg";

export type Movie = {
  id: string;
  title: string;
  poster: string;
  year: number;
  genre: string;
  rating: number;
  duration: string;
  language: string;
  country: string;
  translator?: string;
  director: string;
  description: string;
  downloads: number;
};

export type Highlight = {
  id: string;
  title: string;
  thumbnail: string;
  category: "Football" | "Basketball" | "Volleyball" | "World Cup" | "Champions League" | "AFCON" | "Rwanda League";
  duration: string;
  description: string;
  views: number;
};

export const MOVIES: Movie[] = [
  { id: "m1", title: "Neon Horizon", poster: poster1, year: 2024, genre: "Sci-Fi Thriller", rating: 8.7, duration: "2h 14m", language: "EN/KIN", country: "USA", translator: "Belden Right", director: "Ava Chen", description: "In a city that never sleeps, one driver must outrun his past to save the future of a digital civilization.", downloads: 124500 },
  { id: "m2", title: "Kigali Nights", poster: poster2, year: 2024, genre: "Drama / Romance", rating: 9.1, duration: "1h 48m", language: "KIN/EN", country: "Rwanda", translator: "Belden Right", director: "Eric Kabera", description: "Two souls collide under the golden Kigali skyline in a story about love, loss, and reinvention.", downloads: 98230 },
  { id: "m3", title: "Ancestors' Call", poster: poster3, year: 2023, genre: "Historical Epic", rating: 8.4, duration: "2h 32m", language: "EN/FR", country: "Senegal", director: "Mati Diop", description: "A sweeping epic of warriors who marched into the sunrise to defend their homeland.", downloads: 76110 },
  { id: "m4", title: "Echoes of Tomorrow", poster: poster4, year: 2024, genre: "Cyberpunk", rating: 8.2, duration: "1h 56m", language: "EN", country: "UK", director: "Alex Garland", description: "A cyber-hacker discovers a signal from a future that may never come.", downloads: 145600 },
  { id: "m5", title: "Underground Kings", poster: poster5, year: 2023, genre: "Crime Drama", rating: 8.9, duration: "2h 08m", language: "EN/KIN", country: "USA", translator: "Belden Right", director: "Denis Villeneuve", description: "Rain-soaked streets, fast cars, and the empire one man built in the shadows.", downloads: 188900 },
  { id: "m6", title: "Adlen'Ann", poster: poster6, year: 2024, genre: "Fantasy Adventure", rating: 9.3, duration: "2h 41m", language: "KIN/EN", country: "Rwanda", translator: "Belden Right", director: "Joel Karekezi", description: "A lone warrior climbs the sacred mountain to break a thousand-year curse.", downloads: 201400 },
];

export const TRENDING = [MOVIES[5], MOVIES[3], MOVIES[1], MOVIES[4], MOVIES[0], MOVIES[2]];
export const MOST_DOWNLOADED = [...MOVIES].sort((a, b) => b.downloads - a.downloads);
export const RECENTLY_ADDED = [MOVIES[1], MOVIES[5], MOVIES[3], MOVIES[0], MOVIES[2], MOVIES[4]];
export const RECOMMENDED = [MOVIES[2], MOVIES[0], MOVIES[5], MOVIES[1], MOVIES[4], MOVIES[3]];
export const CONTINUE_WATCHING = [
  { ...MOVIES[0], progress: 64 },
  { ...MOVIES[3], progress: 22 },
  { ...MOVIES[5], progress: 88 },
];

export const HIGHLIGHTS: Highlight[] = [
  { id: "h1", title: "Real Madrid vs Man City — Top Goals & Saves", thumbnail: sportFootball, category: "Champions League", duration: "12:45", description: "Every goal, every save from the semifinal classic.", views: 2_450_000 },
  { id: "h2", title: "BAL Finals — Top 10 Dunks of the Season", thumbnail: sportBasketball, category: "Basketball", duration: "08:20", description: "The most explosive dunks from the Basketball Africa League.", views: 1_120_000 },
  { id: "h3", title: "World Cup Final — The Road to Victory", thumbnail: sportWorldcup, category: "World Cup", duration: "15:00", description: "Every moment that crowned a new champion.", views: 8_900_000 },
  { id: "h4", title: "APR FC vs Rayon Sports — Kigali Derby", thumbnail: sportRwanda, category: "Rwanda League", duration: "10:32", description: "The fiercest derby in East African football.", views: 540_000 },
  { id: "h5", title: "Volleyball Smash Compilation", thumbnail: sportVolleyball, category: "Volleyball", duration: "06:48", description: "The hardest spikes of the season.", views: 320_000 },
  { id: "h6", title: "AFCON Best Moments", thumbnail: sportFootball, category: "AFCON", duration: "14:12", description: "The road to the African championship.", views: 3_120_000 },
  { id: "h7", title: "El Clásico — Goals That Shook Madrid", thumbnail: sportFootball, category: "Football", duration: "09:55", description: "Iconic moments from football's biggest rivalry.", views: 5_780_000 },
  { id: "h8", title: "NBA Buzzer Beaters", thumbnail: sportBasketball, category: "Basketball", duration: "07:30", description: "Last-second magic that defined careers.", views: 4_200_000 },
];

export const CATEGORIES = [
  "Action", "Drama", "Romance", "Sci-Fi", "Thriller", "Comedy", "Horror", "Animation",
  "Crime", "Fantasy", "Historical", "Documentary", "Cyberpunk", "Adventure",
];

export const SPORT_CATEGORIES: Highlight["category"][] = [
  "Football", "Basketball", "Volleyball", "World Cup", "Champions League", "AFCON", "Rwanda League",
];

export const PREMIUM_PLANS = [
  { name: "Guest", price: 0, period: "Free forever", features: ["Watch any movie", "Download in SD", "Browse highlights", "Ads supported"], cta: "Start Watching", highlight: false },
  { name: "Gold", price: 4.99, period: "per month", features: ["Zero ads", "Full HD streaming", "Faster downloads", "Watchlist & history", "Early access drops"], cta: "Go Gold", highlight: true },
  { name: "Platinum", price: 9.99, period: "per month", features: ["Everything in Gold", "4K Ultra HD", "Exclusive originals", "8 device profiles", "Offline download bank"], cta: "Go Platinum", highlight: false },
];
