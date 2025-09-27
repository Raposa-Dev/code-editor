
import { FileSystemNode } from '../types';

export class Path {
    private readonly segments: readonly string[];

    constructor(segments: readonly string[] = []) {
        this.segments = Object.freeze([...segments]);
    }

    public getSegments(): readonly string[] {
        return this.segments;
    }

    public toString(): string {
        const pathString = this.segments.join('/');
        return `~/${pathString || ''}`;
    }

    public static root(): Path {
        return new Path([]);
    }

    public resolve(rawPath: string, findNodeByPath: (path: string[]) => FileSystemNode | undefined): Path | null {
        if (!rawPath || rawPath === '.') {
            return this;
        }
        if (rawPath === '~' || rawPath === '/') {
            return Path.root();
        }

        const inputSegments = rawPath.split('/').filter(s => s && s !== '.');
        let newSegments: string[] = rawPath.startsWith('/') ? [] : [...this.segments];

        for (const segment of inputSegments) {
            if (segment === '..') {
                if (newSegments.length > 0) {
                    newSegments.pop();
                }
            } else {
                newSegments.push(segment);
            }
        }
        
        // Validate the final path exists
        const node = findNodeByPath(newSegments);
        return node ? new Path(newSegments) : null;
    }
}
