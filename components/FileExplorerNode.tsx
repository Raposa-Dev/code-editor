
import React, { useState } from 'react';
import { FileSystemNode } from '../types';
import { useFileSystem } from '../hooks/useFileSystem';
import { ChevronDownIcon, ChevronRightIcon, FileIcon, FolderIcon } from './icons';

interface FileExplorerNodeProps {
    node: FileSystemNode;
    depth: number;
    onContextMenu: (event: React.MouseEvent, node: FileSystemNode) => void;
    renamingNodeId: string | null;
    onRename: (nodeId: string, newName: string) => void;
    onDragStartNode: (event: React.DragEvent, node: FileSystemNode) => void;
    onDragOverNode: (event: React.DragEvent, node: FileSystemNode) => void;
    onDragLeaveNode: (event: React.DragEvent) => void;
    onDropNode: (event: React.DragEvent, node: FileSystemNode) => void;
    dragOverNodeId: string | null;
}

const FileExplorerNode: React.FC<FileExplorerNodeProps> = ({ 
    node, 
    depth, 
    onContextMenu, 
    renamingNodeId, 
    onRename,
    onDragStartNode, 
    onDragOverNode, 
    onDragLeaveNode, 
    onDropNode,
    dragOverNodeId
}) => {
    const { openFile } = useFileSystem();
    const [isExpanded, setIsExpanded] = useState(true);
    const [newName, setNewName] = useState(node.name);

    const isEditing = renamingNodeId === node.id;
    const isDragOver = dragOverNodeId === node.id;

    const handleNodeClick = () => {
        if (node.type === 'folder') {
            setIsExpanded(previous => !previous);
        } else {
            openFile(node.id);
        }
    };
    
    const handleRenameSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onRename(node.id, newName);
    };

    const dropTargetClassName = isDragOver && node.type === 'folder' 
        ? 'bg-[var(--color-bg-accent)] text-[var(--color-text-accent)]' 
        : 'hover:bg-[var(--color-bg-tertiary)]';

    return (
        <div>
            <div
                draggable="true"
                onDragStart={(event) => onDragStartNode(event, node)}
                onDragOver={(event) => onDragOverNode(event, node)}
                onDragLeave={onDragLeaveNode}
                onDrop={(event) => onDropNode(event, node)}
                className={`flex items-center ${dropTargetClassName} cursor-pointer group rounded-sm`}
                style={{ paddingLeft: `${depth * 1}rem` }}
                onClick={handleNodeClick}
                onContextMenu={(event) => onContextMenu(event, node)}
            >
                {node.type === 'folder' ? (
                    isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />
                ) : (
                    <div className="w-4" /> // Placeholder for alignment
                )}
                {node.type === 'folder' ? <FolderIcon /> : <FileIcon />}
                
                {isEditing ? (
                    <form onSubmit={handleRenameSubmit} className="flex-grow ml-2">
                        <input
                            type="text"
                            value={newName}
                            onChange={(event) => setNewName(event.target.value)}
                            onBlur={() => onRename(node.id, newName)}
                            autoFocus
                            onClick={(event) => event.stopPropagation()} 
                            className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] w-full px-1"
                        />
                    </form>
                ) : (
                     <span className="ml-2 flex-grow truncate" title={node.name}>{node.name}</span>
                )}
            </div>
            {node.type === 'folder' && isExpanded && (
                <div>
                    {node.children.map(child => (
                        <FileExplorerNode 
                            key={child.id} 
                            node={child} 
                            depth={depth + 1}
                            onContextMenu={onContextMenu}
                            renamingNodeId={renamingNodeId}
                            onRename={onRename}
                            onDragStartNode={onDragStartNode}
                            onDragOverNode={onDragOverNode}
                            onDragLeaveNode={onDragLeaveNode}
                            onDropNode={onDropNode}
                            dragOverNodeId={dragOverNodeId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileExplorerNode;
