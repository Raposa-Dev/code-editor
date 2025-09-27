
import { TerminalCommand } from './Command';
import { Path } from '../Path';
import { FileSystemContextType } from '../../types';
import { findNodeByPath } from './utils';

export class RmCommand implements TerminalCommand {
    constructor(
        private currentPath: Path,
        private fileSystem: FileSystemContextType,
        private args: string[]
    ) {}

    public execute() {
        const targetPathStr = this.args[0];
        if (!targetPathStr) {
            return { output: 'rm: missing operand' };
        }

        const targetPath = this.currentPath.resolve(targetPathStr, (p) => findNodeByPath(this.fileSystem.root, new Path(p)));
        
        if (targetPath) {
            const node = findNodeByPath(this.fileSystem.root, targetPath);
            if (node?.parentId) { // Cannot remove root
                this.fileSystem.deleteNode(node.id);
                return { output: '' };
            }
            if (node) {
                return { output: `rm: ${targetPathStr}: Operation not permitted` };
            }
        }
        
        return { output: `rm: ${targetPathStr}: No such file or directory` };
    }
}
