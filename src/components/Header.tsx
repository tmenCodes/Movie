import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  watchlistCount: number;
}

const Header = ({ watchlistCount }: HeaderProps) => {
  const { pathname } = useLocation();
  const isWatchlist = pathname === "/watchlist";

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#030014]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-5 xs:px-10 h-16 flex items-center justify-between">
        <Link to="/">
          <img src="/Movie/logo.png" alt="MovieApp" className="h-8 w-auto" />
        </Link>

        <Link
          to="/watchlist"
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            isWatchlist
              ? "bg-[#AB8BFF] text-white"
              : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill={isWatchlist ? "white" : "none"}
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z"
            />
          </svg>
          Watchlist{watchlistCount > 0 ? ` (${watchlistCount})` : ""}
        </Link>
      </div>
    </nav>
  );
};

export default Header;
