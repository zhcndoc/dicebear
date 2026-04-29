---
title: PHP Avatar Library | DiceBear
description: >
  使用 DiceBear PHP 库在服务器端生成 SVG 头像。
  支持 PHP 8.2+，API 与 JavaScript 库完全一致。
---

# PHP Avatar Library

PHP 库提供了与 [JavaScript library](/how-to-use/js-library/) 完全一致的 API。它需要 PHP 8.2 或更高版本。相同的 seed 和样式定义在两种实现中都会生成字节级一致的 SVG。

## 安装

你需要两个包：核心库 `dicebear/core` 和头像样式定义 `dicebear/definitions`。

```
composer require dicebear/core dicebear/definitions
```

## 使用

```php
<?php

use Composer\InstalledVersions;
use DiceBear\Style;
use DiceBear\Avatar;

$basePath = InstalledVersions::getInstallPath('dicebear/definitions');
$definition = json_decode(file_get_contents($basePath . '/src/lorelei.json'), true);

$style = new Style($definition);
$avatar = new Avatar($style, [
  'seed' => 'John Doe',
  // ... 其他选项
]);

$svg = (string) $avatar;
```

每种头像样式都带有多个选项。你可以在每个 [头像样式](/styles/) 的详情页找到它们。

:::info

我们提供了来自不同艺术家的大量头像样式。这些头像样式使用不同的许可证，艺术家可以自行选择。为了让你快速了解，我们为你创建了一个 [许可证概览](/licenses/)。

:::

## 确定性头像

`seed` 选项是生成确定性头像的关键。相同的 seed 总会生成相同的头像：

```php
$avatar1 = new Avatar($style, ['seed' => 'user-123']);
$avatar2 = new Avatar($style, ['seed' => 'user-123']);

(string) $avatar1 === (string) $avatar2; // true
```

## 类

### `Avatar`

用于生成头像的主要类。接受一个 `Style` 实例（或原始定义数组）以及可选选项。

```php
use DiceBear\Avatar;

$avatar = new Avatar($style, [
  // ... 选项
]);
```

### `Style`

对样式定义的不可变包装。用于从同一样式生成多个头像时复用它。

```php
use DiceBear\Style;
use DiceBear\Avatar;

$style = new Style($definition);

$avatar1 = new Avatar($style, ['seed' => 'Alice']);
$avatar2 = new Avatar($style, ['seed' => 'Bob']);
```

### `OptionsDescriptor`

描述给定样式的所有有效选项。适用于构建 UI 或验证用户输入。

```php
use DiceBear\Style;
use DiceBear\OptionsDescriptor;

$descriptor = new OptionsDescriptor(new Style($definition));
$fields = $descriptor->toJSON();
```

## 方法

### `__toString()` / `toString()`

**返回类型：** `string`

以 XML 格式返回 SVG 头像。`__toString()` 魔术方法允许在字符串上下文中直接使用头像对象。

```php
$avatar = new Avatar($style, ['seed' => 'John Doe']);

$svg = (string) $avatar;
// 或
$svg = $avatar->toString();
```

### `toJSON()`

**返回类型：** `array{svg: string, options: array}`

返回一个包含 SVG 和已解析选项的关联数组。

```php
$avatar = new Avatar($style, ['seed' => 'John Doe']);

$json = $avatar->toJSON();

// $json['svg']     → '<svg>...</svg>'
// $json['options'] → ['seed' => 'John Doe', ...]
```

### `toDataUri()`

**返回类型：** `string`

以 [data URI](https://en.wikipedia.org/wiki/Data_URI_scheme) 形式返回头像。

```php
$avatar = new Avatar($style, ['seed' => 'John Doe']);

$dataUri = $avatar->toDataUri();

// <img src="<?= $dataUri ?>" alt="头像" />
```

## 核心选项

核心选项与 JavaScript 库完全一致。完整参考请参见 [JS Library core options](/how-to-use/js-library/#core-options)。以下是 PHP 语法中的选项：

```php
$avatar = new Avatar($style, [
  'seed' => 'John Doe',
  'flip' => 'horizontal',         // 'none', 'horizontal', 'vertical', 'both'
  'rotate' => 10,                  // or [min, max] range
  'scale' => 90,                   // or [min, max] range
  'borderRadius' => 50,            // 0-50 (50 = circle)
  'size' => 128,
  'translateX' => 0,               // -100 to 100 (percent of canvas)
  'translateY' => 0,               // -100 to 100 (percent of canvas)
  'idRandomization' => true,
  'title' => '用户头像',
  'fontFamily' => 'Arial',         // or ['Arial', 'Helvetica']
  'fontWeight' => 700,             // 1-1000
  'backgroundColor' => ['#b6e3f4', '#c0aede'],
  'backgroundColorFill' => 'solid', // 'solid', 'linear', 'radial'
]);
```

动态组件和颜色选项的工作方式也相同。请参见 [JS Library documentation](/how-to-use/js-library/#dynamic-component-options) 了解所有可用模式。

## 示例

### 自定义背景的头像

```php
$avatar = new Avatar($style, [
  'seed' => 'John Doe',
  'backgroundColor' => ['#b6e3f4', '#c0aede', '#d1d4f9'],
]);
```

### 固定尺寸头像

```php
$basePath = InstalledVersions::getInstallPath('dicebear/definitions');
$definition = json_decode(file_get_contents($basePath . '/src/bottts.json'), true);

$style = new Style($definition);
$avatar = new Avatar($style, [
  'seed' => 'robot-42',
  'size' => 128,
  'borderRadius' => 50, // 圆形头像
]);
```

### 带变换效果的头像

```php
$basePath = InstalledVersions::getInstallPath('dicebear/definitions');
$definition = json_decode(file_get_contents($basePath . '/src/avataaars.json'), true);

$style = new Style($definition);
$avatar = new Avatar($style, [
  'seed' => 'Jane Doe',
  'flip' => 'horizontal',
  'rotate' => 10,
  'scale' => 90,
  'translateY' => 5,
]);
```

### 同一页面上的多个头像

在同一页面渲染多个头像时，使用 `idRandomization` 来防止 SVG ID 冲突：

```php
$users = ['alice', 'bob', 'charlie'];

$avatars = array_map(function (string $user) use ($style) {
  return (string) new Avatar($style, [
    'seed' => $user,
    'idRandomization' => true,
  ]);
}, $users);
```

### 加权变体选择

```php
$avatar = new Avatar($style, [
  'seed' => 'John Doe',
  'topVariant' => ['short01' => 2, 'short02' => 2, 'long01' => 1],
]);
```
