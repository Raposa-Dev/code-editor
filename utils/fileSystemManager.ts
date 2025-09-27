

import { File, Folder, FileSystemNode } from '../types';

export class FileSystemManager {
    private readonly root: Folder;
    private readonly nodeMap: Map<string, FileSystemNode>;

    constructor(initialRoot: Folder) {
        this.root = initialRoot;
        this.nodeMap = this.buildNodeMap(initialRoot);
    }

    private buildNodeMap(rootNode: Folder): Map<string, FileSystemNode> {
        const map = new Map<string, FileSystemNode>();
        const traverse = (node: FileSystemNode) => {
            map.set(node.id, node);
            if (node.type === 'folder') {
                node.children.forEach(traverse);
            }
        };
        traverse(rootNode);
        return map;
    }

    public findNodeById(nodeId: string): FileSystemNode | undefined {
        return this.nodeMap.get(nodeId);
    }

    private cloneTree(): Folder {
        return JSON.parse(JSON.stringify(this.root));
    }
    
    private isAncestor(nodeId: string, potentialAncestorId: string): boolean {
        let currentNode = this.nodeMap.get(nodeId);
        while (currentNode?.parentId) {
            if (currentNode.parentId === potentialAncestorId) {
                return true;
            }
            currentNode = this.nodeMap.get(currentNode.parentId);
        }
        return false;
    }

    public updateFileContent(fileId: string, content: string): Folder {
        const newRoot = this.cloneTree();
        const manager = new FileSystemManager(newRoot);
        const file = manager.findNodeById(fileId) as File | undefined;
        if (file) {
            file.content = content;
        }
        return newRoot;
    }
    
    public createNode(type: 'file' | 'folder', name: string, parentId: string): Folder | null {
        const parentNode = this.findNodeById(parentId);
        if (parentNode?.type !== 'folder') return null;

        const newNode: FileSystemNode = type === 'file'
            ? { id: crypto.randomUUID(), name, type: 'file', content: '', parentId }
            : { id: crypto.randomUUID(), name, type: 'folder', children: [], parentId };
        
        const newRoot = this.cloneTree();
        const manager = new FileSystemManager(newRoot);
        const parentFolder = manager.findNodeById(parentId) as Folder;
        parentFolder.children.push(newNode);
        parentFolder.children.sort((a, b) => a.name.localeCompare(b.name));
        
        return newRoot;
    }

    public deleteNode(nodeId: string, onFileCloseCallback: (fileId: string) => void): Folder | null {
        const node = this.findNodeById(nodeId);
        if (!node || !node.parentId) return null; // Cannot delete root
        
        const filesToClose: string[] = [];
        const findFilesRecursive = (nodeToScan: FileSystemNode) => {
            if (nodeToScan.type === 'file') {
                filesToClose.push(nodeToScan.id);
            } else if (nodeToScan.type === 'folder') {
                nodeToScan.children.forEach(findFilesRecursive);
            }
        };
        findFilesRecursive(node);
        filesToClose.forEach(onFileCloseCallback);

        const newRoot = this.cloneTree();
        const manager = new FileSystemManager(newRoot);
        const parent = manager.findNodeById(node.parentId) as Folder;
        parent.children = parent.children.filter(child => child.id !== nodeId);

        return newRoot;
    }
    
    public renameNode(nodeId: string, newName: string): Folder | null {
        const node = this.findNodeById(nodeId);
        if (!node || !node.parentId) return null; // Cannot rename root

        const newRoot = this.cloneTree();
        const manager = new FileSystemManager(newRoot);
        const nodeToRename = manager.findNodeById(nodeId);
        if (nodeToRename) {
            nodeToRename.name = newName;
            // Re-sort parent
            const parent = manager.findNodeById(nodeToRename.parentId!) as Folder;
            parent.children.sort((a, b) => a.name.localeCompare(b.name));
        }
        return newRoot;
    }

    public moveNode(draggedNodeId: string, targetFolderId: string): Folder {
        const draggedNode = this.findNodeById(draggedNodeId);
        const targetFolder = this.findNodeById(targetFolderId);

        if (!draggedNode || !targetFolder || targetFolder.type !== 'folder') {
            throw new Error("Invalid move operation: source or target not found.");
        }

        if (draggedNodeId === targetFolderId || draggedNode.parentId === targetFolderId) {
            return this.root; // No change
        }

        if (draggedNode.type === 'folder' && this.isAncestor(targetFolderId, draggedNodeId)) {
            throw new Error("Cannot move a folder into one of its own subfolders.");
        }

        const newRoot = this.cloneTree();
        const manager = new FileSystemManager(newRoot);
        
        const sourceParent = manager.findNodeById(draggedNode.parentId!) as Folder;
        const finalTargetFolder = manager.findNodeById(targetFolderId) as Folder;
        const nodeToMove = manager.findNodeById(draggedNodeId)!;

        // Remove from old parent
        sourceParent.children = sourceParent.children.filter(child => child.id !== draggedNodeId);

        // Add to new parent
        nodeToMove.parentId = targetFolderId;
        finalTargetFolder.children.push(nodeToMove);
        finalTargetFolder.children.sort((a, b) => a.name.localeCompare(b.name));

        return newRoot;
    }
}