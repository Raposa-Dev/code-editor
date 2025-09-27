
import { Path } from '../Path';

export interface TerminalCommand {
    execute(): {
        output: string;
        newPath?: Path;
    };
}
