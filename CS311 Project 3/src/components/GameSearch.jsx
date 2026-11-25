import { useState } from 'react'

function GameSearch({ loading, message, onSearch }) {
  const [gameName, setGameName] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    onSearch(gameName.trim())
  }

  return (
    <div className="search-content">
      <form className="search-form" onSubmit={handleSubmit}>
        <label className="visually-hidden" htmlFor="game-name">
          Game name
        </label>
        <input
          className="form-control search-input"
          id="game-name"
          type="search"
          placeholder="Try Fortnite or Overwatch"
          value={gameName}
          onChange={(event) => setGameName(event.target.value)}
        />
        <button className="btn search-button" type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search by name'}
        </button>
      </form>

      {message && <p className="search-message" role="status">{message}</p>}
    </div>
  )
}

export default GameSearch
