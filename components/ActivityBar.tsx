import React from 'react';
import { ViewType } from '../hooks/useLayout';
import { FileIcon, GeminiIcon, SettingsIcon, TerminalIcon, SnippetIcon } from './icons';

interface ActivityBarProps {
  activeView: ViewType;
  onAction: (view: ViewType) => void;
  isTerminalCollapsed: boolean;
  onToggleTerminal: () => void;
}

const ActivityBar: React.FC<ActivityBarProps> = ({ activeView, onAction, isTerminalCollapsed, onToggleTerminal }) => {
  const views: { id: ViewType; icon: React.ReactNode, name: string }[] = [
    { id: 'files', icon: <FileIcon />, name: 'Explorer' },
    { id: 'ai', icon: <GeminiIcon />, name: 'Gemini AI' },
    { id: 'snippets', icon: <SnippetIcon />, name: 'Snippets' },
    { id: 'settings', icon: <SettingsIcon />, name: 'Settings' },
  ];

  return (
    <div className="w-12 h-full bg-[var(--color-bg-tertiary)] flex flex-col items-center justify-between py-2">
      <div>
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => onAction(view.id)}
            className={`w-full p-3 my-1 relative flex items-center justify-center ${
              activeView === view.id ? 'text-[var(--color-text-accent)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-accent)]'
            }`}
            title={view.name}
            aria-label={view.name}
          >
            {activeView === view.id && (
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--color-text-accent)]"></div>
            )}
            {view.icon}
          </button>
        ))}
      </div>
      <div>
         <button
            onClick={onToggleTerminal}
            className={`w-full p-3 my-1 relative flex items-center justify-center ${
              !isTerminalCollapsed ? 'text-[var(--color-text-accent)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-accent)]'
            }`}
            title="Terminal"
            aria-label="Toggle Terminal"
          >
           <TerminalIcon />
        </button>
      </div>
    </div>
  );
};

export default ActivityBar;