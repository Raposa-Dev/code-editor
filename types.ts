
export type FileNodeType = 'file' | 'folder';

export interface FileNode {
  id: string;
  name: string;
  type: FileNodeType;
  children?: FileNode[];
}

export enum AIAction {
  ANALYZE = 'ANALYZE',
  REFACTOR = 'REFACTOR',
  GENERATE = 'GENERATE',
  CHAT = 'CHAT',
}
