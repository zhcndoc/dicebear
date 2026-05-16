---
title: JavaScript Avatar Library – 浏览器与 Node.js
description: >
  使用 DiceBear JavaScript 头像库在浏览器（原生 JS）、React、Vue、Angular、Svelte 和 Node.js 中生成 SVG 个人资料图片。包含 TypeScript 支持。
---

# JavaScript 头像库

该库使用 [TypeScript](https://www.typescriptlang.org/) /
[JavaScript](https://developer.mozilla.org/en-US/Web/JavaScript) 编写，可在浏览器中使用，也可在 [Node.js](https://nodejs.org/en/)（22 版或更高）中使用。在其他环境中，你可能会对 [PHP Library](/how-to-use/php-library/)、
[HTTP API](/how-to-use/http-api/) 或 [CLI](/how-to-use/cli/) 感兴趣。

该库是一个纯 [ESM package](https://developer.mozilla.org/en-US/Web/JavaScript/Guide/Modules)。
如果你是 ESM package 新手， [Sindre Sorhus](https://github.com/sindresorhus) 写了一份很棒的 [帮助页面](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)。

## 安装

你需要两个包：核心库 `@dicebear/core` 和头像样式定义 `@dicebear/definitions`。

```
npm install @dicebear/core @dicebear/definitions
```

## 使用

我们在示例中使用头像样式 [lorelei](/styles/lorelei/)。你可以在 [这里](/styles/) 找到更多头像样式。

```js
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

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
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

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
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

const avatar = new Avatar(lorelei, { // [!code focus:3]
  // ... 选项
});
```

### `Style`

样式定义的不可变封装。当前你想在多个头像之间复用同一个已解析的样式，而无需每次重新解析时使用它。

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

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
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

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
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

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
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

const avatar = new Avatar(lorelei, {
  seed: 'John',
  // ... other options
});

const dataUri = avatar.toDataUri(); // [!code focus]

// 在 HTML 中使用
// <img src={dataUri} alt="头像" />
```

## 核心选项

这些选项适用于所有头像样式：

| Option              | Type                                              | Default     | Description                                      |
| ------------------- | ------------------------------------------------- | ----------- | ------------------------------------------------ |
| `seed`              | `string`                                          | `''`        | 用于确定性生成的种子                            |
| `flip`              | `'none' \| 'horizontal' \| 'vertical' \| 'both'` | `'none'`    | 翻转头像                                        |
| `rotate`            | `number \| [min, max]`                            | `0`         | 旋转头像（-360 到 360 度）                      |
| `scale`             | `number \| [min, max]`                            | `1`         | 围绕画布中心的统一缩放因子（0 到 10；`1` 为原始尺寸） |
| `borderRadius`      | `number \| [min, max]`                            | `0`         | 边框圆角（0-50 百分比，50 = 圆形）             |
| `size`              | `number`                                          | _undefined_ | 像素中的固定尺寸                                |
| `translateX`        | `number \| [min, max]`                            | `0`         | 作为画布宽度百分比的水平平移（-1000 到 1000）   |
| `translateY`        | `number \| [min, max]`                            | `0`         | 作为画布高度百分比的垂直平移（-1000 到 1000）   |
| `idRandomization`   | `boolean`                                         | `false`     | 随机化 SVG 元素 ID                              |
| `title`             | `string`                                          | _undefined_ | SVG 的无障碍标题                               |
| `fontFamily`        | `string \| string[]`                              | `'system-ui'` | 文本样式的字体族                            |
| `fontWeight`        | `number \| number[]`                              | `400`       | 文本样式的字体粗细（1-1000）                   |

### 背景选项

这些选项适用于每种样式——即使其定义中没有声明 `background` 颜色组。

| Option                    | Type                                    | Default     | Description                                |
| ------------------------- | --------------------------------------- | ----------- | ------------------------------------------ |
| `backgroundColor`         | `string \| string[]`                    | _undefined_ | 背景颜色（带 # 的十六进制）                |
| `backgroundColorFill`     | `'solid' \| 'linear' \| 'radial'`      | `'solid'`   | 背景填充类型                              |
| `backgroundColorFillStops`| `number \| [min, max]`                  | `2`         | 渐变色标数量；当填充为 `solid` 时忽略      |
| `backgroundColorAngle`    | `number \| [min, max]`                  | `0`         | 渐变角度（-360 到 360 度）                 |

### 动态组件选项

对于样式中的每个组件（例如 `eyes`、`mouth`、`hair`），都可使用以下选项：

| Pattern                   | Type                                            | Description                              |
| ------------------------- | ----------------------------------------------- | ---------------------------------------- |
| `{component}Variant`      | `string \| string[] \| Record<string, number>` | 选择特定变体或设置权重                   |
| `{component}Probability`  | `number`                                        | 可见性概率（0-100）                      |

组件的旋转、平移和缩放会在渲染时根据组件定义进行采样，且**不是**用户选项——不存在
`{component}Rotate`、`{component}TranslateX`、`{component}TranslateY` 或
`{component}Scale` 选项。

### 动态颜色选项

对于样式中的每个颜色组（例如 `skin`、`hair`）以及 `background`，都可使用以下选项：

| 模式                      | 类型                                    | 描述                              |
| ------------------------- | --------------------------------------- | --------------------------------- |
| `{color}Color`            | `string \| string[]`                    | 覆盖颜色调色板（带 # 的十六进制）   |
| `{color}ColorFill`        | `'solid' \| 'linear' \| 'radial'`      | 颜色填充类型                        |
| `{color}ColorFillStops`   | `number \| [min, max]`                  | 渐变色标数量                        |
| `{color}ColorAngle`       | `number \| [min, max]`       | 渐变角度（-360 到 360 度）          |

## 示例

### 带自定义背景的头像

```js
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

const avatar = new Avatar(lorelei, {
  seed: 'John',
  backgroundColor: ['#b6e3f4', '#c0aede', '#d1d4f9'],
  // ... 其他选项
});
```

### 固定尺寸头像

```js
import { Avatar } from '@dicebear/core';
import bottts from '@dicebear/definitions/bottts.json' with { type: 'json' };

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
import avataaars from '@dicebear/definitions/avataaars.json' with { type: 'json' };

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

在同一页面渲染多个头像时，使用 `idRandomization` 以防止 SVG ID 冲突：

```js
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

const users = ['alice', 'bob', 'charlie'];

const avatars = users.map((user) =>
  new Avatar(lorelei, {
    seed: user,
    idRandomization: true,
    // ... 其他选项
  }).toString(),
);
```

### 带权重的变体选择

你可以通过传入权重映射来影响 PRNG，使其更偏好某些变体：

```js
import { Avatar } from '@dicebear/core';
import avataaars from '@dicebear/definitions/avataaars.json' with { type: 'json' };

const avatar = new Avatar(avataaars, {
  seed: 'John',
  topVariant: { short01: 2, short02: 2, long01: 1 },
  // ... 其他选项
});
```

## 可访问性

默认情况下，生成的 `<svg>` 元素会被设置为 `aria-hidden="true"` —— 辅助技术会跳过它。对于用户名旁边纯装饰性的头像来说，这是正确的默认设置。

当头像本身传达身份信息时（例如，它是链接中的唯一内容，或者没有可见标签），请设置 `title` 选项。渲染器会在根元素上输出 `role="img" aria-label="…"`，并且还会生成一个 `<title>` 子元素，因此屏幕阅读器会播报该值：

```js
const avatar = new Avatar(lorelei, {
  seed: 'Alice',
  title: 'Alice 的头像',
});
```

如果你将 SVG 嵌入到 `<img>` 中（通过 `toDataUri()`），请改用 `<img>` 元素的 `alt` 属性 —— 当 SVG 作为图像加载时，辅助技术不会读取 SVG 内部的 `title`。

## TypeScript

该库是完全类型化的。你可以导入类型以获得更好的 IDE 支持：

```ts
import { Avatar, Style } from '@dicebear/core';
import type { StyleOptions, StyleDefinition } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

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
