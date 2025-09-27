import React, { useCallback, useMemo, useEffect } from 'react';
import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { autocompletion, CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import { File } from '../types';
import { useFileSystem } from '../hooks/useFileSystem';
import { useTheme } from '../hooks/useTheme';
import { useSnippets } from '../hooks/useSnippets';
import { useEditorStatus } from '../hooks/useEditorStatus';

const getLanguageExtension = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (['js', 'jsx', 'ts', 'tsx'].includes(extension || '')) {
        return [javascript({ jsx: true, typescript: true })];
    }
    return [javascript()];
};

interface CodeEditorProps {
    file: File;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ file }) => {
    const { updateFileContent, saveFile } = useFileSystem();
    const { editorTheme } = useTheme();
    const { snippets } = useSnippets();
    const { setCursorPosition } = useEditorStatus();

    const handleContentChange = useCallback((value: string) => {
        updateFileContent(file.id, value);
    }, [file.id, updateFileContent]);
    
    const handleViewUpdate = useCallback((viewUpdate: ViewUpdate) => {
        if (viewUpdate.selectionSet || viewUpdate.docChanged) {
            const { state } = viewUpdate;
            const selection = state.selection.main;
            const line = state.doc.lineAt(selection.head);
            const column = selection.head - line.from;
            setCursorPosition({ line: line.number, column: column + 1 });
        }
    }, [setCursorPosition]);

    useEffect(() => {
        const handleSaveShortcut = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault();
                saveFile(file.id);
            }
        };

        window.addEventListener('keydown', handleSaveShortcut);
        return () => {
            window.removeEventListener('keydown', handleSaveShortcut);
        };
    }, [file.id, saveFile]);

    const extensions = useMemo(() => {
        const snippetCompletionSource = (context: CompletionContext): CompletionResult | null => {
            const word = context.matchBefore(/\w*/);
            
            if (!word || (word.from === word.to && !context.explicit)) {
                return null;
            }

            const options = snippets
                .filter(snippet => snippet.prefix.startsWith(word.text))
                .map(snippet => ({
                    label: snippet.prefix,
                    apply: snippet.body,
                    type: 'snippet',
                    detail: snippet.label,
                }));

            if (options.length === 0) {
                return null;
            }

            return {
                from: word.from,
                options,
            };
        };

        return [
            ...getLanguageExtension(file.name),
            autocompletion({ override: [snippetCompletionSource] })
        ];
    }, [file.name, snippets]);

    return (
        <CodeMirror
            value={file.content}
            height="100%"
            style={{height: '100%'}}
            theme={editorTheme.theme}
            extensions={extensions}
            onChange={handleContentChange}
            onUpdate={handleViewUpdate}
        />
    );
};

export default CodeEditor;