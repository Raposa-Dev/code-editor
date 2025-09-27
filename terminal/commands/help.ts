
import { TerminalCommand } from './Command';

export class HelpCommand implements TerminalCommand {
    public execute() {
        const output = [
            'Available commands:',
            '  cd [path]   - Change directory',
            '  ls [path]   - List directory contents',
            '  cat [file]  - Display file content',
            '  touch [file]- Create a new empty file',
            '  rm [path]   - Remove a file or directory',
            '  pwd         - Print working directory',
            '  clear       - Clear the terminal screen',
            '  help        - Show this help message',
        ].join('\n');
        
        return { output };
    }
}
