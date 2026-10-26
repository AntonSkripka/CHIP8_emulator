import { authorLine, releaseYear } from '../../utils/catalog.js';
import {
    GameCardButton,
    GameCardImage,
    GameCardImageWrap,
    GameCardPlaceholder,
    GameCardStyled,
    GameCardCopy,
    GameCardDescription,
    GameCardMeta,
    GameCardTitle
} from './GameCard.styled.jsx';

export function GameCard({ game, authors, imageUrl, onSelect }) {
    const year = releaseYear(game.release);
    return (
        <GameCardStyled>
            <GameCardButton type="button" onClick={onSelect}>
                <GameCardImageWrap>
                    {imageUrl
                        ? <GameCardImage src={imageUrl} alt="" loading="lazy" />
                        : <GameCardPlaceholder aria-hidden="true">NO PREVIEW</GameCardPlaceholder>}
                </GameCardImageWrap>
                <GameCardCopy>
                    <GameCardTitle>{game.title}</GameCardTitle>
                    <GameCardMeta>{authorLine(authors, game.authors)}{year ? ` / ${year}` : ''}</GameCardMeta>
                    {game.desc && <GameCardDescription>{game.desc}</GameCardDescription>}
                </GameCardCopy>
            </GameCardButton>
        </GameCardStyled>
    );
}
