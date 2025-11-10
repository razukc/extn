/**
 * Commander.js program setup
 * Configures CLI commands and options
 */

import { Command } from 'commander';
import { createCommand } from '../commands/create.js';

/**
 * Create and configure the CLI program
 */
export function createProgram(): Command {
  const program = new Command();

  program
    .name('extn')
    .description('CLI for building Chrome extensions')
    .version('0.1.0');

  // Create command
  program
    .command('create <project-name>')
    .description('Create a new Chrome extension project')
    .option('-t, --template <name>', 'Template to use', 'vanilla')
    .option('-d, --directory <path>', 'Target directory')
    .action(async (projectName: string, options: any) => {
      await createCommand(projectName, options);
    });

  return program;
}
