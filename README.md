# Movie Finder

A fast, clean movie discovery app built with React, TypeScript, and Tailwind CSS. Search for films, browse by genre, view ratings and details, and save favorites to a personal watchlist — all powered by The Movie Database (TMDB) API.
A live version of the site is foud here: https://tmencodes.github.io/Movie/

## Features

- **Search** — Real-time movie search with 1-second debounce to reduce API calls
- **Genre filter** — Browse movies by genre using a horizontal chip selector
- **Movie cards** — Poster, title, rating, and release year at a glance
- **Detail modal** — Expanded movie info on click (overview, runtime, genres, etc.)
- **Watchlist** — Bookmark movies locally; persisted to `localStorage` across sessions
- **Loading states** — Spinner while fetching; graceful error messages on failure

## Tech Stack

| Layer     | Library                 |
| --------- | ----------------------- |
| UI        | React 19 + TypeScript   |
| Styling   | Tailwind CSS v4         |
| Build     | Vite 8                  |
| Data      | TMDB REST API           |
| Utilities | react-use (useDebounce) |

## Getting Started

### Prerequisites

- Node.js 18+
- A free [TMDB API key](https://www.themoviedb.org/settings/api)

### Installation

```bash
git clone https://github.com/your-username/movie.git
cd movie
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_TMDB_API_KEY=your_tmdb_bearer_token_here
```

> Use the **Bearer Token** (Read Access Token) from your TMDB API settings page, not the v3 API key.

### Running Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Header.tsx      # Nav bar with watchlist toggle and count badge
│   ├── MovieCard.tsx   # Grid card with bookmark button
│   ├── MovieModal.tsx  # Full-detail overlay on card click
│   ├── Search.jsx      # Controlled search input
│   └── Spinner.tsx     # Loading indicator
├── App.tsx             # Root component — state, fetching, layout
└── main.tsx            # React entry point
```

## License

MIT
