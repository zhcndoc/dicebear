import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'uvu';
import { equal } from 'uvu/assert';
import { ensureSize, getMetadata } from '../../lib/utils/svg.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

test(`"ensureSize" without width and height`, async () => {
  equal(
    ensureSize(`<svg foo bar></svg>`, 100).svg,
    `<svg foo bar width="100" height="100"></svg>`,
  );
});

test(`"ensureSize" with width and height`, async () => {
  equal(
    ensureSize(`<svg foo width="20" bar height="20"></svg>`, 100).svg,
    `<svg foo width="20" bar height="20"></svg>`,
  );
});

test(`"ensureSize" with width only`, async () => {
  equal(
    ensureSize(`<svg foo width="20" bar></svg>`, 100).svg,
    `<svg foo width="20" bar height="20"></svg>`,
  );
});

test(`"ensureSize" with height only`, async () => {
  equal(
    ensureSize(`<svg foo bar height="20"></svg>`, 100).svg,
    `<svg foo bar height="100" width="100"></svg>`,
  );
});

test(`Metadata parsing`, async () => {
  const avatar = await fs.readFile(path.resolve(__dirname, '../fixtures/avatar.svg'), {
    encoding: 'utf8',
  });
  
  equal(
    getMetadata(avatar),
    {
      title: 'Title',
      source: 'https://www.dicebear.com',
      creator: 'Creator',
      license: 'https://www.dicebear.com/licenses',
      copyright: 'Remix of „Title” (https://www.dicebear.com) by „DiceBear”',
    }
  )
});

test.run();
