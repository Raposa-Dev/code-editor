import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type AIStatus = 'idle' | 'loading' | 'error';

interface AIStatusContextType {
    status: AIStatus;
    message: string;
    setStatus: (status: AIStatus, message?: string) => void;
}

const AIStatusContext = createContext<AIStatusContextType | null>(null);

export const AIStatusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [status, setStatusState] = useState<AIStatus>('idle');
    const [message, setMessage] = useState('Ready');

    const setStatus = useCallback((newStatus: AIStatus, newMessage?: string) => {
        setStatusState(newStatus);
        switch (newStatus) {
            case 'idle':
                setMessage(newMessage || 'Ready');
                break;
            case 'loading':
                setMessage(newMessage || 'Generating...');
                break;
            case 'error':
                setMessage(newMessage || 'An error occurred.');
                break;
        }
    }, []);

    const value = { status, message, setStatus };

    return React.createElement(AIStatusContext.Provider, { value }, children);
};

export const useAIStatus = () => {
    const context = useContext(AIStatusContext);
    if (!context) {
        throw new Error('useAIStatus must be used within an AIStatusProvider');
    }
    return context;
};
