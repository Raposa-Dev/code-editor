
export class DirtyFileTracker {
    private readonly dirtyIds: Set<string>;

    constructor(initialIds: Set<string> = new Set()) {
        this.dirtyIds = new Set(initialIds);
    }

    public isDirty(fileId: string): boolean {
        return this.dirtyIds.has(fileId);
    }

    public getDirtyIds(): Set<string> {
        return this.dirtyIds;
    }

    public markDirty(fileId: string): DirtyFileTracker {
        const newIds = new Set(this.dirtyIds);
        newIds.add(fileId);
        return new DirtyFileTracker(newIds);
    }

    public markClean(fileId: string): DirtyFileTracker {
        const newIds = new Set(this.dirtyIds);
        newIds.delete(fileId);
        return new DirtyFileTracker(newIds);
    }
    
    public clearForFile(fileId: string): DirtyFileTracker {
        return this.markClean(fileId);
    }
}
