import updateNotifier from 'update-notifier';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getPackageJson } from './utils/getPackageJson.js';
import { addStyleCommand } from './utils/addStyleCommand.js';
import { loadStyles } from './utils/loadStyles.js';

(async () => {
  const pkg = await getPackageJson();
  updateNotifier({ pkg }).notify();

  const cli = yargs(hideBin(process.argv));
  const styles = loadStyles();

  for (const [name, style] of styles) {
    addStyleCommand(cli, name, style);
  }

  cli.demandCommand().help().locale('en').parse();
})();
