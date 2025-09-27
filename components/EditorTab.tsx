
import React from 'react';
import { File } from '../types';
import { useFileSystem } from '../hooks/useFileSystem';
import { getFileIcon } from '../utils/fileUtils';
import { XIcon, DirtyDotIcon } from './icons';

interface EditorTabProps {
    file: File;
    isActive: boolean;
}

const EditorTab: React.FC<EditorTabProps> = ({ file, isActive }) => {
    const { setActiveFile, closeFile, dirtyFileIds } = useFileSystem();
    const isDirty = dirtyFileIds.has(file.id);

    const handleClose = (event: React.MouseEvent) => {
        event.stopPropagation();
        closeFile(file.id);
    };

    return (
        <div
            onClick={() => setActiveFile(file.id)}
            className={`group flex items-center pl-3 pr-2 py-2 cursor-pointer border-r border-b border-[var(--color-bg-primary)] ${
                isActive ? 'bg-[var(--color-bg-primary)] border-b-transparent' : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]'
            }`}
        >
            {getFileIcon(file.name, "mr-2 w-4 h-4")}
            <span className="text-sm mr-2">{file.name}</span>
            <div className="w-4 h-4 flex items-center justify-center">
                {isDirty ? (
                    <button
                        onClick={handleClose}
                        className="w-full h-full flex items-center justify-center rounded"
                        aria-label={`Close ${file.name} tab`}
                    >
                        <DirtyDotIcon className="group-hover:hidden" />
                        <XIcon className="w-3 h-3 hidden group-hover:block"/>
                    </button>
                ) : (
                    <button
                        onClick={handleClose}
                        className="w-full h-full flex items-center justify-center rounded invisible group-hover:visible hover:bg-[var(--color-bg-secondary)]"
                        aria-label={`Close ${file.name} tab`}
                    >
                        <XIcon className="w-3 h-3"/>
                    </button>
                )}
            </div>
        </div>
    );
};

export default EditorTab;
