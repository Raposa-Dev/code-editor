import React from 'react';
import { FileIcon, HTMLIcon, JSONIcon, JavaScriptIcon } from '../components/icons';

export const getFileIcon = (filename: string, className: string = "w-4 h-4") => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'js':
        case 'ts':
        case 'jsx':
        case 'tsx':
            // FIX: Replaced JSX with React.createElement to resolve TSX parsing errors in a .ts file. The error "'JavaScriptIcon' refers to a value, but is being used as a type here" occurs because the TS parser misinterprets JSX as a type assertion.
            return React.createElement(JavaScriptIcon, { className });
        case 'html':
        case 'css':
        case 'scss':
            // FIX: Replaced JSX with React.createElement to resolve TSX parsing errors in a .ts file. The error "'HTMLIcon' refers to a value, but is being used as a type here" occurs because the TS parser misinterprets JSX as a type assertion.
            return React.createElement(HTMLIcon, { className });
        case 'json':
            // FIX: Replaced JSX with React.createElement to resolve TSX parsing errors in a .ts file. The error "'JSONIcon' refers to a value, but is being used as a type here" occurs because the TS parser misinterprets JSX as a type assertion.
            return React.createElement(JSONIcon, { className });
        default:
            // FIX: Replaced JSX with React.createElement to resolve TSX parsing errors in a .ts file. The error "'FileIcon' refers to a value, but is being used as a type here" occurs because the TS parser misinterprets JSX as a type assertion.
            return React.createElement(FileIcon, { className });
    }
};

export const getLanguageMode = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'js':
        case 'jsx':
            return 'JavaScript';
        case 'ts':
        case 'tsx':
            return 'TypeScript';
        case 'html':
            return 'HTML';
        case 'css':
        case 'scss':
            return 'CSS';
        case 'json':
            return 'JSON';
        case 'md':
            return 'Markdown';
        default:
            return 'Plain Text';
    }
};