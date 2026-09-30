import { SearchResultItem, ItemType } from "./types";

// In-memory genre cache for TMDB
let tmdbMovieGenres: Map<number, string> | null = null;
let tmdbTvGenres: Map<number, string> | null = null;

// Fallback genre mappings in case TMDB genre endpoint has an issue
const STATIC_TMDB_GENRES: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
  10759: "Action & Adventure",
  10762: "Kids",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
};

async function loadTmdbGenres(apiKey: string): Promise<void> {
  if (tmdbMovieGenres && tmdbTvGenres) return;

  try {
    const [movieRes, tvRes] = await Promise.allSettled([
      fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`),
      fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}&language=en-US`),
    ]);

    tmdbMovieGenres = new Map<number, string>();
    tmdbTvGenres = new Map<number, string>();

    if (movieRes.status === "fulfilled" && movieRes.value.ok) {
      const data = await movieRes.value.json();
      if (Array.isArray(data.genres)) {
        for (const g of data.genres) {
          tmdbMovieGenres.set(g.id, g.name);
        }
      }
    }

    if (tvRes.status === "fulfilled" && tvRes.value.ok) {
      const data = await tvRes.value.json();
      if (Array.isArray(data.genres)) {
        for (const g of data.genres) {
          tmdbTvGenres.set(g.id, g.name);
        }
      }
    }
  } catch (err) {
    console.error("Failed to load TMDB genres:", err);
  }
}

function truncateOverview(overview?: string): string {
  if (!overview) return "";
  const trimmed = overview.trim();
  if (trimmed.length <= 300) return trimmed;
  return trimmed.slice(0, 297) + "...";
}

export async function searchTmdb(
  type: "movie" | "series",
  query: string
): Promise<SearchResultItem[]> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not configured.");
  }

  await loadTmdbGenres(apiKey);

  const endpoint = type === "movie" ? "movie" : "tv";
  const url = `https://api.themoviedb.org/3/search/${endpoint}?api_key=${apiKey}&query=${encodeURIComponent(
    query
  )}&language=en-US&page=1&include_adult=false`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`TMDB search failed with status ${res.status}`);
  }

  const data = await res.json();
  const results = Array.isArray(data.results) ? data.results.slice(0, 10) : [];

  return results.map((item: any) => {
    const isMovie = type === "movie";
    const title = (isMovie ? item.title : item.name) || "Untitled";
    const dateStr = isMovie ? item.release_date : item.first_air_date;
    const year = dateStr ? parseInt(dateStr.split("-")[0], 10) || null : null;

    const genreMap = isMovie ? tmdbMovieGenres : tmdbTvGenres;
    const genres: string[] = Array.isArray(item.genre_ids)
      ? item.genre_ids
          .map((id: number) => genreMap?.get(id) || STATIC_TMDB_GENRES[id])
          .filter(Boolean)
      : [];

    const posterUrl = item.poster_path
      ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
      : null;

    return {
      externalId: item.id,
      title,
      year,
      posterUrl,
      overview: truncateOverview(item.overview),
      genres,
    };
  });
}

export async function searchRawg(query: string): Promise<SearchResultItem[]> {
  const apiKey = process.env.RAWG_API_KEY;
  if (!apiKey) {
    throw new Error("RAWG_API_KEY is not configured.");
  }

  const url = `https://api.rawg.io/api/games?search=${encodeURIComponent(
    query
  )}&page_size=10&key=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`RAWG search failed with status ${res.status}`);
  }

  const data = await res.json();
  const results = Array.isArray(data.results) ? data.results.slice(0, 10) : [];

  return results.map((game: any) => {
    const title = game.name || "Untitled Game";
    const year = game.released ? parseInt(game.released.split("-")[0], 10) || null : null;
    const posterUrl = game.background_image || null;

    const genres: string[] = Array.isArray(game.genres)
      ? game.genres.map((g: any) => g.name).filter(Boolean)
      : [];

    // RAWG search results might not have an in-depth description, but may have tags or platforms
    const platforms = Array.isArray(game.platforms)
      ? game.platforms.map((p: any) => p.platform?.name).filter(Boolean).slice(0, 3).join(", ")
      : "";
    const metaScore = game.metacritic ? `Metacritic: ${game.metacritic}. ` : "";
    const overview = truncateOverview(
      game.description_raw || `${metaScore}${platforms ? `Platforms: ${platforms}.` : ""}`
    );

    return {
      externalId: game.id,
      title,
      year,
      posterUrl,
      overview,
      genres,
    };
  });
}

export async function searchMedia(
  type: ItemType,
  query: string
): Promise<SearchResultItem[]> {
  if (type === "movie" || type === "series") {
    return searchTmdb(type, query);
  }
  return searchRawg(query);
}
