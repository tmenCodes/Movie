import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import MovieModal from "./components/MovieModal";
import Header from "./components/Header";
import WatchlistPage from "./pages/WatchlistPage";
import TrendingSection from "./components/TrendingSection";
import { useDebounce } from "react-use";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

interface Genre {
  id: number;
  name: string;
}

// interface Movie {
//   movie: {
//     id: number;
//     poster?: string;
//     title: string;
//     vote_average: number;
//     poster_path: string | null;
//     release_date: string;
//     original_language: string;
//   };

//   onClick?: () => void;
//   isInWatchlist?: boolean;
//   onToggleWatchlist?: (e: React.MouseEvent) => void;
// }

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState<any[]>([]);
  const [isloading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [watchlist, setWatchlist] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("movie-watchlist") || "[]");
    } catch {
      return [];
    }
  });

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/genre/movie/list`,
          API_OPTIONS
        );
        const data = await res.json();
        setGenres(data.genres || []);
      } catch {
        // genres are non-critical; silently ignore
      }
    };
    fetchGenres();
  }, []);

  const toggleWatchlist = (e: React.MouseEvent, movie: any) => {
    e.stopPropagation();
    setWatchlist((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      const next = exists
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie];
      localStorage.setItem("movie-watchlist", JSON.stringify(next));
      return next;
    });
  };

  const handleGenreSelect = (id: number) => {
    if (selectedGenreId === id) {
      setSelectedGenreId(null);
    } else {
      setSelectedGenreId(id);
      setSearchTerm("");
      setDebouncedSearchTerm("");
    }
  };

  const fetchMovies = async (query: string, genreId: number | null) => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const genreParam = genreId ? `&with_genres=${genreId}` : "";
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc${genreParam}`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();
      if (data.response === "False") {
        setErrorMessage(data.error || "Failed to fetch movies.");
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage("Failed to fetch movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm, selectedGenreId);
  }, [debouncedSearchTerm, selectedGenreId]);

  return (
    <main>
      <Header watchlistCount={watchlist.length} />
      <div className="pattern" />
      <Routes>
        <Route
          path="/"
          element={
            <div className="wrapper pt-16">
              <header>
                <img src={"./hero.png"} alt="Hero-banner" />
                <h1>
                  Find <span className="text-gradient">movie</span> ratings and
                  trailers Without the hassle
                </h1>{" "}
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              </header>

              <TrendingSection
                onMovieClick={setSelectedMovie}
                watchlist={watchlist}
                onToggleWatchlist={toggleWatchlist}
              />

              {genres.length > 0 && (
                <div className="flex flex-row gap-2 overflow-x-auto hide-scrollbar py-2 mt-4">
                  {genres.map((genre) => (
                    <button
                      key={genre.id}
                      onClick={() => handleGenreSelect(genre.id)}
                      className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                        selectedGenreId === genre.id
                          ? "bg-[#AB8BFF] text-white"
                          : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                      }`}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              )}

              <section className="all-movies">
                {searchTerm ? (
                  <h2>Search For: {debouncedSearchTerm}</h2>
                ) : selectedGenreId ? (
                  <h2>{genres.find((g) => g.id === selectedGenreId)?.name}</h2>
                ) : (
                  <h2></h2>
                )}
                {isloading ? (
                  <Spinner />
                ) : errorMessage ? (
                  <p className="text-red-500">{errorMessage}</p>
                ) : (
                  <ul>
                    {movieList.map((movie) => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        onClick={() => setSelectedMovie(movie)}
                        isInWatchlist={watchlist.some((m) => m.id === movie.id)}
                        onToggleWatchlist={(e) => toggleWatchlist(e, movie)}
                      />
                    ))}
                  </ul>
                )}
              </section>
              <MovieModal
                movie={selectedMovie}
                onClose={() => setSelectedMovie(null)}
              />
            </div>
          }
        />
        <Route
          path="/watchlist"
          element={
            <WatchlistPage
              watchlist={watchlist}
              toggleWatchlist={toggleWatchlist}
            />
          }
        />
      </Routes>
    </main>
  );
}

export default App;
