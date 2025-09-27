
import { TerminalCommand } from './Command';
import { Path } from '../Path';

export class PwdCommand implements TerminalCommand {
    constructor(private currentPath: Path) {}

    public execute() {
        return { output: `/${this.currentPath.getSegments().join('/')}` };
    }
}
