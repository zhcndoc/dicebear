---
title: JavaScript Avatar Library – 浏览器与 Node.js
description: >
  使用 DiceBear JavaScript 头像库在浏览器（原生 JS）、React、Vue、Angular、Svelte 和 Node.js 中生成 SVG 个人头像。包含 TypeScript 支持。
---

# JavaScript 头像库

该库使用 [TypeScript](https://www.typescriptlang.org/) /
[JavaScript](https://developer.mozilla.org/en-US/Web/JavaScript) 编写，可用于
浏览器以及 [Node.js](https://nodejs.org/en/)（22 版
或更高版本）。在其他环境中，你可能会对以下内容感兴趣：
[PHP Library](/how-to-use/php-library/),
[Python Library](/how-to-use/python-library/),
[Rust Library](/how-to-use/rust-library/),
[Go Library](/how-to-use/go-library/),
[Dart Library](/how-to-use/dart-library/),
[HTTP API](/how-to-use/http-api/)
或 [CLI](/how-to-use/cli/)。

该库是一个纯 [ESM package](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)。
如果你是 ESM package 新手， [Sindre Sorhus](https://github.com/sindresorhus) 写了一份很棒的 [帮助页面](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)。

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

我们提供了来自不同艺术家的大量头像样式。这些头像样式采用不同的许可证，艺术家可以自行选择。为了快速概览，我们为你创建了一个 [许可证概览](/licenses/)。

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
  // ... options
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

Describes all valid options for a given style. Useful for building UIs or validating user input. For details, see
[访问样式选项](/guides/access-all-available-options/)。

## Methods

### `.toString()`

**Return type:** `string`

Returns the SVG avatar in XML format.

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);
const avatar = new Avatar(style, {
  // ... options
});

const svg = avatar.toString(); // [!code focus]
```

### `.toJSON()`

**Return type:** `{ svg: string, options: StyleOptions }`

Returns an object containing the SVG used to generate the avatar and the resolved options.

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);
const avatar = new Avatar(style, {
  seed: 'John',
  // ... other options
});

const json = avatar.toJSON(); // [!code focus]

// Example output:
// {
//   svg: '<svg>...</svg>',
//   options: {
//     seed: 'John',
//     // ... resolved options
//   }
// }
```

### `.toDataUri()`

**Return type:** `string`

Returns the avatar in [data uri](https://en.wikipedia.org/wiki/Data_URI_scheme) format.
This is very useful for embedding avatars directly into HTML or CSS.

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);
const avatar = new Avatar(style, {
  seed: 'John',
  // ... other options
});

const dataUri = avatar.toDataUri(); // [!code focus]

// Use in HTML
// <img src={dataUri} alt="Avatar" />
```

## 核心选项

这些选项适用于所有头像样式。凡是类型中写为 `[min, max]` 的字段，你可以传入固定值或由两个元素组成的元组。PRNG 会从该元组的范围中采样一个值。

| 选项            | 类型                                             | 默认值       | 描述                                                                   |
| ----------------- | ------------------------------------------------ | ------------- | ----------------------------------------------------------------------------- |
| `seed`            | `string`                                         | `''`          | 确定性生成的种子                                                                   |
| `flip`            | `'none' \| 'horizontal' \| 'vertical' \| 'both'` | `'none'`      | 翻转头像（接受一个值数组以随机化）                     |
| `rotate`          | `number \| [min, max]`                           | `0`           | 旋转角度（−360 到 360）                                             |
| `scale`           | `number \| [min, max]`                           | `1`           | 围绕画布中心的统一缩放因子（0 到 10；`1` 为原始大小） |
| `borderRadius`    | `number \| [min, max]`                           | `0`           | 画布边框圆角百分比（0 到 50；`50` 会变成圆形）         |
| `size`            | `integer`                                        | _unset_       | 输出尺寸，单位像素（1 到 4096）；未设置时 SVG 会按容器缩放 |
| `translateX`      | `number \| [min, max]`                           | `0`           | 画布宽度的水平平移百分比（−1000 到 1000）         |
| `translateY`      | `number \| [min, max]`                           | `0`           | 画布高度的垂直平移百分比（−1000 到 1000）          |
| `idRandomization` | `boolean`                                        | `false`       | 为每个 SVG `id` 添加随机的、非确定性的后缀（见下文）       |
| `title`           | `string`                                         | _unset_       | 可访问标题；设置后，SVG 会变为带 `<title>` 的 `role="img"`       |
| `fontFamily`      | `string \| string[]`                             | `'system-ui'` | 文本样式的字体族（CSS 风格的字体栈，不带引号）           |
| `fontWeight`      | `integer \| integer[]`                           | `400`         | 文本样式的字体粗细（1 到 1000）                                 |

### 背景选项

这些选项适用于所有样式，即使那些定义中没有声明 `background` 颜色组的样式也适用。

| 选项                     | 类型                              | 默认值   | 描述                                                        |
| -------------------------- | --------------------------------- | --------- | ------------------------------------------------------------------ |
| `backgroundColor`          | `string \| string[]`              | _unset_   | 背景颜色，十六进制格式（`#` 可选，`#RGB` 到 `#RRGGBBAA`）     |
| `backgroundColorFill`      | `'solid' \| 'linear' \| 'radial'` | `'solid'` | 背景填充类型（接受一个值数组以随机化）     |
| `backgroundColorFillStops` | `integer \| [min, max]`            | `2`       | 渐变色标数量（最少 2 个）；当填充为 `solid` 时忽略 |
| `backgroundColorAngle`     | `number \| [min, max]`            | `0`       | 渐变角度，单位为度（−360 到 360）                            |

### 动态组件选项

对于样式中的每个组件（例如 `eyes`、`mouth`、`hair`），都可使用以下选项：

| 模式                  | 类型                                           | 描述                                            |
| ------------------------ | ---------------------------------------------- | ------------------------------------------------------ |
| `{component}Variant`     | `string \| string[] \| Record<string, number>` | 限制为特定变体，可选地带权重                                |
| `{component}Probability` | `number`                                       | 可见性概率，百分比（0 到 100）                           |

组件的旋转、平移和缩放会在渲染时从组件定义中采样，这些都**不是**用户选项：不存在
`{component}Rotate`、`{component}TranslateX`、`{component}TranslateY` 或
`{component}Scale` 选项。

组件别名（在样式定义中通过 `extends` 声明）不会暴露自己的选项键。它们与其扩展的组件共享 `{source}Variant` 和 `{source}Probability`。

### 动态颜色选项

对于样式中的每个颜色组（例如 `skin`、`hair`）以及 `background`，都可使用以下选项：

| 模式                 | 类型                              | 描述                                                        |
| ----------------------- | --------------------------------- | ------------------------------------------------------------------ |
| `{color}Color`          | `string \| string[]`              | 使用十六进制值覆盖调色板（`#` 可选）                |
| `{color}ColorFill`      | `'solid' \| 'linear' \| 'radial'` | 填充类型（接受一个值数组以随机化）                |
| `{color}ColorFillStops` | `integer \| [min, max]`           | 渐变色标数量（最少 2 个）；当填充为 `solid` 时忽略 |
| `{color}ColorAngle`     | `number \| [min, max]`            | 渐变角度，单位为度（−360 到 360）                            |

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
[Converter](/how-to-use/js-library/converter/) 包。
