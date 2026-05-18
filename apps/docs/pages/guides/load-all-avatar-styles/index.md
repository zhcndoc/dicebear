---
title: 从 @dicebear/styles 加载所有头像样式 | DiceBear
description: >
  了解如何一次性加载 @dicebear/styles 随附的每一种头像样式——
  在 Node.js 和 PHP 中。
---

# 如何从 `@dicebear/styles` 加载所有头像样式？

[DiceBear styles 仓库](https://github.com/dicebear/styles) 将每个官方头像样式都作为单独的 JSON 文件提供——在 npm 上以
[`@dicebear/styles`](https://www.npmjs.com/package/@dicebear/styles) 发布，在
Packagist 上以
[`dicebear/styles`](https://packagist.org/packages/dicebear/styles) 发布。大多数项目只需要一两个样式，但有时——例如用于样式选择器、画廊页面或批处理任务——你会希望一次性加载所有样式。

本指南将展示如何在 Node.js 和 PHP 中实现这一点。

## Node.js

在 Node.js 中，你可以直接从磁盘上已安装的包中读取这些样式。该包将其源 JSON 文件放在 `src/` 下。

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

PHP 可以通过 Composer 定位已安装的包，并遍历其 `src/` 目录中的 JSON 文件。

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
