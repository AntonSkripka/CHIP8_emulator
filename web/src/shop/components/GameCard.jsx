import { authorLine, releaseYear } from '../utils/catalog.js';

export function GameCard({ game, authors, imageUrl, onSelect }) {
    const year = releaseYear(game.release);
    return (
        <article className="game-card">
            <button className="game-card-button" type="button" onClick={onSelect}>
                <span className="game-card-image-wrap">
                    {imageUrl
                        ? <img className="game-card-image" src={imageUrl} alt="" loading="lazy" />
                        : <span className="game-card-placeholder" aria-hidden="true">NO PREVIEW</span>}
                </span>
                <span className="game-card-copy">
                    <span className="game-card-title">{game.title}</span>
                    <span className="game-card-meta">{authorLine(authors, game.authors)}{year ? ` / ${year}` : ''}</span>
                    {game.desc && <span className="game-card-description">{game.desc}</span>}
                </span>
            </button>
        </article>
    );
}
