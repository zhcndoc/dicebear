---
title: 从 @dicebear/styles 加载所有头像样式
description: >
  了解如何一次性加载 @dicebear/styles 随附的每一种头像样式，适用于
  Node.js、PHP、Python、Rust、Go 和 Dart。
---

# 如何从 `@dicebear/styles` 加载所有头像样式？

[DiceBear styles 仓库](https://github.com/dicebear/styles) 将每一种官方头像样式都作为单独的 JSON 文件提供。它以 [`@dicebear/styles`](https://www.npmjs.com/package/@dicebear/styles) 的形式发布在 npm 上，以 [`dicebear/styles`](https://packagist.org/packages/dicebear/styles) 的形式发布在 Packagist 上，以 [`dicebear-styles`](https://pypi.org/project/dicebear-styles/) 的形式发布在 PyPI 上，以 [`dicebear-styles`](https://crates.io/crates/dicebear-styles) 的形式发布在 crates.io 上，作为 Go 模块发布在 [`github.com/dicebear/styles/v10`](https://pkg.go.dev/github.com/dicebear/styles/v10)，并且在 pub.dev 上以 [`dicebear_styles`](https://pub.dev/packages/dicebear_styles) 的形式提供。大多数项目只需要一两种样式，但有时（例如用于样式选择器、画廊页面或批处理任务）你会希望一次性加载所有样式。

本指南将展示如何在 Node.js、PHP、Python、Rust、Go 和 Dart 中实现这一点。

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
    $name = basename($file, '.json');

    $styles[$name] = Style::fromJson(file_get_contents($file));
}

$avatar = new Avatar($styles['lorelei'], ['seed' => 'Alice']);
```

## Python

`dicebear-styles` 包通过 `dicebear_styles` 导入将定义作为 JSON 资源提供。你可以使用 `importlib.resources` 遍历它们。

```python
from importlib.resources import files

from dicebear import Avatar, Style

styles = {
    resource.name.removesuffix(".json"): Style.from_json(
        resource.read_text("utf-8")
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

The `github.com/dicebear/styles/v10` module embeds every style. Unlike the Rust crate, there is no per-style opt-in mechanism here, so as long as you add this module, the full set of styles will be available.

```sh
go get github.com/dicebear/dicebear-go/v10
go get github.com/dicebear/styles/v10
```

`styles.All()` will list all embedded styles, and `styles.Get(name)` will return their original JSON definition.

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

## Dart

`dicebear_styles` 包将每种样式分别打包在各自的库中，因此编译后的
应用只会嵌入它所导入的样式。要加载 _全部_ 样式，请导入
总库 `package:dicebear_styles/dicebear_styles.dart`，它会
重新导出每一种样式：

```sh
dart pub add dicebear_core dicebear_styles
```

`styles.all` 列出所有已嵌入的样式，而 `styles.get(name)` 会返回其原始
JSON 定义。

```dart
import 'package:dicebear_core/dicebear_core.dart';
import 'package:dicebear_styles/dicebear_styles.dart' as styles;

final parsed = {
  for (final name in styles.all) name: Style.parse(styles.get(name)!),
};

final avatar = Avatar(parsed['lorelei']!, {'seed': 'Alice'});
```
