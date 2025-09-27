import { FileSystemContextType } from '../types';
// FIX: Changed import for TerminalCommand to use the correct definition and resolve import errors.
import { TerminalCommand } from './commands/Command';
import { Path } from './Path';
import { LsCommand } from './commands/ls';
import { CdCommand } from './commands/cd';
import { PwdCommand } from './commands/pwd';
import { HelpCommand } from './commands/help';
import { ClearCommand } from './commands/clear';
import { CatCommand } from './commands/cat';
import { TouchCommand } from './commands/touch';
import { RmCommand } from './commands/rm';

class UnknownCommand implements TerminalCommand {
    constructor(private commandName: string) {}

    public execute() {
        return { output: `${this.commandName}: command not found` };
    }
}

export class CommandFactory {
    public static create(
        input: string,
        currentPath: Path,
        fileSystem: FileSystemContextType
    ): TerminalCommand {
        const [commandName, ...args] = input.trim().split(' ').filter(Boolean);

        if (!commandName) {
            // Returns a command that does nothing, for empty input.
            return { execute: () => ({ output: '' }) };
        }

        switch (commandName) {
            case 'ls':
                return new LsCommand(currentPath, fileSystem.root, args);
            case 'cd':
                return new CdCommand(currentPath, fileSystem.root, args);
            case 'pwd':
                return new PwdCommand(currentPath);
            case 'help':
                return new HelpCommand();
            case 'clear':
                return new ClearCommand();
            case 'cat':
                return new CatCommand(currentPath, fileSystem.root, args);
            case 'touch':
                return new TouchCommand(currentPath, fileSystem, args);
            case 'rm':
                return new RmCommand(currentPath, fileSystem, args);
            default:
                return new UnknownCommand(commandName);
        }
    }
}
