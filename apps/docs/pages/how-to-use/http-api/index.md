---
title: 通过 URL 生成 SVG 头像的 HTTP API
description: >
  DiceBear 提供的免费头像 API 和个人资料图片 API。通过一个简单的 URL
  生成随机用户头像和用户占位图像。无需身份验证。
---

<script setup>
import BrowserPreview from '@theme/components/ui/UiBrowserPreview.vue';
import DocsGrid from '@theme/components/docs/DocsGrid.vue';

const fileFormats = [
  {
    title: 'SVG',
    description: '推荐。可无限缩放，无尺寸限制，更高的速率限制。',
    badge: '推荐',
  },
  {
    title: 'PNG',
    description: '最大 256 × 256 px。较低的速率限制。',
  },
  {
    title: 'JPG',
    description: '最大 256 × 256 px。较低的速率限制。',
  },
  {
    title: 'WebP',
    description: '最大 256 × 256 px。较低的速率限制。',
  },
  {
    title: 'AVIF',
    description: '最大 256 × 256 px。较低的速率限制。',
  },
  {
    title: 'JSON',
    description: '以 JSON 形式返回头像元数据，而不是图像。',
  },
];
</script>

# 通过 URL 生成 SVG 头像的 HTTP API

我们的 HTTP API 是将 DiceBear 作为个人资料图片 API 或头像占位图像 API 使用的最简单方式。无需身份验证。

## 用法

使用以下地址，并将 `<styleName>` 替换为你偏好的头像样式。样式名称使用小写形式，多个单词之间用连字符连接，例如 `lorelei`、`pixel-art`、`adventurer-neutral`。支持所有官方的 [头像样式](/styles/)。

```
https://api.dicebear.com/10.x/<styleName>/svg
```

### 一些示例

<BrowserPreview url="https://api.dicebear.com/10.x/pixel-art/svg" />
<BrowserPreview url="https://api.dicebear.com/10.x/lorelei/svg" />

### 从用户 ID 生成一致的头像

使用一个稳定的标识符作为 `seed`，每次访问时每个用户都会获得相同的头像。用户 ID 就很适合，而且相同的 seed 始终会返回相同的图像。这使它成为尚未上传照片的用户的理想默认头像，因为图片在不同页面和会话中都保持不变。

```
https://api.dicebear.com/10.x/lorelei/svg?seed=user-8f3a2c
```

<BrowserPreview url="https://api.dicebear.com/10.x/lorelei/svg?seed=user-8f3a2c" />

如果 seed 包含空格或其他特殊字符，请先对其进行 URL 编码。

:::info

我们提供了来自不同艺术家的大量头像样式。这些头像样式采用不同的许可协议，且由艺术家自行选择。为了便于快速了解，我们为你整理了一个[许可概览](/licenses/)。

:::

## 列出可用样式

要查看某个实例支持哪些头像样式，请向版本根地址发送请求。它会以 JSON 形式返回可用样式名称，并按字母顺序排序：

```
https://api.dicebear.com/10.x
```

```json
{
  "styles": ["adventurer", "adventurer-neutral", "avataaars", "..."]
}
```

::: info

此端点自 `10.x` 版本起可用。更早的版本不支持列出样式。

:::

## 样式定义和选项

每种样式还会公开两个元数据端点。它们非常适合在 API 之上构建工具，例如头像编辑器：

```
https://api.dicebear.com/10.x/<styleName>/definition.json
https://api.dicebear.com/10.x/<styleName>/options.json
```

`definition.json` 返回原始样式定义，也就是随该样式的 npm 包一起发布的同一份 JSON。

`options.json` 描述样式接受的每个查询参数选项，包括字段类型、允许的枚举值和取值范围。以下是 [Pixel Art](/styles/pixel-art/) 的节选：

```json
{
  "seed": { "type": "string" },
  "flip": {
    "type": "enum",
    "values": ["none", "horizontal", "vertical", "both"],
    "list": true
  },
  "backgroundColor": { "type": "color", "list": true },
  "hairVariant": {
    "type": "enum",
    "values": ["long01", "long02", "...", "short24"],
    "list": true,
    "weighted": true
  },
  "hairProbability": { "type": "number", "min": 0, "max": 100 }
}
```

::: info

这些端点自 `10.x` 版本起可用。在自托管实例上，它们默认是禁用的。请参阅
[自托管指南](/guides/host-the-http-api-yourself/#optional-style-metadata-endpoints)。

:::

## 选项

所有 [核心选项](/how-to-use/js-library/#core-options)（例如 `seed`、`flip`、`rotate`、`scale`、`borderRadius` 和 `backgroundColor`）都可作为 [查询参数](https://en.wikipedia.org/wiki/Query_string) 使用。样式特定的选项列在各个 [头像样式页面](/styles/) 中。例如：

<BrowserPreview url="https://api.dicebear.com/10.x/pixel-art/svg?seed=John" />
<BrowserPreview url="https://api.dicebear.com/10.x/pixel-art/svg?seed=Jane" />

:::tip

如果你想传递更多选项，可以像平常使用查询字符串那样，用 `&` 将它们连接起来。

:::

::: warning

`idRandomization`、`fontFamily`、`fontWeight` 和 `title` 这些选项不受我们的公共 HTTP API 支持。你可以通过[自行托管实例](/guides/host-the-http-api-yourself/)来启用它们。

:::

### 数组选项

数组值之间用逗号分隔。例如，如果你希望在种子之外向 PRNG 提供多种发型，URL 可能会像这样。请注意，头像样式提供的选项各不相同。在这个示例中，我们使用 [像素艺术](/styles/pixel-art/) 头像样式。

<BrowserPreview url="https://api.dicebear.com/10.x/pixel-art/svg?seed=John&hairVariant=short01,short02,short03,short04,short05" />
<BrowserPreview url="https://api.dicebear.com/10.x/pixel-art/svg?seed=Jane&hairVariant=long01,long02,long03,long04,long05" />

### 枚举选项

枚举值以字符串形式传递。例如，`flip` 选项接受
`none`、`horizontal`、`vertical` 或 `both`：

<BrowserPreview url="https://api.dicebear.com/10.x/lorelei/svg?flip=horizontal" />
<BrowserPreview url="https://api.dicebear.com/10.x/lorelei/svg?flip=none" />

## File Formats

<DocsGrid :items="fileFormats" />

PNG, JPG, WebP, and AVIF use the
[Noto Sans](https://fonts.google.com/noto/specimen/Noto+Sans) font and currently
support the following subsets: `cyrillic`, `cyrillic-ext`, `devanagari`,
`greek`, `greek-ext`, `japanese`, `korean`, `latin`, `latin-ext`,
`simplified-chinese`, `thai`, and `vietnamese`.

<BrowserPreview url="https://api.dicebear.com/10.x/bottts/svg" />
<BrowserPreview url="https://api.dicebear.com/10.x/bottts/png" />
<BrowserPreview url="https://api.dicebear.com/10.x/bottts/jpg" />
<BrowserPreview url="https://api.dicebear.com/10.x/bottts/webp" />
<BrowserPreview url="https://api.dicebear.com/10.x/bottts/avif" />

## 版本控制

你可以在 URL 中设置版本。只需将前面示例中的 `10.x` 替换为你想要的版本即可。

| 版本 | 状态 | 终止支持时间 |
| ------- | ---------- | -------------- |
| `10.x`  | **Active** | 无           |
| `9.x`   | **Active** | 无           |
| `8.x`   | 已弃用 | 2028 年 4 月 30 日 |
| `7.x`   | 已弃用 | 2028 年 4 月 30 日 |
| `6.x`   | 已弃用 | 2028 年 4 月 30 日 |
| `5.x`   | 已弃用 | 2028 年 4 月 30 日 |

::: warning

5.x 到 8.x 版本将于 2028 年 4 月 30 日达到生命周期终点。到那时，这些版本的 HTTP API 将被关闭并不再可用。
请升级到最新版本。详情请参见
[公告](https://github.com/orgs/dicebear/discussions/491)。

:::

::: info

你可以[自行托管 API](/guides/host-the-http-api-yourself/)，以在生命周期结束后继续使用已停止维护的版本。

:::

## 自托管头像 API

Need private or commercial deployment? You can
[host the Avatar API yourself](/guides/host-the-http-api-yourself/) to take full control over
availability, rate limits, and data privacy.

## 公平使用与速率限制

我们的 API 可免费用于非商业用途，但请负责任地使用。我们保留封禁滥用用户的权利。

我们目前将请求速率限制为每秒 **50 次用于 SVG**，以及 **10 次用于 PNG、JPG、
WebP 和 AVIF**。超过限制将返回 HTTP `429 Too Many Requests`。我们保留
随时更改这些限制的权利，恕不另行通知。

对于商业用途或更高限制，请
[搭建你自己的实例](/guides/host-the-http-api-yourself/)。如有疑问，欢迎在 GitHub 上发起
[讨论](https://github.com/orgs/dicebear/discussions)。

## 变更与可用性

请注意，我们保留随时更新 API 的权利。虽然我们会尽最大努力保持向后兼容，但无法保证一定如此。即使我们会尽量始终返回相同的头像，设计，尤其是源代码也可能发生变化。此外，我们也无法保证 API 始终可用。如果你需要持续稳定地访问该 API，我们建议你搭建[自己的实例](/guides/host-the-http-api-yourself/)。
