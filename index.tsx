import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './hooks/useTheme';
import { SnippetsProvider } from './hooks/useSnippets';
import { FileSystemProvider } from './hooks/useFileSystem';
import { AIStatusProvider } from './hooks/useAIStatus';
import { EditorStatusProvider } from './hooks/useEditorStatus';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <SnippetsProvider>
        <AIStatusProvider>
          <EditorStatusProvider>
            <FileSystemProvider>
              <App />
            </FileSystemProvider>
          </EditorStatusProvider>
        </AIStatusProvider>
      </SnippetsProvider>
    </ThemeProvider>
  </React.StrictMode>
);