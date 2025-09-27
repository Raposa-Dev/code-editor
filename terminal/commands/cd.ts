
import { TerminalCommand } from './Command';
import { Path } from '../Path';
import { Folder } from '../../types';
import { findNodeByPath } from './utils';

export class CdCommand implements TerminalCommand {
    constructor(
        private currentPath: Path,
        private root: Folder,
        private args: string[]
    ) {}

    public execute() {
        const targetPathStr = this.args[0] || '~';
        
        const newPath = this.currentPath.resolve(targetPathStr, (p) => findNodeByPath(this.root, new Path(p)));

        if (newPath) {
            const node = findNodeByPath(this.root, newPath);
            if (node?.type === 'folder') {
                return { output: '', newPath };
            }
            return { output: `cd: ${targetPathStr}: Not a directory` };
        }
        
        return { output: `cd: ${targetPathStr}: No such file or directory` };
    }
}
