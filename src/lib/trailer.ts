/** Build a YouTube search URL for a movie/series trailer. */
export function youtubeTrailerUrl(title: string, year?: number | null, seriesTitle?: string | null) {
  const base = seriesTitle ? `${seriesTitle} ${title}` : title;
  const q = `${base}${year ? ` ${year}` : ""} official trailer`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
}

/** Open the trailer search on YouTube in a new tab. */
export function openTrailer(title: string, year?: number | null, seriesTitle?: string | null) {
  window.open(youtubeTrailerUrl(title, year, seriesTitle), "_blank", "noopener,noreferrer");
}
