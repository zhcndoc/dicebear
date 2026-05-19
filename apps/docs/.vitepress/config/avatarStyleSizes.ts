import { createRequire } from 'node:module';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { gzipSync } from 'node:zlib';

import type { AvatarStyleSizeBundle } from '@theme/types';

const require = createRequire(import.meta.url);

function sizeFor(file: string): { raw: number; gzip: number } {
  const buf = fs.readFileSync(file);
  return { raw: buf.byteLength, gzip: gzipSync(buf).byteLength };
}

function walkJsFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkJsFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      out.push(full);
    }
  }
  return out;
}

const stylesDir = path.dirname(require.resolve('@dicebear/styles/initials.json'));
const coreLibDir = path.dirname(require.resolve('@dicebear/core'));

const styles: Record<string, { raw: number; gzip: number }> = {};
for (const file of fs.readdirSync(stylesDir)) {
  if (!file.endsWith('.min.json')) continue;
  const name = file.replace('.min.json', '');
  styles[name] = sizeFor(path.join(stylesDir, file));
}

let coreRaw = 0;
let coreGzip = 0;
for (const file of walkJsFiles(coreLibDir)) {
  const s = sizeFor(file);
  coreRaw += s.raw;
  coreGzip += s.gzip;
}

const avatarStyleSizes: AvatarStyleSizeBundle = {
  core: { raw: coreRaw, gzip: coreGzip },
  styles,
};

export default avatarStyleSizes;
