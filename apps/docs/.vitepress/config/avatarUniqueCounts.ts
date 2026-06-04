import type { StyleDefinition } from '@dicebear/core';
import { createRequire } from 'node:module';
import * as path from 'node:path';
import * as fs from 'node:fs';

import type { AvatarUniqueCount } from '@theme/types';
import { computeCount } from '../theme/utils/avatar/combinationCount';

const require = createRequire(import.meta.url);

const definitionsDir = path.dirname(
  require.resolve('@dicebear/styles/initials.json'),
);

const avatarUniqueCounts: Record<string, AvatarUniqueCount> = {};

for (const file of fs.readdirSync(definitionsDir)) {
  if (!file.endsWith('.min.json')) {
    continue;
  }

  const name = file.replace('.min.json', '');
  const definition: StyleDefinition = JSON.parse(
    fs.readFileSync(path.join(definitionsDir, file), 'utf-8'),
  );

  avatarUniqueCounts[name] = computeCount(definition);
}

export default avatarUniqueCounts;
