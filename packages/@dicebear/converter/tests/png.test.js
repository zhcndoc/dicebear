import { toPng } from '../lib/node/index.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const avatar = fs.readFileSync(path.resolve(__dirname, 'fixtures/avatar.svg'), {
  encoding: 'utf8',
});

test(`Convert to png buffer`, async () => {
  assert.doesNotThrow(() => toPng(avatar).toArrayBuffer());
});

test(`Convert to png data uri`, async () => {
  assert.doesNotThrow(() => toPng(avatar).toDataUri());
});
