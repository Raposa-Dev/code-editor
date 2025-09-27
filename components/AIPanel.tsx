

import React, { useState } from 'react';
import { useFileSystem } from '../hooks/useFileSystem';
import { generateCode } from '../services/geminiService';
import { useAIStatus } from '../hooks/useAIStatus';

const AIPanel: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const { status: aiStatus, setStatus: setAIStatus } = useAIStatus();
    const isLoading = aiStatus === 'loading';
    const { activeFileId, findNodeById } = useFileSystem();

    const handleSubmit = async () => {
        const activeFile = activeFileId ? findNodeById(activeFileId) : null;
        if (!prompt) {
            setResponse("Please enter a prompt.");
            return;
        }
        if (!activeFile || activeFile.type !== 'file') {
            setResponse("Please open a file to provide context for the AI.");
            return;
        }

        setAIStatus('loading');
        setResponse('');

        try {
            const fullPrompt = `
Context: You are acting as an AI programming assistant integrated into a code editor.
The user is currently working on a file named "${activeFile.name}".

User's request: "${prompt}"

Here is the full content of the file:
\`\`\`
${activeFile.content}
\`\`\`

Please provide a helpful response. If you are generating code, please provide only the code block.
            `;
            const result = await generateCode(fullPrompt);
            setResponse(result);
            setAIStatus('idle');
        } catch (error) {
            console.error('Gemini API error:', error);
            let errorMessage = 'An error occurred while communicating with the Gemini API.';
            if (error instanceof Error && error.message.includes("API_KEY_NOT_SET")) {
                errorMessage = "Gemini API key not found. Please set it in the Settings panel (the key icon on the left).";
            }
             setResponse(errorMessage);
             setAIStatus('error', errorMessage);
        }
    };

    return (
        <div className="p-4 text-[var(--color-text-primary)] h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-2">AI Assistant</h3>
            <p className="text-xs text-[var(--color-text-secondary)] mb-4">
                Enter a prompt to generate, refactor, or get help with your code. The content of your currently active file will be used as context.
            </p>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'Refactor this function to use async/await'"
                className="w-full h-24 p-2 bg-[var(--color-bg-tertiary)] rounded-md text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-bg-accent)]"
                disabled={isLoading}
            />
            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-[var(--color-bg-accent)] hover:bg-[var(--color-bg-accent-hover)] text-white font-bold py-2 px-4 rounded disabled:bg-[var(--color-bg-tertiary)] disabled:bg-opacity-50"
            >
                {isLoading ? 'Generating...' : 'Ask Gemini'}
            </button>
            <div className="mt-4 flex-grow overflow-auto bg-[var(--color-bg-primary)] rounded-md p-2">
                <h4 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Response:</h4>
                {isLoading ? (
                     <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-bg-accent)]"></div>
                     </div>
                ) : (
                    <pre className="text-xs whitespace-pre-wrap font-mono">{response}</pre>
                )}
            </div>
        </div>
    );
};

export default AIPanel;