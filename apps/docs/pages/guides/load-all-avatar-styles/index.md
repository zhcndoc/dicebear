---
title: Load All Avatar Styles from @dicebear/styles | DiceBear
description: >
  Learn how to load every avatar style shipped with @dicebear/styles at once —
  in Node.js and PHP.
---

# How to load all avatar styles from `@dicebear/styles`?

The [DiceBear styles repository](https://github.com/dicebear/styles) ships every
official avatar style as a separate JSON file — distributed as
[`@dicebear/styles`](https://www.npmjs.com/package/@dicebear/styles) on npm and
[`dicebear/styles`](https://packagist.org/packages/dicebear/styles) on
Packagist. Most projects only need one or two styles, but sometimes — for a
style picker, a gallery page, or a batch job — you want to load all of them at
once.

This guide shows how to do that in Node.js and PHP.

## Node.js

In Node.js you can read the styles straight from the installed package on disk.
The package ships its source JSON files under `src/`.

```js
import { readdir, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { Avatar } from '@dicebear/core';

const require = createRequire(import.meta.url);
const stylesDir = path.join(
  path.dirname(require.resolve('@dicebear/styles/package.json')),
  'src',
);

const files = (await readdir(stylesDir)).filter((file) =>
  file.endsWith('.json'),
);

const styles = Object.fromEntries(
  await Promise.all(
    files.map(async (file) => {
      const definition = JSON.parse(
        await readFile(path.join(stylesDir, file), 'utf8'),
      );

      return [path.basename(file, '.json'), definition];
    }),
  ),
);

const avatar = new Avatar(styles.lorelei, { seed: 'Alice' });
```

## PHP

PHP can locate the installed package via Composer and iterate over the JSON
files in its `src/` directory.

```php
<?php

use Composer\InstalledVersions;
use DiceBear\Avatar;
use DiceBear\Style;

$basePath = InstalledVersions::getInstallPath('dicebear/styles');
$files    = glob($basePath . '/src/*.json');

$styles = [];
foreach ($files as $file) {
    $name       = basename($file, '.json');
    $definition = json_decode(file_get_contents($file), true);

    $styles[$name] = new Style($definition);
}

$avatar = new Avatar($styles['lorelei'], ['seed' => 'Alice']);
```
