const EDITOR_THEME_STORAGE_KEY = 'code-gemini-editor-theme';

export function getEditorTheme(): string | null {
    try {
        return localStorage.getItem(EDITOR_THEME_STORAGE_KEY);
    } catch (error) {
        console.error('Failed to retrieve editor theme from local storage:', error);
        return null;
    }
}

export function setEditorTheme(themeName: string): void {
    try {
        if (themeName) {
            localStorage.setItem(EDITOR_THEME_STORAGE_KEY, themeName);
        } else {
            localStorage.removeItem(EDITOR_THEME_STORAGE_KEY);
        }
    } catch (error) {
        console.error('Failed to save editor theme to local storage:', error);
    }
}
