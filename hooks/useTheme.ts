import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { themes, Theme } from '../data/themes';
import { getTheme, setTheme as saveTheme } from '../utils/themeStore';
import { getEditorTheme, setEditorTheme as saveEditorTheme } from '../utils/editorThemeStore';
import { availableEditorThemes, EditorTheme } from '../data/editorThemes';

interface ThemeContextType {
    theme: Theme;
    setTheme: (themeName: string) => void;
    editorTheme: EditorTheme;
    setEditorTheme: (themeName: string) => void;
    availableEditorThemes: EditorTheme[];
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [themeName, setThemeName] = useState<string>(() => getTheme() || 'Dark');
    const [editorThemeName, setEditorThemeName] = useState<string>(() => getEditorTheme() || 'VS Code Dark');

    useEffect(() => {
        const currentTheme = themes.find(t => t.name === themeName) || themes[0];
        const root = window.document.documentElement;

        Object.entries(currentTheme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });
        
        saveTheme(themeName);
    }, [themeName]);

     useEffect(() => {
        saveEditorTheme(editorThemeName);
    }, [editorThemeName]);
    
    const setTheme = (name: string) => {
        setThemeName(name);
    };

    const setEditorTheme = (name: string) => {
        setEditorThemeName(name);
    }
    
    const theme = useMemo(() => themes.find(t => t.name === themeName) || themes[0], [themeName]);
    const editorTheme = useMemo(() => availableEditorThemes.find(t => t.name === editorThemeName) || availableEditorThemes[0], [editorThemeName]);

    const value = { theme, setTheme, editorTheme, setEditorTheme, availableEditorThemes };

    return React.createElement(ThemeContext.Provider, { value }, children);
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};