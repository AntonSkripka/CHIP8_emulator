import styled from '@emotion/styled';

export const StoreRoot = styled.div`
    min-height: 60vh;
    padding: clamp(12px, 2vw, 22px);
    border: 1px solid ${({ theme }) => theme.borderColor};
    background: color-mix(in srgb, ${({ theme }) => theme.surfaceColor} 95%, transparent);
    box-shadow: 0 0 20px ${({ theme }) => theme.shadowColor},
        inset 0 0 12px ${({ theme }) => theme.shadowColor};
`;

export const StoreToolbar = styled.div`
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 18px;
    padding-bottom: 14px;
    border-bottom: 1px solid ${({ theme }) => theme.borderColor};
`;

export const StoreKicker = styled.p`
    margin: 0 0 5px;
    color: ${({ theme }) => theme.accentColor};
    letter-spacing: 0.08em;
    text-shadow: ${({ theme }) => theme.glowEffect};
`;

export const StoreDescription = styled.p`
    margin: 0;
    color: ${({ theme }) => theme.mutedColor};
`;

export const GameGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(210px, 100%), 1fr));
    gap: 14px;
`;

export const StoreMessage = styled.p(({ theme, $error }) => ({
    padding: 14,
    borderLeft: `2px solid ${$error ? '#e55' : theme.borderColor}`,
    color: $error ? '#f88' : theme.mutedColor,
    background: theme.surfaceRaised
}));
