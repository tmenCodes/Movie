import { useEffect, useState } from "react";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  original_language: string;
  overview: string;
  vote_count: number;
  popularity: number;
  original_title: string;
  genre_ids?: number[];
}

interface TrendingSectionProps {
  onMovieClick: (movie: Movie) => void;
  watchlist: Movie[];
  onToggleWatchlist: (e: React.MouseEvent, movie: Movie) => void;
}

const TrendingSection = ({
  onMovieClick,
  watchlist,
  onToggleWatchlist,
}: TrendingSectionProps) => {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/trending/movie/week`,
          API_OPTIONS
        );
        const data = await res.json();
        setTrending((data.results || []).slice(0, 10));
      } catch {
        // non-critical; silently ignore
      }
    };
    fetchTrending();
  }, []);

  if (trending.length === 0) return null;

  return (
    <section className="trending">
      <h2>Trending This Week</h2>
      <ul>
        {trending.map((movie, index) => {
          const isInWatchlist = watchlist.some((m) => m.id === movie.id);
          const isHovered = hoveredId === movie.id;

          return (
            <li
              key={movie.id}
              className="cursor-pointer relative group"
              onClick={() => onMovieClick(movie)}
              onMouseEnter={() => setHoveredId(movie.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <p className="text-nowrap">{index + 1}</p>

              <div className="relative -ml-3.5 flex-shrink-0">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                      : "./no-movie.png"
                  }
                  alt={movie.title}
                  className={`transition-transform duration-200 ${
                    isHovered ? "scale-105 brightness-75" : ""
                  }`}
                />

                {/* Watchlist button — appears on hover */}
                <button
                  onClick={(e) => onToggleWatchlist(e, movie)}
                  className={`absolute top-2 right-2 p-1.5 rounded-full bg-black/70 transition-all duration-200 ${
                    isHovered || isInWatchlist ? "opacity-100" : "opacity-0"
                  } hover:bg-black/90`}
                  aria-label={
                    isInWatchlist ? "Remove from watchlist" : "Add to watchlist"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill={isInWatchlist ? "#AB8BFF" : "none"}
                    stroke={isInWatchlist ? "#AB8BFF" : "white"}
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z"
                    />
                  </svg>
                </button>

                {/* Rating badge */}
                {isHovered && (
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 rounded-full px-2 py-0.5">
                    <img src="star.svg" alt="Rating" className="h-3 w-3" />
                    <span className="text-white text-xs font-semibold">
                      {movie.vote_average
                        ? movie.vote_average.toFixed(1)
                        : "N/A"}
                    </span>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default TrendingSection;
