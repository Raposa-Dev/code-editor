
import { TerminalCommand } from './Command';

export class ClearCommand implements TerminalCommand {
    public execute() {
        // ANSI escape code to clear screen and move cursor to top-left
        return { output: '\x1b[2J\x1b[H' };
    }
}
