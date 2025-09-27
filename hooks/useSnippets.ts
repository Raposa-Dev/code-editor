import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Snippet } from '../types';
import { getSnippets, saveSnippets } from '../utils/snippetStore';

interface SnippetsContextType {
    snippets: Snippet[];
    addSnippet: (snippetData: Omit<Snippet, 'id'>) => void;
    deleteSnippet: (snippetId: string) => void;
}

const SnippetsContext = createContext<SnippetsContextType | null>(null);

const initialSnippets: Snippet[] = [
    { id: '1', prefix: 'clog', label: 'Console Log', body: 'console.log();' },
    { id: '2', prefix: 'func', label: 'Function', body: 'function functionName() {\n  \n}' },
];

export const SnippetsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [snippets, setSnippets] = useState<Snippet[]>(() => {
        const savedSnippets = getSnippets();
        return savedSnippets.length > 0 ? savedSnippets : initialSnippets;
    });

    useEffect(() => {
        saveSnippets(snippets);
    }, [snippets]);

    const addSnippet = useCallback((snippetData: Omit<Snippet, 'id'>) => {
        const newSnippet: Snippet = { id: crypto.randomUUID(), ...snippetData };
        setSnippets(prev => [...prev, newSnippet]);
    }, []);

    const deleteSnippet = useCallback((snippetId: string) => {
        setSnippets(prev => prev.filter(s => s.id !== snippetId));
    }, []);

    const value = { snippets, addSnippet, deleteSnippet };

    return React.createElement(SnippetsContext.Provider, { value }, children);
};

export const useSnippets = () => {
    const context = useContext(SnippetsContext);
    if (!context) {
        throw new Error('useSnippets must be used within a SnippetsProvider');
    }
    return context;
};