import { useState } from 'react';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';

interface WatchlistPageProps {
  watchlist: any[];
  toggleWatchlist: (e: React.MouseEvent, movie: any) => void;
}

const WatchlistPage = ({ watchlist, toggleWatchlist }: WatchlistPageProps) => {
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);

  return (
    <div className="wrapper pt-16">
      <section className="all-movies">
        <h2>Watchlist</h2>
        {watchlist.length === 0 ? (
          <p className="text-white/50">No movies saved yet. Click the bookmark on any movie to add it.</p>
        ) : (
          <ul>
            {watchlist.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => setSelectedMovie(movie)}
                isInWatchlist={true}
                onToggleWatchlist={(e) => toggleWatchlist(e, movie)}
              />
            ))}
          </ul>
        )}
      </section>
      <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </div>
  );
};

export default WatchlistPage;
