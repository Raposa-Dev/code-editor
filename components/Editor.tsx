import React from 'react';

interface EditorProps {
  activeFileId: string | null;
  content: string;
  onContentChange: (newContent: string) => void;
}

const Editor: React.FC<EditorProps> = ({ activeFileId, content, onContentChange }) => {
  if (activeFileId === null) {
    return (
      <div className="flex-1 bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500">Select a file from the explorer to begin editing.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      <div className="relative flex-1">
        <textarea
          key={activeFileId} // Add key to force re-render on file change
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="w-full h-full bg-transparent text-gray-300 p-4 font-mono text-sm resize-none outline-none leading-relaxed"
          spellCheck="false"
        />
      </div>
    </div>
  );
};

export default Editor;