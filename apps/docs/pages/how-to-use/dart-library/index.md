---
title: Dart 头像库
description: >
  使用 DiceBear Dart 库在 Dart 和 Flutter 中生成 SVG 头像图片。
  Dart 3.4+，API 与 JavaScript 库完全相同。
---

# Dart 头像库

Dart 库提供与
[JavaScript 库](/how-to-use/js-library/)完全相同的 API。它要求 Dart 3.4 或更高版本，
也可用于 Flutter 应用。相同的 seed 和样式定义会生成与 JavaScript 参考实现字节级完全一致的 SVG。

## 安装

你需要两个包：核心库 `dicebear_core` 和头像样式
定义 `dicebear_styles`。每种样式都是其各自库中的一个字符串常量，
因此编译后的应用只会嵌入它所导入的样式。

```sh
dart pub add dicebear_core
dart pub add dicebear_styles
```

在 Flutter 项目中，请改用 `flutter pub add`。

## 用法

我们在示例中使用头像样式 [lorelei](/styles/lorelei/)。你可以在[这里](/styles/)找到更多头像样式。每种样式都以原始 JSON 字符串的形式提供（例如来自 `package:dicebear_styles/lorelei.dart` 的 `lorelei`），然后将其传递给 `Style.parse`。

```dart
import 'package:dicebear_core/dicebear_core.dart';
import 'package:dicebear_styles/lorelei.dart';

void main() {
  final style = Style.parse(lorelei);

  final avatar = Avatar(style, {
    'seed': 'John',
    // ... 其他选项
  });

  print(avatar.svg);
}
```

`Style.parse` 会对原始 JSON 字符串进行解码和校验。如果你已经持有一个已解码的定义（`Map<String, Object?>`），请改为将其传递给默认的 `Style(...)` 构造函数。

每种头像样式都带有若干选项。你可以在每个[头像样式](/styles/)的详情页面找到它们。

:::info

我们提供了来自不同艺术家的大量头像样式。头像样式采用不同的许可证授权，这些许可证由艺术家自行选择。为了便于快速了解，我们为你创建了一个[许可证概览](/licenses/)。

:::

## 确定性头像

`seed` 选项是生成确定性头像的关键。相同的种子
总是会生成相同的头像：

```dart
final avatar1 = Avatar(style, {'seed': 'user-123'});
final avatar2 = Avatar(style, {'seed': 'user-123'});

// avatar1.svg == avatar2.svg
```

## 类型

### `Style`

一个经过验证、不可变的样式定义包装器。先从解码后的定义 JSON 中构建一次，然后在生成多个头像时重复使用它。无效的定义会抛出 `StyleValidationError`。

```dart
final style = Style.parse(lorelei);

final avatar1 = Avatar(style, {'seed': 'Alice'});
final avatar2 = Avatar(style, {'seed': 'Bob'});
```

### `Avatar`

用于生成头像的主要类。构造函数接收一个 `Style` 和一个可选的选项映射（无效选项会抛出 `OptionsValidationError`，循环颜色引用会抛出 `CircularColorReferenceError`）。省略选项映射等同于传入一个空映射。

```dart
final avatar = Avatar(style, {
  // ... 选项
});
```

### `OptionsDescriptor`

描述某个样式下所有有效的选项。适用于构建 UI 或验证用户输入。

```dart
final descriptor = OptionsDescriptor(style).toJson();
```

## 方法

### `svg` / `toString()`

**返回类型：** `String`

以 XML 格式返回头像的 SVG。`toString()` 返回相同的字符串，
因此 `Avatar` 可以直接用于字符串上下文中（字符串插值、
`print`）。

```dart
final avatar = Avatar(style, {'seed': 'Alice'});

var svg = avatar.svg;
// 或
svg = avatar.toString();
```

### `toJson()`

**返回类型：** `Map<String, Object?>`（包含键 `svg` 和 `options`）

返回 SVG 以及解析后的选项，格式为可进行 JSON 编码的映射。将其传递给
`jsonEncode` 即可得到序列化形式。

```dart
final avatar = Avatar(style, {'seed': 'Alice'});

final result = jsonEncode(avatar.toJson());

// result → {"svg":"<svg>...</svg>","options":{"flip":"none",...}}
```

解析后的选项也可以通过
`avatar.resolvedOptions` 直接以映射形式访问。

### `toDataUri()`

**返回类型：** `String`

以 [data URI](https://en.wikipedia.org/wiki/Data_URI_scheme) 形式返回头像。

```dart
final avatar = Avatar(style, {'seed': 'Alice'});

final dataUri = avatar.toDataUri();

// <img src="{dataUri}" alt="头像" />
```

## 核心选项

核心选项与 JavaScript 库完全相同。完整参考请参见
[JS Library 核心选项](/how-to-use/js-library/#core-options)。以下是 Dart 语法中的选项：

```dart
final avatar = Avatar(style, {
  'seed': 'Alice',
  'flip': 'horizontal', // 'none', 'horizontal', 'vertical', 'both'
  'rotate': 10, // -360 to 360, or [min, max] range
  'scale': 0.9, // 0 to 10 (1 = original), or [min, max] range
  'borderRadius': 50, // 0-50 (50 = circle)
  'size': 128,
  'translateX': 0, // -1000 to 1000 (canvas 宽度的百分比)
  'translateY': 0, // -1000 to 1000 (canvas 高度的百分比)
  'idRandomization': true,
  'title': 'User Avatar',
  'fontFamily': 'Arial', // or ['Arial', 'Helvetica']
  'fontWeight': 700, // 1-1000
  'backgroundColor': ['#b6e3f4', '#c0aede'],
  'backgroundColorFill': 'solid', // 'solid', 'linear', 'radial'
});
```

动态组件和颜色选项的工作方式也相同。有关所有可用模式，请参见
[JS Library 文档](/how-to-use/js-library/#dynamic-component-options)。

## 示例

### 在 Flutter 中渲染

该库不依赖 Flutter；它返回纯字符串。要在 Flutter widget 树中显示一个头像，可以使用诸如 [`flutter_svg`](https://pub.dev/packages/flutter_svg) 这样的包来渲染 SVG 字符串：

```dart
final avatar = Avatar(style, {'seed': 'Alice', 'size': 128});

// 在你的 build 方法中，配合 package:flutter_svg
SvgPicture.string(avatar.svg, width: 128, height: 128);
```

### 使用自定义背景的头像

```dart
final avatar = Avatar(style, {
  'seed': 'Alice',
  'backgroundColor': ['#b6e3f4', '#c0aede', '#d1d4f9'],
});
```

### 固定大小头像

```dart
import 'package:dicebear_styles/bottts.dart';

final style = Style.parse(bottts);

final avatar = Avatar(style, {
  'seed': 'robot-42',
  'size': 128,
  'borderRadius': 50, // 圆形头像
});
```

### 带变换的头像

```dart
import 'package:dicebear_styles/avataaars.dart';

final style = Style.parse(avataaars);

final avatar = Avatar(style, {
  'seed': 'Jane',
  'flip': 'horizontal',
  'rotate': 10,
  'scale': 0.9,
  'translateY': 5,
});
```

### 同一页面上的多个头像

在同一页面渲染多个头像时，使用 `idRandomization` 来
防止 SVG ID 冲突：

```dart
final style = Style.parse(lorelei);

for (final seed in ['alice', 'bob', 'charlie']) {
  final avatar = Avatar(style, {
    'seed': seed,
    'idRandomization': true,
  });
  print(avatar.svg);
}
```

### 加权变体选择

加权映射会让某些变体比其他变体更容易被选中。这里，lorelei 样式会将 `happy01` 或 `happy02` 这两种嘴型的选择概率设为 `sad01` 的两倍：

```dart
final avatar = Avatar(style, {
  'seed': 'Alice',
  'mouthVariant': {'happy01': 2, 'happy02': 2, 'sad01': 1},
});
```
