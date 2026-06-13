---
title: 从 @dicebear/styles 加载所有头像样式 | DiceBear
description: >
  了解如何一次性加载随 @dicebear/styles 提供的所有头像样式，适用于
  Node.js、PHP、Python、Rust 和 Go。
---

# 如何从 `@dicebear/styles` 加载所有头像样式？

[DiceBear 样式仓库](https://github.com/dicebear/styles)将每种官方头像样式作为单独的 JSON 文件提供。它通过 npm 上的
[`@dicebear/styles`](https://www.npmjs.com/package/@dicebear/styles)、
Packagist 上的
[`dicebear/styles`](https://packagist.org/packages/dicebear/styles)、
PyPI 上的
[`dicebear-styles`](https://pypi.org/project/dicebear-styles/) 以及
crates.io 上的
[`dicebear-styles`](https://crates.io/crates/dicebear-styles) 进行分发。大多数项目只需要一两个样式，但有时（比如样式选择器、画廊页面或批处理任务）你会想一次性加载全部样式。

本指南将展示如何在 Node.js、PHP、Python、Rust 和 Go 中实现这一点。

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

## Python

`dicebear-styles` 包通过 `dicebear_styles` 导入名将定义作为 JSON 资源提供。你可以使用 `importlib.resources` 遍历它们。

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

`dicebear-styles` crate 会通过同名的 Cargo feature 将每种样式嵌入进去，因此二进制文件只会包含其选择启用的样式。要加载 _全部_ 样式，请使用 `all` feature 添加该 crate：

```sh
cargo add dicebear-core serde_json
cargo add dicebear-styles --features all
```

`dicebear_styles::all()` 会列出构建中编译进来的所有样式，而
`dicebear_styles::get(name)` 会返回其原始 JSON 定义。

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

## Go

`github.com/dicebear/styles/v10` 模块会嵌入每一种样式。与 Rust crate 不同，这里没有按样式选择启用的机制，因此只要添加该模块，整套样式就都可用。

```sh
go get github.com/dicebear/dicebear-go/v10
go get github.com/dicebear/styles/v10
```

`styles.All()` 会列出所有嵌入的样式，而 `styles.Get(name)` 会返回其原始 JSON 定义。

```go
import (
	dicebear "github.com/dicebear/dicebear-go/v10"
	"github.com/dicebear/styles/v10"
)

parsed := map[string]*dicebear.Style{}
for _, name := range styles.All() {
	definition, _ := styles.Get(name)
	style, err := dicebear.NewStyle([]byte(definition))
	if err != nil {
		panic(err)
	}
	parsed[name] = style
}

avatar, _ := dicebear.NewAvatar(parsed["lorelei"], map[string]any{"seed": "Alice"})
```
