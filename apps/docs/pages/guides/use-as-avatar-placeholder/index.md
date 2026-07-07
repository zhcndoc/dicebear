---
title: 将 DiceBear 用作头像占位符 API
description: >
  将 DiceBear 用作用户个人资料的确定性头像占位符 API。
  根据用户 ID 或邮箱生成一致的 SVG 头像，无需上传图片。
---

<script setup>
import { Fingerprint, Zap, Server, Palette } from '@lucide/vue';
import BrowserPreview from '@theme/components/ui/UiBrowserPreview.vue';
import DocsHighlights from '@theme/components/docs/DocsHighlights.vue';
import DocsStyleGrid from '@theme/components/docs/DocsStyleGrid.vue';

const highlights = [
  {
    icon: Fingerprint,
    title: '确定性',
    description:
      '相同的种子始终会生成相同的头像。使用用户 ID 或邮箱作为种子，占位符在不同会话和设备之间都保持一致。',
    color: '#1689cc',
  },
  {
    icon: Zap,
    title: '无需上传',
    description:
      '无需存储图片，也无需审核。头像会即时生成，这对尚未拥有头像的新用户非常适用。',
    color: '#f59e0b',
  },
  {
    icon: Server,
    title: '可自托管',
    description:
      '运行你自己的 HTTP API 实例，以便对可用性和数据保留拥有完全控制权。',
    color: '#22c55e',
  },
  {
    icon: Palette,
    title: '35+ 种样式',
    description:
      '从抽象几何图形到插画角色，选择适合你产品的视觉风格。',
    color: '#a855f7',
  },
];

const styles = [
  {
    name: '首字母',
    styleName: 'initials',
    link: '/styles/initials/',
    bestFor: '适合展示用户首字母是常见做法的应用',
  },
  {
    name: 'Identicon',
    styleName: 'identicon',
    link: '/styles/identicon/',
    bestFor: '开发者工具、版本控制、技术平台',
  },
  {
    name: '像素艺术',
    styleName: 'pixel-art',
    link: '/styles/pixel-art/',
    bestFor: '游戏、复古风或面向开发者的社区',
  },
  {
    name: 'Thumbs',
    styleName: 'thumbs',
    link: '/styles/thumbs/',
    bestFor: '友好的消费类应用和社交平台',
  },
  {
    name: 'Shapes',
    styleName: 'shapes',
    link: '/styles/shapes/',
    bestFor: '适用于任何场景的抽象、中性的占位符',
  },
];
</script>

# 将 DiceBear 用作头像占位符 API

头像占位符用于替代用户尚未上传头像时显示的通用默认图标。DiceBear 不会显示灰色剪影，而是根据任意种子生成独特且确定性的 SVG 头像，因此每位用户从注册开始就能拥有一张专属图片。

## 为什么选择 DiceBear 作为占位符？

<DocsHighlights :highlights="highlights" />

## Using HTTP API

The easiest method: use the DiceBear API URL as the `src` of an `<img>` tag. Use a stable identifier as the seed. A numeric user ID works well. For full options and rate limit details, see the [HTTP API documentation](/how-to-use/http-api/).

<BrowserPreview url="https://api.dicebear.com/10.x/initials/svg?seed=JD" />
<BrowserPreview url="https://api.dicebear.com/10.x/pixel-art/svg?seed=user-42" />

```html
<img
  src="https://api.dicebear.com/10.x/initials/svg?seed=JD"
  alt="User avatar"
  width="48"
  height="48"
/>
```

### Fallback when the image errors

Combine DiceBear with an `onerror` handler so it gracefully falls back when a user-uploaded photo fails to load:

```html
<img
  src="/uploads/user-123.jpg"
  onerror="this.src='https://api.dicebear.com/10.x/pixel-art/svg?seed=123'; this.onerror=null;"
  alt="User avatar"
/>
```

### Using the user ID as the seed

Pass a stable and unique identifier as the seed to ensure each user always receives the same placeholder:

```js
const userId = 'user-8f3a2c';
const avatarUrl = `https://api.dicebear.com/10.x/thumbs/svg?seed=${encodeURIComponent(userId)}`;
```

<BrowserPreview url="https://api.dicebear.com/10.x/thumbs/svg?seed=user-8f3a2c" />

## Using JavaScript Libraries

Use a JS library to render on the server, or embed SVGs directly into your markup without making an additional HTTP request. For complete installation and API details, please refer to the [JavaScript Library Documentation](/how-to-use/js-library/).

```js
import { Style, Avatar } from '@dicebear/core';
import thumbs from '@dicebear/styles/thumbs.json' with { type: 'json' };

const style = new Style(thumbs);

function getPlaceholderAvatar(userId) {
  return new Avatar(style, {
    seed: userId,
    size: 48,
    borderRadius: 50,
  }).toString();
}
```

## Using PHP Library

Use the PHP library for server-side rendering without additional HTTP requests. For complete installation and API details, please refer to
[PHP Library Documentation](/how-to-use/php-library/).

```php
<?php

use Composer\InstalledVersions;
use DiceBear\Style;
use DiceBear\Avatar;

$basePath = InstalledVersions::getInstallPath('dicebear/styles');
$style = Style::fromJson(file_get_contents($basePath . '/src/thumbs.json'));

function getPlaceholderAvatar(Style $style, string $userId): string {
  return (string) new Avatar($style, [
    'seed' => $userId,
    'size' => 48,
    'borderRadius' => 50,
  ]);
}
```

## 使用 Python 库

使用 Python 库进行服务端渲染，而无需额外的 HTTP 请求。关于完整的安装和 API 详情，请参阅
[Python 库文档](/how-to-use/python-library/)。

```python
from importlib.resources import files

from dicebear import Avatar, Style

style = Style.from_json(
    files("dicebear_styles").joinpath("thumbs.json").read_text("utf-8")
)

def get_placeholder_avatar(user_id: str) -> str:
    return Avatar(style, {
        "seed": user_id,
        "size": 48,
        "borderRadius": 50,
    }).to_string()
```

## 使用 Rust 库

使用 Rust 库进行服务端渲染，而无需额外的 HTTP 请求。关于完整的安装和 API 详情，请参阅
[Rust 库文档](/how-to-use/rust-library/)。

```rust
use dicebear_core::{Avatar, Error, Style};
use serde_json::json;

let style = Style::from_str(dicebear_styles::THUMBS)?;

fn placeholder_avatar(style: &Style, user_id: &str) -> Result<String, Error> {
    let avatar = Avatar::new(style, json!({
        "seed": user_id,
        "size": 48,
        "borderRadius": 50,
    }))?;

    Ok(avatar.to_string())
}
```

## 使用 Go 库

使用 Go 库进行服务端渲染，而无需额外的 HTTP 请求。
关于完整的安装和 API 详情，请参阅
[Go 库文档](/how-to-use/go-library/)。

```go
import (
	dicebear "github.com/dicebear/dicebear-go/v10"
	"github.com/dicebear/styles/v10"
)

style, _ := dicebear.NewStyle([]byte(styles.Thumbs))

func placeholderAvatar(style *dicebear.Style, userID string) (string, error) {
	avatar, err := dicebear.NewAvatar(style, map[string]any{
		"seed":         userID,
		"size":         48,
		"borderRadius": 50,
	})
	if err != nil {
		return "", err
	}

	return avatar.SVG(), nil
}
```

## 使用 Dart 库

使用 Dart 库进行服务端渲染，而无需额外的 HTTP
请求。有关完整的安装和 API 详情，请参阅
[Dart 库文档](/how-to-use/dart-library/)。

```dart
import 'package:dicebear_core/dicebear_core.dart';
import 'package:dicebear_styles/thumbs.dart';

final style = Style.parse(thumbs);

String getPlaceholderAvatar(String userId) {
  return Avatar(style, {
    'seed': userId,
    'size': 48,
    'borderRadius': 50,
  }).svg;
}
```

## 选择一种样式

不同样式适用于不同的使用场景。点击某个样式即可查看所有可用选项。

<DocsStyleGrid :styles="styles" />

## 提示：始终指定尺寸

指定 `size` 或 CSS 尺寸，以避免头像加载时发生布局偏移：

```js
// JS 库
new Avatar(style, { seed: userId, size: 48, borderRadius: 50 });
```

```php
// PHP 库
new Avatar($style, ['seed' => $userId, 'size' => 48, 'borderRadius' => 50]);
```

```python
# Python 库
Avatar(style, {"seed": user_id, "size": 48, "borderRadius": 50})
```

```rust
// Rust 库
Avatar::new(&style, json!({ "seed": user_id, "size": 48, "borderRadius": 50 }))?;
```

```go
// Go 库
dicebear.NewAvatar(style, map[string]any{"seed": userID, "size": 48, "borderRadius": 50})
```

```dart
// Dart 库
Avatar(style, {'seed': userId, 'size': 48, 'borderRadius': 50});
```

```
// HTTP API
https://api.dicebear.com/10.x/thumbs/svg?seed=user-123&size=48&borderRadius=50
```
