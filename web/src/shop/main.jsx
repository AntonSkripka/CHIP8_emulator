import { createRoot } from 'react-dom/client';
import App from './App.jsx';

export function mountGameStore(element, bridge) {
    createRoot(element).render(<App bridge={bridge} />);
}
