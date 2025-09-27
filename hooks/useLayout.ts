

import { useState, useCallback } from 'react';
import { TERMINAL_HEADER_HEIGHT } from '../utils/constants';

export type ViewType = 'files' | 'ai' | 'settings' | 'snippets';
type ResizingType = 'sidebar' | 'terminal' | null;

export const useLayout = () => {
    const [activeView, setActiveView] = useState<ViewType>('files');
    const [sidebarWidth, setSidebarWidth] = useState(250);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [terminalHeight, setTerminalHeight] = useState(200);
    const [isTerminalCollapsed, setIsTerminalCollapsed] = useState(false);
    const [resizingType, setResizingType] = useState<ResizingType>(null);

    const handleSidebarResize = useCallback((event: MouseEvent) => {
        const newWidth = event.clientX;
        if (newWidth > 200 && newWidth < 500) {
            setSidebarWidth(newWidth);
        }
    }, []);

    const handleTerminalResize = useCallback((event: MouseEvent) => {
        const newHeight = window.innerHeight - event.clientY;
        if (newHeight > TERMINAL_HEADER_HEIGHT && newHeight < window.innerHeight / 2) {
            setTerminalHeight(newHeight);
        }
    }, []);

    const stopResizing = useCallback(() => {
        window.removeEventListener('mousemove', handleSidebarResize);
        window.removeEventListener('mousemove', handleTerminalResize);
        window.removeEventListener('mouseup', stopResizing);
        setResizingType(null);
    }, [handleSidebarResize, handleTerminalResize]);

    const startResizingSidebar = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        setResizingType('sidebar');
        window.addEventListener('mousemove', handleSidebarResize);
        window.addEventListener('mouseup', stopResizing);
    }, [handleSidebarResize, stopResizing]);

    const startResizingTerminal = useCallback((event: React.MouseEvent) => {
        if (isTerminalCollapsed) return;
        event.preventDefault();
        setResizingType('terminal');
        window.addEventListener('mousemove', handleTerminalResize);
        window.addEventListener('mouseup', stopResizing);
    }, [handleTerminalResize, stopResizing, isTerminalCollapsed]);

    const handleActivityBarAction = useCallback((view: ViewType) => {
        if (isSidebarCollapsed) {
            setIsSidebarCollapsed(false);
            setActiveView(view);
        } else if (activeView === view) {
            setIsSidebarCollapsed(true);
        } else {
            setActiveView(view);
        }
    }, [activeView, isSidebarCollapsed]);

    const toggleTerminal = useCallback(() => {
        setIsTerminalCollapsed(previousState => !previousState);
    }, []);

    return {
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
    };
};