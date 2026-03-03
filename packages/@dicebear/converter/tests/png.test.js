import { toPng } from '../lib/node/index.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';

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

test(`PNG output respects size option`, async () => {
  const buffer = await toPng(avatar, { size: 128 }).toArrayBuffer();
  const metadata = await sharp(Buffer.from(buffer)).metadata();
  assert.equal(metadata.width, 128);
  assert.equal(metadata.height, 128);
});

test(`PNG output defaults to 512`, async () => {
  const buffer = await toPng(avatar).toArrayBuffer();
  const metadata = await sharp(Buffer.from(buffer)).metadata();
  assert.equal(metadata.width, 512);
  assert.equal(metadata.height, 512);
});

test(`PNG output clamps oversized value to 2048`, async () => {
  const buffer = await toPng(avatar, { size: 99999 }).toArrayBuffer();
  const metadata = await sharp(Buffer.from(buffer)).metadata();
  assert.equal(metadata.width, 2048);
  assert.equal(metadata.height, 2048);
});
