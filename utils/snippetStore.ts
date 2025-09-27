import { Snippet } from '../types';

const SNIPPET_STORAGE_KEY = 'code-gemini-snippets';

export function getSnippets(): Snippet[] {
    try {
        const saved = localStorage.getItem(SNIPPET_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Failed to retrieve snippets from local storage:', error);
        return [];
    }
}

export function saveSnippets(snippets: Snippet[]): void {
    try {
        localStorage.setItem(SNIPPET_STORAGE_KEY, JSON.stringify(snippets));
    } catch (error) {
        console.error('Failed to save snippets to local storage:', error);
    }
}