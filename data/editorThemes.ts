import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { githubLight } from '@uiw/codemirror-theme-github';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { solarizedDark, solarizedLight } from '@uiw/codemirror-theme-solarized';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { nord } from '@uiw/codemirror-theme-nord';
import { Extension } from '@codemirror/state';

export interface EditorTheme {
  name: string;
  theme: Extension;
}

export const availableEditorThemes: EditorTheme[] = [
  { name: 'VS Code Dark', theme: vscodeDark },
  { name: 'GitHub Light', theme: githubLight },
  { name: 'Dracula', theme: dracula },
  { name: 'Solarized Dark', theme: solarizedDark },
  { name: 'Solarized Light', theme: solarizedLight },
  { name: 'Okaidia', theme: okaidia },
  { name: 'Nord', theme: nord },
];