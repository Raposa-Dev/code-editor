import React, { useState } from 'react';
import { useSnippets } from '../hooks/useSnippets';
import { TrashIcon } from './icons';

const SnippetsPanel: React.FC = () => {
    const { snippets, addSnippet, deleteSnippet } = useSnippets();
    const [prefix, setPrefix] = useState('');
    const [label, setLabel] = useState('');
    const [body, setBody] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!prefix.trim() || !label.trim() || !body.trim()) {
            alert('All fields are required.');
            return;
        }
        addSnippet({ prefix, label, body });
        setPrefix('');
        setLabel('');
        setBody('');
    };

    return (
        <div className="p-4 text-[var(--color-text-primary)] h-full flex flex-col space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2">New Snippet</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="text-xs text-[var(--color-text-secondary)]">Prefix</label>
                        <input
                            type="text"
                            value={prefix}
                            onChange={(e) => setPrefix(e.target.value)}
                            placeholder="e.g., 'clog'"
                            className="w-full p-2 bg-[var(--color-bg-tertiary)] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-bg-accent)]"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-[var(--color-text-secondary)]">Label</label>
                        <input
                            type="text"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            placeholder="e.g., 'Console Log'"
                            className="w-full p-2 bg-[var(--color-bg-tertiary)] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-bg-accent)]"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-[var(--color-text-secondary)]">Body</label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="console.log($1);"
                            rows={4}
                            className="w-full p-2 bg-[var(--color-bg-tertiary)] rounded-md text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[var(--color-bg-accent)]"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[var(--color-bg-accent)] hover:bg-[var(--color-bg-accent-hover)] text-[var(--color-text-accent)] font-bold py-2 px-4 rounded"
                    >
                        Add Snippet
                    </button>
                </form>
            </div>

            <div className="flex-grow flex flex-col min-h-0">
                <h3 className="text-lg font-semibold mb-2 flex-shrink-0">Saved Snippets</h3>
                <div className="overflow-y-auto flex-grow">
                    {snippets.length === 0 ? (
                        <p className="text-sm text-[var(--color-text-secondary)]">No snippets saved.</p>
                    ) : (
                        <ul className="space-y-2">
                            {snippets.map(snippet => (
                                <li key={snippet.id} className="p-2 bg-[var(--color-bg-tertiary)] rounded-md flex justify-between items-center">
                                    <div>
                                        <p className="font-mono font-bold text-sm">{snippet.prefix}</p>
                                        <p className="text-xs text-[var(--color-text-secondary)]">{snippet.label}</p>
                                    </div>
                                    <button onClick={() => deleteSnippet(snippet.id)} className="p-1 hover:text-[var(--color-status-danger)]">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SnippetsPanel;
