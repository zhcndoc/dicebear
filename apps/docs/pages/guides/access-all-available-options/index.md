---
title: 以编程方式访问所有可用样式选项 | DiceBear
description: >
  了解如何使用 OptionsDescriptor 类以编程方式访问 DiceBear
  头像样式的所有可用选项。
---

# 如何以编程方式访问头像样式的所有可用选项？

每种头像样式都有不同的选项，具体取决于其组件和颜色。
`OptionsDescriptor` 类可让你在运行时发现所有可用选项。

## JavaScript

```js
import { Style, OptionsDescriptor } from '@dicebear/core';
import definition from '@dicebear/definitions/micah.json' with { type: 'json' };

const style = new Style(definition);
const descriptor = new OptionsDescriptor(style);

console.log(descriptor.toJSON());
```

## PHP

```php
use Composer\InstalledVersions;
use DiceBear\Style;
use DiceBear\OptionsDescriptor;

$basePath = InstalledVersions::getInstallPath('dicebear/definitions');
$definition = json_decode(file_get_contents($basePath . '/src/micah.json'), true);

$style = new Style($definition);
$descriptor = new OptionsDescriptor($style);

print_r($descriptor->toJSON());
```

## 字段描述符类型

`toJSON()` 方法返回一个从选项名称到字段描述符的映射。每个
描述符都有一个 `type`，以及根据类型不同而附加的属性：

| 类型      | 属性                              | 示例选项                 |
| --------- | --------------------------------- | ------------------------ |
| `string`  | `list?`                           | `seed`, `fontFamily`     |
| `number`  | `min?`, `max?`, `list?`           | `fontWeight`             |
| `boolean` |                                   | `idRandomization`        |
| `enum`    | `values`, `list?`, `weighted?`    | `flip`, `*Variant`       |
| `color`   | `list?`                           | `*Color`                 |
| `range`   | `min?`, `max?`                    | `rotate`, `borderRadius` |

`list` 标志表示该选项接受数组。`weighted` 标志
（用于 enum 字段）表示该选项接受一个用于加权 PRNG 选择的 `Record<string, number>`。
