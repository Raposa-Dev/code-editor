
import { FileSystemNode, Folder } from '../../types';
import { Path } from '../Path';

export const findNodeByPath = (root: Folder, path: Path): FileSystemNode | undefined => {
    let currentNode: FileSystemNode = root;
    for (const segment of path.getSegments()) {
        if (currentNode.type === 'folder') {
            const found = currentNode.children.find(child => child.name === segment);
            if (!found) return undefined;
            currentNode = found;
        } else {
            return undefined; // Tried to traverse into a file
        }
    }
    return currentNode;
};
