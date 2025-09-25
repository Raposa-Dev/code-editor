import React, { useState } from 'react';
import { FileNode } from '../types';
import Icon from './Icon';

interface SidebarProps {
  fileTree: FileNode[];
  onFileSelect: (fileId: string, fileName: string) => void;
  activeFileId: string | null;
  onCreateFile: () => void;
  onCreateFolder: () => void;
  onOpenProject: () => void;
}

const FileTreeItem: React.FC<{ 
  node: FileNode; 
  onFileSelect: (fileId: string, fileName: string) => void; 
  activeFileId: string | null; 
  level?: number;
}> = ({ node, onFileSelect, activeFileId, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      onFileSelect(node.id, node.name);
    }
  };

  const isFolder = node.type === 'folder';
  const isActive = activeFileId === node.id;

  return (
    <div>
      <div
        onClick={handleToggle}
        className={`flex items-center cursor-pointer p-1.5 rounded-md text-sm ${isActive ? 'bg-blue-500 bg-opacity-30 text-white' : 'hover:bg-gray-700 text-gray-400'}`}
        style={{ paddingLeft: `${level * 1.25 + 0.5}rem` }}
      >
        {isFolder ? (
          <Icon name={isOpen ? 'chevron-down' : 'chevron-right'} className="w-4 h-4 mr-2 flex-shrink-0" />
        ) : (
          <div className="w-4 mr-2 flex-shrink-0" /> // Placeholder for alignment
        )}
        
        <Icon 
            name={isFolder ? (isOpen ? 'folder-open' : 'folder') : 'file'} 
            className="w-5 h-5 mr-2 text-gray-500" 
        />
        <span className="truncate">{node.name}</span>
      </div>
      {isFolder && isOpen && node.children && (
        <div>
          {node.children.map(child => (
            <FileTreeItem 
                key={child.id} 
                node={child} 
                onFileSelect={onFileSelect} 
                activeFileId={activeFileId} 
                level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ fileTree, onFileSelect, activeFileId, onCreateFile, onCreateFolder, onOpenProject }) => {
  return (
    <div className="w-64 bg-gray-800 p-2 flex flex-col h-full overflow-y-auto">
      <div className="flex justify-between items-center p-2">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Explorer</h2>
        <div className="flex items-center space-x-2">
            <button onClick={onCreateFile} title="New File" className="text-gray-400 hover:text-white">
                <Icon name="document-plus" className="w-5 h-5" />
            </button>
            <button onClick={onCreateFolder} title="New Folder" className="text-gray-400 hover:text-white">
                <Icon name="folder-plus" className="w-5 h-5" />
            </button>
            <button onClick={onOpenProject} title="Open Project" className="text-gray-400 hover:text-white">
                <Icon name="folder-arrow-down" className="w-5 h-5" />
            </button>
        </div>
      </div>
      <div className="flex-grow mt-2">
        {fileTree.map(node => (
          <FileTreeItem 
            key={node.id} 
            node={node} 
            onFileSelect={onFileSelect} 
            activeFileId={activeFileId} 
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
