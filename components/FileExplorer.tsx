

import React, { useState, useRef } from 'react';
import { useFileSystem } from '../hooks/useFileSystem';
import { FileSystemNode } from '../types';
import ContextMenu, { MenuItem } from './ContextMenu';
import { parseFileInputToFSTree } from '../utils/directoryParser';
import FileExplorerNode from './FileExplorerNode';

const DRAG_AND_DROP_MIME_TYPE = 'application/vnd.code-gemini.node-id';

const FileExplorer: React.FC = () => {
    const { root, createNode, deleteNode, renameNode, moveNode, setRootFileSystem } = useFileSystem();
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; node: FileSystemNode } | null>(null);
    const [renamingNodeId, setRenamingNodeId] = useState<string | null>(null);
    const [dragOverNodeId, setDragOverNodeId] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleOpenFolderClick = () => {
        inputRef.current?.click();
    };

    const handleFolderSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        if (!files || files.length === 0) return;

        try {
            const newRoot = await parseFileInputToFSTree(files);
            if (newRoot) setRootFileSystem(newRoot);
        } catch (error) {
            console.error("Error processing directory:", error);
            alert("Could not process the selected directory.");
        }

        if (inputRef.current) inputRef.current.value = '';
    };

    const handleContextMenu = (event: React.MouseEvent, node: FileSystemNode) => {
        event.preventDefault();
        event.stopPropagation();
        setContextMenu({ x: event.clientX, y: event.clientY, node });
    };

    const closeContextMenu = () => setContextMenu(null);

    const handleRename = (nodeId: string, newName: string) => {
        if (newName.trim()) renameNode(nodeId, newName.trim());
        setRenamingNodeId(null);
    };

    const handleDragStart = (event: React.DragEvent, node: FileSystemNode) => {
        event.dataTransfer.setData(DRAG_AND_DROP_MIME_TYPE, node.id);
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (event: React.DragEvent, node: FileSystemNode) => {
        event.preventDefault();
        if (node.type === 'folder') setDragOverNodeId(node.id);
    };
    
    const handleDragLeave = () => {
        setDragOverNodeId(null);
    };

    const handleDrop = (event: React.DragEvent, dropTargetNode: FileSystemNode) => {
        event.preventDefault();
        event.stopPropagation();
        setDragOverNodeId(null);

        const draggedNodeId = event.dataTransfer.getData(DRAG_AND_DROP_MIME_TYPE);
        if (!draggedNodeId) return;

        const targetFolderId = dropTargetNode.type === 'folder' ? dropTargetNode.id : dropTargetNode.parentId;
        if (targetFolderId) moveNode(draggedNodeId, targetFolderId);
    };

    const getMenuItems = (): MenuItem[] => {
        if (!contextMenu) return [];
        const { node } = contextMenu;
        const items: MenuItem[] = [];

        if (node.type === 'folder') {
            items.push({
                label: 'New File',
                onClick: () => {
                    const name = prompt('Enter file name:');
                    if (name) createNode('file', name, node.id);
                }
            });
            items.push({
                label: 'New Folder',
                onClick: () => {
                    const name = prompt('Enter folder name:');
                    if (name) createNode('folder', name, node.id);
                }
            });
        }
        
        if (node.parentId) { // Can't rename or delete root
            items.push({ label: 'Rename', onClick: () => setRenamingNodeId(node.id) });
            items.push({
                label: 'Delete',
                onClick: () => {
                    if (confirm(`Are you sure you want to delete ${node.name}?`)) {
                        deleteNode(node.id);
                    }
                },
            });
        }

        return items;
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-2 border-b border-[var(--color-border-primary)] flex-shrink-0">
                 <input
                    type="file"
                    ref={inputRef}
                    onChange={handleFolderSelection}
                    // @ts-ignore
                    webkitdirectory="true"
                    directory="true"
                    multiple
                    style={{ display: 'none' }}
                />
                 <button 
                    onClick={handleOpenFolderClick}
                    className="w-full text-left px-2 py-1.5 text-sm bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-accent)] hover:text-[var(--color-text-accent)] rounded-md"
                 >
                    Open Folder
                </button>
            </div>
            <div className="p-2 text-[var(--color-text-primary)] flex-grow overflow-auto" onMouseDown={() => contextMenu && closeContextMenu()}>
                <FileExplorerNode 
                    node={root} 
                    depth={0} 
                    onContextMenu={handleContextMenu}
                    renamingNodeId={renamingNodeId}
                    onRename={handleRename}
                    onDragStartNode={handleDragStart}
                    onDragOverNode={handleDragOver}
                    onDragLeaveNode={handleDragLeave}
                    onDropNode={handleDrop}
                    dragOverNodeId={dragOverNodeId}
                />
                {contextMenu && (
                    <ContextMenu
                        x={contextMenu.x}
                        y={contextMenu.y}
                        items={getMenuItems()}
                        onClose={closeContextMenu}
                    />
                )}
            </div>
        </div>
    );
};

export default FileExplorer;