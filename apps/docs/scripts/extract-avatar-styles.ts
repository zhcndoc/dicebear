/**
 * Extracts meta and schema from @dicebear/collection
 * and saves them as a static JSON file to avoid loading
 * the entire collection (with create functions) at runtime.
 *
 * Run: npx tsx scripts/extract-avatar-styles.ts
 */

import * as collection from '@dicebear/collection';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface AvatarStyleData {
  meta: {
    title: string;
    creator?: string;
    source?: string;
    homepage?: string;
    license?: {
      name: string;
      url: string;
    };
  };
  schema: object;
}

const avatarStyles: Record<string, AvatarStyleData> = {};

for (const key in collection) {
  const style = collection[key as keyof typeof collection];

  if (style.meta) {
    avatarStyles[key] = {
      meta: style.meta,
      schema: style.schema,
    };
  }
}

const outputPath = path.join(
  __dirname,
  '..',
  '.vitepress',
  'config',
  'avatarStyles.json',
);

fs.writeFileSync(outputPath, JSON.stringify(avatarStyles, null, 2));

console.log(`Extracted ${Object.keys(avatarStyles).length} avatar styles to:`);
console.log(outputPath);
