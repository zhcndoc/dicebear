---
title: Load All Avatar Styles from @dicebear/styles | DiceBear
description: >
  Learn how to load every avatar style shipped with @dicebear/styles at once —
  in Node.js, PHP, Python and Rust.
---

# How to load all avatar styles from `@dicebear/styles`?

The [DiceBear styles repository](https://github.com/dicebear/styles) ships every
official avatar style as a separate JSON file — distributed as
[`@dicebear/styles`](https://www.npmjs.com/package/@dicebear/styles) on npm,
[`dicebear/styles`](https://packagist.org/packages/dicebear/styles) on
Packagist,
[`dicebear-styles`](https://pypi.org/project/dicebear-styles/) on PyPI and
[`dicebear-styles`](https://crates.io/crates/dicebear-styles) on crates.io. Most
projects only need one or two styles, but sometimes — for a style picker, a
gallery page, or a batch job — you want to load all of them at once.

This guide shows how to do that in Node.js, PHP, Python and Rust.

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

## Python

The `dicebear-styles` package ships the definitions as JSON resources under the
`dicebear_styles` import name. Iterate over them with `importlib.resources`.

```python
import json
from importlib.resources import files

from dicebear import Avatar, Style

styles = {
    resource.name.removesuffix(".json"): Style(
        json.loads(resource.read_text("utf-8"))
    )
    for resource in files("dicebear_styles").iterdir()
    if resource.name.endswith(".json")
}

avatar = Avatar(styles["lorelei"], {"seed": "Alice"})
```

## Rust

The `dicebear-styles` crate embeds each style behind a Cargo feature of the same
name, so a binary only ships the styles it opts into. To load _all_ of them, add
the crate with the `all` feature:

```sh
cargo add dicebear-core serde_json
cargo add dicebear-styles --features all
```

`dicebear_styles::all()` lists every style compiled into the build, and
`dicebear_styles::get(name)` returns its raw JSON definition.

```rust
use std::collections::HashMap;

use dicebear_core::{Avatar, Style};
use serde_json::json;

let mut styles = HashMap::new();
for name in dicebear_styles::all() {
    let definition = dicebear_styles::get(name).expect("style is embedded");
    styles.insert(name, Style::from_str(definition)?);
}

let avatar = Avatar::new(&styles["lorelei"], json!({ "seed": "Alice" }))?;
```
