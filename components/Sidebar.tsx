
import React from 'react';
import { ViewType } from '../hooks/useLayout';
import FileExplorer from './FileExplorer';
import AIPanel from './AIPanel';
import SettingsPanel from './SettingsPanel';
import SnippetsPanel from './SnippetsPanel';

interface SidebarProps {
  activeView: ViewType;
}

const getHeaderText = (view: ViewType) => {
    switch (view) {
        case 'files':
            return 'Explorer';
        case 'ai':
            return 'Gemini AI';
        case 'snippets':
            return 'Snippets';
        case 'settings':
            return 'Settings';
        default:
            return '';
    }
}

const Sidebar: React.FC<SidebarProps> = ({ activeView }) => {
  return (
    <div className="h-full w-full flex flex-col">
      <header className="p-2.5 text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)]">
        {getHeaderText(activeView)}
      </header>      
      <div className="flex-grow overflow-auto">
        {activeView === 'files' && <FileExplorer />}
        {activeView === 'ai' && <AIPanel />}
        {activeView === 'snippets' && <SnippetsPanel />}
        {activeView === 'settings' && <SettingsPanel />}
      </div>
    </div>
  );
};

export default Sidebar;