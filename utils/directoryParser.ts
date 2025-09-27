
import { File, Folder, FileSystemNode } from '../types';

export async function parseFileInputToFSTree(files: FileList): Promise<Folder | null> {
    if (files.length === 0) return null;

    const firstPath = files[0].webkitRelativePath;
    const rootName = firstPath.split('/')[0] || 'Imported Project';

    const root: Folder = {
        id: 'root',
        name: rootName,
        type: 'folder',
        parentId: null,
        children: []
    };

    const fileReadPromises: Promise<void>[] = [];

    for (const file of Array.from(files)) {
        // @ts-ignore
        const pathSegments = file.webkitRelativePath.split('/');
        let currentNode: Folder = root;

        for (let i = 1; i < pathSegments.length - 1; i++) {
            const segment = pathSegments[i];
            let nextNode = currentNode.children.find(c => c.name === segment && c.type === 'folder') as Folder;
            if (!nextNode) {
                nextNode = {
                    id: crypto.randomUUID(),
                    name: segment,
                    type: 'folder',
                    parentId: currentNode.id,
                    children: []
                };
                currentNode.children.push(nextNode);
            }
            currentNode = nextNode;
        }

        const fileName = pathSegments[pathSegments.length - 1];
        if (fileName) {
            const fileNode: File = {
                id: crypto.randomUUID(),
                name: fileName,
                type: 'file',
                content: '',
                parentId: currentNode.id
            };
            currentNode.children.push(fileNode);

            const promise = file.text()
                .then(content => { fileNode.content = content; })
                .catch(err => {
                    console.error(`Could not read file ${file.name}:`, err);
                    fileNode.content = "Error: Could not read file content.";
                });
            fileReadPromises.push(promise);
        }
    }
    
    await Promise.all(fileReadPromises);

    const sortChildrenRecursive = (node: FileSystemNode) => {
        if (node.type === 'folder') {
            node.children.sort((a, b) => {
                if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
                return a.name.localeCompare(b.name);
            });
            node.children.forEach(sortChildrenRecursive);
        }
    };
    sortChildrenRecursive(root);

    return root;
}
