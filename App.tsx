import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import AIPanel from './components/AIPanel';
import ActivityBar from './components/ActivityBar';
import Tabs from './components/Tabs';
import { MOCK_FILE_TREE, MOCK_FILE_CONTENTS } from './constants';
import { FileNode, AIAction } from './types';
import { runAIQuery } from './services/geminiService';

const App: React.FC = () => {
  const [fileTree, setFileTree] = useState<FileNode[]>(MOCK_FILE_TREE);
  const [fileContents, setFileContents] = useState<Record<string, string>>(MOCK_FILE_CONTENTS);
  
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isAIPanelVisible, setIsAIPanelVisible] = useState(true);

  const [openFiles, setOpenFiles] = useState<{ id: string; name: string }[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  const [aiOutput, setAiOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const findFirstFile = (nodes: FileNode[]): FileNode | null => {
    for (const node of nodes) {
      if (node.type === 'file') return node;
      if (node.children) {
        const found = findFirstFile(node.children);
        if (found) return found;
      }
    }
    return null;
  };

  useEffect(() => {
    // Select the first file by default on initial load
    if (openFiles.length === 0) {
        const firstFile = findFirstFile(fileTree);
        if (firstFile) {
          handleFileSelect(firstFile.id, firstFile.name);
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleFileSelect = (fileId: string, fileName: string) => {
    // If file isn't already open, add it to the open files list
    if (!openFiles.some(f => f.id === fileId)) {
        setOpenFiles(prev => [...prev, { id: fileId, name: fileName }]);
    }
    // Set the newly selected file as active
    setActiveFileId(fileId);
  };

  const handleContentChange = (newContent: string) => {
    if (activeFileId) {
      setFileContents(prev => ({ ...prev, [activeFileId]: newContent }));
    }
  };

  const handleTabClick = (fileId: string) => {
    setActiveFileId(fileId);
  }

  const handleCloseTab = (fileIdToClose: string) => {
    const closedTabIndex = openFiles.findIndex(f => f.id === fileIdToClose);
    const newOpenFiles = openFiles.filter(f => f.id !== fileIdToClose);
    setOpenFiles(newOpenFiles);

    if (activeFileId === fileIdToClose) {
      if (newOpenFiles.length > 0) {
        // Activate the previous tab, or the first one if the closed one was the first
        const newActiveIndex = Math.max(0, closedTabIndex - 1);
        setActiveFileId(newOpenFiles[newActiveIndex].id);
      } else {
        setActiveFileId(null);
      }
    }
  };
  
  const handleCreateNode = (type: 'file' | 'folder') => {
    const name = prompt(`Enter new ${type} name:`);
    if (!name) return;

    const newNode: FileNode = {
        id: `new-${Date.now()}`,
        name,
        type,
        ...(type === 'folder' && { children: [] }),
    };
    
    // For simplicity, adding to the root.
    setFileTree(prevTree => [...prevTree, newNode]);

    if (type === 'file') {
        setFileContents(prev => ({ ...prev, [newNode.id]: '' }));
        handleFileSelect(newNode.id, newNode.name);
    }
  };

  const handleOpenProject = () => {
    alert("This would typically open a dialog to select a project folder.");
  };

  const handleAskAI = useCallback(async (action: AIAction, prompt: string) => {
    setIsLoading(true);
    setAiOutput('');
    const currentCode = activeFileId ? fileContents[activeFileId] || '' : '';
    
    const result = await runAIQuery(action, prompt, currentCode);
    
    if (action === AIAction.REFACTOR || (action === AIAction.CHAT && prompt.toLowerCase().includes('generate'))) {
      const codeBlockRegex = /```(?:\w+\n)?([\s\S]*?)```/;
      const match = result.match(codeBlockRegex);
      if (match && match[1] && activeFileId) {
        handleContentChange(match[1].trim());
        setAiOutput("Code has been refactored/generated in the editor.");
      } else {
        setAiOutput(result);
      }
    } else {
      setAiOutput(result);
    }
    
    setIsLoading(false);
  }, [activeFileId, fileContents]);

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-white overflow-hidden">
      <ActivityBar 
        isSidebarVisible={isSidebarVisible}
        toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)}
        isAIPanelVisible={isAIPanelVisible}
        toggleAIPanel={() => setIsAIPanelVisible(!isAIPanelVisible)}
      />
      
      {isSidebarVisible && (
        <Sidebar 
          fileTree={fileTree} 
          onFileSelect={handleFileSelect}
          activeFileId={activeFileId}
          onCreateFile={() => handleCreateNode('file')}
          onCreateFolder={() => handleCreateNode('folder')}
          onOpenProject={handleOpenProject}
        />
      )}

      <main className="flex-1 flex min-w-0">
        <div className="flex-1 flex flex-col min-w-0">
            <Tabs 
                openFiles={openFiles}
                activeFileId={activeFileId}
                onTabClick={handleTabClick}
                onCloseTab={handleCloseTab}
            />
            <Editor
                activeFileId={activeFileId}
                content={activeFileId ? fileContents[activeFileId] || '' : ''}
                onContentChange={handleContentChange}
            />
        </div>

        {isAIPanelVisible && (
            <AIPanel 
                onAskAI={handleAskAI}
                aiOutput={aiOutput}
                isLoading={isLoading}
            />
        )}
      </main>
    </div>
  );
};

export default App;
