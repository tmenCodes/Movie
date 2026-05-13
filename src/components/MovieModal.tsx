import { useEffect, useState } from "react";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  original_language: string;
  original_title: string;
  genre_ids?: number[];
}

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  hi: "Hindi",
  pt: "Portuguese",
  it: "Italian",
};

const MovieModal = ({ movie, onClose }: MovieModalProps) => {
  const [youtubeLink, setYoutubeLink] = useState<string>("");

  useEffect(() => {
    if (!movie) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    // const youtubeLink = movie.title
    //   ? `https://www.youtube.com/results?search_query=${encodeURIComponent}`
    //   : "N/A";

    let youtubeaddition = movie.title.replaceAll(" ", "+");
    setYoutubeLink(
      "https://www.youtube.com/results?search_query=" + youtubeaddition
    );

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [movie, onClose]);

  if (!movie) return null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "./no-movie.png";

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;

  const year = movie.release_date ? movie.release_date.split("-")[0] : "N/A";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  const language =
    LANGUAGE_NAMES[movie.original_language] ||
    movie.original_language.toUpperCase();

  const ratingColor =
    movie.vote_average >= 7
      ? "text-green-400"
      : movie.vote_average >= 5
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label={movie.title}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      {/* Modal panel */}
      <div
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gray-900 shadow-2xl ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero backdrop image */}
        {backdropUrl && (
          <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
            <img
              src={backdropUrl}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white/70 transition hover:bg-black/80 hover:text-white"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Content */}
        <div className={`flex gap-5 p-6 ${backdropUrl ? "-mt-16" : ""}`}>
          {/* Poster */}
          <img
            src={posterUrl}
            alt={movie.title}
            className="hidden sm:block w-32 flex-shrink-0 rounded-xl object-cover shadow-lg ring-1 ring-white/10"
          />

          {/* Info */}
          <div className="flex flex-col gap-4 flex-1 min-w-0">
            <div>
              <h2 className="text-xl font-bold text-white leading-snug">
                {movie.title}
              </h2>
              {movie.original_title !== movie.title && (
                <p className="mt-0.5 text-sm text-white/50">
                  {movie.original_title}
                </p>
              )}
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span
                className={`font-semibold ${ratingColor} flex items-center gap-1`}
              >
                <img src="star.svg" alt="Rating" className="h-4 w-4" />
                {rating}
              </span>
              <span className="text-white/30">•</span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-white/70">
                {year}
              </span>
              <span className="text-white/30">•</span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-white/70 uppercase tracking-wide text-xs">
                {language}
              </span>
            </div>

            {/* Overview */}
            {movie.overview && (
              <p className="text-sm text-white/70 leading-relaxed">
                {movie.overview}
              </p>
            )}

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10 text-sm">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">
                  Votes
                </p>
                <p className="text-white font-medium">
                  {movie.vote_count.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">
                  Link to YouTube
                </p>
                <p className="text-white font-medium">
                  {/* {movie.popularity.toFixed(0)} */}
                  <a href={youtubeLink}>Youtube Link</a>
                </p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">
                  Release Date
                </p>
                <p className="text-white font-medium">
                  {movie.release_date || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">
                  Title
                </p>
                <p className="text-white font-medium">{movie.title}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
