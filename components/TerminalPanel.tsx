

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { useFileSystem } from '../hooks/useFileSystem';
import { useTheme } from '../hooks/useTheme';
import { ChevronDownIcon, ChevronUpIcon } from './icons';
import { CommandFactory } from '../terminal/CommandFactory';
import { TERMINAL_HEADER_HEIGHT } from '../utils/constants';
import { Path } from '../terminal/Path';

interface TerminalPanelProps {
    height: number;
    isCollapsed: boolean;
    onToggle: () => void;
    onResizeStart: (event: React.MouseEvent) => void;
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({ height, isCollapsed, onToggle, onResizeStart }) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const terminalInstance = useRef<Terminal | null>(null);
    const fitAddon = useRef<FitAddon | null>(null);
    const fileSystem = useFileSystem();
    const { theme } = useTheme();
    
    const [currentPath, setCurrentPath] = useState<Path>(Path.root());
    const commandHistory = useRef<string[]>([]);
    const historyIndex = useRef<number>(0);
    const currentCommand = useRef('');
    
    const getPrompt = useCallback(() => {
        const pathString = currentPath.toString();
        return `\x1b[1;32m${pathString}\x1b[0m $ `;
    }, [currentPath]);

    const executeCommand = useCallback((terminal: Terminal, command: string) => {
        const commandToExecute = command.trim();
        
        if (commandToExecute) {
            const commandInstance = CommandFactory.create(commandToExecute, currentPath, fileSystem);
            const result = commandInstance.execute();
            
            if (result.output) {
                terminal.write(result.output.replace(/\n/g, '\r\n'));
            }
            if (result.newPath) {
                setCurrentPath(result.newPath);
            }

            const newHistory = [...commandHistory.current.filter(c => c !== commandToExecute), commandToExecute];
            commandHistory.current = newHistory;
        }

        historyIndex.current = commandHistory.current.length;
        currentCommand.current = '';
    }, [currentPath, fileSystem]);
    
    const handleEnter = useCallback((terminal: Terminal) => {
        terminal.writeln('');
        executeCommand(terminal, currentCommand.current);
        terminal.write(`\r\n${getPrompt()}`);
    }, [executeCommand, getPrompt]);

    const handleArrowKey = useCallback((terminal: Terminal, direction: 'up' | 'down') => {
        const prompt = getPrompt();
        let newIndex: number;
        if (direction === 'up') {
            newIndex = Math.max(0, historyIndex.current - 1);
        } else {
            newIndex = Math.min(commandHistory.current.length, historyIndex.current + 1);
        }
        historyIndex.current = newIndex;
        
        const newCommand = commandHistory.current[newIndex] ?? '';
        terminal.write('\r' + prompt + ' '.repeat(currentCommand.current.length));
        terminal.write('\r' + prompt + newCommand);
        currentCommand.current = newCommand;
    }, [getPrompt]);

    useEffect(() => {
        if (!terminalRef.current) return;

        const terminal = terminalInstance.current ?? new Terminal({ cursorBlink: true, convertEol: true });
        if (!terminalInstance.current) { 
            const newFitAddon = new FitAddon();
            fitAddon.current = newFitAddon;
            terminal.loadAddon(newFitAddon);
            terminal.open(terminalRef.current);
            newFitAddon.fit();
            
            terminal.writeln('Welcome to Code-Gemini Terminal!');
            terminal.writeln('Type "help" for a list of commands.');
            terminal.write(getPrompt());
            
            terminal.onData((data) => {
                switch (data) {
                    case '\r': handleEnter(terminal); break; 
                    case '\u007F': 
                        if (currentCommand.current.length > 0) {
                            terminal.write('\b \b');
                            currentCommand.current = currentCommand.current.slice(0, -1);
                        }
                        break;
                    case '\x1b[A': handleArrowKey(terminal, 'up'); break;
                    case '\x1b[B': handleArrowKey(terminal, 'down'); break;
                    default:
                        if (data >= String.fromCharCode(0x20) || data === '\t') {
                            currentCommand.current += data;
                            terminal.write(data);
                        }
                }
            });
            terminalInstance.current = terminal;
        }

        const resizeObserver = new ResizeObserver(() => {
            window.requestAnimationFrame(() => fitAddon.current?.fit());
        });
        resizeObserver.observe(terminalRef.current);

        return () => resizeObserver.disconnect();
    }, [getPrompt, handleEnter, handleArrowKey]);

    useEffect(() => {
        if (terminalInstance.current) {
            terminalInstance.current.options.theme = {
                background: theme.colors['terminal-bg'],
                foreground: theme.colors['terminal-fg'],
            };
        }
    }, [theme]);

     useEffect(() => {
        if (!isCollapsed) {
            window.requestAnimationFrame(() => fitAddon.current?.fit());
        }
    }, [isCollapsed, height]);

    return (
        <div 
            style={{ height: isCollapsed ? `${TERMINAL_HEADER_HEIGHT}px` : `${height}px` }}
            className="flex-shrink-0 flex flex-col bg-[var(--color-bg-tertiary)]"
        >
            <div 
                onMouseDown={onResizeStart}
                className="flex-shrink-0 flex items-center px-3 cursor-row-resize border-t border-b border-[var(--color-border-primary)]"
                style={{ height: `${TERMINAL_HEADER_HEIGHT}px`}}
            >
                <span className="font-bold text-xs uppercase tracking-wider text-[var(--color-text-secondary)] flex-grow">
                    Terminal
                </span>
                <button 
                    onClick={onToggle} 
                    className="ml-auto p-1 rounded hover:bg-[var(--color-bg-secondary)]"
                    aria-label={isCollapsed ? "Restore terminal" : "Minimize terminal"}
                >
                    {isCollapsed ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </button>
            </div>
            
            <div className={`flex-grow w-full bg-[var(--color-terminal-bg)] ${isCollapsed ? 'hidden' : ''}`}>
                 <div ref={terminalRef} className="w-full h-full p-2" />
            </div>
        </div>
    );
};

export default TerminalPanel;