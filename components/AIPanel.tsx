
import React, { useState } from 'react';
import { AIAction } from '../types';
import Icon from './Icon';

interface AIPanelProps {
  onAskAI: (action: AIAction, prompt: string) => void;
  aiOutput: string;
  isLoading: boolean;
}

const AIPanel: React.FC<AIPanelProps> = ({ onAskAI, aiOutput, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onAskAI(AIAction.CHAT, prompt);
      setPrompt('');
    }
  };

  const handleActionClick = (action: AIAction, actionPrompt?: string) => {
    onAskAI(action, actionPrompt || 'Perform the selected action on the current code.');
  };

  return (
    <div className="w-96 bg-gray-800 flex flex-col h-full border-l border-gray-700">
      <div className="p-4 border-b border-gray-700 flex items-center">
        <Icon name="sparkles" className="w-6 h-6 text-purple-400 mr-2" />
        <h2 className="text-lg font-bold text-gray-200">MCP AI Assistant</h2>
      </div>

      <div className="flex-1 p-4 overflow-y-auto text-sm text-gray-300 space-y-4">
        {isLoading && aiOutput === '' && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Icon name="spinner" className="w-8 h-8 mb-2" />
            <p>MCP is thinking...</p>
          </div>
        )}
        {aiOutput ? (
            <pre className="whitespace-pre-wrap font-mono bg-gray-900 p-3 rounded-md">{aiOutput}</pre>
        ) : (
            !isLoading && <p className="text-gray-500 text-center mt-8">Select an action or ask me anything about your code.</p>
        )}
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="grid grid-cols-2 gap-2 mb-4">
            <button onClick={() => handleActionClick(AIAction.ANALYZE)} className="bg-gray-700 hover:bg-gray-600 text-sm p-2 rounded-md transition-colors">Analyze Code</button>
            <button onClick={() => handleActionClick(AIAction.REFACTOR)} className="bg-gray-700 hover:bg-gray-600 text-sm p-2 rounded-md transition-colors">Refactor Code</button>
        </div>
        <form onSubmit={handlePromptSubmit}>
          <div className="flex items-center bg-gray-900 rounded-md">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask MCP or describe code to generate..."
              className="w-full bg-transparent p-3 text-sm outline-none"
              disabled={isLoading}
            />
            <button type="submit" className="p-3 text-gray-400 hover:text-white" disabled={isLoading}>
              <Icon name="send" className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIPanel;
