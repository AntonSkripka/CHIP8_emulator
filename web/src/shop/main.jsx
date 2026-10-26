import { createRoot } from 'react-dom/client';
import App from './components/App/App.jsx';
import { ThemeProvider } from '@emotion/react';
import { theme } from './constans/theme.js';

export function mountGameStore(element, bridge) {
    createRoot(element).render(
        <ThemeProvider theme={theme}>
            <App bridge={bridge} />
        </ThemeProvider>
    );
}
