import React from 'react';
import Icon from './Icon';

interface Tab {
  id: string;
  name: string;
}

interface TabsProps {
  openFiles: Tab[];
  activeFileId: string | null;
  onTabClick: (fileId: string) => void;
  onCloseTab: (fileId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ openFiles, activeFileId, onTabClick, onCloseTab }) => {
  if (openFiles.length === 0) {
    return <div className="bg-gray-800 h-[41px] border-b border-gray-700"></div>; // Placeholder for consistent height
  }
  
  return (
    <div className="flex bg-gray-800 border-b border-gray-700">
      {openFiles.map((file) => (
        <div
          key={file.id}
          onClick={() => onTabClick(file.id)}
          className={`flex items-center justify-between p-2 px-4 text-sm cursor-pointer border-r border-gray-700 ${
            activeFileId === file.id
              ? 'bg-gray-900 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <span className="mr-3 truncate">{file.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent tab click when closing
              onCloseTab(file.id);
            }}
            className="p-0.5 rounded-full hover:bg-gray-600"
            aria-label={`Close ${file.name}`}
          >
            <Icon name="x-mark" className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
