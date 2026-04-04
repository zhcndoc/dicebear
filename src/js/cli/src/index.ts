import updateNotifier from 'update-notifier';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';

import { getPackageJson } from './utils/getPackageJson.js';
import { addStyleCommand } from './utils/addStyleCommand.js';
import { loadStyles } from './utils/loadStyles.js';
import { loadDefinition } from './utils/loadDefinition.js';
import { handleStyleCommand } from './utils/handleStyleCommand.js';
import { getStyleCommandOptions } from './utils/getStyleCommandOptions.js';

(async () => {
  const pkg = await getPackageJson();
  updateNotifier({ pkg }).notify();

  const cli = yargs(hideBin(process.argv));
  const styles = loadStyles();

  for (const [name, style] of styles) {
    addStyleCommand(cli, name, style);
  }

  cli.command({
    command: '* <definition> [outputPath]',
    describe: false,
    builder: (yargs) => {
      const args = hideBin(process.argv);
      const filePath = args[0];

      let options = {};

      if (filePath) {
        try {
          const { style } = loadDefinition(filePath);
          options = getStyleCommandOptions(style);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);

          console.error(chalk.red(`\nError: ${message}`));
          process.exit(1);
        }
      }

      return yargs
        .default('outputPath', '.')
        .options(options);
    },
    handler: async (argv) => {
      try {
        const { style, name } = loadDefinition(argv.definition as string);

        await handleStyleCommand(argv, name, style);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error);

        console.error(chalk.red(`\nError: ${message}`));
        process.exit(1);
      }
    },
  });

  cli.demandCommand().help().locale('en').parse();
})();
