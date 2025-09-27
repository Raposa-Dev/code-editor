

// FIX: Removed duplicate `TerminalCommand` interface to resolve a type error. The canonical definition exists in `terminal/commands/Command.ts`.

export interface BaseNode {
  id: string;
  name: string;
  parentId: string | null;
}

export interface File extends BaseNode {
  type: 'file';
  content: string;
}

export interface Folder extends BaseNode {
  type: 'folder';
  children: FileSystemNode[];
}

export type FileSystemNode = File | Folder;

export interface FileSystemContextType {
    root: Folder;
    openFiles: File[];
    activeFileId: string | null;
    dirtyFileIds: Set<string>;
    openFile: (fileId: string) => void;
    closeFile: (fileId: string) => void;
    setActiveFile: (fileId: string) => void;
    updateFileContent: (fileId: string, content: string) => void;
    saveFile: (fileId: string) => void;
    createNode: (type: 'file' | 'folder', name: string, parentId: string) => void;
    deleteNode: (nodeId: string) => void;
    renameNode: (nodeId: string, newName: string) => void;
    findNodeById: (nodeId: string) => FileSystemNode | undefined;
    moveNode: (draggedNodeId: string, targetFolderId: string) => void;
    setRootFileSystem: (newRoot: Folder) => void;
}

export interface Snippet {
  id: string;
  prefix: string;
  label: string;
  body: string;
}
