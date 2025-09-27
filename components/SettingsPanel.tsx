
import React, { useState, useEffect } from 'react';
import { getApiKey, setApiKey } from '../utils/apiKeyStore';
import { useTheme } from '../hooks/useTheme';
import { themes } from '../data/themes';

const SettingsPanel: React.FC = () => {
    const [apiKey, setApiKeyValue] = useState('');
    const [isKeySet, setIsKeySet] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const { theme, setTheme, editorTheme, setEditorTheme, availableEditorThemes } = useTheme();


    useEffect(() => {
        const currentKey = getApiKey();
        if (currentKey) {
            setIsKeySet(true);
        }
    }, []);

    const handleSave = () => {
        if (!apiKey) {
            setStatusMessage('API Key cannot be empty.');
            return;
        }
        setApiKey(apiKey);
        setIsKeySet(true);
        setApiKeyValue(''); // Clear the input after saving
        setStatusMessage('API Key saved successfully!');
        setTimeout(() => setStatusMessage(''), 3000); // Clear message after 3 seconds
    };
    
    const handleRemove = () => {
        setApiKey(''); // Set to empty string to remove
        setIsKeySet(false);
        setStatusMessage('API Key removed.');
        setTimeout(() => setStatusMessage(''), 3000);
    };

    return (
        <div className="p-4 text-[var(--color-text-primary)] space-y-8">
            <div>
                <h3 className="text-lg font-semibold mb-2">Gemini API Key</h3>
                <p className="text-xs text-[var(--color-text-secondary)] mb-4">
                    Your API key is stored locally in your browser and is never sent to our servers.
                </p>

                {isKeySet ? (
                    <div className="bg-[var(--color-bg-tertiary)] p-3 rounded-md">
                        <p className="text-sm text-[var(--color-status-success)] mb-2">API Key is configured.</p>
                         <button
                            onClick={handleRemove}
                            style={{ backgroundColor: 'var(--color-status-danger)', color: 'var(--color-text-accent)' }}
                            className="w-full font-bold py-2 px-4 rounded"
                        >
                            Remove Key
                        </button>
                    </div>
                ) : (
                     <div>
                        <label htmlFor="apiKey" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                            Enter your key:
                        </label>
                        <input
                            id="apiKey"
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKeyValue(e.target.value)}
                            placeholder="Enter your Gemini API Key"
                            className="w-full p-2 bg-[var(--color-bg-primary)] rounded-md text-sm mb-4 focus:outline-none focus:ring-2 ring-[var(--color-bg-accent)]"
                        />
                        <button
                            onClick={handleSave}
                            className="w-full bg-[var(--color-bg-accent)] hover:bg-[var(--color-bg-accent-hover)] text-[var(--color-text-accent)] font-bold py-2 px-4 rounded"
                        >
                            Save Key
                        </button>
                     </div>
                )}
                
                {statusMessage && (
                    <p className={`text-sm mt-4 ${statusMessage.includes('successfully') ? 'text-[var(--color-status-success)]' : 'text-[var(--color-status-warning)]'}`}>
                        {statusMessage}
                    </p>
                )}
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">UI Theme</h3>
                <p className="text-xs text-[var(--color-text-secondary)] mb-4">
                   Select a color theme for the IDE interface.
                </p>
                <select
                    value={theme.name}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full p-2 bg-[var(--color-bg-primary)] rounded-md text-sm focus:outline-none focus:ring-2 ring-[var(--color-bg-accent)] border border-[var(--color-border-primary)]"
                >
                    {themes.map(t => (
                        <option key={t.name} value={t.name}>{t.name}</option>
                    ))}
                </select>
            </div>
             <div>
                <h3 className="text-lg font-semibold mb-2">Editor Syntax Highlighting</h3>
                <p className="text-xs text-[var(--color-text-secondary)] mb-4">
                   Select a theme for the code editor.
                </p>
                <select
                    value={editorTheme.name}
                    onChange={(e) => setEditorTheme(e.target.value)}
                    className="w-full p-2 bg-[var(--color-bg-primary)] rounded-md text-sm focus:outline-none focus:ring-2 ring-[var(--color-bg-accent)] border border-[var(--color-border-primary)]"
                >
                    {availableEditorThemes.map(t => (
                        <option key={t.name} value={t.name}>{t.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default SettingsPanel;