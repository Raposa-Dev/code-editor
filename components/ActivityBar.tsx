import React from 'react';
import Icon from './Icon';

interface ActivityBarProps {
  isSidebarVisible: boolean;
  toggleSidebar: () => void;
  isAIPanelVisible: boolean;
  toggleAIPanel: () => void;
}

const ActivityBarButton: React.FC<{
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
    ariaLabel: string;
}> = ({ onClick, isActive, children, ariaLabel }) => (
    <button
        onClick={onClick}
        aria-label={ariaLabel}
        aria-pressed={isActive}
        className={`w-full p-3 flex justify-center items-center relative transition-colors duration-200 ${
        isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
        }`}
    >
        {children}
        {isActive && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500"></div>}
    </button>
);

const ActivityBar: React.FC<ActivityBarProps> = ({ isSidebarVisible, toggleSidebar, isAIPanelVisible, toggleAIPanel }) => {
  return (
    <nav className="w-12 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-2 space-y-2">
        <ActivityBarButton onClick={toggleSidebar} isActive={isSidebarVisible} ariaLabel="Toggle File Explorer">
            <Icon name="files" className="w-6 h-6" />
        </ActivityBarButton>
        <div className="flex-grow" />
        <ActivityBarButton onClick={toggleAIPanel} isActive={isAIPanelVisible} ariaLabel="Toggle AI Panel">
            <Icon name="layout-sidebar-right" className="w-6 h-6" />
        </ActivityBarButton>
    </nav>
  );
};

export default ActivityBar;
