export const THEMES = ['mono', 'green', 'amber', 'blue'];
const DEFAULT_THEME = 'green';
const STORAGE_KEY = 'chip8-theme';

export class ThemeManager {
    constructor({ documentRef, storage, logger = console }) {
        this.document = documentRef;
        this.storage = storage;
        this.logger = logger;
        this.currentTheme = this.readSavedTheme();
        this.apply(this.currentTheme);
    }

    readSavedTheme() {
        try {
            const savedTheme = this.storage.getItem(STORAGE_KEY);
            return THEMES.includes(savedTheme) ? savedTheme : DEFAULT_THEME;
        } catch (error) {
            this.logger.warn('Could not read the saved color theme:', error);
            return DEFAULT_THEME;
        }
    }

    setTheme(theme) {
        if (!THEMES.includes(theme)) {
            throw new RangeError(`Unknown color theme: ${theme}`);
        }

        this.currentTheme = theme;
        this.apply(theme);
        try {
            this.storage.setItem(STORAGE_KEY, theme);
        } catch (error) {
            this.logger.error('Could not save the selected color theme:', error);
        }
    }

    apply(theme) {
        this.document.documentElement.dataset.theme = theme;
        this.document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }

    getTheme() {
        return this.currentTheme;
    }
}
