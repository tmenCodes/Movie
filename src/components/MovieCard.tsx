const MovieCard = ({
  movie: { title, vote_average, poster_path, release_date, original_language },

  onClick,
  isInWatchlist,
  onToggleWatchlist,
}: {
  movie: {
    title: string;
    vote_average: number;
    poster_path: string | null;
    release_date: string;
    original_language: string;
  };
  onClick?: () => void;
  isInWatchlist?: boolean;
  onToggleWatchlist?: (e: React.MouseEvent) => void;
}) => {
  return (
    <div
      className="movie-card cursor-pointer transition-transform hover:scale-105 hover:ring-2 hover:ring-white/20 rounded-xl"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500/${poster_path}`
              : "./no-movie.png"
          }
          alt={title}
        />
        <button
          onClick={onToggleWatchlist}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 transition-colors"
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
      </div>

      <div className="mt-4">
        <h3>{title}</h3>
        <div className="content">
          <div className="rating">
            <img src="star.svg" alt="Star Icon" />
            <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
          </div>
          <span>•</span>
          <p className="lang">{original_language}</p>
          <span>•</span>
          <p className="year">
            {release_date ? release_date.split("-")[0] : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
