import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { deepStrictEqual as equal } from 'node:assert/strict';
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
    `<svg foo width="100" bar height="100"></svg>`,
  );
});

test(`"ensureSize" with width only`, async () => {
  equal(
    ensureSize(`<svg foo width="20" bar></svg>`, 100).svg,
    `<svg foo width="100" bar height="100"></svg>`,
  );
});

test(`"ensureSize" with height only`, async () => {
  equal(
    ensureSize(`<svg foo bar height="20"></svg>`, 100).svg,
    `<svg foo bar height="100" width="100"></svg>`,
  );
});

test(`"ensureSize" returns correct size`, async () => {
  equal(ensureSize(`<svg></svg>`, 256).size, 256);
});

test(`"ensureSize" defaults to 512`, async () => {
  const result = ensureSize(`<svg></svg>`);
  equal(result.size, 512);
  equal(result.svg, `<svg width="512" height="512"></svg>`);
});

test(`"ensureSize" overwrites huge SVG dimensions`, async () => {
  equal(
    ensureSize(`<svg width="999999999" height="999999999"></svg>`, 128).svg,
    `<svg width="128" height="128"></svg>`,
  );
});

test(`"ensureSize" overwrites non-numeric SVG dimensions`, async () => {
  equal(
    ensureSize(`<svg width="100%" height="auto"></svg>`, 64).svg,
    `<svg width="64" height="64"></svg>`,
  );
});

test(`"ensureSize" clamps to max 2048`, async () => {
  const result = ensureSize(`<svg></svg>`, 10000);
  equal(result.size, 2048);
  equal(result.svg, `<svg width="2048" height="2048"></svg>`);
});

test(`"ensureSize" floors fractional size`, async () => {
  const result = ensureSize(`<svg></svg>`, 99.9);
  equal(result.size, 99);
  equal(result.svg, `<svg width="99" height="99"></svg>`);
});

test(`"ensureSize" falls back to 512 for NaN`, async () => {
  equal(ensureSize(`<svg></svg>`, NaN).size, 512);
});

test(`"ensureSize" falls back to 512 for negative`, async () => {
  equal(ensureSize(`<svg></svg>`, -100).size, 512);
});

test(`"ensureSize" falls back to 512 for zero`, async () => {
  equal(ensureSize(`<svg></svg>`, 0).size, 512);
});

test(`"ensureSize" falls back to 512 for Infinity`, async () => {
  equal(ensureSize(`<svg></svg>`, Infinity).size, 512);
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
