
import { TerminalCommand } from './Command';
import { Path } from '../Path';
import { FileSystemContextType } from '../../types';
import { findNodeByPath } from './utils';

export class TouchCommand implements TerminalCommand {
    constructor(
        private currentPath: Path,
        private fileSystem: FileSystemContextType,
        private args: string[]
    ) {}

    public execute() {
        const pathStr = this.args[0];
        if (!pathStr) {
            return { output: 'touch: missing file operand' };
        }

        const lastSlashIndex = pathStr.lastIndexOf('/');
        const parentPathStr = lastSlashIndex === -1 ? '.' : pathStr.substring(0, lastSlashIndex);
        const newFileName = pathStr.substring(lastSlashIndex + 1);

        if (!newFileName) {
            return { output: `touch: invalid file name` };
        }

        const targetDir = this.currentPath.resolve(parentPathStr, (p) => findNodeByPath(this.fileSystem.root, new Path(p)));
        
        if (targetDir) {
            const parentNode = findNodeByPath(this.fileSystem.root, targetDir);
            if (parentNode?.type === 'folder') {
                const fileExists = parentNode.children.some(child => child.name === newFileName);
                if (!fileExists) {
                    this.fileSystem.createNode('file', newFileName, parentNode.id);
                }
                return { output: '' }; // On unix, touch updates timestamp. Here, if file exists, we do nothing.
            }
            if (parentNode) {
                return { output: `touch: ${parentPathStr}: Not a directory` };
            }
        }
        
        return { output: `touch: ${parentPathStr}: No such file or directory` };
    }
}
