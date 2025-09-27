

import React from 'react';
import Sidebar from './components/Sidebar';
import EditorPanel from './components/EditorPanel';
import ActivityBar from './components/ActivityBar';
import TerminalPanel from './components/TerminalPanel';
import StatusBar from './components/StatusBar';
import { useLayout } from './hooks/useLayout';

const App: React.FC = () => {
    const {
        activeView,
        sidebarWidth,
        isSidebarCollapsed,
        terminalHeight,
        isTerminalCollapsed,
        resizingType,
        handleActivityBarAction,
        toggleTerminal,
        startResizingSidebar,
        startResizingTerminal,
    } = useLayout();

    return (
        <div className="h-screen w-screen bg-[var(--color-bg-primary)] flex flex-col text-sm overflow-hidden text-[var(--color-text-primary)]">
            <div className="flex flex-grow min-h-0">
                <ActivityBar
                    activeView={activeView}
                    onAction={handleActivityBarAction}
                    isTerminalCollapsed={isTerminalCollapsed}
                    onToggleTerminal={toggleTerminal}
                />
                {!isSidebarCollapsed && (
                    <>
                        <div style={{ width: `${sidebarWidth}px` }} className="flex-shrink-0 bg-[var(--color-bg-secondary)]">
                            <Sidebar activeView={activeView} />
                        </div>
                        <div
                            onMouseDown={startResizingSidebar}
                            className="w-1 cursor-col-resize bg-[var(--color-border-primary)] hover:bg-[var(--color-bg-accent-hover)] transition-colors duration-200"
                        />
                    </>
                )}
                <div className="flex flex-col flex-grow min-w-0">
                    <div className="flex-grow min-h-0">
                        <EditorPanel />
                    </div>
                    <TerminalPanel
                        height={terminalHeight}
                        isCollapsed={isTerminalCollapsed}
                        onToggle={toggleTerminal}
                        onResizeStart={startResizingTerminal}
                    />
                </div>
                {resizingType && (
                    <div
                        className="absolute inset-0 z-50"
                        style={{ cursor: resizingType === 'sidebar' ? 'col-resize' : 'row-resize' }}
                    />
                )}
            </div>
            <StatusBar />
        </div>
    );
};

export default App;