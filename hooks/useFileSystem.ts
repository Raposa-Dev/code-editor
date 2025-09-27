

import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { File, Folder, FileSystemNode, FileSystemContextType } from '../types';
import { initialFileSystem } from '../data/mockFileSystem';
import { FileSystemManager } from '../utils/fileSystemManager';
import { DirtyFileTracker } from '../utils/DirtyFileTracker';

const FileSystemContext = createContext<FileSystemContextType | null>(null);

export const FileSystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [root, setRoot] = useState<Folder>(initialFileSystem);
    const [openFiles, setOpenFiles] = useState<File[]>([]);
    const [activeFileId, setActiveFileId] = useState<string | null>(null);
    const [dirtyFileTracker, setDirtyFileTracker] = useState(new DirtyFileTracker());
    
    const fileSystemManager = useMemo(() => new FileSystemManager(root), [root]);

    const findNodeById = useCallback((nodeId: string) => {
        return fileSystemManager.findNodeById(nodeId);
    }, [fileSystemManager]);
    
    const setRootFileSystem = useCallback((newRoot: Folder) => {
        setRoot(newRoot);
        setOpenFiles([]);
        setActiveFileId(null);
        setDirtyFileTracker(new DirtyFileTracker());
    }, []);

    const openFile = useCallback((fileId: string) => {
        if (openFiles.some(file => file.id === fileId)) {
            setActiveFileId(fileId);
            return;
        }
        const fileNode = findNodeById(fileId);
        if (fileNode?.type === 'file') {
            setOpenFiles(previousOpenFiles => [...previousOpenFiles, fileNode]);
            setActiveFileId(fileId);
        }
    }, [openFiles, findNodeById]);

    const closeFile = useCallback((fileId: string) => {
        setOpenFiles(previousOpenFiles => {
            const fileIndex = previousOpenFiles.findIndex(file => file.id === fileId);
            if (fileIndex === -1) return previousOpenFiles;

            const newOpenFiles = previousOpenFiles.filter(file => file.id !== fileId);

            if (activeFileId === fileId) {
                const newActiveIndex = newOpenFiles.length > 0 ? Math.max(0, fileIndex - 1) : -1;
                setActiveFileId(newActiveIndex > -1 ? newOpenFiles[newActiveIndex].id : null);
            }
            return newOpenFiles;
        });
        setDirtyFileTracker(tracker => tracker.clearForFile(fileId));
    }, [activeFileId]);
    
    const setActiveFile = useCallback((fileId: string) => {
        setActiveFileId(fileId);
    }, []);

    const updateFileContent = useCallback((fileId: string, content: string) => {
        const newRoot = fileSystemManager.updateFileContent(fileId, content);
        setRoot(newRoot);
        setOpenFiles(previousOpenFiles => previousOpenFiles.map(file => 
            file.id === fileId ? { ...file, content } : file
        ));
        setDirtyFileTracker(tracker => tracker.markDirty(fileId));
    }, [fileSystemManager]);

    const saveFile = useCallback((fileId: string) => {
        setDirtyFileTracker(tracker => tracker.markClean(fileId));
    }, []);

    const createNode = useCallback((type: 'file' | 'folder', name: string, parentId: string) => {
        const newRoot = fileSystemManager.createNode(type, name, parentId);
        if (newRoot) setRoot(newRoot);
    }, [fileSystemManager]);

    const deleteNode = useCallback((nodeId: string) => {
        const newRoot = fileSystemManager.deleteNode(nodeId, (fileId) => closeFile(fileId));
        if (newRoot) setRoot(newRoot);
    }, [fileSystemManager, closeFile]);

    const renameNode = useCallback((nodeId: string, newName: string) => {
        const newRoot = fileSystemManager.renameNode(nodeId, newName);
        if (newRoot) {
            setRoot(newRoot);
            setOpenFiles(previousOpenFiles => previousOpenFiles.map(file => 
                file.id === nodeId ? { ...file, name: newName } : file
            ));
        }
    }, [fileSystemManager]);

    const moveNode = useCallback((draggedNodeId: string, targetFolderId: string) => {
        try {
            const newRoot = fileSystemManager.moveNode(draggedNodeId, targetFolderId);
            if (newRoot) setRoot(newRoot);
        } catch (error) {
            if (error instanceof Error) alert(error.message);
            else console.error(error);
        }
    }, [fileSystemManager]);

    const value = {
        root,
        openFiles,
        activeFileId,
        dirtyFileIds: dirtyFileTracker.getDirtyIds(),
        openFile,
        closeFile,
        setActiveFile,
        updateFileContent,
        saveFile,
        createNode,
        deleteNode,
        renameNode,
        findNodeById,
        moveNode,
        setRootFileSystem,
    };

    return React.createElement(FileSystemContext.Provider, { value }, children);
};

export const useFileSystem = () => {
    const context = useContext(FileSystemContext);
    if (!context) {
        throw new Error('useFileSystem must be used within a FileSystemProvider');
    }
    return context;
};