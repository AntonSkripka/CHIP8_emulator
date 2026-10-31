import { useEffect, useMemo, useState } from 'react';
import { GameCard } from '../GameCard/GameCard.jsx';
import { GameDetails } from '../GameDetails/GameDetails.jsx';
import {
    GameGrid,
    GenreButton,
    GenreFilters,
    ResetButton,
    StoreDescription,
    StoreKicker,
    StoreMessage,
    StoreRoot,
    StoreToolbar
} from './App.styled.jsx';

export default function App({ bridge }) {
    const [catalog, setCatalog] = useState(null);
    const [selectedSlug, setSelectedSlug] = useState(null);
    const [isDetailsClosing, setIsDetailsClosing] = useState(false);
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const [filterGenre, setFilterGenre] = useState('all');

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
            .map(([slug, game]) => ({ slug, ...game, genre: game.genre || 'Other' }))
            .sort((left, right) => left.title.localeCompare(right.title))
        : [], [catalog]);

    const genreCounts = useMemo(() => games.reduce((counts, game) => {
        counts[game.genre] = (counts[game.genre] || 0) + 1;
        return counts;
    }, {}), [games]);

    const genres = useMemo(() => Object.entries(genreCounts)
        .sort(([left], [right]) => left.localeCompare(right)), [genreCounts]);

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

    const filteredGames = useMemo(() => {
        if (filterGenre === 'all') return games;
        return games.filter(game => game.genre === filterGenre);
    }, [games, filterGenre]);

    return (
        <StoreRoot>
            <StoreToolbar>
                <div>
                    <StoreKicker>{catalog ? `${filterGenre.toUpperCase()} GAMES` : '...'} / {catalog ? filteredGames.length : '...'} TITLES</StoreKicker>
                    <StoreDescription>SELECT A GAME TO VIEW ITS DETAILS, ADD IT TO DISK, OR RUN IT.</StoreDescription>
                    <GenreFilters aria-label="Filter games by genre">
                        {genres.map(([genre, count]) => (
                            <GenreButton
                                key={genre}
                                type="button"
                                $active={filterGenre === genre}
                                aria-pressed={filterGenre === genre}
                                onClick={() => setFilterGenre(genre)}
                            >
                                {genre} ({count})
                            </GenreButton>
                        ))}
                        <ResetButton
                            type="button"
                            $active={filterGenre === 'all'}
                            aria-pressed={filterGenre === 'all'}
                            onClick={() => setFilterGenre('all')}
                        >
                            Reset ({games.length})
                        </ResetButton>
                    </GenreFilters>
                </div>
            </StoreToolbar>

            {error && !selectedGame && <StoreMessage role="alert" $error>{error}</StoreMessage>}

            {catalog ? (
                <GameGrid>
                    {filteredGames.map((game) => (
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
                </GameGrid>
            ) : (
                <StoreMessage>LOADING CATALOG...</StoreMessage>
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
                        if (isDetailsClosing && event.target === event.currentTarget) {
                            finishClosingDetails();
                        }
                    }}
                    onSave={() => performAction(() => bridge.saveGame(selectedGame.slug))}
                    onLoad={() => performAction(async () => {
                        await bridge.loadGame(selectedGame.slug, selectedGame.options);
                        closeDetails();
                    })}
                />
            )}
        </StoreRoot>
    );
}
