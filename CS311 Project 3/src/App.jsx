import { useEffect, useMemo, useState } from 'react'
import GameGrid from './components/GameGrid.jsx'
import GameSearch from './components/GameSearch.jsx'
import './App.css'

const GAMES_URL = 'https://www.freetogame.com/api'
const PAGE_SIZE = 20

function App() {
  const [games, setGames] = useState([])
  const [activeFilter, setActiveFilter] = useState('All')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchMessage, setSearchMessage] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadGames() {
      try {
        const response = await fetch(`${GAMES_URL}/games`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error('The game catalog could not be loaded.')
        }

        const data = await response.json()
        setGames(data)
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadGames()
    return () => controller.abort()
  }, [])

  async function searchGamesByName(name) {
    setSearchResults([])
    setSearchQuery(name)
    setSearchMessage('')

    if (!name) {
      setSearchMessage('Enter a game name to search.')
      return
    }

    setSearchLoading(true)
    try {
      const response = await fetch(`${GAMES_URL}/games`)
      if (!response.ok) {
        throw new Error('The game search failed. Please try again.')
      }

      const catalog = await response.json()
      const normalizedName = name.toLocaleLowerCase()
      const matches = catalog.filter((game) =>
        game.title.toLocaleLowerCase().includes(normalizedName),
      )
      if (matches.length === 0) {
        setSearchMessage(`No games were found matching "${name}".`)
        return
      }
      setSearchResults(matches)
    } catch (searchError) {
      setSearchMessage(searchError.message)
    } finally {
      setSearchLoading(false)
    }
  }

  const filteredGames = useMemo(
    () =>
      activeFilter === 'All'
        ? games
        : games.filter((game) => (game.genre || 'Other') === activeFilter),
    [activeFilter, games],
  )
  const availableGenres = useMemo(
    () =>
      [...new Set(games.map((game) => game.genre || 'Other'))].sort((a, b) =>
        a.localeCompare(b),
      ),
    [games],
  )
  const visibleGames = filteredGames.slice(0, visibleCount)

  function changeFilter(genre) {
    setActiveFilter(genre)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <main className="app-shell">
      <header className="hero container">
        <p className="eyebrow">Find your next favorite</p>
        <h1>Game <span>Explorer</span></h1>
        <p className="hero-copy">
          Browse free-to-play games across genres, discover something new, or search
          the catalog by name.
        </p>
        <div className="hero-stat" aria-live="polite">
          <strong>{games.length}</strong>
          <span>games in the catalog</span>
        </div>
      </header>

      <div className="container content-area">
        <section className="search-panel" aria-labelledby="search-title">
          <div>
            <p className="section-kicker">Have a game in mind?</p>
            <h2 id="search-title">Search by name</h2>
            <p className="muted-copy">
              Search the full API catalog, including games beyond the first 20.
            </p>
          </div>
          <GameSearch
            loading={searchLoading}
            message={searchMessage}
            onSearch={searchGamesByName}
          />
        </section>

        {searchResults.length > 0 && (
          <section className="search-result" aria-live="polite">
            <div className="result-heading">
              <span className="section-kicker">
                {searchResults.length} {searchResults.length === 1 ? 'match' : 'matches'} found
              </span>
              <h2>Results for &ldquo;{searchQuery}&rdquo;</h2>
            </div>
            <GameGrid games={searchResults} />
          </section>
        )}

        <section className="roster-section" aria-labelledby="catalog-title">
          <div className="roster-heading">
            <div>
              <p className="section-kicker">The catalog</p>
              <h2 id="catalog-title">Explore games</h2>
            </div>
            <span className="roster-count">{visibleGames.length} shown</span>
          </div>

          <div className="filter-controls">
            <button
              className={`btn filter-toggle ${filtersOpen ? 'active' : ''}`}
              type="button"
              aria-expanded={filtersOpen}
              aria-controls="genre-filters"
              onClick={() => setFiltersOpen((open) => !open)}
            >
              <span aria-hidden="true">☷</span>
              {filtersOpen ? 'Hide filters' : 'Filter games'}
              {activeFilter !== 'All' && <span className="filter-selection">{activeFilter}</span>}
            </button>
            {filtersOpen && (
              <div className="filter-row" id="genre-filters" aria-label="Filter by game genre">
                <button
                  className={`btn filter-button ${activeFilter === 'All' ? 'active' : ''}`}
                  type="button"
                  aria-pressed={activeFilter === 'All'}
                  onClick={() => changeFilter('All')}
                >
                  All genres
                </button>
                {availableGenres.map((genre) => (
                  <button
                    className={`btn filter-button ${activeFilter === genre ? 'active' : ''}`}
                    key={genre}
                    type="button"
                    aria-pressed={activeFilter === genre}
                    onClick={() => changeFilter(genre)}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && <div className="alert alert-warning" role="alert">{error}</div>}
          {loading ? (
            <div className="loading-message" role="status">
              <span className="spinner-border spinner-border-sm" aria-hidden="true" />
              Loading games from the catalog...
            </div>
          ) : (
            <GameGrid games={visibleGames} />
          )}

          {!loading && visibleGames.length < filteredGames.length && (
            <div className="load-more-wrap">
              <button
                className="btn load-more-button"
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              >
                Show 20 more games
              </button>
            </div>
          )}
        </section>
      </div>

      <footer className="container page-footer">
        Game data provided by{' '}
        <a href="https://www.freetogame.com/" target="_blank" rel="noreferrer">
          FreeToGame
        </a>
        .
      </footer>
    </main>
  )
}

export default App
