---
title: JavaScript 头像库 – 浏览器与 Node.js
description: >
  使用 DiceBear JavaScript 头像库在浏览器（原生 JS）、React、Vue、Angular、Svelte 和 Node.js 中生成 SVG 个人头像。包含 TypeScript 支持。
---

# JavaScript 头像库

该库使用 [TypeScript](https://www.typescriptlang.org/) /
[JavaScript](https://developer.mozilla.org/en-US/Web/JavaScript) 编写，可用于
浏览器以及 [Node.js](https://nodejs.org/en/)（22 版
或更高版本）。在其他环境中，你可能会对以下内容感兴趣：
[PHP 库](/how-to-use/php-library/),
[Python 库](/how-to-use/python-library/),
[Rust 库](/how-to-use/rust-library/),
[Go 库](/how-to-use/go-library/),
[Dart 库](/how-to-use/dart-library/),
[HTTP API](/how-to-use/http-api/)
或 [CLI](/how-to-use/cli/)。

该库是一个纯 [ESM 包](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)。
如果你是 ESM 包新手， [Sindre Sorhus](https://github.com/sindresorhus) 写了一份很棒的 [帮助页面](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)。

## 安装

你需要两个包：核心库 `@dicebear/core` 和头像样式定义 `@dicebear/styles`。

```
npm install @dicebear/core @dicebear/styles
```

## 使用

我们在示例中使用头像样式 [lorelei](/styles/lorelei/)。你可以在 [这里](/styles/) 找到更多头像样式。

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);
const avatar = new Avatar(style, {
  seed: 'John',
  // ... 其他选项
});

const svg = avatar.toString();
```

每种头像样式都带有若干选项。你可以在每个 [头像样式](/styles/) 的详情页找到它们。

::: tip

如果你想将该库集成到某个框架中，请查看我们为 [Angular](/guides/use-the-library-with-angular/)、
[React](/guides/use-the-library-with-react/)、
[React Native](/guides/use-the-library-with-react-native/)、
[Vue](/guides/use-the-library-with-vue/) 或
[Svelte](/guides/use-the-library-with-svelte/) 提供的指南。

:::

:::info

我们提供了来自不同创作者的大量头像样式。这些头像样式采用不同的许可证，创作者可以自行选择许可证。为了便于快速了解，我们为你创建了[许可证概览](/licenses/)。

:::

## 确定性头像

`seed` 选项是生成确定性头像的关键。相同的 seed
将始终生成相同的头像，这对用户资料很有用：

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);

// 这些将始终生成相同的头像
const avatar1 = new Avatar(style, { seed: 'user-123' });
const avatar2 = new Avatar(style, { seed: 'user-123' });

avatar1.toString() === avatar2.toString(); // true
```

## 类

### `Avatar`

生成头像的主类。传入一个 `Style` 实例和可选的
选项。

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);
const avatar = new Avatar(style, {
  // [!code focus:3]
  // ... 选项
});
```

### `Style`

围绕样式定义的不可变包装器。

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei); // [!code focus:4]

const avatar1 = new Avatar(style, { seed: 'Alice' });
const avatar2 = new Avatar(style, { seed: 'Bob' });
```

### `OptionsDescriptor`

描述给定样式的所有有效选项。适用于构建用户界面或验证用户输入。有关详细信息，请参阅
[访问样式选项](/guides/access-all-available-options/)。

## 方法

### `.toString()`

**返回类型：** `string`

以 XML 格式返回 SVG 头像。

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);
const avatar = new Avatar(style, {
  // ... 选项
});

const svg = avatar.toString(); // [!code focus]
```

### `.toJSON()`

**返回类型：** `{ svg: string, options: StyleOptions }`

返回一个对象，其中包含用于生成头像的 SVG 和解析后的选项。

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);
const avatar = new Avatar(style, {
  seed: 'John',
  // ... 其他选项
});

const json = avatar.toJSON(); // [!code focus]

// 示例输出：
// {
//   svg: '<svg>...</svg>',
//   options: {
//     seed: 'John',
//     // ... 解析后的选项
//   }
// }
```

### `.toDataUri()`

**返回类型：** `string`

以 [数据 URI](https://en.wikipedia.org/wiki/Data_URI_scheme) 格式返回头像。
这对于将头像直接嵌入 HTML 或 CSS 非常有用。

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);
const avatar = new Avatar(style, {
  seed: 'John',
  // ... 其他选项
});

const dataUri = avatar.toDataUri(); // [!code focus]

// 在 HTML 中使用
// <img src={dataUri} alt="头像" />
```

## 选项

每个 DiceBear 核心都支持相同的选项。完整参考（包括背景、组件级和颜色级选项）请参阅
[核心选项](/guides/core-options/)页面。以下示例展示了如何在 JavaScript 中传递这些选项。

## 示例

### 带自定义背景的头像

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);
const avatar = new Avatar(style, {
  seed: 'John',
  backgroundColor: ['#b6e3f4', '#c0aede', '#d1d4f9'],
  // ... 其他选项
});
```

### 固定尺寸头像

```js
import { Style, Avatar } from '@dicebear/core';
import bottts from '@dicebear/styles/bottts.json' with { type: 'json' };

const style = new Style(bottts);
const avatar = new Avatar(style, {
  seed: 'robot-42',
  size: 128,
  borderRadius: 50, // 圆形头像
  // ... 其他选项
});
```

### 带变换的头像

```js
import { Style, Avatar } from '@dicebear/core';
import avataaars from '@dicebear/styles/avataaars.json' with { type: 'json' };

const style = new Style(avataaars);
const avatar = new Avatar(style, {
  seed: 'Jane',
  flip: 'horizontal',
  rotate: 10,
  scale: 0.9,
  translateY: 5,
  // ... 其他选项
});
```

### 同一页面上的多个头像

当将多个头像内联到同一个文档中时（例如直接把 SVG 标记插入页面，而不是使用 `<img src={dataUri}>`），请使用
`idRandomization` 为每个 SVG 的内部 ID 添加后缀，以避免 `<defs>` /
`url(#…)` 冲突：

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);
const users = ['alice', 'bob', 'charlie'];

const avatars = users.map((user) =>
  new Avatar(style, {
    seed: user,
    idRandomization: true,
    // ... 其他选项
  }).toString(),
);
```

后缀取自 `Math.random()`（**不是** DiceBear PRNG），因此使用相同 seed 渲染的两个头像会得到不同的 ID。这也意味着渲染出的 SVG 不再是确定性的；只有视觉输出是。对于快照测试、SSR/hydration，或任何依赖完全相同标记的场景，请跳过 `idRandomization`。当你只是通过 `<img>`（data URI 或 HTTP API）嵌入头像时，ID 位于彼此隔离的文档中，因此不需要 ID 随机化。

### 带权重的变体选择

你可以通过传入权重映射来影响 PRNG 以偏好某些变体。
映射中未列出的变体会被排除；权重为 `0` 的变体也会被排除，除非**所有**映射的变体权重都为 `0`，在这种情况下，PRNG 会回退为在这些变体上进行无权重选择：

```js
import { Style, Avatar } from '@dicebear/core';
import avataaars from '@dicebear/styles/avataaars.json' with { type: 'json' };

const style = new Style(avataaars);
const avatar = new Avatar(style, {
  seed: 'John',
  topVariant: { short01: 2, short02: 2, long01: 1 },
  // ... 其他选项
});
```

## 可访问性

默认情况下，生成的 `<svg>` 元素带有 `aria-hidden="true"`，因此辅助
技术会忽略它。对于紧邻用户名、纯装饰性的头像来说，这是合适的默认设置。

当头像本身传达身份信息时（例如，它是链接中唯一的内容，或者没有可见标签），请设置 `title` 选项。渲染器会在根元素上输出 `role="img" aria-label="…"`，并且还会输出一个 `<title>` 子元素，因此
屏幕阅读器会朗读该值：

```js
const avatar = new Avatar(style, {
  seed: 'Alice',
  title: 'Alice 的头像',
});
```

如果你通过 `toDataUri()` 将 SVG 嵌入到 `<img>` 中，请改用 `<img>`
元素的 `alt` 属性。SVG 内部的 `title` 在 SVG 作为图像加载时不会被
辅助技术读取。

## TypeScript

该库是完全类型化的。你可以导入类型以获得更好的 IDE 支持：

```ts
import { Avatar, Style } from '@dicebear/core';
import type { StyleOptions, StyleDefinition } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);
const avatar = new Avatar(style, {
  seed: 'John',
  backgroundColor: ['#b6e3f4'],
  // ... 其他选项
});
```

当将样式定义作为 JSON 导入时，TypeScript 会推断该定义的字面量类型，为组件和颜色选项名称提供自动补全。

## 转换为其他格式

需要 PNG、JPEG 或其他格式吗？请查看
[转换器](/how-to-use/js-library/converter/) 包。
