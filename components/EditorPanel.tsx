

import React from 'react';
import { useFileSystem } from '../hooks/useFileSystem';
import CodeEditor from './CodeEditor';
import EditorTab from './EditorTab';

const EditorPanel: React.FC = () => {
    const { openFiles, activeFileId, findNodeById } = useFileSystem();
    const activeFile = activeFileId ? findNodeById(activeFileId) : null;

    if (openFiles.length === 0) {
        return <div className="h-full w-full bg-[var(--color-bg-primary)] flex items-center justify-center text-[var(--color-text-secondary)]">No file open</div>;
    }

    return (
        <div className="h-full w-full flex flex-col bg-[var(--color-bg-primary)]">
            <div className="flex-shrink-0 bg-[var(--color-bg-tertiary)] flex">
                {openFiles.map(file => (
                    <EditorTab
                        key={file.id}
                        file={file}
                        isActive={activeFileId === file.id}
                    />
                ))}
            </div>
            <div className="flex-grow w-full h-full overflow-auto">
                {activeFile?.type === 'file' ? (
                     <CodeEditor file={activeFile} />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-[var(--color-text-secondary)]">Select a file to edit</div>
                )}
            </div>
        </div>
    );
};

export default EditorPanel;