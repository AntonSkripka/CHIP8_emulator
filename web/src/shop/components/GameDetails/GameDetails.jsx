import { createPortal } from 'react-dom';
import { authorLine, releaseDate } from '../../utils/catalog.js';
import {
    DetailsActions,
    DetailsBackdrop,
    DetailsCloseButton,
    DetailsHeader,
    DetailsImage,
    DetailsImagePlaceholder,
    DetailsMeta,
    DetailsMetaItem,
    DetailsMetaLabel,
    DetailsMetaValue,
    DetailsPanel,
    DetailsSection,
    DetailsSectionBody,
    DetailsSectionTitle,
    DetailsTitle,
    DetailsKicker,
    StoreError,
    StorePrimaryButton,
    StoreButton
} from './GameDetails.styled.jsx';

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
        <DetailsBackdrop
            $isClosing={isClosing}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
            onAnimationEnd={onAnimationEnd}
        >
            <DetailsPanel role="dialog" aria-modal="true" aria-labelledby="game-details-title">
                <DetailsHeader>
                    <div>
                        <DetailsKicker>GAME DETAILS</DetailsKicker>
                        <DetailsTitle id="game-details-title">{game.title}</DetailsTitle>
                    </div>
                    <DetailsCloseButton type="button" onClick={onClose}>
                        [ ESC ] CLOSE
                    </DetailsCloseButton>
                </DetailsHeader>
                {imageUrl
                    ? <DetailsImage src={imageUrl} alt={`${game.title} gameplay preview`} />
                    : <DetailsImagePlaceholder>NO PREVIEW AVAILABLE</DetailsImagePlaceholder>}
                <DetailsMeta>
                    <DetailsMetaItem><DetailsMetaLabel>AUTHOR</DetailsMetaLabel><DetailsMetaValue>{authorLine(authors, game.authors)}</DetailsMetaValue></DetailsMetaItem>
                    <DetailsMetaItem><DetailsMetaLabel>RELEASE</DetailsMetaLabel><DetailsMetaValue>{releaseDate(game.release)}</DetailsMetaValue></DetailsMetaItem>
                    {additionalDetails.map(([key, value]) => (
                        <DetailsMetaItem key={key}>
                            <DetailsMetaLabel>{key === 'event' ? 'EVENT' : key.toUpperCase()}</DetailsMetaLabel>
                            <DetailsMetaValue>{formatValue(value)}</DetailsMetaValue>
                        </DetailsMetaItem>
                    ))}
                </DetailsMeta>
                {game.desc && <DetailsSection>
                    <DetailsSectionTitle>DESCRIPTION</DetailsSectionTitle>
                    <DetailsSectionBody>{game.desc}</DetailsSectionBody>
                </DetailsSection>}
                {game.howto && <DetailsSection>
                    <DetailsSectionTitle>INSTRUCTIONS</DetailsSectionTitle>
                    <DetailsSectionBody>{game.howto}</DetailsSectionBody>
                </DetailsSection>}
                {error && <StoreError role="alert">{error}</StoreError>}
                <DetailsActions>
                    <StorePrimaryButton
                        type="button"
                        onClick={onLoad}
                        disabled={busy || !supportsEmulator}
                        title={supportsEmulator ? undefined : 'This emulator currently supports CHIP-8 only.'}
                    >
                        RUN IN EMULATOR
                    </StorePrimaryButton>
                    <StoreButton
                        type="button"
                        onClick={onSave}
                        disabled={busy || !supportsEmulator}
                        title={supportsEmulator ? undefined : 'Only CHIP-8 games can be added to the virtual disk.'}
                    >
                        ADD TO VIRTUAL DISK
                    </StoreButton>
                </DetailsActions>
            </DetailsPanel>
        </DetailsBackdrop>,
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
