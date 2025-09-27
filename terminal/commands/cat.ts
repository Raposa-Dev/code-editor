
import { TerminalCommand } from './Command';
import { Path } from '../Path';
import { Folder } from '../../types';
import { findNodeByPath } from './utils';

export class CatCommand implements TerminalCommand {
    constructor(
        private currentPath: Path,
        private root: Folder,
        private args: string[]
    ) {}

    public execute() {
        const filePathStr = this.args[0];
        if (!filePathStr) {
            return { output: 'cat: missing file operand' };
        }

        const filePath = this.currentPath.resolve(filePathStr, (p) => findNodeByPath(this.root, new Path(p)));

        if (filePath) {
            const file = findNodeByPath(this.root, filePath);
            if (file?.type === 'file') {
                return { output: file.content };
            }
            if (file?.type === 'folder') {
                return { output: `cat: ${filePathStr}: Is a directory` };
            }
        }
        
        return { output: `cat: ${filePathStr}: No such file or directory` };
    }
}
