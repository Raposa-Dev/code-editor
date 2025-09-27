
const API_KEY_STORAGE_KEY = 'gemini-api-key';

export function getApiKey(): string | null {
    try {
        return localStorage.getItem(API_KEY_STORAGE_KEY);
    } catch (error) {
        console.error('Failed to retrieve API key from local storage:', error);
        return null;
    }
}

export function setApiKey(key: string): void {
    try {
        if (key) {
            localStorage.setItem(API_KEY_STORAGE_KEY, key);
        } else {
            localStorage.removeItem(API_KEY_STORAGE_KEY);
        }
    } catch (error) {
        console.error('Failed to save API key to local storage:', error);
    }
}
