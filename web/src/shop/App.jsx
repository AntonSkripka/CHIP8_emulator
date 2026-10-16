import { useEffect, useMemo, useState } from 'react';
import { GameCard } from './components/GameCard.jsx';
import { GameDetails } from './components/GameDetails.jsx';
import './components/GameStore.css';

export default function App({ bridge }) {
    const [catalog, setCatalog] = useState(null);
    const [selectedSlug, setSelectedSlug] = useState(null);
    const [isDetailsClosing, setIsDetailsClosing] = useState(false);
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        let active = true;
        bridge.loadCatalog()
            .then((data) => {
                if (active) setCatalog(data);
            })
            .catch((loadError) => {
                console.error('Could not load game catalog:', loadError);
                if (active) setError('CATALOG DATA COULD NOT BE LOADED.');
            });
        return () => {
            active = false;
        };
    }, [bridge]);

    const games = useMemo(() => catalog
        ? Object.entries(catalog.programs)
            .map(([slug, game]) => ({ slug, ...game }))
            .sort((left, right) => left.title.localeCompare(right.title))
        : [], [catalog]);

    const selectedGame = selectedSlug && catalog
        ? { slug: selectedSlug, ...catalog.programs[selectedSlug] }
        : null;

    useEffect(() => {
        if (!selectedSlug) return undefined;

        const root = document.documentElement;
        const scrollY = window.scrollY;
        const previousOverflow = root.style.overflow;
        root.style.overflow = 'hidden';

        return () => {
            root.style.overflow = previousOverflow;
            const shopScreen = document.getElementById('shop-screen');
            window.scrollTo(0, shopScreen && !shopScreen.hidden ? scrollY : 0);
        };
    }, [selectedSlug]);

    useEffect(() => {
        if (!selectedSlug || isDetailsClosing) return undefined;
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                closeDetails();
            }
        };
        document.addEventListener('keydown', handleKeyDown, true);
        return () => document.removeEventListener('keydown', handleKeyDown, true);
    }, [selectedSlug, isDetailsClosing]);

    function closeDetails() {
        if (selectedSlug && !isDetailsClosing) {
            setIsDetailsClosing(true);
            setError('');
        }
    }

    function finishClosingDetails() {
        setSelectedSlug(null);
        setIsDetailsClosing(false);
    }

    async function performAction(action) {
        setError('');
        setBusy(true);
        try {
            await action();
        } catch (actionError) {
            console.error('Game store action failed:', actionError);
            setError(actionError.message || 'THE REQUEST COULD NOT BE COMPLETED.');
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="game-store">
            <div className="game-store-toolbar">
                <div>
                    <p className="game-store-kicker">GAME CATALOG / {catalog ? games.length : '...' } TITLES</p>
                    <p className="game-store-description">SELECT A GAME TO VIEW ITS DETAILS, ADD IT TO DISK, OR RUN IT.</p>
                </div>
            </div>

            {error && !selectedGame && <p className="game-store-error" role="alert">{error}</p>}

            {catalog ? (
                <div className="game-store-grid">
                    {games.map((game) => (
                        <GameCard
                            key={game.slug}
                            game={game}
                            authors={catalog.authors}
                            imageUrl={game.images?.[0] ? bridge.assetUrl(game.images[0]) : ''}
                            onSelect={() => {
                                setError('');
                                setIsDetailsClosing(false);
                                setSelectedSlug(game.slug);
                            }}
                        />
                    ))}
                </div>
            ) : (
                <p className="game-store-loading">LOADING CATALOG...</p>
            )}

            {selectedGame && (
                <GameDetails
                    game={selectedGame}
                    authors={catalog.authors}
                    imageUrl={selectedGame.images?.[0] ? bridge.assetUrl(selectedGame.images[0]) : ''}
                    busy={busy}
                    error={error}
                    isClosing={isDetailsClosing}
                    onClose={closeDetails}
                    onAnimationEnd={(event) => {
                        if (event.animationName === 'gameDetailsBackdropOut') {
                            finishClosingDetails();
                        }
                    }}
                    onSave={() => performAction(() => bridge.saveGame(selectedGame.slug))}
                    onLoad={() => performAction(async () => {
                        await bridge.loadGame(selectedGame.slug);
                        closeDetails();
                    })}
                />
            )}
        </div>
    );
}
