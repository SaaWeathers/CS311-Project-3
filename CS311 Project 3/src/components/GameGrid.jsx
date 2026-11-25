import GameCard from './GameCard.jsx'

function GameGrid({ games }) {
  if (games.length === 0) {
    return (
      <p className="empty-state">
        No games match this genre. Choose another filter to keep exploring.
      </p>
    )
  }

  return (
    <div className="row g-4 game-grid">
      {games.map((game) => (
        <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={game.id}>
          <GameCard game={game} />
        </div>
      ))}
    </div>
  )
}

export default GameGrid
