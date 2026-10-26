import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const backdropIn = keyframes`
    from { background-color: rgb(0 0 0 / 0%); }
    to { background-color: rgb(0 0 0 / 72%); }
`;

const backdropOut = keyframes`
    from { background-color: rgb(0 0 0 / 72%); }
    to { background-color: rgb(0 0 0 / 0%); }
`;

const panelIn = keyframes`
    from { opacity: 0; transform: translateX(32px); }
    to { opacity: 1; transform: translateX(0); }
`;

const panelOut = keyframes`
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(32px); }
`;

export const DetailsBackdrop = styled.div`
    position: fixed;
    z-index: 20;
    inset: 0;
    display: flex;
    justify-content: flex-end;
    background: rgb(0 0 0 / 72%);
    animation: ${({ $isClosing }) => $isClosing ? backdropOut : backdropIn} 250ms ease both;

    & > aside {
        animation: ${({ $isClosing }) => $isClosing ? panelOut : panelIn} 250ms ease both;
        pointer-events: ${({ $isClosing }) => $isClosing ? 'none' : 'auto'};
    }
`;

export const DetailsPanel = styled.aside`
    display: flex;
    width: min(50vw, 780px);
    height: 100vh;
    height: 100dvh;
    flex-direction: column;
    padding: clamp(16px, 3vw, 30px);
    overflow-y: auto;
    border-left: 2px solid ${({ theme }) => theme.borderColor};
    color: ${({ theme }) => theme.textColor};
    background: ${({ theme }) => theme.surfaceColor};
    box-shadow: -12px 0 32px ${({ theme }) => theme.shadowColor};
    @media (max-width: 760px) {
        width: 100%;
        border-left: 0;
    }
`;

export const DetailsHeader = styled.header`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 16px;

    @media (max-width: 480px) {
        flex-direction: column;
    }
`;

export const DetailsKicker = styled.p`
    margin: 0 0 5px;
    color: ${({ theme }) => theme.accentColor};
    letter-spacing: 0.08em;
    text-shadow: ${({ theme }) => theme.glowEffect};
`;

export const DetailsTitle = styled.h2`
    margin: 0;
    color: ${({ theme }) => theme.accentColor};
    font-size: 1.8rem;
    font-weight: normal;
    line-height: 1;
    text-shadow: ${({ theme }) => theme.glowEffect};
`;

const buttonStyles = ({ theme }) => `
    padding: 5px 10px;
    border: 1px solid ${theme.borderColor};
    color: ${theme.accentColor};
    background: transparent;
    cursor: pointer;
    text-align: left;
    transition: color 250ms ease, background-color 250ms ease, border-color 250ms ease,
        box-shadow 250ms ease, transform 250ms ease;

    &:hover:not(:disabled) {
        transform: translateY(-1px);
        background: ${theme.accentColor};
        color: ${theme.backgroundColor};
        text-shadow: none;
        box-shadow: 0 0 12px ${theme.shadowColor};
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
`;

export const DetailsCloseButton = styled.button`
    ${({ theme }) => buttonStyles({ theme })}
    flex: 0 0 auto;
`;

export const DetailsImage = styled.img`
    display: block;
    width: 100%;
    max-height: min(44vh, 420px);
    min-height: 120px;
    flex: 0 0 auto;
    object-fit: contain;
    border: 1px solid ${({ theme }) => theme.borderColor};
    background: ${({ theme }) => theme.backgroundColor};
    filter: var(--shop-image-filter);
`;

export const DetailsImagePlaceholder = styled.div`
    display: grid;
    width: 100%;
    max-height: min(44vh, 420px);
    min-height: 120px;
    flex: 0 0 auto;
    place-items: center;
    border: 1px solid ${({ theme }) => theme.borderColor};
    background: ${({ theme }) => theme.backgroundColor};
    color: ${({ theme }) => theme.mutedColor};
    font-size: 0.9rem;
    letter-spacing: 0.08em;
`;

export const DetailsMeta = styled.dl`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin: 14px 0;
`;

export const DetailsMetaItem = styled.div`
    display: grid;
    gap: 3px;
    min-width: 0;
    padding: 7px;
    border: 1px solid ${({ theme }) => theme.borderColor};
    background: ${({ theme }) => theme.surfaceRaised};
`;

export const DetailsMetaLabel = styled.dt`
    color: ${({ theme }) => theme.accentColor};
    font-size: 0.9rem;
    font-weight: normal;
`;

export const DetailsMetaValue = styled.dd`
    overflow-wrap: anywhere;
    margin: 0;
`;

export const DetailsSection = styled.section`
    margin: 5px 0 10px;
    padding: 10px 12px;
    border-left: 2px solid ${({ theme }) => theme.borderColor};
    background: ${({ theme }) => theme.surfaceRaised};
`;

export const DetailsSectionTitle = styled.h3`
    margin: 0 0 4px;
    color: ${({ theme }) => theme.accentColor};
    font-size: 0.9rem;
    font-weight: normal;
`;

export const DetailsSectionBody = styled.p`
    margin: 0;
    line-height: 1.4;
    white-space: pre-wrap;
`;

export const StoreError = styled.p`
    padding: 14px;
    border-left: 2px solid #e55;
    color: #f88;
    background: ${({ theme }) => theme.surfaceRaised};
`;

export const DetailsActions = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: auto;
    padding-top: 18px;
`;

export const StoreButton = styled.button`
    ${({ theme }) => buttonStyles({ theme })}
`;

export const StorePrimaryButton = styled(StoreButton)`
    color: ${({ theme }) => theme.backgroundColor};
    background: ${({ theme }) => theme.accentColor};
`;
