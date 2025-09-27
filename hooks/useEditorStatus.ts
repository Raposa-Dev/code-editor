import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface CursorPosition {
    line: number;
    column: number;
}

interface EditorStatusContextType {
    cursorPosition: CursorPosition;
    setCursorPosition: (pos: CursorPosition) => void;
}

const EditorStatusContext = createContext<EditorStatusContextType | null>(null);

export const EditorStatusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ line: 1, column: 1 });

    const value = { cursorPosition, setCursorPosition: useCallback((pos: CursorPosition) => setCursorPosition(pos), []) };

    return React.createElement(EditorStatusContext.Provider, { value }, children);
};

export const useEditorStatus = () => {
    const context = useContext(EditorStatusContext);
    if (!context) {
        throw new Error('useEditorStatus must be used within an EditorStatusProvider');
    }
    return context;
};
