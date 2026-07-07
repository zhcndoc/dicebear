---
title: Flutter Avatar Library
description: >
  使用 DiceBear 在 Flutter 中生成 SVG 头像。使用 Dart 库在设备上渲染头像，或通过 HTTP API 加载 PNG，无需额外包。
---

# Flutter 头像库：在 Flutter 中使用 DiceBear

你可以通过两种方式在 Flutter 中生成 DiceBear 头像。使用带有 SVG 渲染器的
[Dart 库](/how-to-use/dart-library/)在设备上构建头像，或者使用 Flutter 内置的 `Image.network`
配合 [HTTP API](/how-to-use/http-api/) 加载现成的 PNG。

HTTP API 无需额外包，且是最快的上手方式。Dart
库将所有内容保留在本地，因此可离线工作且不会发送任何请求。

## 使用 Dart 库

添加核心库、样式定义以及 SVG 渲染器。我们使用
[flutter_svg](https://pub.dev/packages/flutter_svg) 来绘制 SVG 字符串。

```sh
flutter pub add dicebear_core dicebear_styles flutter_svg
```

```dart
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:dicebear_core/dicebear_core.dart';
import 'package:dicebear_styles/lorelei.dart';

// 解析样式一次并重复使用。
final style = Style.parse(lorelei);

class UserAvatar extends StatelessWidget {
  const UserAvatar({super.key, this.seed = 'Alice'});

  final String seed;

  @override
  Widget build(BuildContext context) {
    final avatar = Avatar(style, {
      'seed': seed,
      'size': 128,
      // ... 其他选项
    });

    return SvgPicture.string(
      avatar.svg,
      width: 128,
      height: 128,
    );
  }
}
```

`Avatar(style, {...}).svg` 会以字符串形式返回 SVG，而
`SvgPicture.string` 会直接渲染它。有关完整 API 以及每种样式支持的选项，请参阅 [Dart 库参考](/how-to-use/dart-library/)。

## 使用 HTTP API

HTTP API 会返回已完成的图片，因此你无需额外的包。请求
`png` 格式，并将 URL 传递给 `Image.network`。

```dart
import 'package:flutter/material.dart';

class UserAvatar extends StatelessWidget {
  const UserAvatar({super.key, this.seed = 'Alice'});

  final String seed;

  @override
  Widget build(BuildContext context) {
    final url = Uri.https('api.dicebear.com', '/10.x/lorelei/png', {
      'seed': seed,
      'size': '128',
      // ... 其他选项
    });

    return Image.network(
      url.toString(),
      width: 128,
      height: 128,
    );
  }
}
```

每个选项都是一个查询参数。完整列表请参阅
[HTTP API 参考](/how-to-use/http-api/)。
