import styled from '@emotion/styled';

export const GameCardStyled = styled.article`
    min-width: 0;
    border: 1px solid ${({ theme }) => theme.borderColor};
    background: ${({ theme }) => theme.surfaceColor};
    box-shadow: inset 0 0 12px ${({ theme }) => theme.shadowColor};
    transition: transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease;

    &:hover {
        transform: translateY(-2px);
        border-color: ${({ theme }) => theme.accentColor};
        box-shadow: 0 0 14px ${({ theme }) => theme.shadowColor},
            inset 0 0 12px ${({ theme }) => theme.shadowColor};
    }

    &:hover img {
        transform: scale(1.035);
    }
`;

export const GameCardButton = styled.button`
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    padding: 0;
    border: 0;
    color: ${({ theme }) => theme.textColor};
    background: transparent;
    cursor: pointer;
    text-align: left;

    &:focus-visible {
        outline: 2px solid ${({ theme }) => theme.accentColor};
        outline-offset: 2px;
    }
`;

export const GameCardImageWrap = styled.span`
    display: grid;
    width: 100%;
    aspect-ratio: 16 / 10;
    place-items: center;
    overflow: hidden;
    border-bottom: 1px solid ${({ theme }) => theme.borderColor};
    background: ${({ theme }) => theme.backgroundColor};
`;

export const GameCardImage = styled.img`
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: var(--shop-image-filter);
    transition: filter 250ms ease, transform 250ms ease;
`;

export const GameCardPlaceholder = styled.span`
    color: ${({ theme }) => theme.mutedColor};
    font-size: 0.9rem;
    letter-spacing: 0.08em;
`;

export const GameCardCopy = styled.span`
    display: grid;
    width: 100%;
    min-width: 0;
    gap: 5px;
    padding: 10px 12px 12px;
`;

export const GameCardTitle = styled.span`
    min-width: 0;
    overflow-wrap: anywhere;
    color: ${({ theme }) => theme.accentColor};
    font-size: 1.15rem;
    line-height: 1.05;
`;

export const GameCardMeta = styled.span`
    min-width: 0;
    overflow-wrap: anywhere;
    color: ${({ theme }) => theme.mutedColor};
    font-size: 0.9rem;
`;

export const GameCardDescription = styled.span`
    min-width: 0;
    overflow-wrap: anywhere;
    color: ${({ theme }) => theme.textColor};
    font-size: 0.95rem;
    line-height: 1.25;
    white-space: normal;
`;
