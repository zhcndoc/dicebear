---
title: 以编程方式访问所有可用样式选项 | DiceBear
description: >
  了解如何使用 OptionsDescriptor 类以编程方式访问 DiceBear
  头像样式的所有可用选项。
---

# 如何以编程方式访问头像样式的所有可用选项？

每种头像样式都会根据其组件和颜色提供不同的选项。
`OptionsDescriptor` 类可让你在运行时发现所有可用选项。

## JavaScript

```js
import { Style, OptionsDescriptor } from '@dicebear/core';
import definition from '@dicebear/styles/micah.json' with { type: 'json' };

const style = new Style(definition);
const descriptor = new OptionsDescriptor(style);

console.log(descriptor.toJSON());
```

## PHP

```php
use Composer\InstalledVersions;
use DiceBear\Style;
use DiceBear\OptionsDescriptor;

$basePath = InstalledVersions::getInstallPath('dicebear/styles');
$definition = json_decode(file_get_contents($basePath . '/src/micah.json'), true);

$style = new Style($definition);
$descriptor = new OptionsDescriptor($style);

print_r($descriptor->toJSON());
```

## 字段描述符类型

`toJSON()` 方法返回一个从选项名称到字段描述符的映射。每个
描述符都有一个 `type`，以及根据类型不同而附加的属性：

| 类型      | 属性                           | 示例选项                 |
| --------- | ------------------------------ | ------------------------ |
| `string`  | `list?`                        | `seed`, `fontFamily`     |
| `number`  | `min?`, `max?`, `list?`        | `fontWeight`             |
| `boolean` |                                | `idRandomization`        |
| `enum`    | `values`, `list?`, `weighted?` | `flip`, `*Variant`       |
| `color`   | `list?`, `contrastTo?`         | `*Color`                 |
| `range`   | `min?`, `max?`                 | `rotate`, `borderRadius` |

- `list` 表示该选项也接受值数组。
- `weighted`（在枚举字段上）表示该选项还接受一个用于 PRNG 选择的 `Record<string, number>` 权重映射。
- `contrastTo`（在颜色字段上）指定渲染器要与之形成对比的颜色组，因此 UI 可以标记该组的选择是由对比驱动而非随机驱动。仅当样式定义在该组上声明了 `contrastTo` 约束时才会设置。

通过 `extends` 在定义中声明的组件别名，不会向描述符中贡献它们自己的 `${alias}Variant` / `${alias}Probability` 条目——它们共享其源组件的用户选项。
