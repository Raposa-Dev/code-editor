
import { TerminalCommand } from './Command';
import { Path } from '../Path';
import { Folder } from '../../types';
import { findNodeByPath } from './utils';

export class LsCommand implements TerminalCommand {
    constructor(
        private currentPath: Path,
        private root: Folder,
        private args: string[]
    ) {}

    public execute() {
        const targetPathStr = this.args[0] || '.';
        
        const targetPath = this.currentPath.resolve(targetPathStr, (p) => findNodeByPath(this.root, new Path(p)));

        if (targetPath) {
            const node = findNodeByPath(this.root, targetPath);
            if (node?.type === 'folder') {
                const output = node.children.map(child =>
                    child.type === 'folder' 
                        ? `\x1b[1;34m${child.name}\x1b[0m` // Blue for folders
                        : child.name
                ).join('\n');
                return { output };
            }
            if (node) {
                return { output: node.name }; // ls on a file shows its name
            }
        }

        return { output: `ls: ${targetPathStr}: No such file or directory` };
    }
}
