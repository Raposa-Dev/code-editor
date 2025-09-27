const THEME_STORAGE_KEY = 'code-gemini-theme';

export function getTheme(): string | null {
    try {
        return localStorage.getItem(THEME_STORAGE_KEY);
    } catch (error) {
        console.error('Failed to retrieve theme from local storage:', error);
        return null;
    }
}

export function setTheme(themeName: string): void {
    try {
        if (themeName) {
            localStorage.setItem(THEME_STORAGE_KEY, themeName);
        } else {
            localStorage.removeItem(THEME_STORAGE_KEY);
        }
    } catch (error) {
        console.error('Failed to save theme to local storage:', error);
    }
}
