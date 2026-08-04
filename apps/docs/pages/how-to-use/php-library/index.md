---
title: PHP 头像库
description: >
  使用 DiceBear PHP 库在服务器端生成 SVG 头像。
  支持 PHP 8.2+，API 与 JavaScript 库完全一致。
---

# PHP 头像库

PHP 库提供了与
[JavaScript 库](/how-to-use/js-library/) 完全相同的 API。它需要 PHP 8.2 或更高版本。
相同的 seed 和样式定义会生成与 JavaScript
参考实现字节级完全一致的 SVG。

## 安装

你需要两个包：核心库 `dicebear/core` 和头像样式
定义 `dicebear/styles`。

```
composer require dicebear/core dicebear/styles
```

## 使用

```php
<?php

use Composer\InstalledVersions;
use DiceBear\Style;
use DiceBear\Avatar;

$basePath = InstalledVersions::getInstallPath('dicebear/styles');
$style = Style::fromJson(file_get_contents($basePath . '/src/lorelei.json'));

$avatar = new Avatar($style, [
  'seed' => 'Alice',
  // ... 其他选项
]);

$svg = (string) $avatar;
```

每种头像样式都带有多个选项。你可以在每个 [头像样式](/styles/) 的详情页找到它们。

:::info

我们提供了大量来自不同创作者的头像样式。这些头像样式采用不同的许可证，创作者可以自行选择许可证类型。为了方便快速了解，我们为你创建了一个[许可证概览](/licenses/)。

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

用于生成头像的主类。传入一个 `Style` 实例和可选
选项。

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
$avatar = new Avatar($style, ['seed' => 'Alice']);

$svg = (string) $avatar;
// 或
$svg = $avatar->toString();
```

### `toJSON()`

**返回类型：** `array{svg: string, options: array}`

返回一个包含 SVG 和解析后选项的关联数组。

```php
$avatar = new Avatar($style, ['seed' => 'Alice']);

$json = $avatar->toJSON();

// $json['svg']     → '<svg>...</svg>'
// $json['options'] → ['seed' => 'Alice', ...]
```

### `toDataUri()`

**返回类型：** `string`

以 [数据 URI](https://en.wikipedia.org/wiki/Data_URI_scheme) 形式返回头像。

```php
$avatar = new Avatar($style, ['seed' => 'Alice']);

// <img src="<?= $dataUri ?>" alt="头像" />
```

## 核心选项

这些选项适用于每个 DiceBear 核心。请参阅
[核心选项](/guides/core-options/) 获取完整参考。以下是 PHP 语法中的选项：

```php
$avatar = new Avatar($style, [
  'seed' => 'Alice',
  'flip' => 'horizontal',          // 'none'（无）、'horizontal'（水平）、'vertical'（垂直）、'both'（两者）
  'rotate' => 10,                  // -360 到 360，或 [最小值, 最大值] 范围
  'scale' => 0.9,                  // 0 到 10（1 = 原始大小），或 [最小值, 最大值] 范围
  'borderRadius' => 50,            // 0-50（50 = 圆形）
  'size' => 128,
  'translateX' => 0,               // -1000 到 1000（画布宽度的百分比）
  'translateY' => 0,               // -1000 到 1000（画布高度的百分比）
  'idRandomization' => true,
  'title' => '用户头像',
  'fontFamily' => 'Arial',         // 或 ['Arial', 'Helvetica']
  'fontWeight' => 700,             // 1-1000
  'backgroundColor' => ['#b6e3f4', '#c0aede'],
  'backgroundColorFill' => 'solid', // 'solid'（纯色）、'linear'（线性）、'radial'（径向）
]);
```

动态组件和颜色选项的工作方式也相同。请参阅
[动态组件选项](/guides/core-options/#dynamic-component-options) 了解
所有可用的模式。

## 示例

### 自定义背景的头像

```php
$avatar = new Avatar($style, [
  'seed' => 'Alice',
  'backgroundColor' => ['#b6e3f4', '#c0aede', '#d1d4f9'],
]);
```

### 固定尺寸头像

```php
$basePath = InstalledVersions::getInstallPath('dicebear/styles');
$style = Style::fromJson(file_get_contents($basePath . '/src/bottts.json'));

$avatar = new Avatar($style, [
  'seed' => 'robot-42',
  'size' => 128,
  'borderRadius' => 50, // 圆形头像
]);
```

### 带变换效果的头像

```php
$basePath = InstalledVersions::getInstallPath('dicebear/styles');
$style = Style::fromJson(file_get_contents($basePath . '/src/avataaars.json'));

$avatar = new Avatar($style, [
  'seed' => 'Jane',
  'flip' => 'horizontal',
  'rotate' => 10,
  'scale' => 0.9,
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
  'seed' => 'Alice',
  'topVariant' => ['short01' => 2, 'short02' => 2, 'long01' => 1],
]);
```
