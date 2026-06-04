---
title: JavaScript Avatar Library – 浏览器与 Node.js
description: >
  使用 DiceBear JavaScript 头像库在浏览器（原生 JS）、React、Vue、Angular、Svelte 和 Node.js 中生成 SVG 个人头像。包含 TypeScript 支持。
---

# JavaScript 头像库

该库使用 [TypeScript](https://www.typescriptlang.org/) /
[JavaScript](https://developer.mozilla.org/en-US/Web/JavaScript) 编写，可在浏览器以及 [Node.js](https://nodejs.org/en/)（22 版或更高）中使用。在其他环境中，你可能会对 [PHP Library](/how-to-use/php-library/)、
[HTTP API](/how-to-use/http-api/)
或 [CLI](/how-to-use/cli/) 感兴趣。

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
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const avatar = new Avatar(lorelei, {
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

`seed` 选项是生成确定性头像的关键。相同的 seed 始终会生成相同的头像，这使它非常适合用户资料：

```js
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

// 这些将始终生成相同的头像
const avatar1 = new Avatar(lorelei, { seed: 'user-123' });
const avatar2 = new Avatar(lorelei, { seed: 'user-123' });

avatar1.toString() === avatar2.toString(); // true
```

## 类

### `Avatar`

用于生成头像的主类。接受样式定义（或 `Style` 实例）以及可选选项。

```js
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const avatar = new Avatar(lorelei, {
  // [!code focus:3]
  // ... 选项
});
```

### `Style`

样式定义的不可变封装。当前你想在多个头像之间复用同一个已解析的样式，而无需每次重新解析时使用它。

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei); // [!code focus:4]

const avatar1 = new Avatar(style, { seed: 'Alice' });
const avatar2 = new Avatar(style, { seed: 'Bob' });
```

### `OptionsDescriptor`

描述给定样式的所有有效选项。适用于构建 UI 或验证用户输入。详情请参见
[访问样式选项](/guides/access-all-available-options/)。

## 方法

### `.toString()`

**返回类型：** `string`

以 XML 格式返回 SVG 头像。

```js
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const avatar = new Avatar(lorelei, {
  // ... 选项
});

const svg = avatar.toString(); // [!code focus]
```

### `.toJSON()`

**返回类型：** `{ svg: string, options: StyleOptions }`

返回一个对象，包含用于生成头像的 SVG 和已解析选项。

```js
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const avatar = new Avatar(lorelei, {
  seed: 'John',
  // ... 其他选项
});

const json = avatar.toJSON(); // [!code focus]

// 示例输出：
// {
//   svg: '<svg>...</svg>',
//   options: {
//     seed: 'John',
//     // ... 已解析选项
//   }
// }
```

### `.toDataUri()`

**返回类型：** `string`

返回 [data uri](https://en.wikipedia.org/wiki/Data_URI_scheme) 形式的头像。
这对于直接将头像嵌入 HTML 或 CSS 非常有用。

```js
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const avatar = new Avatar(lorelei, {
  seed: 'John',
  // ... 其他选项
});

const dataUri = avatar.toDataUri(); // [!code focus]

// 在 HTML 中使用
// <img src={dataUri} alt="头像" />
```

## 核心选项

这些选项适用于所有头像样式。若类型中写作 `[min, max]`，你既可以传入固定值，也可以传入一个包含两个元素的元组——PRNG 会从该范围内采样一个值。

| Option            | Type                                             | Default       | Description                                                                   |
| ----------------- | ------------------------------------------------ | ------------- | ----------------------------------------------------------------------------- |
| `seed`            | `string`                                         | `''`          | 用于确定性生成的种子                                                         |
| `flip`            | `'none' \| 'horizontal' \| 'vertical' \| 'both'` | `'none'`      | 翻转头像（接受值数组以实现随机化）                                           |
| `rotate`          | `number \| [min, max]`                           | `0`           | 旋转角度（−360 到 360）                                                      |
| `scale`           | `number \| [min, max]`                           | `1`           | 以画布中心为基准的统一缩放系数（0 到 10；`1` 为原始大小）                    |
| `borderRadius`    | `number \| [min, max]`                           | `0`           | 画布的圆角半径百分比（0 到 50；`50` 时为圆形）                               |
| `size`            | `integer`                                        | _unset_       | 输出尺寸（像素）（1 到 4096）；未设置时 SVG 会按容器大小缩放                  |
| `translateX`      | `number \| [min, max]`                           | `0`           | 画布宽度百分比的水平平移（−1000 到 1000）                                    |
| `translateY`      | `number \| [min, max]`                           | `0`           | 画布高度百分比的垂直平移（−1000 到 1000）                                    |
| `idRandomization` | `boolean`                                        | `false`       | 为每个 SVG 的 `id` 添加随机的非确定性后缀（见下文）                          |
| `title`           | `string`                                         | _unset_       | 无障碍标题——设置后，SVG 会变为带 `<title>` 的 `role="img"`                   |
| `fontFamily`      | `string \| string[]`                             | `'system-ui'` | 基于文本的样式所用字体族（CSS 风格字体栈，不带引号）                          |
| `fontWeight`      | `integer \| integer[]`                             | `400`         | 基于文本的样式所用字体粗细（1 到 1000）                                      |

### 背景选项

这些选项适用于每种样式——即使其定义中没有声明 `background` 颜色组。

| Option                     | Type                              | Default   | Description                                                        |
| -------------------------- | --------------------------------- | --------- | ------------------------------------------------------------------ |
| `backgroundColor`          | `string \| string[]`              | _unset_   | 背景颜色，十六进制格式（`#` 可选，`#RGB`–`#RRGGBBAA`）             |
| `backgroundColorFill`      | `'solid' \| 'linear' \| 'radial'` | `'solid'` | 背景填充类型（接受值数组以实现随机化）                             |
| `backgroundColorFillStops` | `integer \| [min, max]`           | `2`       | 渐变色标数量（至少 2 个）；当填充为 `solid` 时忽略                |
| `backgroundColorAngle`     | `number \| [min, max]`            | `0`       | 渐变角度（−360 到 360）                                            |

### 动态组件选项

对于样式中的每个组件（例如 `eyes`、`mouth`、`hair`），都可使用以下选项：

| Pattern                  | Type                                           | Description                                            |
| ------------------------ | ---------------------------------------------- | ------------------------------------------------------ |
| `{component}Variant`     | `string \| string[] \| Record<string, number>` | 限制为特定变体，可选地带权重                                |
| `{component}Probability` | `number`                                       | 可见性概率，百分比（0 到 100）                           |

组件的旋转、平移和缩放会在渲染时根据组件定义进行采样，且**不是**用户选项——不存在
`{component}Rotate`、`{component}TranslateX`、`{component}TranslateY` 或
`{component}Scale` 选项。

组件别名（在样式定义中通过 `extends` 声明）不会暴露
它们自己的选项键——它们与所扩展的组件共享 `{source}Variant` 和 `{source}Probability`。

### 动态颜色选项

对于样式中的每个颜色组（例如 `skin`、`hair`）以及 `background`，都可使用以下选项：

| Pattern                 | Type                              | Description                                                        |
| ----------------------- | --------------------------------- | ------------------------------------------------------------------ |
| `{color}Color`          | `string \| string[]`              | 覆盖调色板——十六进制值（`#` 可选）                                  |
| `{color}ColorFill`      | `'solid' \| 'linear' \| 'radial'` | 填充类型（接受值数组以实现随机化）                                 |
| `{color}ColorFillStops` | `integer \| [min, max]`           | 渐变色标数量（至少 2 个）；当填充为 `solid` 时忽略                |
| `{color}ColorAngle`     | `number \| [min, max]`            | 渐变角度（−360 到 360）                                            |

## 示例

### 带自定义背景的头像

```js
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const avatar = new Avatar(lorelei, {
  seed: 'John',
  backgroundColor: ['#b6e3f4', '#c0aede', '#d1d4f9'],
  // ... 其他选项
});
```

### 固定尺寸头像

```js
import { Avatar } from '@dicebear/core';
import bottts from '@dicebear/styles/bottts.json' with { type: 'json' };

const avatar = new Avatar(bottts, {
  seed: 'robot-42',
  size: 128,
  borderRadius: 50, // 圆形头像
  // ... 其他选项
});
```

### 带变换的头像

```js
import { Avatar } from '@dicebear/core';
import avataaars from '@dicebear/styles/avataaars.json' with { type: 'json' };

const avatar = new Avatar(avataaars, {
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
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const users = ['alice', 'bob', 'charlie'];

const avatars = users.map((user) =>
  new Avatar(lorelei, {
    seed: user,
    idRandomization: true,
    // ... 其他选项
  }).toString(),
);
```

该后缀来自 `Math.random()` —— **不是**来自 DiceBear PRNG —— 因此
两个使用相同 seed 渲染的头像会获得不同的 ID。这也意味着渲染后的
SVG 不再是确定性的；只有视觉输出是确定性的。对于快照测试、SSR/水合，或任何依赖
完全相同标记的场景，请不要使用 `idRandomization`。当你仅通过 `<img>`（data URI 或 HTTP API）
嵌入头像时，ID 位于隔离的文档中，因此不需要 ID 随机化。

### 带权重的变体选择

你可以通过传入权重映射来影响 PRNG 以偏好某些变体。
映射中未列出的变体会被排除；权重为 `0` 的变体也会被排除，除非**所有**映射的变体权重都为 `0`，在这种情况下，PRNG 会回退为在这些变体上进行无权重选择：

```js
import { Avatar } from '@dicebear/core';
import avataaars from '@dicebear/styles/avataaars.json' with { type: 'json' };

const avatar = new Avatar(avataaars, {
  seed: 'John',
  topVariant: { short01: 2, short02: 2, long01: 1 },
  // ... 其他选项
});
```

## 可访问性

默认情况下，生成的 `<svg>` 元素带有 `aria-hidden="true"` — 辅助
技术会跳过它。对于用户名旁边纯装饰性的头像来说，这是正确的默认设置。

当头像本身传达身份信息时（例如，它是链接中唯一的内容，或者没有可见标签），请设置 `title` 选项。渲染器会在根元素上输出 `role="img" aria-label="…"`，并且还会输出一个 `<title>` 子元素，因此
屏幕阅读器会朗读该值：

```js
const avatar = new Avatar(lorelei, {
  seed: 'Alice',
  title: 'Alice 的头像',
});
```

如果你将 SVG 嵌入到 `<img>` 中（通过 `toDataUri()`），请改用 `<img>`
元素的 `alt` 属性——当 SVG 作为图像加载时，辅助
技术不会读取 SVG 内部的 `title`。

## TypeScript

该库是完全类型化的。你可以导入类型以获得更好的 IDE 支持：

```ts
import { Avatar, Style } from '@dicebear/core';
import type { StyleOptions, StyleDefinition } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const avatar = new Avatar(lorelei, {
  seed: 'John',
  backgroundColor: ['#b6e3f4'],
  // ... 其他选项
});
```

当将样式定义作为 JSON 导入时，TypeScript 会推断该定义的字面量类型，为组件和颜色选项名称提供自动补全。

## 转换为其他格式

需要 PNG、JPEG 或其他格式吗？请查看
[Converter](/how-to-use/js-library/converter/) 包。
