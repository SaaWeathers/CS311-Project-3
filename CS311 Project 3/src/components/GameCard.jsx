function GameCard({ game }) {
  return (
    <article className="card game-card h-100">
      <a
        className="game-image-wrap"
        href={game.game_url}
        target="_blank"
        rel="noreferrer"
        aria-label={`View ${game.title} on FreeToGame`}
      >
        <img
          className="game-image"
          src={game.thumbnail}
          alt={`${game.title} game artwork`}
          loading="lazy"
        />
        <span className="game-genre">{game.genre}</span>
      </a>
      <div className="card-body">
        <p className="game-id">Game ID {game.id}</p>
        <h3 className="game-title">{game.title}</h3>
        <p className="game-summary">{game.short_description}</p>
        <dl className="game-details">
          <div>
            <dt>Platform</dt>
            <dd>{game.platform}</dd>
          </div>
          <div>
            <dt>Publisher</dt>
            <dd>{game.publisher}</dd>
          </div>
          <div>
            <dt>Released</dt>
            <dd>{game.release_date}</dd>
          </div>
        </dl>
      </div>
    </article>
  )
}

export default GameCard
