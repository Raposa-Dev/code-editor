import React from 'react';
import { useAIStatus } from '../hooks/useAIStatus';
import { useEditorStatus } from '../hooks/useEditorStatus';
import { useFileSystem } from '../hooks/useFileSystem';
import { getLanguageMode } from '../utils/fileUtils';
import { GeminiIcon, SyncIcon, AlertTriangleIcon } from './icons';

const AIStatusDisplay: React.FC = () => {
    const { status, message } = useAIStatus();

    const getIcon = () => {
        switch (status) {
            case 'loading':
                return <SyncIcon className="w-4 h-4 mr-2 animate-spin" />;
            case 'error':
                return <AlertTriangleIcon className="w-4 h-4 mr-2 text-[var(--color-status-warning)]" />;
            default:
                return <GeminiIcon className="w-4 h-4 mr-2" />;
        }
    };
    
    return (
        <div className="flex items-center px-2">
            {getIcon()}
            <span>{message}</span>
        </div>
    );
};


const EditorStatusDisplay: React.FC = () => {
    const { cursorPosition } = useEditorStatus();
    const { activeFileId, findNodeById } = useFileSystem();
    
    const activeFile = activeFileId ? findNodeById(activeFileId) : null;

    if (!activeFile || activeFile.type !== 'file') {
        return null;
    }

    return (
        <div className="flex items-center space-x-4 px-2">
            <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
            <span>UTF-8</span>
            <span>LF</span>
            <span>{getLanguageMode(activeFile.name)}</span>
        </div>
    );
};


const StatusBar: React.FC = () => {
    return (
        <div className="flex-shrink-0 h-6 bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] text-xs flex items-center justify-between border-t border-[var(--color-border-primary)]">
            <AIStatusDisplay />
            <EditorStatusDisplay />
        </div>
    );
};

export default StatusBar;