
import { FileNode } from './types';

export const MOCK_FILE_TREE: FileNode[] = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: '2',
        name: 'components',
        type: 'folder',
        children: [
          { id: '3', name: 'Button.tsx', type: 'file' },
          { id: '4', name: 'Modal.tsx', type: 'file' },
        ],
      },
      {
        id: '5',
        name: 'services',
        type: 'folder',
        children: [{ id: '6', name: 'api.ts', type: 'file' }],
      },
      { id: '7', name: 'App.tsx', type: 'file' },
      { id: '8', name: 'index.tsx', type: 'file' },
    ],
  },
  { id: '9', name: 'package.json', type: 'file' },
  { id: '10', name: 'README.md', type: 'file' },
];

export const MOCK_FILE_CONTENTS: Record<string, string> = {
    '3': `import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = variant === 'primary' 
    ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500' 
    : 'bg-gray-600 text-gray-200 hover:bg-gray-700 focus:ring-gray-500';

  return (
    <button className={\`\${baseClasses} \${variantClasses}\`} {...props}>
      {children}
    </button>
  );
};

export default Button;`,
    '4': `import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;`,
    '6': `// Mock API service
// In a real app, this would contain fetch calls to a backend.

export const fetchUserData = async (userId: string) => {
  console.log(\`Fetching data for user \${userId}...\`);
  // Simulate network delay
  await new Promise(res => setTimeout(res, 500));
  return {
    id: userId,
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
  };
};`,
    '7': `import React from 'react';
    
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;`,
    '8': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
    '9': `{
  "name": "gemini-code-editor",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}`,
    '10': `# Gemini AI Code Editor
A minimalist, AI-powered code editor built with React and Tailwind CSS.`,
};
