---
title: 将 DiceBear 用作头像占位符 API
description: >
  将 DiceBear 用作用户个人资料的确定性头像占位符 API。
  根据用户 ID 或邮箱生成一致的 SVG 头像——无需上传图片。
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
      '无需存储图片，也无需审核。头像会即时生成——非常适合尚未设置头像的新用户。',
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
    title: '30+ 种样式',
    description:
      '选择适合你产品的视觉风格——从抽象几何图形到插画角色。',
    color: '#a855f7',
  },
];

const styles = [
  {
    name: 'Initials',
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
    name: 'Pixel Art',
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

头像占位符会替代用户尚未上传头像时显示的通用默认图像。DiceBear 不再显示灰色剪影，而是从任意种子生成独特且确定性的 SVG 头像——让每位用户从注册那一刻起就有被代表的感觉。

## 为什么将 DiceBear 作为占位符？

<DocsHighlights :highlights="highlights" />

## 使用 HTTP API

最简单的方法：将 DiceBear API URL 作为 `<img>` 标签的 `src`。使用稳定的标识符作为种子——数字用户 ID 就很合适。关于完整选项和速率限制详情，请参阅 [HTTP API 文档](/how-to-use/http-api/)。

<BrowserPreview url="https://api.dicebear.com/10.x/initials/svg?seed=JD" />
<BrowserPreview url="https://api.dicebear.com/10.x/pixel-art/svg?seed=user-42" />

```html
<img
  src="https://api.dicebear.com/10.x/initials/svg?seed=JD"
  alt="用户头像"
  width="48"
  height="48"
/>
```

### 图片错误时的回退

结合 DiceBear 和 `onerror` 处理器，在用户上传的照片加载失败时优雅地回退：

```html
<img
  src="/uploads/user-123.jpg"
  onerror="this.src='https://api.dicebear.com/10.x/pixel-art/svg?seed=123'; this.onerror=null;"
  alt="用户头像"
/>
```

### 使用用户 ID 作为种子

传入一个稳定且唯一的标识符作为种子，以确保每个用户始终获得相同的占位符：

```js
const userId = 'user-8f3a2c';
const avatarUrl = `https://api.dicebear.com/10.x/thumbs/svg?seed=${encodeURIComponent(userId)}`;
```

<BrowserPreview url="https://api.dicebear.com/10.x/thumbs/svg?seed=user-8f3a2c" />

## 使用 JavaScript 库

使用 JS 库进行服务端渲染，或者将 SVG 直接嵌入到你的标记中，而无需额外的 HTTP 请求。关于完整的安装和 API 详情，请参阅 [JavaScript 库文档](/how-to-use/js-library/)。

```js
import { Avatar } from '@dicebear/core';
import thumbs from '@dicebear/definitions/thumbs.json' with { type: 'json' };

function getPlaceholderAvatar(userId) {
  return new Avatar(thumbs, {
    seed: userId,
    size: 48,
    borderRadius: 50,
  }).toString();
}
```

## 使用 PHP 库

使用 PHP 库进行服务端渲染，而无需额外的 HTTP 请求。关于完整的安装和 API 详情，请参阅
[PHP 库文档](/how-to-use/php-library/)。

```php
<?php

use Composer\InstalledVersions;
use DiceBear\Style;
use DiceBear\Avatar;

$basePath = InstalledVersions::getInstallPath('dicebear/definitions');
$definition = json_decode(file_get_contents($basePath . '/src/thumbs.json'), true);

$style = new Style($definition);

function getPlaceholderAvatar(Style $style, string $userId): string {
  return (string) new Avatar($style, [
    'seed' => $userId,
    'size' => 48,
    'borderRadius' => 50,
  ]);
}
```

## 选择样式

不同样式适用于不同的使用场景。点击某个样式即可查看所有可用选项。

<DocsStyleGrid :styles="styles" />

## 提示：始终定义尺寸

指定 `size` 或 CSS 尺寸，以避免头像加载时发生布局偏移：

```js
// JS 库
new Avatar(thumbs, { seed: userId, size: 48, borderRadius: 50 });
```

```php
// PHP 库
new Avatar($style, ['seed' => $userId, 'size' => 48, 'borderRadius' => 50]);
```

```
// HTTP API
https://api.dicebear.com/10.x/thumbs/svg?seed=user-123&size=48&borderRadius=50
```
