import type { Style } from '@dicebear/core';
import yargs from 'yargs';
import chalk from 'chalk';

import { getStyleCommandOptions } from './getStyleCommandOptions.js';
import { handleStyleCommand } from './handleStyleCommand.js';

export function addStyleCommand(
  cli: yargs.Argv<{}>,
  name: string,
  style: Style,
) {
  const options = getStyleCommandOptions(style);

  return cli.command({
    command: `${name} [outputPath]`,
    describe: `Generate "${name}" avatar(s)`,
    builder: (yargs) => {
      return yargs
        .default('outputPath', '.')
        .options(options);
    },
    handler: async (argv) => {
      try {
        await handleStyleCommand(argv, name, style);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        console.error(chalk.red(`\nError: ${message}`));
        process.exit(1);
      }
    },
  });
}
