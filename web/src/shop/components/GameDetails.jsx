import { createPortal } from 'react-dom';
import { authorLine, releaseDate } from '../utils/catalog.js';

const DISPLAYED_FIELDS = new Set(['title', 'authors', 'images', 'desc', 'howto', 'release', 'options']);

export function GameDetails({
    game,
    authors,
    imageUrl,
    busy,
    error,
    isClosing,
    onClose,
    onAnimationEnd,
    onSave,
    onLoad
}) {
    const additionalDetails = Object.entries(game).filter(([key]) => !DISPLAYED_FIELDS.has(key));
    const supportsEmulator = !game.platform || game.platform.toLowerCase() === 'chip8';

    return createPortal(
        <div
            className={`game-details-backdrop${isClosing ? ' is-closing' : ''}`}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
            onAnimationEnd={onAnimationEnd}
        >
            <aside className="game-details-panel" role="dialog" aria-modal="true" aria-labelledby="game-details-title">
                <header className="game-details-header">
                    <div>
                        <p className="game-store-kicker">GAME DETAILS</p>
                        <h2 id="game-details-title">{game.title}</h2>
                    </div>
                    <button className="terminal-button game-details-close" type="button" onClick={onClose}>
                        [ ESC ] CLOSE
                    </button>
                </header>
                {imageUrl
                    ? <img className="game-details-image" src={imageUrl} alt={`${game.title} gameplay preview`} />
                    : <div className="game-details-image game-details-placeholder">NO PREVIEW AVAILABLE</div>}
                <dl className="game-details-meta">
                    <div><dt>AUTHOR</dt><dd>{authorLine(authors, game.authors)}</dd></div>
                    <div><dt>RELEASE</dt><dd>{releaseDate(game.release)}</dd></div>
                    {additionalDetails.map(([key, value]) => (
                        <div key={key}>
                            <dt>{key === 'event' ? 'EVENT' : key.toUpperCase()}</dt>
                            <dd>{formatValue(value)}</dd>
                        </div>
                    ))}
                </dl>
                {game.desc && <section className="game-details-section">
                    <h3>DESCRIPTION</h3>
                    <p>{game.desc}</p>
                </section>}
                {game.howto && <section className="game-details-section">
                    <h3>INSTRUCTIONS</h3>
                    <p>{game.howto}</p>
                </section>}
                {error && <p className="game-store-error" role="alert">{error}</p>}
                <div className="game-details-actions">
                    <button
                        className="terminal-button game-store-primary"
                        type="button"
                        onClick={onLoad}
                        disabled={busy || !supportsEmulator}
                        title={supportsEmulator ? undefined : 'This emulator currently supports CHIP-8 only.'}
                    >
                        RUN IN EMULATOR
                    </button>
                    <button
                        className="terminal-button"
                        type="button"
                        onClick={onSave}
                        disabled={busy || !supportsEmulator}
                        title={supportsEmulator ? undefined : 'Only CHIP-8 games can be added to the virtual disk.'}
                    >
                        ADD TO VIRTUAL DISK
                    </button>
                </div>
            </aside>
        </div>,
        document.body
    );
}

function formatValue(value) {
    if (value === null || value === undefined || value === '') return 'UNKNOWN';
    if (typeof value === 'object') {
        return Object.entries(value)
            .map(([key, item]) => `${key}: ${formatValue(item)}`)
            .join(' · ');
    }
    return String(value);
}
